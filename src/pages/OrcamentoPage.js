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

// Dados dos produtos
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
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import '../styles/OrcamentoPage.css';

const QUIZ_URL = 'https://auxiliar-de-escolha.vercel.app/';

const OrcamentoPage = () => {
  const { i18n } = useTranslation();

  // Determina idioma atual
  const currentLang = useMemo(() => {
    const l = (i18n.language || 'pt').toLowerCase();
    return l.startsWith('en') ? 'en' : 'pt';
  }, [i18n.language]);

  // Seleciona o JSON correto de dados
  const precosData = currentLang === 'en' ? precosEN : precosPT;
  const heroData = precosData?.orcamento?.hero || {};

  // ===== TRADUÇÃO DE INTERFACE (UI) =====
  const content = useMemo(() => {
    const pt = {
      seoTitle: 'Orçamento Online | Comerc IA’s',
      seoDesc: 'Monte seu orçamento em poucos cliques. Escolha serviços, veja detalhes e receba um resumo por e-mail.',
      hlFast: 'Rápido e intuitivo',
      hlPro: 'Resumo profissional',
      hlClear: 'Detalhes por serviço',
      step1: '1',
      step1Title: 'Escolha seus serviços',
      step1Sub: 'Expanda uma categoria, selecione itens e veja detalhes completos.',
      step2: '2',
      step2Title: 'Seus dados',
      step2Sub: 'Preencha e clique em “Gerar orçamento”.',
      lblIncludes: 'Inclui',
      lblBenefits: 'Benefícios',
      lblFormats: 'Formatos',
      lblDeadline: 'Prazo',
      lblPeriod: 'Período',
      btnDetails: 'Detalhes',
      btnClose: 'Fechar',
      catOptions: 'opções',
      labelName: 'Nome',
      labelEmail: 'E-mail',
      labelCompany: 'Empresa / Instagram',
      labelPhone: 'Telefone',
      labelCoupon: 'Cupom',
      labelMessage: 'Mensagem',
      labelAgree: 'Concordo em ser contatado para finalizar detalhes do orçamento.',
      labelObs: 'Obs:',
      btnGenerate: 'Gerar orçamento',
      btnWhats: 'Falar no WhatsApp',
      summaryTitle: 'Resumo',
      summarySelected: 'Selecionados',
      summarySubtotal: 'Subtotal',
      summaryHint: 'Finalize no Passo 2 para receber seu orçamento por e-mail.',
      btnGoForm: 'Ir para o formulário',
      btnBackServices: 'Voltar aos serviços',
      quizTitle: 'Não sabe qual serviço escolher?',
      quizDesc: 'Responda um quiz rápido e receba uma recomendação do melhor pacote para o seu objetivo.',
      quizCta: 'Abrir quiz de escolha →',
      resTitle: 'Resumo do orçamento',
      resHint: 'Guarde este resumo para comparar opções.',
      btnPrint: 'Imprimir',
      btnDownload: 'Baixar',
      lblDiscount: 'Desconto aplicado',
      lblFinalPrice: 'Preço final',
      lblSelected: 'Serviços selecionados',
      lblSubtotalRaw: 'Subtotal (antes de cupons)',
      btnShare: 'Compartilhar',
      btnBackTop: 'Voltar ao topo',
      modalShareTitle: 'Compartilhar orçamento',
      modalShareDesc: 'Copie a mensagem abaixo e envie para o cliente.',
      btnCopy: 'Copiar',
      alertSuccess: 'Orçamento gerado! Já enviamos um resumo por e-mail.',
      alertError: 'Houve um erro ao gerar o orçamento.',
      alertFill: 'Preencha todos os dados obrigatórios.',
      alertEmail: 'Digite um e-mail válido.',
      alertTerms: 'Você precisa aceitar os termos para continuar.',
      alertSelect: 'Selecione pelo menos 1 serviço.',
      alertCoupon: 'Cupom não cumulativo com planos de longo prazo.',
      alertCopied: 'Texto copiado!',
    };

    const en = {
      seoTitle: 'Instant Quote | Comerc IA’s',
      seoDesc: 'Build your quote in a few clicks. Choose services, check details, and get a summary by email.',
      hlFast: 'Fast & intuitive',
      hlPro: 'Professional summary',
      hlClear: 'Details per service',
      step1: '1',
      step1Title: 'Choose your services',
      step1Sub: 'Expand a category, select items, and view full details.',
      step2: '2',
      step2Title: 'Your details',
      step2Sub: 'Fill in and click “Generate quote”.',
      lblIncludes: 'Includes',
      lblBenefits: 'Benefits',
      lblFormats: 'Formats',
      lblDeadline: 'Deadline',
      lblPeriod: 'Period',
      btnDetails: 'Details',
      btnClose: 'Close',
      catOptions: 'options',
      labelName: 'Name',
      labelEmail: 'E-mail',
      labelCompany: 'Company / Instagram',
      labelPhone: 'Phone',
      labelCoupon: 'Coupon',
      labelMessage: 'Message',
      labelAgree: 'I agree to be contacted to finalize quote details.',
      labelObs: 'Note:',
      btnGenerate: 'Generate quote',
      btnWhats: 'Chat on WhatsApp',
      summaryTitle: 'Summary',
      summarySelected: 'Selected',
      summarySubtotal: 'Subtotal',
      summaryHint: 'Finish in Step 2 to receive your quote via email.',
      btnGoForm: 'Go to form',
      btnBackServices: 'Back to services',
      quizTitle: 'Not sure what to choose?',
      quizDesc: 'Take a quick quiz and get a package recommendation based on your goal.',
      quizCta: 'Open choice quiz →',
      resTitle: 'Quote Summary',
      resHint: 'Keep this summary to compare options.',
      btnPrint: 'Print',
      btnDownload: 'Download',
      lblDiscount: 'Discount applied',
      lblFinalPrice: 'Final price',
      lblSelected: 'Selected services',
      lblSubtotalRaw: 'Subtotal (before coupons)',
      btnShare: 'Share',
      btnBackTop: 'Back to top',
      modalShareTitle: 'Share quote',
      modalShareDesc: 'Copy the message below and send it to the client.',
      btnCopy: 'Copy',
      alertSuccess: 'Quote generated! We sent a summary to your email.',
      alertError: 'There was an error generating the quote.',
      alertFill: 'Please fill in all required fields.',
      alertEmail: 'Please enter a valid email.',
      alertTerms: 'You must accept the terms to continue.',
      alertSelect: 'Select at least 1 service.',
      alertCoupon: 'Coupon does not stack with long-term plans.',
      alertCopied: 'Text copied!',
    };

    return currentLang === 'en' ? en : pt;
  }, [currentLang]);

  // Estados
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

  // Formatador de Moeda CORRIGIDO (Sem variável unused)
  const formatCurrency = (value) => {
    try {
      const locale = currentLang === 'en' ? 'en-US' : 'pt-BR';
      // Removida a variável 'currency' que causava erro no Vercel
      return new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(value || 0);
    } catch (e) {
      return `R$ ${Number(value || 0).toFixed(2)}`;
    }
  };

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
  }, [precosData]);

  const findPeriodDetails = (serviceObject, selectedPrice) => {
    if (serviceObject?.precos_por_periodo) {
      return serviceObject.precos_por_periodo.find((p) => p.preco_total_com_desc === selectedPrice);
    }
    return null;
  };

  const getReunioesSemanas = (categoryName, title) => {
    const nameLower = (categoryName || '').toLowerCase();
    const titleLower = (title || '').toLowerCase();
    
    if (nameLower.includes('social') || nameLower.includes('planos') || nameLower.includes('plans')) {
      if (titleLower.includes('básico') || titleLower.includes('basic')) return currentLang === 'en' ? '1 meeting/week' : '1 reunião/semana';
      if (titleLower.includes('standart') || titleLower.includes('standard')) return currentLang === 'en' ? '2 meetings/week' : '2 reuniões/semana';
      if (titleLower.includes('premium')) return currentLang === 'en' ? '2 meetings/week' : '2 reuniões/semana';
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
              periodInfo = `(${periodDetails.periodo} - ${periodDetails.meses} ${currentLang === 'en' ? 'months' : 'meses'}, Econ: ${formatCurrency(economia)})`;
            }
            return `- ${vendaTitle} ${periodInfo} - ${formatCurrency(itemPrice)}`;
          })
          .join('\n');
        return `*${category}*\n${serviceItems}`;
      })
      .join('\n\n');

    const emailContent = `
Novo Orçamento (${currentLang.toUpperCase()}) de ${userData.nome}
E-mail: ${userData.email}
Telefone: ${userData.telefone || 'Não informado'}
Empresa/Instagram: ${userData.empresa || 'Não informado'}
Mensagem do Cliente: ${userData.mensagem || '—'}
Cupom de Desconto: ${userData.cupom || 'Nenhum'} (${appliedCoupon ? 'Aplicado' : 'Não aplicado'})

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
          subject: `Novo Orçamento (${currentLang.toUpperCase()}) - Comerc IAs`,
          body: emailContent,
        }),
      });

      setAlert({ variant: 'success', message: content.alertSuccess });
      setShowResultCard(true);
    } catch (error) {
      setAlert({ variant: 'danger', message: content.alertError });
    }
  };

  const calculateBudget = () => {
    setAlert(null);
    setShowResultCard(false);

    if (!userData.nome || !userData.email || !userData.empresa || !userData.telefone) {
      setAlert({ variant: 'danger', message: content.alertFill });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setAlert({ variant: 'danger', message: content.alertEmail });
      return;
    }

    if (!agreedToContact) {
      setAlert({ variant: 'danger', message: content.alertTerms });
      return;
    }

    if (selectedCount === 0) {
      setAlert({ variant: 'danger', message: content.alertSelect });
      return;
    }

    let total = selectedSubtotal;
    let discount = 0;
    let appliedCoupon = false;

    if (userData.cupom.trim().toUpperCase() === 'NATAL25') {
      appliedCoupon = true;
      const isLongTermPlanSelected = Object.keys(selectedServices).some((category) => {
        const cat = precosData.orcamento.categorias.find((c) => c.nome === category);
        if (cat && (cat.nome.toLowerCase().includes('social') || cat.nome.toLowerCase().includes('planos') || cat.nome.toLowerCase().includes('plans'))) {
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
        setAlert({ variant: 'warning', message: content.alertCoupon });
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
    documentTitle: `Orcamento_ComercIAs_${userData.nome}`,
  });

  const getShareText = () => `${userData.nome}, seu orçamento na Comerc IA's ficou em ${formatCurrency(finalPrice)}.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText());
    setAlert({ variant: 'success', message: content.alertCopied });
    setShowShareModal(false);
  };

  const handleDownload = () => {
    const contentToDownload = `Orçamento Comerc IA's\nCliente: ${userData.nome}\nValor Final: ${formatCurrency(finalPrice)}`;
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
    const disc = originalPrice - currentPrice;
    return Math.round((disc / originalPrice) * 100);
  };

  const scrollToForm = () => {
    const el = document.querySelector('.orc-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <SEO
        title={content.seoTitle}
        description={content.seoDesc}
        href={`/${currentLang}/orcamento`}
      />

      <div className="orcamento-page">
        <Container>
          <div className="orc-wrap">
            <section className="orc-hero">
              <div className="orc-hero-inner">
                <div className="orc-hero-badge">
                  <FontAwesomeIcon icon={faBolt} className="me-2" />
                  {heroData.badge}
                </div>

                <h1 className="orc-hero-title">
                  {heroData.titulo}
                </h1>

                <p className="orc-hero-subtitle">
                  {heroData.subtitulo}
                </p>

                <div className="orc-hero-highlights">
                  <div className="orc-hero-highlight">
                    <FontAwesomeIcon icon={faClock} />
                    <span>{content.hlFast}</span>
                  </div>
                  <div className="orc-hero-highlight">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <span>{content.hlPro}</span>
                  </div>
                  <div className="orc-hero-highlight">
                    <FontAwesomeIcon icon={faListCheck} />
                    <span>{content.hlClear}</span>
                  </div>
                </div>

                <div className="orc-hero-note">
                  {heroData.nota}
                </div>
              </div>
            </section>

            <Row className="g-4 mt-2">
              <Col lg={8}>
                <Card className="orc-card">
                  <Card.Body className="orc-card-body">
                    <div className="orc-card-head">
                      <div>
                        <div className="orc-step">{content.step1}</div>
                      </div>
                      <div className="flex-grow-1">
                        <h2 className="orc-card-title">{content.step1Title}</h2>
                        <p className="orc-card-subtitle">
                          {content.step1Sub}
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
                                {categoria.servicos.length} {content.catOptions}
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
                                            {reunioesBadge || (periodDetails ? `${periodDetails.meses} m` : servico.prazo_entrega || 'Padrão')}
                                          </Badge>

                                          <Badge bg="secondary" className="orc-badge">
                                            {servico.revisoes_incluidas != null 
                                              ? `${servico.revisoes_incluidas} revs` 
                                              : 'Revisões inclusas'}
                                          </Badge>
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
                                            ? content.btnClose
                                            : content.btnDetails}{' '}
                                          <FontAwesomeIcon icon={faInfoCircle} />
                                        </button>
                                      </div>
                                    </div>

                                    {servico.precos_por_periodo && (
                                      <div className="orc-periods">
                                        <div className="orc-periodsTitle">{content.lblPeriod}</div>

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
                                                          ~{formatCurrency(p.preco_mensal_efetivo)}/{currentLang === 'en' ? 'mo' : 'mês'}
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
                                            <div className="orc-detailsTitle">{content.lblIncludes}</div>
                                            {servico.inclui && servico.inclui.length > 0 ? (
                                              <ul className="orc-detailsList">
                                                {servico.inclui.map((it, i) => (<li key={i}>{it}</li>))}
                                              </ul>
                                            ) : (
                                              <div className="orc-muted">—</div>
                                            )}
                                          </div>

                                          {servico.beneficios && servico.beneficios.length > 0 && (
                                            <div>
                                              <div className="orc-detailsTitle">{content.lblBenefits}</div>
                                              <ul className="orc-detailsList">
                                                {servico.beneficios.map((b, i) => (<li key={i}>{b}</li>))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>

                                        <div className="orc-detailsMeta">
                                          {servico.formato_entrega && (
                                            <div>
                                              <div className="orc-detailsTitle">{content.lblFormats}</div>
                                              <div className="orc-small">{servico.formato_entrega.join(' • ')}</div>
                                            </div>
                                          )}

                                          <div>
                                            <div className="orc-detailsTitle">{content.lblDeadline}</div>
                                            <div className="orc-small">{servico.prazo_entrega || '—'}</div>
                                          </div>
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

                    <a
                      className="orc-quizCard orc-quizCard--inline"
                      href={QUIZ_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="orc-quizCard__top">
                        <div className="orc-quizCard__title">{content.quizTitle}</div>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </div>
                      <div className="orc-quizCard__desc">
                        {content.quizDesc}
                      </div>
                      <div className="orc-quizCard__cta">{content.quizCta}</div>
                    </a>
                  </Card.Body>
                </Card>

                <Card className="orc-card mt-4">
                  <Card.Body className="orc-card-body">
                    <div className="orc-card-head">
                      <div>
                        <div className="orc-step">{content.step2}</div>
                      </div>
                      <div className="flex-grow-1">
                        <h2 className="orc-card-title">{content.step2Title}</h2>
                        <p className="orc-card-subtitle">
                          {content.step2Sub}
                        </p>
                      </div>
                    </div>

                    <Form className="orc-form">
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{content.labelName}</Form.Label>
                            <Form.Control type="text" name="nome" value={userData.nome} onChange={handleUserInputChange} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{content.labelEmail}</Form.Label>
                            <Form.Control type="email" name="email" value={userData.email} onChange={handleUserInputChange} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{content.labelCompany}</Form.Label>
                            <Form.Control type="text" name="empresa" value={userData.empresa} onChange={handleUserInputChange} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{content.labelPhone}</Form.Label>
                            <Form.Control type="tel" name="telefone" value={userData.telefone} onChange={handleUserInputChange} required />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>{content.labelCoupon}</Form.Label>
                            <Form.Control type="text" name="cupom" value={userData.cupom} onChange={handleUserInputChange} placeholder="Ex: NATAL25" />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>{content.labelMessage}</Form.Label>
                            <Form.Control as="textarea" rows={4} name="mensagem" value={userData.mensagem} onChange={handleUserInputChange} />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group>
                            <Form.Check
                              type="checkbox"
                              id="agreedToContact"
                              className="orc-check"
                              label={content.labelAgree}
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
                          {content.btnGenerate}
                        </Button>

                        <Button
                          type="button"
                          variant="outline-primary"
                          className="orc-btn orc-btn-ghost"
                          onClick={() => { window.location.href = `/${currentLang}/contact`; }}
                        >
                          {content.btnWhats}
                        </Button>
                      </div>

                      <div className="orc-footnote">
                        <strong>{content.labelObs}</strong> {precosData.orcamento.observacoes}
                      </div>
                    </Form>
                  </Card.Body>
                </Card>

                {showResultCard && (
                  <div ref={componentRef} className="mt-4">
                    <Card className="orc-card orc-card-result">
                      <Card.Body className="orc-card-body">
                        <div className="orc-resultHead">
                          <div>
                            <h2 className="orc-card-title mb-1">{content.resTitle}</h2>
                            <div className="orc-muted">
                              {content.resHint}
                            </div>
                          </div>

                          <div className="orc-resultActions">
                            <Button variant="outline-secondary" size="sm" className="orc-actionBtn" onClick={handlePrint}>
                              <FontAwesomeIcon icon={faPrint} /> {content.btnPrint}
                            </Button>
                            <Button variant="outline-secondary" size="sm" className="orc-actionBtn" onClick={handleDownload}>
                              <FontAwesomeIcon icon={faDownload} /> {content.btnDownload}
                            </Button>
                          </div>
                        </div>

                        <div className="orc-resultGrid">
                          <div className="orc-resultCard">
                            <div className="orc-resultLabel">{content.lblDiscount}</div>
                            <div className="orc-resultValue">{formatCurrency(appliedDiscount)}</div>
                          </div>

                          <div className="orc-resultCard is-highlight">
                            <div className="orc-resultLabel">{content.lblFinalPrice}</div>
                            <div className="orc-resultValue">{formatCurrency(finalPrice)}</div>
                          </div>
                        </div>

                        <div className="orc-divider" />

                        <Row className="g-3">
                          <Col md={6}>
                            <div className="orc-kv"><span>{content.labelName}</span><strong>{userData.nome}</strong></div>
                            <div className="orc-kv"><span>{content.labelEmail}</span><strong>{userData.email}</strong></div>
                            <div className="orc-kv"><span>{content.labelCompany}</span><strong>{userData.empresa}</strong></div>
                            <div className="orc-kv"><span>{content.labelPhone}</span><strong>{userData.telefone}</strong></div>
                          </Col>

                          <Col md={6}>
                            <div className="orc-kv">
                              <span>{content.lblSelected}</span>
                              <strong>{selectedCount}</strong>
                            </div>
                            <div className="orc-kv">
                              <span>{content.lblSubtotalRaw}</span>
                              <strong>{formatCurrency(selectedSubtotal)}</strong>
                            </div>
                          </Col>
                        </Row>

                        <h3 className="orc-sectionTitle mt-4">{content.lblSelected}</h3>

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
                            <FontAwesomeIcon icon={faShareAlt} className="me-2" /> {content.btnShare}
                          </Button>

                          <Button
                            variant="primary"
                            className="orc-btn orc-btn-primary"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            {content.btnBackTop}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Col>

              <Col lg={4}>
                <div className="orc-aside">
                  <Card className="orc-card orc-card-sticky">
                    <Card.Body className="orc-card-body">
                      <div className="orc-asideTitle">
                        {content.summaryTitle}
                      </div>

                      <div className="orc-asideLine">
                        <span>{content.summarySelected}</span>
                        <strong>{selectedCount}</strong>
                      </div>

                      <div className="orc-asideLine">
                        <span>{content.summarySubtotal}</span>
                        <strong>{formatCurrency(selectedSubtotal)}</strong>
                      </div>

                      <div className="orc-asideHint">
                        {content.summaryHint}
                      </div>

                      <div className="orc-asideBtns">
                        <Button
                          type="button"
                          className="orc-btn orc-btn-primary"
                          onClick={scrollToForm}
                        >
                          {content.btnGoForm}
                        </Button>

                        <Button
                          type="button"
                          variant="outline-primary"
                          className="orc-btn orc-btn-ghost"
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                          {content.btnBackServices}
                        </Button>
                      </div>

                      <a
                        className="orc-quizCard"
                        href={QUIZ_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="orc-quizCard__top">
                          <div className="orc-quizCard__title">{content.quizTitle}</div>
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </div>
                        <div className="orc-quizCard__desc">
                          {content.quizDesc}
                        </div>
                        <div className="orc-quizCard__cta">{content.quizCta}</div>
                      </a>
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
                <Modal.Title>{content.modalShareTitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="orc-muted">{content.modalShareDesc}</p>
                <Form.Control as="textarea" rows={6} readOnly value={getShareText()} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowShareModal(false)}>{content.btnClose}</Button>
                <Button variant="primary" onClick={copyToClipboard}>{content.btnCopy}</Button>
              </Modal.Footer>
            </Modal>

          </div>
        </Container>
      </div>
    </>
  );
};

export default OrcamentoPage;