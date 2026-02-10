import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  faBolt,
  faShieldAlt,
  faClock,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import '../styles/OrcamentoPage.css';

const OrcamentoPage = () => {
  const { t, i18n } = useTranslation();

  const currentLang = ((i18n.language || 'pt').split('-')[0] || 'pt').toLowerCase();

  // Lógica para escolher qual JSON usar
  const precosData = (i18n.language && i18n.language.startsWith('en'))
    ? precosEN
    : precosPT;

  const hero = precosData?.orcamento?.hero || {};

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

  const formatCurrency = (value) => {
    try {
      const locale = currentLang === 'en' ? 'en-US' : 'pt-BR';
      return new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(value || 0);
    } catch (e) {
      return `R$ ${Number(value || 0).toFixed(2)}`;
    }
  };

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
          if (!newSelectedServices[item.category]) newSelectedServices[item.category] = {};
          const serviceObject = findServiceObject(item.category, item.title);
          if (serviceObject) {
            const priceToUse =
              serviceObject.preco ||
              (serviceObject.precos_por_periodo && serviceObject.precos_por_periodo[0].preco_total_com_desc);
            if (priceToUse !== undefined) newSelectedServices[item.category][item.title] = priceToUse;
          }
        });

        setSelectedServices(newSelectedServices);

        const newOpenCategories = {};
        Object.keys(newSelectedServices).forEach((cat) => { newOpenCategories[cat] = true; });
        setOpenCategories(newOpenCategories);
      } catch (e) {
        console.error('Erro ao decodificar serviços da URL:', e);
      }
    }

    if (encodedResumo) {
      try {
        const resumoDecodificado = decodeURIComponent(encodedResumo);
        setUserData((prev) => ({ ...prev, mensagem: resumoDecodificado }));
      } catch (e) {
        console.error('Erro ao decodificar resumo da URL:', e);
      }
    }
    // eslint-disable-next-line
  }, []);

  const findPeriodDetails = (serviceObject, selectedPrice) => {
    if (serviceObject?.precos_por_periodo) {
      return serviceObject.precos_por_periodo.find((p) => p.preco_total_com_desc === selectedPrice);
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
    setOpenCategories((prev) => ({ ...prev, [categoryName]: !prev[categoryName] }));
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
      const svc = findServiceObject(categoryName, serviceTitle);
      const hasPeriodPricing = !!svc?.precos_por_periodo;

      if (!hasPeriodPricing) {
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
        // radio (apenas 1 período por serviço)
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
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgreementChange = (e) => setAgreedToContact(e.target.checked);

  const selectedCount = useMemo(() => (
    Object.keys(selectedServices).reduce(
      (count, category) => count + Object.keys(selectedServices[category]).length,
      0
    )
  ), [selectedServices]);

  const selectedSubtotal = useMemo(() => {
    let total = 0;
    for (const category in selectedServices) {
      for (const service in selectedServices[category]) total += selectedServices[category][service];
    }
    return total;
  }, [selectedServices]);

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
              periodInfo = `(${periodDetails.periodo} - ${periodDetails.meses} meses, Economia: ${formatCurrency(economia)})`;
            }
            return `- ${vendaTitle} ${periodInfo} - ${formatCurrency(itemPrice)}`;
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
Total Bruto: ${formatCurrency(price + discount)}
Desconto Aplicado: ${formatCurrency(discount)}
Preço Final: ${formatCurrency(price)}
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

      setAlert({ variant: 'success', message: t('alert_success', { defaultValue: 'Orçamento gerado! Já enviamos um resumo por e-mail.' }) });
      setShowResultCard(true);
    } catch (error) {
      setAlert({ variant: 'danger', message: t('alert_error', { defaultValue: 'Houve um erro ao gerar o orçamento.' }) });
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

    if (selectedCount === 0) {
      setAlert({ variant: 'danger', message: t('alert_select_service') });
      return;
    }

    let total = selectedSubtotal;

    let discount = 0;
    let appliedCoupon = false;

    if (userData.cupom.trim().toUpperCase() === 'NATAL25') {
      appliedCoupon = true;
      const isLongTermPlanSelected = Object.keys(selectedServices).some((category) => {
        const cat = precosData.orcamento.categorias.find((c) => c.nome === category);
        if (cat && (cat.nome.includes('Social Media') || cat.nome.includes('Planos'))) {
          return Object.keys(selectedServices[category]).some((title) => {
            const svc = findServiceObject(category, title);
            const selectedPrice = selectedServices[category][title];
            const periodDetails = findPeriodDetails(svc, selectedPrice);
            return periodDetails && periodDetails.meses > 1 && periodDetails.desconto_perc > 0;
          });
        }
        return false;
      });

      if (isLongTermPlanSelected) {
        setAlert({ variant: 'warning', message: t('coupon_not_stack', { defaultValue: 'Cupom não cumulativo com planos de longo prazo.' }) });
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

  const getShareText = () => `Olá, ${userData.nome}! O seu orçamento deu ${formatCurrency(finalPrice)}.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText());
    setAlert({ variant: 'success', message: t('alert_copy_success') });
    setShowShareModal(false);
  };

  const handleDownload = () => {
    const contentToDownload = `Orçamento: ${formatCurrency(finalPrice)}`;
    const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orcamento.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        href={`/${currentLang}/orcamento`}
      />

      <div className="orcamento-page">
        <Container>
          <div className="orc-wrap">

            {/* HERO PREMIUM */}
            <section className="orc-hero">
              <div className="orc-hero-inner">
                <div className="orc-hero-badge">
                  <FontAwesomeIcon icon={faBolt} className="me-2" />
                  {hero.badge || t('orcamento_hero_badge', { defaultValue: 'Orçamento Instantâneo' })}
                </div>

                <h1 className="orc-hero-title">
                  {hero.titulo || t('orcamento_page_title')}
                </h1>

                <p className="orc-hero-subtitle">
                  {hero.subtitulo || t('orcamento_subtitle')}
                </p>

                <div className="orc-hero-highlights">
                  <div className="orc-hero-highlight">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{t('orc_hl_fast', { defaultValue: 'Rápido e intuitivo' })}</span>
                  </div>
                  <div className="orc-hero-highlight">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <span>{t('orc_hl_pro', { defaultValue: 'Resumo profissional' })}</span>
                  </div>
                  <div className="orc-hero-highlight">
                    <FontAwesomeIcon icon={faListCheck} />
                    <span>{t('orc_hl_clear', { defaultValue: 'Detalhes por serviço' })}</span>
                  </div>
                </div>

                <div className="orc-hero-note">
                  {hero.nota || t('orcamento_hero_note', { defaultValue: 'Dica: descreva seu objetivo no campo de mensagem para um orçamento mais preciso.' })}
                </div>
              </div>
            </section>

            {/* MARCADOR: PROVA SOCIAL / LOGOS / DEPOIMENTOS (adicione aqui depois) */}
            <div className="premium-marker">
              MARCADOR: Prova social (logos / números / depoimentos curtos)
            </div>

            <Row className="g-4 mt-2">
              {/* COLUNA PRINCIPAL */}
              <Col lg={8}>
                {/* PASSO 1 */}
                <Card className="orc-card">
                  <Card.Body className="orc-card-body">
                    <div className="orc-card-head">
                      <div>
                        <div className="orc-step">1</div>
                      </div>
                      <div className="flex-grow-1">
                        <h2 className="orc-card-title">{t('orc_step_services', { defaultValue: 'Escolha seus serviços' })}</h2>
                        <p className="orc-card-subtitle">
                          {t('orc_step_services_sub', { defaultValue: 'Expanda uma categoria, selecione itens e veja detalhes completos.' })}
                        </p>
                      </div>
                    </div>

                    <div className="orc-list">
                      {precosData.orcamento.categorias.map((categoria) => (
                        <div key={categoria.nome} className="orc-cat">
                          <button
                            type="button"
                            className={`orc-catHeader ${openCategories[categoria.nome] ? 'is-open' : ''}`}
                            onClick={() => toggleCategory(categoria.nome)}
                          >
                            <div className="orc-catLeft">
                              <h3 className="orc-catTitle">{categoria.nome}</h3>
                              <span className="orc-catMeta">
                                {categoria.servicos.length} {t('orcamento_cat_options')}
                              </span>
                            </div>
                            <span className="orc-catIcon">
                              <FontAwesomeIcon icon={openCategories[categoria.nome] ? faChevronUp : faChevronDown} />
                            </span>
                          </button>

                          <Collapse in={openCategories[categoria.nome]}>
                            <div className="orc-catBody">
                              {categoria.servicos.map((servico) => {
                                const key = `${categoria.nome}-${servico.titulo}`;
                                const defaultPrice =
                                  servico.preco ||
                                  (servico.precos_por_periodo
                                    ? servico.precos_por_periodo[0].preco_total_com_desc
                                    : 0);

                                const currentPrice = selectedServices[categoria.nome]
                                  ? selectedServices[categoria.nome][servico.titulo]
                                  : defaultPrice;

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
                                  <div key={key} className={`orc-svc ${isChecked ? 'is-selected' : ''}`}>
                                    <div className="orc-svcTop">
                                      <div className="orc-svcMain">
                                        {!servico.precos_por_periodo ? (
                                          <Form.Check
                                            type="checkbox"
                                            id={`${categoria.nome}-${servico.titulo}`}
                                            className="orc-check"
                                            label={<strong>{vendaTitle}</strong>}
                                            onChange={() => handleServiceSelect(categoria.nome, servico.titulo, defaultPrice)}
                                            checked={!!isChecked}
                                          />
                                        ) : (
                                          <div className="orc-svcTitle"><strong>{vendaTitle}</strong></div>
                                        )}

                                        <div className="orc-svcDesc">{servico.descricao}</div>

                                        <div className="orc-badges">
                                          <Badge bg="info" className="orc-badge">
                                            {reunioesBadge || (periodDetails ? `${periodDetails.meses} meses` : servico.prazo_entrega || 'Padrão')}
                                          </Badge>

                                          <Badge bg="secondary" className="orc-badge">
                                            {servico.revisoes_incluidas != null ? `${servico.revisoes_incluidas} revisão(ões)` : 'Revisões sob pedido'}
                                          </Badge>

                                          {est && (
                                            <Badge bg="warning" text="dark" className="orc-badge">
                                              {est.label}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>

                                      <div className="orc-svcPrice">
                                        {discountToDisplay > 0 && (
                                          <div className="orc-svcStrike">
                                            <span className="orc-svcOld">{formatCurrency(Number(originalPriceToDisplay || 0))}</span>
                                            <span className="orc-svcOff">-{discountToDisplay}%</span>
                                          </div>
                                        )}
                                        <div className="orc-svcNew">
                                          {formatCurrency(Number(finalPriceToDisplay || 0))}
                                        </div>

                                        <button
                                          type="button"
                                          className="orc-linkBtn"
                                          onClick={() => toggleServiceDetails(categoria.nome, servico.titulo)}
                                        >
                                          {openServiceDetails[`${categoria.nome}||${servico.titulo}`]
                                            ? t('btn_close')
                                            : t('btn_details')}{' '}
                                          <FontAwesomeIcon icon={faInfoCircle} />
                                        </button>
                                      </div>
                                    </div>

                                    {servico.precos_por_periodo && (
                                      <div className="orc-periods">
                                        <div className="orc-periodsTitle">{t('label_period')}</div>

                                        {servico.precos_por_periodo.map((p) => {
                                          const isPeriodChecked = isChecked && currentPrice === p.preco_total_com_desc;
                                          const isMonthly = p.meses === 1;
                                          return (
                                            <div key={`${key}-${p.periodo}`} className={`orc-period ${isPeriodChecked ? 'is-active' : ''}`}>
                                              <Form.Check
                                                type="radio"
                                                name={`${categoria.nome}-${servico.titulo}-periodo`}
                                                id={`${categoria.nome}-${servico.titulo}-${p.periodo}`}
                                                className="orc-radio"
                                                checked={isPeriodChecked}
                                                onChange={() => handleServiceSelect(categoria.nome, servico.titulo, p.preco_total_com_desc)}
                                                label={
                                                  <div className="orc-periodRow">
                                                    <div className="orc-periodLeft">
                                                      <div className="orc-periodName">{p.periodo}</div>
                                                      {!isMonthly && (
                                                        <div className="orc-periodMini">
                                                          ~{formatCurrency(p.preco_mensal_efetivo)}/mês
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className="orc-periodRight">
                                                      <div className="orc-periodPrice">{formatCurrency(p.preco_total_com_desc)}</div>
                                                      {p.desconto_perc > 0 && (
                                                        <span className="orc-periodOff">-{p.desconto_perc}%</span>
                                                      )}
                                                    </div>
                                                  </div>
                                                }
                                              />
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}

                                    <Collapse in={openServiceDetails[`${categoria.nome}||${servico.titulo}`]}>
                                      <div className="orc-details">
                                        <div className="orc-detailsGrid">
                                          <div>
                                            <div className="orc-detailsTitle">{t('label_includes')}</div>
                                            {servico.inclui && servico.inclui.length > 0 ? (
                                              <ul className="orc-detailsList">
                                                {servico.inclui.map((it, i) => (<li key={i}>{it}</li>))}
                                              </ul>
                                            ) : (
                                              <div className="orc-muted">Inclusões não especificadas.</div>
                                            )}
                                          </div>

                                          {servico.beneficios && servico.beneficios.length > 0 && (
                                            <div>
                                              <div className="orc-detailsTitle">{t('label_benefits')}</div>
                                              <ul className="orc-detailsList">
                                                {servico.beneficios.map((b, i) => (<li key={i}>{b}</li>))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>

                                        <div className="orc-detailsMeta">
                                          {servico.formato_entrega && (
                                            <div>
                                              <div className="orc-detailsTitle">{t('label_formats')}</div>
                                              <div className="orc-small">{servico.formato_entrega.join(' • ')}</div>
                                            </div>
                                          )}

                                          <div>
                                            <div className="orc-detailsTitle">{t('label_deadline')}</div>
                                            <div className="orc-small">{servico.prazo_entrega || 'Conforme acordado'}</div>
                                          </div>
                                        </div>

                                        {/* MARCADOR: INSERIR "Exemplos / antes e depois / mini vídeo" por serviço */}
                                        <div className="premium-marker premium-marker--small">
                                          MARCADOR: Mini mídia do serviço (ex: vídeo curto / antes e depois / mini case)
                                        </div>
                                      </div>
                                    </Collapse>
                                  </div>
                                );
                              })}
                            </div>
                          </Collapse>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* PASSO 2 */}
                <Card className="orc-card mt-4">
                  <Card.Body className="orc-card-body">
                    <div className="orc-card-head">
                      <div>
                        <div className="orc-step">2</div>
                      </div>
                      <div className="flex-grow-1">
                        <h2 className="orc-card-title">{t('form_title')}</h2>
                        <p className="orc-card-subtitle">
                          {t('orc_step_form_sub', { defaultValue: 'Preencha seus dados e clique em “Gerar orçamento”.' })}
                        </p>
                      </div>
                    </div>

                    <Form className="orc-form">
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{t('label_name')}</Form.Label>
                            <Form.Control type="text" name="nome" value={userData.nome} onChange={handleUserInputChange} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{t('label_email')}</Form.Label>
                            <Form.Control type="email" name="email" value={userData.email} onChange={handleUserInputChange} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{t('label_company')}</Form.Label>
                            <Form.Control type="text" name="empresa" value={userData.empresa} onChange={handleUserInputChange} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{t('label_phone')}</Form.Label>
                            <Form.Control type="tel" name="telefone" value={userData.telefone} onChange={handleUserInputChange} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{t('label_coupon')}</Form.Label>
                            <Form.Control type="text" name="cupom" value={userData.cupom} onChange={handleUserInputChange} placeholder="Ex: NATAL25" />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>{t('label_message')}</Form.Label>
                            <Form.Control as="textarea" rows={4} name="mensagem" value={userData.mensagem} onChange={handleUserInputChange} />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group>
                            <Form.Check
                              type="checkbox"
                              id="agreedToContact"
                              className="orc-check"
                              label={t('label_agree')}
                              checked={agreedToContact}
                              onChange={handleAgreementChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {alert && (
                        <Alert variant={alert.variant} className="mt-3">
                          {alert.message}
                        </Alert>
                      )}

                      <div className="orc-ctaRow">
                        <Button type="button" onClick={calculateBudget} className="orc-btn orc-btn-primary">
                          {hero.cta_primario || t('btn_generate')}
                        </Button>
                        <Button
                          type="button"
                          variant="outline-primary"
                          className="orc-btn orc-btn-ghost"
                          onClick={() => { window.location.href = `/${currentLang}/contact`; }}
                        >
                          {hero.cta_secundario || t('orc_whats', { defaultValue: 'WhatsApp' })}
                        </Button>
                      </div>

                      <div className="orc-footnote">
                        <strong>{t('label_obs')}</strong> {precosData.orcamento.observacoes}
                      </div>
                    </Form>
                  </Card.Body>
                </Card>

                {/* PASSO 3 - RESULTADO */}
                {showResultCard && (
                  <div ref={componentRef} className="mt-4">
                    <Card className="orc-card orc-card-result">
                      <Card.Body className="orc-card-body">
                        <div className="orc-resultHead">
                          <div>
                            <h2 className="orc-card-title mb-1">{t('result_title')}</h2>
                            <div className="orc-muted">
                              {t('orc_result_hint', { defaultValue: 'Guarde este resumo para comparar opções.' })}
                            </div>
                          </div>

                          <div className="orc-resultActions">
                            <Button variant="outline-secondary" size="sm" className="orc-actionBtn" onClick={handlePrint}>
                              <FontAwesomeIcon icon={faPrint} /> {t('btn_print')}
                            </Button>
                            <Button variant="outline-secondary" size="sm" className="orc-actionBtn" onClick={handleDownload}>
                              <FontAwesomeIcon icon={faDownload} /> {t('btn_download')}
                            </Button>
                          </div>
                        </div>

                        <div className="orc-resultGrid">
                          <div className="orc-resultCard">
                            <div className="orc-resultLabel">{t('label_discount_applied')}</div>
                            <div className="orc-resultValue">{formatCurrency(appliedDiscount)}</div>
                          </div>

                          <div className="orc-resultCard is-highlight">
                            <div className="orc-resultLabel">{t('label_final_price')}</div>
                            <div className="orc-resultValue">{formatCurrency(finalPrice)}</div>
                          </div>
                        </div>

                        <div className="orc-divider" />

                        <Row className="g-3">
                          <Col md={6}>
                            <div className="orc-kv"><span>{t('label_name')}</span><strong>{userData.nome}</strong></div>
                            <div className="orc-kv"><span>{t('label_email')}</span><strong>{userData.email}</strong></div>
                            <div className="orc-kv"><span>{t('label_company')}</span><strong>{userData.empresa}</strong></div>
                            <div className="orc-kv"><span>{t('label_phone')}</span><strong>{userData.telefone}</strong></div>
                          </Col>

                          <Col md={6}>
                            <div className="orc-kv">
                              <span>{t('label_selected_services')}</span>
                              <strong>{selectedCount}</strong>
                            </div>
                            <div className="orc-kv">
                              <span>{t('orc_subtotal', { defaultValue: 'Subtotal (antes de cupons)' })}</span>
                              <strong>{formatCurrency(selectedSubtotal)}</strong>
                            </div>
                          </Col>
                        </Row>

                        <h3 className="orc-sectionTitle mt-4">{t('label_selected_services')}</h3>

                        <div className="orc-selectedList">
                          {Object.entries(selectedServices).map(([category, services]) => (
                            <div key={category} className="orc-selectedCat">
                              <div className="orc-selectedCatTitle">{category}</div>
                              <div className="orc-selectedItems">
                                {Object.entries(services).map(([title, price]) => (
                                  <div key={title} className="orc-selectedItem">
                                    <div className="orc-selectedLeft">
                                      <strong>{title}</strong>
                                    </div>
                                    <div className="orc-selectedRight">
                                      {formatCurrency(Number(price))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="orc-resultFooter">
                          <Button variant="outline-primary" className="orc-btn orc-btn-ghost" onClick={() => setShowShareModal(true)}>
                            <FontAwesomeIcon icon={faShareAlt} className="me-2" /> {t('btn_share')}
                          </Button>

                          <Button
                            variant="primary"
                            className="orc-btn orc-btn-primary"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            {t('btn_back_top')}
                          </Button>
                        </div>

                        {/* MARCADOR: CTA final para sala 3D (quando estiver pronto) */}
                        <div className="premium-marker mt-3">
                          MARCADOR: CTA final “Entrar no Escritório 3D” + mini texto de fascínio
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Col>

              {/* ASIDE PREMIUM (RESUMO / STICKY) */}
              <Col lg={4}>
                <div className="orc-aside">
                  <Card className="orc-card orc-card-sticky">
                    <Card.Body className="orc-card-body">
                      <div className="orc-asideTitle">
                        {t('orc_summary', { defaultValue: 'Resumo' })}
                      </div>

                      <div className="orc-asideLine">
                        <span>{t('orc_selected', { defaultValue: 'Selecionados' })}</span>
                        <strong>{selectedCount}</strong>
                      </div>

                      <div className="orc-asideLine">
                        <span>{t('orc_subtotal', { defaultValue: 'Subtotal' })}</span>
                        <strong>{formatCurrency(selectedSubtotal)}</strong>
                      </div>

                      <div className="orc-asideHint">
                        {t('orc_summary_hint', { defaultValue: 'Finalize no Passo 2 para receber seu orçamento por e-mail.' })}
                      </div>

                      <div className="orc-asideBtns">
                        <Button
                          type="button"
                          className="orc-btn orc-btn-primary"
                          onClick={() => {
                            const el = document.querySelector('.orc-form');
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                        >
                          {t('orc_go_form', { defaultValue: 'Ir para o formulário' })}
                        </Button>

                        <Button
                          type="button"
                          variant="outline-primary"
                          className="orc-btn orc-btn-ghost"
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                          {t('orc_back_services', { defaultValue: 'Voltar aos serviços' })}
                        </Button>
                      </div>

                      {/* MARCADOR: mini funil / bot / CTA adicional */}
                      <div className="premium-marker premium-marker--small mt-3">
                        MARCADOR: Mini funil (bot / perguntas rápidas / recomendação automática)
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>

            <Modal
              show={showShareModal}
              onHide={() => setShowShareModal(false)}
              centered
              dialogClassName="orc-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title>{t('modal_share_title')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="orc-muted">{t('modal_share_desc')}</p>
                <Form.Control as="textarea" rows={6} readOnly value={getShareText()} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowShareModal(false)}>{t('btn_close')}</Button>
                <Button variant="primary" onClick={copyToClipboard}>{t('btn_copy')}</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Container>
      </div>
    </>
  );
};

export default OrcamentoPage;
