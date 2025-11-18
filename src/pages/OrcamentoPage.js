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
import precosData from '../data/precos.json'; 
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
import '../styles/OrcamentoPage.css';
import InfoTooltip from '../components/InfoTooltip';

const OrcamentoPage = () => {
  // selectedServices agora armazena o preço TOTAL do serviço/período selecionado
  const [selectedServices, setSelectedServices] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [openServiceDetails, setOpenServiceDetails] = useState({}); // para expandir detalhes por serviço
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
          // Lógica simplificada: para planos de longo prazo que não têm 'preco' direto, 
          // usaremos o preço do primeiro período (Mensal) para inicialização.
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
  }, []);

  // Helper: encontra o objeto do serviço a partir da categoria e título
  const findServiceObject = (categoryName, serviceTitle) => {
    const cat = precosData.orcamento.categorias.find((c) => c.nome === categoryName);
    if (!cat) return null;
    return cat.servicos.find((s) => s.titulo === serviceTitle) || null;
  };

  // Helper: encontra os detalhes do período selecionado
  const findPeriodDetails = (serviceObject, selectedPrice) => {
    if (serviceObject?.precos_por_periodo) {
      return serviceObject.precos_por_periodo.find(p => p.preco_total_com_desc === selectedPrice);
    }
    return null; // Não se aplica a serviços avulsos
  };

  // Helper: Encontra o detalhe específico das reuniões semanais para os planos
  const getReunioesSemanas = (categoryName, title) => {
      if (categoryName.includes('Planos de Social Media')) {
          // Os detalhes dos planos são baseados no título (Básico, Intermediário, Premium)
          if (title.includes('Básico')) return '1 Reunião Semanal';
          if (title.includes('Intermediário')) return '1 Reunião Semanal';
          if (title.includes('Premium')) return '2 Reuniões Semanais';
      }
      return null; // Retorna null para serviços avulsos
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

      // Se for um serviço com preço único (sem 'precos_por_periodo')
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
        // Se for um serviço com 'precos_por_periodo' (Plano), o preço é sempre substituído
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
                // É um plano de longo prazo
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

      setAlert({ variant: 'success', message: 'Orçamento gerado com sucesso! Verifique abaixo!' });
      setShowResultCard(true);
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Houve um erro ao gerar o orçamento. Por favor, tente novamente.' });
    }
  };


  const calculateBudget = () => {
    setAlert(null);
    setShowResultCard(false);

    if (!userData.nome || !userData.email || !userData.empresa || !userData.telefone) {
      setAlert({ variant: 'danger', message: 'Por favor, preencha todos os seus dados.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setAlert({ variant: 'danger', message: 'Digite um e-mail válido.' });
      return;
    }

    if (!agreedToContact) {
      setAlert({ variant: 'danger', message: 'Você precisa aceitar ser contactado para gerar o orçamento.' });
      return;
    }

    const selectedCount = Object.keys(selectedServices).reduce(
      (count, category) => count + Object.keys(selectedServices[category]).length,
      0
    );
    if (selectedCount === 0) {
      setAlert({ variant: 'danger', message: 'Selecione pelo menos um serviço para gerar o orçamento.' });
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

    // Lógica para verificar se o cupom IA25 deve ser aplicado e se é cumulativo
    if (userData.cupom.trim().toUpperCase() === 'IA25') {
      appliedCoupon = true;
      
      // Verifica se algum plano de longo prazo já está selecionado
      const isLongTermPlanSelected = Object.keys(selectedServices).some(category => {
        const cat = precosData.orcamento.categorias.find(c => c.nome === category);
        if (cat && cat.nome.includes('Planos de Social Media')) {
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
        setAlert({ variant: 'warning', message: 'O cupom IA25 não é cumulativo com os descontos dos Planos de Compromisso (Trimestral, Semestral, Anual). O desconto será de 0%.' });
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
    const serviceList = Object.entries(selectedServices)
      .map(([category, services]) => {
        const serviceItems = Object.entries(services)
          .map(([title, itemPrice]) => {
            const svcObj = findServiceObject(category, title);
            const vendaTitle = svcObj?.titulo_venda || title;
            
            let periodInfo = '';
            const periodDetails = findPeriodDetails(svcObj, itemPrice);

            if (periodDetails) {
                // É um plano de longo prazo
                periodInfo = `(${periodDetails.periodo} - ~R$ ${periodDetails.preco_mensal_efetivo.toFixed(2)}/mês)`;
            }

            return `• ${vendaTitle} ${periodInfo} — R$ ${itemPrice.toFixed(2)}`;
          })
          .join('\n');
        return `${category}\n${serviceItems}`;
      })
      .join('\n\n');

    return `Olá, ${userData.nome}!
Seu orçamento ficou assim:

${serviceList}

Total Bruto: R$ ${(finalPrice + appliedDiscount).toFixed(2)}
Desconto: R$ R$ ${appliedDiscount.toFixed(2)}
Preço Final: R$ ${finalPrice.toFixed(2)}

Qualquer dúvida, estamos à disposição!`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText());
    setAlert({ variant: 'success', message: 'Orçamento copiado para a área de transferência!' });
    setShowShareModal(false);
  };

  const handleDownload = () => {
    const servicesText = Object.entries(selectedServices)
      .map(([category, services]) => {
        const items = Object.entries(services)
          .map(([title, price]) => {
            const svcObj = findServiceObject(category, title);
            const vendaTitle = svcObj?.titulo_venda || title;
            
            let periodInfo = '';
            const periodDetails = findPeriodDetails(svcObj, price);

            if (periodDetails) {
                // É um plano de longo prazo
                periodInfo = `(${periodDetails.periodo} - ${periodDetails.meses} meses | R$ ${periodDetails.preco_mensal_efetivo.toFixed(2)}/mês)`;
            }

            return `- ${vendaTitle} ${periodInfo} — R$ ${price.toFixed(2)}`;
          })
          .join('\n');
        return `\n${category}\n${items}`;
      })
      .join('\n');

    const contentToDownload = `
Orçamento Comerc IAs

Cliente: ${userData.nome}
E-mail: ${userData.email}
Telefone: ${userData.telefone}
Empresa: ${userData.empresa}

--------------------------------------

Serviços Selecionados:
${servicesText}

--------------------------------------

Total Bruto: R$ ${(finalPrice + appliedDiscount).toFixed(2)}
Desconto: R$ ${appliedDiscount.toFixed(2)}
Preço Final: R$ ${finalPrice.toFixed(2)}

--------------------------------------

Observações: ${precosData.orcamento.observacoes}
`;
    const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orcamento-comerc-ias.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  // Helper: calcula porcentagem de desconto
  const calculateDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) {
      return 0; // Sem desconto ou preço original não é maior
    }
    const discount = originalPrice - currentPrice;
    const percentage = (discount / originalPrice) * 100;
    return Math.round(percentage);
  };

  // Helper: formata tempo estimado e calcula preco/hora aproximado
  const formatEstimatedHours = (svc, price) => {
    // Para planos, o preço/hora não é tão relevante e é difícil calcular
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
    <Container className="orcamento-section">
      <h2 className="text-primary fw-bold text-center mb-4">Gerador de Orçamento</h2>

      <Row className="justify-content-center">
        <Col md={9}>
          <Card className="orcamento-card p-3">
            <h4 className="mb-3">Escolha os serviços que você deseja! Aproveite nossa Black Ninja! É só até 28/11!</h4>
            <div className="orcamento-list mb-3">
              {precosData.orcamento.categorias.map((categoria) => (
                <div key={categoria.nome} className="category-item mb-3">
                  <div
                    onClick={() => toggleCategory(categoria.nome)}
                    className="d-flex justify-content-between align-items-center p-3 rounded"
                    style={{ backgroundColor: '#f7f9fb', cursor: 'pointer' }}
                  >
                    <div>
                      <h5 className="mb-0">{categoria.nome}</h5>
                      <small className="text-muted">{categoria.servicos.length} opções</small>
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
                        // Para serviços avulsos, usa o preço simples; para planos, usaremos o preço do primeiro item (Mensal) como default
                        const defaultPrice = servico.preco || (servico.precos_por_periodo ? servico.precos_por_periodo[0].preco_total_com_desc : 0);
                        const currentPrice = selectedServices[categoria.nome] ? selectedServices[categoria.nome][servico.titulo] : defaultPrice;
                        const isChecked = !!selectedServices[categoria.nome] && !!selectedServices[categoria.nome][servico.titulo];

                        const vendaTitle = servico.titulo_venda || servico.titulo;
                        const est = formatEstimatedHours(servico, currentPrice);
                        const discountPercentage = calculateDiscountPercentage(
                          servico.preco_original,
                          currentPrice
                        );
                        
                        // Detalhes do período selecionado (se aplicável)
                        const periodDetails = findPeriodDetails(servico, currentPrice);
                        const originalPriceToDisplay = periodDetails ? periodDetails.preco_total_sem_desc : servico.preco_original;
                        const discountToDisplay = periodDetails ? periodDetails.desconto_perc : discountPercentage;
                        const finalPriceToDisplay = periodDetails ? periodDetails.preco_total_com_desc : currentPrice;
                        
                        // Detalhe das reuniões
                        const reunioesBadge = getReunioesSemanas(categoria.nome, servico.titulo);


                        return (
                          <Card key={key} className="mb-2">
                            <Card.Body className="p-2">
                              {/* Conteúdo principal do card (Título, checkbox/radio e Preço) */}
                              <div className="d-flex align-items-start">
                                <div style={{ flex: 1 }}>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div>
                                      {servico.precos_por_periodo ? (
                                        // Para planos, não usamos o checkbox principal, a seleção é feita pelo radio
                                        <h5 className="mb-0"><strong>{vendaTitle}</strong></h5>
                                      ) : (
                                        // Para serviços avulsos, usamos o checkbox
                                        <Form.Check
                                          type="checkbox"
                                          id={`${categoria.nome}-${servico.titulo}`}
                                          label={<strong>{vendaTitle}</strong>}
                                          onChange={() =>
                                            handleServiceSelect(categoria.nome, servico.titulo, defaultPrice)
                                          }
                                          checked={!!isChecked}
                                        />
                                      )}
                                      
                                      <div className="ms-4 mt-1">
                                        <small className="text-muted d-block">{servico.descricao}</small>
                                        <div className="mt-1">
                                          {/* Badge: Mostra reuniões ou meses/prazo */}
                                          <Badge bg="info" className="me-1">
                                            {reunioesBadge || (periodDetails ? `${periodDetails.meses} meses` : servico.prazo_entrega || 'Padrão')}
                                          </Badge>

                                          <Badge bg="secondary" className="me-1">
                                            {servico.revisoes_incluidas != null
                                              ? `${servico.revisoes_incluidas} revisão(ões)`
                                              : 'Revisões sob pedido'}
                                          </Badge>
                                          {est && (
                                            <Badge bg="warning" text="dark">
                                              {est.label}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* --- COLUNA DE PREÇO E DETALHES (INVERTIDA) --- */}
                                    <div style={{minWidth: '130px', textAlign: 'right'}} className="d-flex flex-column justify-content-center align-items-end"> 
                                      
                                      {/* Preço Final e Desconto */}
                                      <div style={{lineHeight: 1}} className="d-flex flex-column align-items-end">
                                        {discountToDisplay > 0 && (
                                          <div className="d-flex align-items-center justify-content-end gap-1 mb-1 w-100">
                                            <div className="text-muted small" style={{ textDecoration: 'line-through' }}>
                                              R$ {Number(originalPriceToDisplay).toFixed(0)}
                                            </div>
                                            <Badge bg="danger" className="align-self-start ms-1">
                                              -{discountToDisplay}%
                                            </Badge>
                                          </div>
                                        )}
                                        <div className="text-success" style={{fontWeight: 900, fontSize: '1.4rem'}}>
                                          R$ {Number(finalPriceToDisplay).toFixed(0)}
                                        </div>
                                      </div>
                                      
                                      {/* Botão Detalhes (Movido para baixo) */}
                                      <div className="mt-2">
                                        <Button
                                          variant="link"
                                          size="sm"
                                          onClick={() => toggleServiceDetails(categoria.nome, servico.titulo)}
                                          style={{ padding: 0 }}
                                        >
                                          {openServiceDetails[`${categoria.nome}||${servico.titulo}`] ? 'Fechar' : 'Detalhes'}
                                          {' '}
                                          <FontAwesomeIcon icon={faInfoCircle} />
                                        </Button>
                                      </div>
                                    </div>
                                    {/* --- FIM COLUNA DE PREÇO E DETALHES --- */}
                                    
                                  </div>
                                </div>
                              </div>
                              
                              {/* Opções de Período para Planos de Social Media (AJUSTADO) */}
                              {servico.precos_por_periodo && (
                                <div className="mt-3 p-2 border-top">
                                  <h6>Escolha o Período:</h6>
                                  {servico.precos_por_periodo.map((p, pIndex) => {
                                    const isPeriodChecked = isChecked && currentPrice === p.preco_total_com_desc;
                                    
                                    // Determina se é Mensal (sem desconto)
                                    const isMonthly = p.meses === 1;

                                    return (
                                      <Form.Check
                                        key={`${key}-${p.periodo}`}
                                        type="radio" 
                                        name={`${categoria.nome}-${servico.titulo}-periodo`}
                                        id={`${categoria.nome}-${servico.titulo}-${p.periodo}`}
                                        label={
                                          <div className="d-flex justify-content-between align-items-start w-100">
                                            <span className="mt-1">
                                              {p.periodo} ({p.meses} meses)
                                            </span>
                                            <div style={{minWidth: '130px', textAlign: 'right', marginLeft: '10px'}} className="d-flex flex-column align-items-end">
                                                
                                                {/* Linha 1: Preço Principal e Desconto (Se existir) */}
                                                <div className="d-flex align-items-center" style={{minHeight: '24px', marginBottom: '4px'}}>
                                                    {/* Preço Principal */}
                                                    <span className="text-success" style={{fontWeight: 700, fontSize: '1.1rem', whiteSpace: 'nowrap'}}>
                                                        R$ {p.preco_total_com_desc.toFixed(0)}
                                                    </span>
                                                    {/* BADGE DE DESCONTO: Só aparece se houver desconto */}
                                                    {p.desconto_perc > 0 ? (
                                                        <Badge bg="danger" className="ms-2">-{p.desconto_perc}% OFF</Badge>
                                                    ) : (
                                                        // Bloco de espaço vazio para alinhar o preço principal (R$ 400) com os demais
                                                        <span style={{minWidth: '55px', height: '100%', visibility: 'hidden'}}>
                                                          &nbsp;
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Linha 2: Preço Mensal Efetivo (ou espaço vazio para o Mensal) */}
                                                {(!isMonthly) ? (
                                                    <small className="text-muted d-block" style={{fontSize: '0.75em'}}>
                                                      ~R$ {p.preco_mensal_efetivo.toFixed(0)}/mês
                                                    </small>
                                                ) : (
                                                    // Espaço vazio para manter a altura da linha
                                                    <small className="text-muted d-block" style={{fontSize: '0.75em', visibility: 'hidden'}}>
                                                        &nbsp;
                                                    </small>
                                                )}
                                            </div>
                                          </div>
                                        }
                                        onChange={() =>
                                          // O preço é o preço total do período
                                          handleServiceSelect(categoria.nome, servico.titulo, p.preco_total_com_desc)
                                        }
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
                                    <strong>O que inclui:</strong>
                                    {servico.inclui && servico.inclui.length > 0 ? (
                                      <ul>
                                        {servico.inclui.map((it, i) => (
                                          <li key={i}>{it}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="mb-1 text-muted">Inclusões não especificadas.</p>
                                    )}
                                  </div>

                                  {servico.beneficios && servico.beneficios.length > 0 && (
                                    <div>
                                      <strong>Benefícios:</strong>
                                      <ul>
                                        {servico.beneficios.map((b, i) => (
                                          <li key={i}>{b}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  <div className="d-flex gap-3 flex-wrap">
                                    {servico.formato_entrega && (
                                      <div>
                                        <strong>Formatos:</strong>
                                        <div className="small">{servico.formato_entrega.join(' • ')}</div>
                                      </div>
                                    )}
                                    <div>
                                      <strong>Prazo:</strong>
                                      <div className="small">{servico.prazo_entrega || 'Conforme acordado'}</div>
                                    </div>
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

            <h4 className="mb-3">Suas Informações</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome:</Form.Label>
                <Form.Control type="text" name="nome" value={userData.nome} onChange={handleUserInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>E-mail:</Form.Label>
                <Form.Control type="email" name="email" value={userData.email} onChange={handleUserInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nome da Empresa ou Instagram:</Form.Label>
                <Form.Control type="text" name="empresa" value={userData.empresa} onChange={handleUserInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Telefone (com DDD):</Form.Label>
                <Form.Control type="tel" name="telefone" value={userData.telefone} onChange={handleUserInputChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cupom de Desconto:</Form.Label>
                <Form.Control type="text" name="cupom" value={userData.cupom} onChange={handleUserInputChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mensagem / Briefing rápido:</Form.Label>
                <Form.Control as="textarea" rows={4} name="mensagem" value={userData.mensagem} onChange={handleUserInputChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="agreedToContact"
                  label="Aceito ser contactado pelas formas de contato fornecidas."
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
                Gerar Orçamento
              </Button>
            </Form>

            <div className="mt-4">
              <h6>Observações:</h6>
              <p>{precosData.orcamento.observacoes}</p>
            </div>
          </Card>

          {showResultCard && (
            <div ref={componentRef}>
              <Card className="p-4 shadow mt-4">
                <div className="d-flex justify-content-between align-items-start">
                  <h4>Seu Orçamento Final</h4>
                  <div>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={handlePrint}>
                      <FontAwesomeIcon icon={faPrint} /> Imprimir
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={handleDownload}>
                      <FontAwesomeIcon icon={faDownload} /> Baixar
                    </Button>
                  </div>
                </div>
                <hr />
                <Row>
                  <Col md={6}>
                    <p><strong>Nome:</strong> {userData.nome}</p>
                    <p><strong>E-mail:</strong> {userData.email}</p>
                    <p><strong>Empresa:</strong> {userData.empresa}</p>
                    <p><strong>Telefone:</strong> {userData.telefone}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Mensagem / Briefing:</strong> {userData.mensagem || '—'}</p>
                    <p><strong>Desconto Aplicado:</strong> R$ {appliedDiscount.toFixed(2)}</p>
                    <h5 className="text-primary">Preço Final: R$ {finalPrice.toFixed(2)}</h5>
                  </Col>
                </Row>

                <h5 className="mt-3">Serviços Selecionados</h5>
                <div>
                  {Object.entries(selectedServices).map(([category, services]) => (
                    <Card key={category} className="mb-2">
                      <Card.Body>
                        <h6>{category}</h6>
                        <ul className="list-unstyled mb-0">
                          {Object.entries(services).map(([title, price]) => {
                            const svcObj = findServiceObject(category, title);
                            const vendaTitle = svcObj?.titulo_venda || title;
                            const est = formatEstimatedHours(svcObj, price);
                            
                            let periodInfo = '';
                            let originalPrice = svcObj?.preco_original;
                            let discountPercentage = calculateDiscountPercentage(originalPrice, price);

                            const periodDetails = findPeriodDetails(svcObj, price);

                            if (periodDetails) {
                                // Se for plano, usa os detalhes do período
                                periodInfo = `(${periodDetails.periodo} - ${periodDetails.meses} meses)`;
                                originalPrice = periodDetails.preco_total_sem_desc;
                                discountPercentage = periodDetails.desconto_perc;
                            }
                            
                            return (
                              <li key={title} className="mb-2">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <strong>{vendaTitle} {periodInfo}</strong>
                                    <div className="small text-muted">{svcObj?.descricao}</div>
                                    {svcObj?.inclui && (
                                      <div className="small mt-1">
                                        <em>Inclui:</em> {svcObj.inclui.slice(0, 3).join(' • ')}{svcObj.inclui.length > 3 ? ' • …' : ''}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-end">
                                    {discountPercentage > 0 && (
                                      <div className="text-muted small" style={{ textDecoration: 'line-through' }}>
                                        R$ {Number(originalPrice).toFixed(0)}
                                      </div>
                                    )}
                                    <div>R$ {Number(price).toFixed(0)}</div>
                                    {est && (
                                      <div className="small text-muted">
                                        {est.label} • ~R$ {est.pricePerHour ?? '—'} /h
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                <div className="mt-3 d-flex gap-2 justify-content-end">
                  <Button variant="outline-primary" onClick={handleShare}>
                    <FontAwesomeIcon icon={faShareAlt} className="me-2" /> Compartilhar
                  </Button>
                  <Button variant="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Voltar ao topo
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Compartilhar Orçamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Copie o texto abaixo para compartilhar o orçamento:</p>
          <Form.Control as="textarea" rows={10} readOnly value={getShareText()} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShareModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={copyToClipboard}>
            Copiar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrcamentoPage;