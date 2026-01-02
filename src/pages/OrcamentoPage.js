import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Collapse,
  Alert,
  Modal,
  Badge,
} from 'react-bootstrap';
import precosPT from '../data/precos.json'; 
import precosEN from '../data/precos_en.json';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faPrint,
  faShareAlt,
  faDownload,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import '../styles/OrcamentoPage.css';

const OrcamentoPage = () => {
  const { t, i18n } = useTranslation();
  
  // Lógica para escolher qual JSON usar
  const precosData = (i18n.language && i18n.language.startsWith('en')) 
    ? precosEN 
    : precosPT;

  // REMOVIDO: const currentLang = i18n.language || 'pt'; (Não estava sendo usado)

  const [selectedServices, setSelectedServices] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [openServiceDetails, setOpenServiceDetails] = useState({});
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    cupom: '',
    mensagem: '',
  });
  const [finalPrice, setFinalPrice] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [alert, setAlert] = useState(null);
  const [showResultCard, setShowResultCard] = useState(false);
  const [agreedToContact, setAgreedToContact] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const componentRef = useRef();

  // Função auxiliar para encontrar o serviço dentro do JSON atual (precosData)
  const findServiceObject = (categoryName, serviceTitle) => {
    if (!precosData || !precosData.orcamento) return null;
    const cat = precosData.orcamento.categorias.find((c) => c.nome === categoryName);
    if (!cat) return null;
    return cat.servicos.find((s) => s.titulo === serviceTitle) || null;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedServices = urlParams.get('servicos');
    const encodedResumo = urlParams.get('resumo');

    if (encodedServices) {
      try {
        const selectedFromQuiz = JSON.parse(decodeURIComponent(encodedServices));
        const newSelectedServices = {};

        selectedFromQuiz.forEach((item) => {
          if (!newSelectedServices[item.category]) {
            newSelectedServices[item.category] = {};
          }
          const serviceObject = findServiceObject(item.category, item.title);
          if (serviceObject) {
            const priceToUse = serviceObject.preco || (serviceObject.precos_por_periodo && serviceObject.precos_por_periodo[0].preco_total_com_desc);
            if (priceToUse !== undefined) {
              newSelectedServices[item.category][item.title] = priceToUse;
            }
          }
        });
        setSelectedServices(newSelectedServices);

        const newOpenCategories = {};
        Object.keys(newSelectedServices).forEach((cat) => {
          newOpenCategories[cat] = true;
        });
        setOpenCategories(newOpenCategories);
      } catch (e) {
        console.error('Erro ao decodificar serviços da URL:', e);
      }
    }

    if (encodedResumo) {
      try {
        const resumoDecodificado = decodeURIComponent(encodedResumo);
        setUserData((prev) => ({
          ...prev,
          mensagem: resumoDecodificado,
        }));
      } catch (e) {
        console.error('Erro ao decodificar resumo da URL:', e);
      }
    }
  // eslint-disable-next-line
  }, []); 

  const findPeriodDetails = (serviceObject, selectedPrice) => {
    if (serviceObject?.precos_por_periodo) {
      return serviceObject.precos_por_periodo.find(p => p.preco_total_com_desc === selectedPrice);
    }
    return null;
  };

  const getReunioesSemanas = (categoryName, title) => {
      if (categoryName.includes('Social Media') || categoryName.includes('Planos')) {
          if (title.includes('Básico') || title.includes('Basic')) return '1 Meeting/Week'; 
          if (title.includes('Standart') || title.includes('Standard')) return '2 Meetings/Week';
          if (title.includes('Premium')) return '2 Meetings/Week';
      }
      return null;
  };

  const toggleCategory = (categoryName) => {
    setOpenCategories((prevState) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  const toggleServiceDetails = (categoryName, serviceTitle) => {
    const key = `${categoryName}||${serviceTitle}`;
    setOpenServiceDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleServiceSelect = (categoryName, serviceTitle, price) => {
    setSelectedServices((prevState) => {
      const isSelected =
        prevState[categoryName] && Object.prototype.hasOwnProperty.call(prevState[categoryName], serviceTitle);
      const newSelection = { ...prevState };

      if (!findServiceObject(categoryName, serviceTitle).precos_por_periodo) {
        if (isSelected) {
          const updatedCategory = { ...newSelection[categoryName] };
          delete updatedCategory[serviceTitle];
          if (Object.keys(updatedCategory).length === 0) {
            delete newSelection[categoryName];
          } else {
            newSelection[categoryName] = updatedCategory;
          }
        } else {
          newSelection[categoryName] = {
            ...newSelection[categoryName],
            [serviceTitle]: price,
          };
        }
      } else {
        newSelection[categoryName] = {
          ...newSelection[categoryName],
          [serviceTitle]: price,
        };
      }
      return newSelection;
    });
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAgreementChange = (e) => {
    setAgreedToContact(e.target.checked);
  };
  
  const sendEmail = async (price, discount, appliedCoupon) => {
    const serviceList = Object.entries(selectedServices)
      .map(([category, services]) => {
        const serviceItems = Object.entries(services)
          .map(([title, itemPrice]) => {
            const svcObj = findServiceObject(category, title);
            const vendaTitle = svcObj?.titulo_venda || title;
            let periodInfo = '';
            const periodDetails = findPeriodDetails(svcObj, itemPrice);
            if (periodDetails) {
                const economia = periodDetails.preco_total_sem_desc - periodDetails.preco_total_com_desc;
                periodInfo = `(${periodDetails.periodo} - ${periodDetails.meses} meses, Economia: R$ ${economia.toFixed(2)})`;
            }
            return `- ${vendaTitle} ${periodInfo} - R$ ${itemPrice.toFixed(2)}`;
          })
          .join('\n');
        return `*${category}*\n${serviceItems}`;
      })
      .join('\n\n');

    const emailContent = `
Novo Orçamento de ${userData.nome}
E-mail: ${userData.email}
Telefone: ${userData.telefone || 'Não informado'}
Empresa/Instagram: ${userData.empresa || 'Não informado'}
Mensagem do Cliente: ${userData.mensagem || '—'}
Cupom de Desconto: ${userData.cupom || 'Nenhum'} (${appliedCoupon ? 'Aplicado' : 'Não aplicado ou Inválido'})

---
Serviços selecionados:
${serviceList}
---
Total Bruto: R$ ${(price + discount).toFixed(2)}
Desconto Aplicado: R$ ${discount.toFixed(2)}
Preço Final: R$ ${price.toFixed(2)}
`;

    try {
      const formspreeUrl = 'https://formspree.io/f/xwpnyvba';
      await fetch(formspreeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          from: 'comerc.ias.prod@gmail.com',
          to: 'comerc.ias.prod@gmail.com',
          _replyto: userData.email,
          subject: 'Novo Orçamento - Comerc IAs',
          body: emailContent,
        }),
      });

      setAlert({ variant: 'success', message: t('alert_success') });
      setShowResultCard(true);
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Houve um erro ao gerar o orçamento.' });
    }
  };


  const calculateBudget = () => {
    setAlert(null);
    setShowResultCard(false);

    if (!userData.nome || !userData.email || !userData.empresa || !userData.telefone) {
      setAlert({ variant: 'danger', message: t('alert_fill_data') });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setAlert({ variant: 'danger', message: t('alert_valid_email') });
      return;
    }

    if (!agreedToContact) {
      setAlert({ variant: 'danger', message: t('alert_accept_terms') });
      return;
    }

    const selectedCount = Object.keys(selectedServices).reduce(
      (count, category) => count + Object.keys(selectedServices[category]).length,
      0
    );
    if (selectedCount === 0) {
      setAlert({ variant: 'danger', message: t('alert_select_service') });
      return;
    }

    let total = 0;
    for (const category in selectedServices) {
      for (const service in selectedServices[category]) {
        total += selectedServices[category][service];
      }
    }

    let discount = 0;
    let appliedCoupon = false;

    if (userData.cupom.trim().toUpperCase() === 'NATAL25') {
      appliedCoupon = true;
      const isLongTermPlanSelected = Object.keys(selectedServices).some(category => {
        // Busca usando findServiceObject que agora usa precosData (dinâmico)
        const cat = precosData.orcamento.categorias.find(c => c.nome === category);
        if (cat && (cat.nome.includes('Social Media') || cat.nome.includes('Planos'))) {
          return Object.keys(selectedServices[category]).some(title => {
            const svc = findServiceObject(category, title);
            const selectedPrice = selectedServices[category][title];
            const periodDetails = findPeriodDetails(svc, selectedPrice);
            return periodDetails && periodDetails.meses > 1 && periodDetails.desconto_perc > 0;
          });
        }
        return false;
      });

      if (isLongTermPlanSelected) {
        setAlert({ variant: 'warning', message: 'Cupom não cumulativo com planos de longo prazo.' });
        discount = 0;
      } else {
        discount = total * 0.25;
      }
    }

    const final = total - discount;
    setFinalPrice(final);
    setAppliedDiscount(discount);

    sendEmail(final, discount, appliedCoupon);
    setShowResultCard(true);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Orçamento Comerc IAs - ${userData.nome}`,
  });

  const getShareText = () => {
    return `Olá, ${userData.nome}! O seu orçamento deu R$ ${finalPrice.toFixed(2)}.`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText());
    setAlert({ variant: 'success', message: t('alert_copy_success') });
    setShowShareModal(false);
  };

  const handleDownload = () => {
    const contentToDownload = `Orçamento: R$ ${finalPrice.toFixed(2)}`;
    const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orcamento.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const calculateDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    const discount = originalPrice - currentPrice;
    return Math.round((discount / originalPrice) * 100);
  };

  const formatEstimatedHours = (svc, price) => {
    if (svc?.precos_por_periodo) return null; 
    if (!svc) return null;
    const min = svc.tempo_estimado_horas_min;
    const max = svc.tempo_estimado_horas_max;
    if (min && max) {
      const avg = (min + max) / 2;
      const pricePerHour = avg > 0 ? price / avg : null;
      return {
        label: `${min}–${max} h`,
        avg,
        pricePerHour: pricePerHour ? Number(pricePerHour.toFixed(2)) : null,
      };
    }
    return null;
  };

  return (
    <>
      <SEO 
        title={t('orcamento_seo_title')} 
        description={t('orcamento_seo_desc')} 
        href="/orcamento" 
      />
      <Container className="orcamento-section">
        <h1 className="text-primary fw-bold text-center mb-4">{t('orcamento_page_title')}</h1>

        <Row className="justify-content-center">
          <Col md={9}>
            <Card className="orcamento-card p-3">
              <h4 className="mb-3">{t('orcamento_subtitle')}</h4>
              <div className="orcamento-list mb-3">
                {/* Iteramos sobre precosData (que muda conforme idioma) */}
                {precosData.orcamento.categorias.map((categoria) => (
                  <div key={categoria.nome} className="category-item mb-3">
                    <div
                      onClick={() => toggleCategory(categoria.nome)}
                      className="d-flex justify-content-between align-items-center p-3 rounded"
                      style={{ backgroundColor: '#f7f9fb', cursor: 'pointer' }}
                    >
                      <div>
                        {/* categoria.nome agora vem traduzido do JSON EN ou PT */}
                        <h5 className="mb-0">{categoria.nome}</h5>
                        <small className="text-muted">{categoria.servicos.length} {t('orcamento_cat_options')}</small>
                      </div>
                      <FontAwesomeIcon
                        icon={openCategories[categoria.nome] ? faChevronUp : faChevronDown}
                        size="lg"
                      />
                    </div>

                    <Collapse in={openCategories[categoria.nome]}>
                      <div className="services-list p-3 border rounded">
                        {categoria.servicos.map((servico, index) => {
                          const key = `${categoria.nome}-${servico.titulo}`;
                          const defaultPrice = servico.preco || (servico.precos_por_periodo ? servico.precos_por_periodo[0].preco_total_com_desc : 0);
                          const currentPrice = selectedServices[categoria.nome] ? selectedServices[categoria.nome][servico.titulo] : defaultPrice;
                          const isChecked = !!selectedServices[categoria.nome] && !!selectedServices[categoria.nome][servico.titulo];

                          const vendaTitle = servico.titulo_venda || servico.titulo;
                          const est = formatEstimatedHours(servico, currentPrice);
                          const discountPercentage = calculateDiscountPercentage(servico.preco_original, currentPrice);
                          
                          const periodDetails = findPeriodDetails(servico, currentPrice);
                          const originalPriceToDisplay = periodDetails ? periodDetails.preco_total_sem_desc : servico.preco_original;
                          const discountToDisplay = periodDetails ? periodDetails.desconto_perc : discountPercentage;
                          const finalPriceToDisplay = periodDetails ? periodDetails.preco_total_com_desc : currentPrice;
                          const reunioesBadge = getReunioesSemanas(categoria.nome, servico.titulo);

                          return (
                            <Card key={key} className="mb-2">
                              <Card.Body className="p-2">
                                <div className="d-flex align-items-start">
                                  <div style={{ flex: 1 }}>
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div>
                                        {servico.precos_por_periodo ? (
                                          <h5 className="mb-0"><strong>{vendaTitle}</strong></h5>
                                        ) : (
                                          <Form.Check
                                            type="checkbox"
                                            id={`${categoria.nome}-${servico.titulo}`}
                                            label={<strong>{vendaTitle}</strong>}
                                            onChange={() => handleServiceSelect(categoria.nome, servico.titulo, defaultPrice)}
                                            checked={!!isChecked}
                                          />
                                        )}
                                        
                                        <div className="ms-4 mt-1">
                                          <small className="text-muted d-block">{servico.descricao}</small>
                                          <div className="mt-1">
                                            <Badge bg="info" className="me-1">
                                              {reunioesBadge || (periodDetails ? `${periodDetails.meses} meses` : servico.prazo_entrega || 'Padrão')}
                                            </Badge>
                                            <Badge bg="secondary" className="me-1">
                                              {servico.revisoes_incluidas != null ? `${servico.revisoes_incluidas} revisão(ões)` : 'Revisões sob pedido'}
                                            </Badge>
                                            {est && ( <Badge bg="warning" text="dark">{est.label}</Badge> )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div style={{minWidth: '130px', textAlign: 'right'}} className="d-flex flex-column justify-content-center align-items-end"> 
                                        <div style={{lineHeight: 1}} className="d-flex flex-column align-items-end">
                                          {discountToDisplay > 0 && (
                                            <div className="d-flex align-items-center justify-content-end gap-1 mb-1 w-100">
                                              <div className="text-muted small" style={{ textDecoration: 'line-through' }}>
                                                R$ {Number(originalPriceToDisplay).toFixed(0)}
                                              </div>
                                              <Badge bg="danger" className="align-self-start ms-1">-{discountToDisplay}%</Badge>
                                            </div>
                                          )}
                                          <div className="text-success" style={{fontWeight: 900, fontSize: '1.4rem'}}>
                                            R$ {Number(finalPriceToDisplay).toFixed(0)}
                                          </div>
                                        </div>
                                        
                                        <div className="mt-2">
                                          <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => toggleServiceDetails(categoria.nome, servico.titulo)}
                                            style={{ padding: 0 }}
                                          >
                                            {openServiceDetails[`${categoria.nome}||${servico.titulo}`] ? t('btn_close') : t('btn_details')}
                                            {' '}<FontAwesomeIcon icon={faInfoCircle} />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {servico.precos_por_periodo && (
                                  <div className="mt-3 p-2 border-top">
                                    <h6>{t('label_period')}</h6>
                                    {servico.precos_por_periodo.map((p) => {
                                      const isPeriodChecked = isChecked && currentPrice === p.preco_total_com_desc;
                                      const isMonthly = p.meses === 1;
                                      return (
                                        <Form.Check
                                          key={`${key}-${p.periodo}`}
                                          type="radio" 
                                          name={`${categoria.nome}-${servico.titulo}-periodo`}
                                          id={`${categoria.nome}-${servico.titulo}-${p.periodo}`}
                                          label={
                                            <div className="d-flex justify-content-between align-items-start w-100">
                                              <span className="mt-1" style={{ fontWeight: 'bold' }}>{p.periodo}</span>
                                              <div style={{minWidth: '130px', textAlign: 'right', marginLeft: '10px'}} className="d-flex flex-column align-items-end">
                                                  <div className="d-flex align-items-center" style={{minHeight: '24px', marginBottom: '4px'}}>
                                                      <span className="text-success" style={{fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap'}}>
                                                          R$ {p.preco_total_com_desc.toFixed(0)}
                                                      </span>
                                                      {p.desconto_perc > 0 ? (
                                                          <Badge bg="danger" className="ms-2">-{p.desconto_perc}% OFF</Badge>
                                                      ) : ( <span style={{minWidth: '55px', height: '100%', visibility: 'hidden'}}>&nbsp;</span> )}
                                                  </div>
                                                  {(!isMonthly) ? (
                                                      <small className="text-muted d-block" style={{fontSize: '0.75em'}}>
                                                        ~R$ {p.preco_mensal_efetivo.toFixed(0)}/mês
                                                      </small>
                                                  ) : ( <small className="text-muted d-block" style={{fontSize: '0.75em', visibility: 'hidden'}}>&nbsp;</small> )}
                                              </div>
                                            </div>
                                          }
                                          onChange={() => handleServiceSelect(categoria.nome, servico.titulo, p.preco_total_com_desc)}
                                          checked={isPeriodChecked}
                                          className="mb-1"
                                        />
                                      );
                                    })}
                                  </div>
                                )}

                                <Collapse in={openServiceDetails[`${categoria.nome}||${servico.titulo}`]}>
                                  <div className="mt-3 ms-4">
                                    <div>
                                      <strong>{t('label_includes')}</strong>
                                      {servico.inclui && servico.inclui.length > 0 ? (
                                        <ul>{servico.inclui.map((it, i) => (<li key={i}>{it}</li>))}</ul>
                                      ) : (<p className="mb-1 text-muted">Inclusões não especificadas.</p>)}
                                    </div>
                                    {servico.beneficios && servico.beneficios.length > 0 && (
                                      <div>
                                        <strong>{t('label_benefits')}</strong>
                                        <ul>{servico.beneficios.map((b, i) => (<li key={i}>{b}</li>))}</ul>
                                      </div>
                                    )}
                                    <div className="d-flex gap-3 flex-wrap">
                                      {servico.formato_entrega && (
                                        <div><strong>{t('label_formats')}</strong><div className="small">{servico.formato_entrega.join(' • ')}</div></div>
                                      )}
                                      <div><strong>{t('label_deadline')}</strong><div className="small">{servico.prazo_entrega || 'Conforme acordado'}</div></div>
                                    </div>
                                  </div>
                                </Collapse>
                              </Card.Body>
                            </Card>
                          );
                        })}
                      </div>
                    </Collapse>
                  </div>
                ))}
              </div>

              <h4 className="mb-3">{t('form_title')}</h4>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>{t('label_name')}</Form.Label>
                  <Form.Control type="text" name="nome" value={userData.nome} onChange={handleUserInputChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('label_email')}</Form.Label>
                  <Form.Control type="email" name="email" value={userData.email} onChange={handleUserInputChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('label_company')}</Form.Label>
                  <Form.Control type="text" name="empresa" value={userData.empresa} onChange={handleUserInputChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('label_phone')}</Form.Label>
                  <Form.Control type="tel" name="telefone" value={userData.telefone} onChange={handleUserInputChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('label_coupon')}</Form.Label>
                  <Form.Control type="text" name="cupom" value={userData.cupom} onChange={handleUserInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>{t('label_message')}</Form.Label>
                  <Form.Control as="textarea" rows={4} name="mensagem" value={userData.mensagem} onChange={handleUserInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="agreedToContact"
                    label={t('label_agree')}
                    checked={agreedToContact}
                    onChange={handleAgreementChange}
                  />
                </Form.Group>

                {alert && (
                  <Alert variant={alert.variant} className="mb-3">
                    {alert.message}
                  </Alert>
                )}

                <Button onClick={calculateBudget} className="w-100 rounded-pill mt-2">
                  {t('btn_generate')}
                </Button>
              </Form>

              <div className="mt-4">
                <h6>{t('label_obs')}</h6>
                <p>{precosData.orcamento.observacoes}</p>
              </div>
            </Card>

            {showResultCard && (
              <div ref={componentRef}>
                <Card className="p-4 shadow mt-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <h4>{t('result_title')}</h4>
                    <div>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={handlePrint}>
                        <FontAwesomeIcon icon={faPrint} /> {t('btn_print')}
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={handleDownload}>
                        <FontAwesomeIcon icon={faDownload} /> {t('btn_download')}
                      </Button>
                    </div>
                  </div>
                  <hr />
                  <Row>
                    <Col md={6}>
                      <p><strong>{t('label_name')}</strong> {userData.nome}</p>
                      <p><strong>{t('label_email')}</strong> {userData.email}</p>
                      <p><strong>Empresa:</strong> {userData.empresa}</p>
                      <p><strong>Telefone:</strong> {userData.telefone}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>{t('label_discount_applied')}</strong> R$ {appliedDiscount.toFixed(2)}</p>
                      <h5 className="text-primary">{t('label_final_price')} R$ {finalPrice.toFixed(2)}</h5>
                    </Col>
                  </Row>

                  <h5 className="mt-3">{t('label_selected_services')}</h5>
                  <div>
                    {Object.entries(selectedServices).map(([category, services]) => (
                      <Card key={category} className="mb-2">
                        <Card.Body>
                          <h6>{category}</h6>
                          <ul className="list-unstyled mb-0">
                            {Object.entries(services).map(([title, price]) => (
                                <li key={title} className="mb-2">
                                  <div className="d-flex justify-content-between">
                                    <div><strong>{title}</strong></div>
                                    <div className="text-end">R$ {Number(price).toFixed(0)}</div>
                                  </div>
                                </li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-3 d-flex gap-2 justify-content-end">
                    <Button variant="outline-primary" onClick={handleShare}>
                      <FontAwesomeIcon icon={faShareAlt} className="me-2" /> {t('btn_share')}
                    </Button>
                    <Button variant="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      {t('btn_back_top')}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </Col>
        </Row>

        <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{t('modal_share_title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{t('modal_share_desc')}</p>
            <Form.Control as="textarea" rows={10} readOnly value={getShareText()} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowShareModal(false)}>{t('btn_close')}</Button>
            <Button variant="primary" onClick={copyToClipboard}>{t('btn_copy')}</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default OrcamentoPage;