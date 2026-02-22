import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Container,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBolt,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faCircleXmark,
  faClipboard,
  faClock,
  faFire,
  faListCheck,
  faMagnifyingGlass,
  faPaperPlane,
  faPrint,
  faRotateRight,
  faShareNodes,
  faTag,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';

import SEO from '../components/SEO';
import '../styles/OrcamentoPage.css';

import precosPT from '../data/precos.json';
import precosEN from '../data/precos_en.json';

const STORAGE_KEY = 'comerc_orcamento_page_v2';

/* ==========================================================================
   Helpers
   ========================================================================== */
const norm = (s) =>
  (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const slug = (s) =>
  norm(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/(^-|-$)/g, '') || 'item';

const pickLang = (i18n) => ((i18n?.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt');
const getDataByLang = (lang) => (lang === 'en' ? precosEN : precosPT);

const moneyFormatter = (lang) =>
  new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });

const WHATSAPP_NUMBER = '5532991147944';
const buildWhatsAppUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const safeCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
};

const b64UrlEncode = (str) => {
  try {
    const b64 = window.btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  } catch {
    return '';
  }
};

const b64UrlDecode = (b64) => {
  try {
    let s = (b64 || '').replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return decodeURIComponent(escape(window.atob(s)));
  } catch {
    return '';
  }
};

/* ==========================================================================
   Copy (PT/EN)
   ========================================================================== */
const COPY = {
  pt: {
    seoTitle: 'Orçamento Instantâneo — Comerc IAs',
    seoDesc: 'Monte seu orçamento em 2 minutos: selecione serviços e veja o total na hora.',
    badge: 'Orçamento Instantâneo',
    title: 'Monte seu orçamento em 2 minutos',
    subtitle:
      'Selecione serviços, ajuste opções (quando houver) e veja o valor na hora. Se quiser, peça uma proposta personalizada com descontos para combos.',
    highlights: ['Rápido e intuitivo', 'Resumo profissional', 'Detalhes por serviço'],
    note: 'Dica: comece com 1–2 serviços e avance. Se quiser, descreva sua ideia no campo de mensagem.',
    ctaPrimary: 'Fazer quiz (60s)',
    ctaSecondary: 'Escolher serviços',
    ctaTotalLabel: 'Total agora',
    ctaItems: 'itens',
    ctaExtQuiz: 'Simular combos e descontos',
    ctaShare: 'Compartilhar',
    ctaPrint: 'Imprimir',
    step1Title: 'Escolha seus serviços',
    step1Sub:
      'Selecione itens e ajuste opções (como período) quando disponível. O total aparece instantaneamente.',
    searchPh: 'Buscar por serviço (ex: reels, site, personagem...)',
    filterAll: 'Todos',
    filterPopular: 'Mais vendidos',
    filterVideo: 'Vídeos',
    filterImages: 'Imagens',
    filterPlans: 'Planos mensais',
    filterWeb: 'Website',
    filterCharacter: 'Personagens',
    details: 'Ver detalhes',
    hideDetails: 'Ocultar detalhes',
    includes: 'Inclui',
    benefits: 'Benefícios',
    delivery: 'Prazo',
    revisions: 'Revisões',
    formats: 'Formatos',
    choosePeriod: 'Escolha o período',
    asideTitle: 'Seu orçamento',
    selected: 'Selecionados',
    subtotal: 'Subtotal',
    total: 'Total',
    comboHint:
      'Podemos montar combos com desconto (depende do volume e do prazo). Se quiser, peça uma proposta personalizada para ver o melhor valor.',
    whatsapp: 'Fechar no WhatsApp',
    proposal: 'Quero proposta personalizada (com descontos)',
    proposalSub:
      'Opcional. Se você preencher, eu consigo sugerir combos e condições melhores (prazo/volume). O orçamento instantâneo já aparece acima.',
    name: 'Nome',
    whatsappField: 'WhatsApp (opcional)',
    email: 'Email (opcional)',
    message: 'Mensagem (opcional)',
    send: 'Enviar pedido',
    shareTitle: 'Compartilhar orçamento',
    shareDesc: 'Copie o link com os itens selecionados para abrir este orçamento já preenchido.',
    copyLink: 'Copiar link',
    copied: 'Copiado!',
    close: 'Fechar',
    quizTitle: 'Assistente de Escolha (quiz rápido)',
    quizDesc:
      'Responda em 30–60s e eu recomendo um pacote inicial. Você pode ajustar tudo depois (sem compromisso).',
    next: 'Próxima',
    back: 'Voltar',
    finish: 'Gerar recomendação',
    apply: 'Adicionar recomendação',
    restart: 'Refazer',
    quizQ1: 'Qual seu objetivo principal?',
    quizQ2: 'Onde esse conteúdo vai aparecer?',
    quizQ3: 'Qual seu prazo?',
    quizQ4: 'Qual seu nível de investimento?',
    goal1: 'Vendas / conversão',
    goal2: 'Autoridade / marca',
    goal3: 'Conteúdo recorrente',
    goal4: 'Mascote / personagem',
    ch1: 'Instagram / Reels',
    ch2: 'Anúncios / campanha',
    ch3: 'Site / Landing page',
    ch4: 'Mix (um pouco de tudo)',
    dl1: 'Urgente (1–2 dias)',
    dl2: 'Normal (até 1 semana)',
    dl3: 'Sem pressa (2+ semanas)',
    bud1: 'Enxuto',
    bud2: 'Equilibrado',
    bud3: 'Premium',
    recTitle: 'Recomendação pronta',
    recSub:
      'Sugestão inicial baseada nas suas respostas. Você pode editar e adicionar mais serviços.',
    why: 'Por que isso?',
    whySub: 'Porque para o seu objetivo, esses itens tendem a trazer mais resultado mais rápido.',
    comboTitle: 'Combos sugeridos',
    comboSub:
      'Um ponto de partida rápido (você pode adicionar/remover itens). Descontos para combos são negociáveis por prazo e volume.',
    addCombo: 'Adicionar combo',
    itemsSelectedTitle: 'Itens selecionados',
    emptySearch:
      'Nenhum serviço encontrado. Tente outra busca.',
    notSelected: 'Não selecionado',
    added: 'Adicionado',
  },
  en: {
    seoTitle: 'Instant Quote — Comerc IAs',
    seoDesc: 'Build your quote in 2 minutes: pick services and see the total instantly.',
    badge: 'Instant Quote',
    title: 'Build your quote in 2 minutes',
    subtitle:
      'Select services, adjust options (when available) and see the price instantly. Want a tailored proposal with bundle discounts? Optional.',
    highlights: ['Fast & intuitive', 'Professional summary', 'Details per service'],
    note: 'Tip: start with 1–2 services. You can describe your idea in the message field (optional).',
    ctaPrimary: 'Take the quiz (60s)',
    ctaSecondary: 'Pick services',
    ctaTotalLabel: 'Total now',
    ctaItems: 'items',
    ctaExtQuiz: 'Simulate combos and discounts',
    ctaShare: 'Share',
    ctaPrint: 'Print',
    step1Title: 'Pick your services',
    step1Sub:
      'Select items and adjust options (like period) when available. The total updates instantly.',
    searchPh: 'Search services (e.g., reels, website, character...)',
    filterAll: 'All',
    filterPopular: 'Best sellers',
    filterVideo: 'Video',
    filterImages: 'Images',
    filterPlans: 'Monthly plans',
    filterWeb: 'Website',
    filterCharacter: 'Characters',
    details: 'View details',
    hideDetails: 'Hide details',
    includes: 'Includes',
    benefits: 'Benefits',
    delivery: 'Delivery',
    revisions: 'Revisions',
    formats: 'Formats',
    choosePeriod: 'Choose a period',
    asideTitle: 'Your quote',
    selected: 'Selected',
    subtotal: 'Subtotal',
    total: 'Total',
    comboHint:
      'We can build bundles with discounts (depends on volume & deadline). If you want, request a tailored proposal for the best value.',
    whatsapp: 'Close on WhatsApp',
    proposal: 'Request a tailored proposal (with discounts)',
    proposalSub:
      'Optional. If you fill this in, I can suggest bundles and better conditions (deadline/volume). Your instant quote is already shown above.',
    name: 'Name',
    whatsappField: 'WhatsApp (optional)',
    email: 'Email (optional)',
    message: 'Message (optional)',
    send: 'Send request',
    shareTitle: 'Share quote',
    shareDesc: 'Copy a link with your selected items to open this quote pre-filled.',
    copyLink: 'Copy link',
    copied: 'Copied!',
    close: 'Close',
    quizTitle: 'Service Picker (quick quiz)',
    quizDesc: 'Answer in 30–60s and I’ll suggest a starter bundle. You can tweak everything later.',
    next: 'Next',
    back: 'Back',
    finish: 'Get recommendation',
    apply: 'Add recommendation',
    restart: 'Restart',
    quizQ1: 'Main goal?',
    quizQ2: 'Where will it be used?',
    quizQ3: 'Deadline?',
    quizQ4: 'Investment level?',
    goal1: 'Sales / conversion',
    goal2: 'Brand / authority',
    goal3: 'Ongoing content',
    goal4: 'Mascot / character',
    ch1: 'Instagram / Reels',
    ch2: 'Ads / campaign',
    ch3: 'Website / landing page',
    ch4: 'Mix (a bit of everything)',
    dl1: 'Urgent (1–2 days)',
    dl2: 'Normal (up to 1 week)',
    dl3: 'No rush (2+ weeks)',
    bud1: 'Budget-friendly',
    bud2: 'Balanced',
    bud3: 'Premium',
    recTitle: 'Recommendation ready',
    recSub: 'Starter bundle based on your answers. You can edit and add more services.',
    why: 'Why these?',
    whySub: 'Because for your goal, these options tend to perform better sooner.',
    comboTitle: 'Suggested bundles',
    comboSub:
      'A quick starting point (you can add/remove items). Bundle discounts are negotiable depending on deadline and volume.',
    addCombo: 'Add bundle',
    itemsSelectedTitle: 'Selected items',
    emptySearch:
      'No services found. Try a different search.',
    notSelected: 'Not selected',
    added: 'Added',
  },
};

/* ==========================================================================
   Catalog normalization (performance: precompute norms)
   ========================================================================== */
const normalizeCatalog = (raw) => {
  const hero = raw?.orcamento?.hero || {};

  const categorias = (raw?.orcamento?.categorias || []).map((cat) => {
    const categoriaNome = cat?.nome || 'Categoria';
    const categoriaNorm = norm(categoriaNome);

    const servicos = (cat?.servicos || []).map((svc) => {
      const titulo = svc?.titulo || '';
      const tituloVenda = svc?.titulo_venda || titulo || '';

      const id = svc?.id || `${slug(categoriaNome)}__${slug(tituloVenda || titulo)}`;

      const inclui = Array.isArray(svc?.inclui) ? svc.inclui : [];
      const beneficios = Array.isArray(svc?.beneficios) ? svc.beneficios : [];
      const formato = Array.isArray(svc?.formato_entrega) ? svc.formato_entrega : [];
      const tags = Array.isArray(svc?.tags) ? svc.tags : [];

      const hasPeriods = Array.isArray(svc?.precos_por_periodo) && svc.precos_por_periodo.length > 0;
      const periods = hasPeriods
        ? svc.precos_por_periodo.map((p) => ({
            name: p?.periodo || '',
            price: Number(p?.preco) || 0,
            old: p?.preco_original ?? null,
            off: p?.desconto_percentual ?? null,
          }))
        : [];

      const price = Number(svc?.preco) || 0;
      const old = svc?.preco_original ?? null;
      const off =
        svc?.desconto_percentual ??
        (old && price ? Math.round((1 - Number(price) / Number(old)) * 100) : null);

      const titleNorm = norm(`${tituloVenda} ${titulo}`);
      const tagsNorm = norm(tags.join(' '));
      const descNorm = norm(svc?.descricao || '');
      const searchNorm = norm(`${tituloVenda} ${titulo} ${svc?.descricao || ''} ${categoriaNome} ${tags.join(' ')}`);

      return {
        id,
        categoria: categoriaNome,
        titulo,
        tituloVenda,
        descricao: svc?.descricao || '',
        inclui,
        beneficios,
        prazo: svc?.prazo_entrega || '',
        revisoes: svc?.revisoes_incluidas ?? null,
        formato,
        tags,
        popular: !!svc?.popular,

        hasPeriods,
        periods,
        price,
        old,
        off,

        // precomputed
        _categoriaNorm: categoriaNorm,
        _titleNorm: titleNorm,
        _tagsNorm: tagsNorm,
        _descNorm: descNorm,
        _searchNorm: searchNorm,
      };
    });

    return { nome: categoriaNome, _nomeNorm: categoriaNorm, servicos };
  });

  const all = categorias.flatMap((c) => c.servicos);
  const byId = all.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  return { hero, categorias, all, byId };
};

/* ==========================================================================
   Bundles (premium quick start)
   ========================================================================== */
const buildBundles = (catalog, isPt) => {
  const bundles = [];

  const findService = (p) => {
    const catNeed = (p.catIncludes || []).map(norm);
    const titleNeed = (p.titleIncludes || []).map(norm);

    for (const ccat of catalog.categorias) {
      const cn = norm(ccat.nome);
      if (catNeed.length && !catNeed.some((x) => cn.includes(x))) continue;

      for (const s of ccat.servicos) {
        const tn = norm(s.tituloVenda || s.titulo);
        if (titleNeed.length && !titleNeed.every((x) => tn.includes(x))) continue;
        return s;
      }
    }
    return null;
  };

  const addBundle = (id, name, hint, pickerList) => {
    const items = pickerList.map(findService).filter(Boolean);
    if (items.length >= 2) bundles.push({ id, name, hint, items });
  };

  addBundle(
    'bundle-social-boost',
    isPt ? 'Combo Social Boost' : 'Social Boost Bundle',
    isPt ? 'Mais conteúdo para redes + vídeo curto para conversão.' : 'More social content + a short video for conversion.',
    [
      { catIncludes: ['imagens', 'images'], titleIncludes: ['10'] },
      { catIncludes: ['videos', 'vídeos'], titleIncludes: ['short'] },
    ]
  );

  addBundle(
    'bundle-launch',
    isPt ? 'Combo Lançamento' : 'Launch Bundle',
    isPt ? 'Vídeo + artes + site para campanha completa.' : 'Video + designs + website for a full campaign.',
    [
      { catIncludes: ['videos', 'vídeos'], titleIncludes: ['30'] },
      { catIncludes: ['imagens', 'images'], titleIncludes: ['15'] },
      { catIncludes: ['servicos', 'services'], titleIncludes: ['website'] },
    ]
  );

  addBundle(
    'bundle-brand',
    isPt ? 'Combo Marca' : 'Brand Bundle',
    isPt ? 'Identidade + website para presença profissional.' : 'Brand identity + website for a professional presence.',
    [
      { catIncludes: ['servicos', 'services'], titleIncludes: ['identidade'] },
      { catIncludes: ['servicos', 'services'], titleIncludes: ['website'] },
    ]
  );

  return bundles.slice(0, 3);
};

/* ==========================================================================
   Component
   ========================================================================== */
export default function OrcamentoPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { i18n } = useTranslation();
  const lang = pickLang(i18n);
  const copy = COPY[lang];
  const routeLang = (params?.lang || lang || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';
  const goToFunnel = useCallback(() => {
    navigate(`/${routeLang}/orcamento/funil`);
  }, [navigate, routeLang]);

  const catalog = useMemo(() => normalizeCatalog(getDataByLang(lang)), [lang]);
  const fmt = useMemo(() => moneyFormatter(lang), [lang]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [openCats, setOpenCats] = useState({});
  const [openDetails, setOpenDetails] = useState({});

  // selection: id -> { id, categoria, tituloVenda, price, periodName }
  const [selected, setSelected] = useState({});

  // Proposal form (optional)
  const [wantsProposal, setWantsProposal] = useState(false);
  const [lead, setLead] = useState({ name: '', whatsapp: '', email: '', message: '' });

  // Modals
const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // print
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: lang === 'en' ? 'Comerc IAs - Quote' : 'Comerc IAs - Orçamento',
  });

  const servicesAnchorRef = useRef(null);
  const scrollToServices = useCallback(() => {
    try {
      servicesAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // ignore
    }
  }, []);

  /* ------------------------------------------------------------------------
     Selection helpers (DRY)
     ------------------------------------------------------------------------ */
  const getBestPeriod = useCallback((svc) => {
    if (!svc?.hasPeriods || !svc.periods?.length) return null;
    const sorted = [...svc.periods].sort((a, b) => Number(a.price) - Number(b.price));
    return sorted[0] || null;
  }, []);

  const buildSelectionEntry = useCallback(
    (svc, preferredPeriodName = '') => {
      if (!svc) return null;

      // If periods exist:
      if (svc.hasPeriods && svc.periods?.length) {
        // If preferredPeriodName matches, use it; otherwise choose best (lowest)
        let chosen = null;

        if (preferredPeriodName) {
          chosen = svc.periods.find((p) => norm(p.name) === norm(preferredPeriodName)) || null;
        }
        if (!chosen) chosen = getBestPeriod(svc);

        return {
          id: svc.id,
          categoria: svc.categoria,
          tituloVenda: svc.tituloVenda,
          price: Number(chosen?.price) || svc.price,
          oldPrice: Number(chosen?.old) || Number(svc.old) || 0,
          periodName: chosen?.name || '',
          revisoes: svc.revisoes,
          prazo: svc.prazo,
        };
      }

      // No periods:
      return {
        id: svc.id,
        categoria: svc.categoria,
        tituloVenda: svc.tituloVenda,
        price: Number(svc.price) || 0,
        oldPrice: Number(svc.old) || 0,
        periodName: '',
        revisoes: svc.revisoes,
        prazo: svc.prazo,
      };
    },
    [getBestPeriod]
  );

  const toggleService = useCallback(
    (svc) => {
      setSelected((prev) => {
        const next = { ...prev };
        if (next[svc.id]) {
          delete next[svc.id];
          return next;
        }
        const entry = buildSelectionEntry(svc);
        if (entry) next[svc.id] = entry;
        return next;
      });
    },
    [buildSelectionEntry]
  );

  const setPeriod = useCallback(
    (svc, periodName) => {
      setSelected((prev) => {
        const next = { ...prev };
        const current = next[svc.id] || buildSelectionEntry(svc);
        if (!current) return prev;

        const p = svc.periods?.find((pp) => norm(pp.name) === norm(periodName));
        if (!p) {
          next[svc.id] = { ...current, periodName: '', price: Number(svc.price) || 0 };
          return next;
        }

        next[svc.id] = {
          ...current,
          periodName: p.name,
          price: Number(p.price) || current.price,
          oldPrice: Number(p.old) || Number(svc.old) || 0,
        };
        return next;
      });
    },
    [buildSelectionEntry]
  );

  const removeItem = useCallback((id) => {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const selectedList = useMemo(() => Object.values(selected), [selected]);
  const selectedCount = selectedList.length;

  const total = useMemo(() => selectedList.reduce((sum, it) => sum + (Number(it.price) || 0), 0), [selectedList]);
  const totalSavings = useMemo(
    () =>
      selectedList.reduce(
        (sum, it) => sum + Math.max(0, (Number(it.oldPrice) || 0) - (Number(it.price) || 0)),
        0
      ),
    [selectedList]
  );
  const averageTicket = selectedCount ? total / selectedCount : 0;
  const avgRevisions = useMemo(() => {
    if (!selectedCount) return 0;
    const withReview = selectedList.filter((it) => typeof it.revisoes === 'number');
    if (!withReview.length) return 0;
    const sum = withReview.reduce((acc, it) => acc + Number(it.revisoes || 0), 0);
    return sum / withReview.length;
  }, [selectedCount, selectedList]);

  const potentialDiscount = useMemo(() => {
    if (selectedCount < 2) return null;
    if (selectedCount >= 6) return { min: 10, max: 20 };
    if (selectedCount >= 4) return { min: 8, max: 15 };
    return { min: 5, max: 12 };
  }, [selectedCount]);

  /* ------------------------------------------------------------------------
     Share URL
     ------------------------------------------------------------------------ */
  const shareUrl = useMemo(() => {
    const payload = {
      items: selectedList.map((it) => ({
        id: it.id,
        price: Number(it.price) || 0,
        oldPrice: Number(it.oldPrice) || 0,
        periodName: it.periodName || '',
      })),
    };

    const encoded = b64UrlEncode(JSON.stringify(payload));
    const base = `${window.location.origin}${window.location.pathname}`;

    if (!encoded) return window.location.href;
    return `${base}?itens=${encoded}`;
  }, [selectedList]);

  const onCopyShare = useCallback(async () => {
    setCopied(false);
    const ok = await safeCopy(shareUrl);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 1500);
  }, [shareUrl]);

  /* ------------------------------------------------------------------------
     WhatsApp summary
     ------------------------------------------------------------------------ */
  const buildSummaryText = useCallback(() => {
    const lines = [];
    lines.push(lang === 'en' ? 'Hello! I’d like a quote:' : 'Olá! Quero um orçamento:');
    lines.push('');

    selectedList
      .slice()
      .sort((a, b) => (a.categoria || '').localeCompare(b.categoria || ''))
      .forEach((it) => {
        const period = it.periodName ? ` (${it.periodName})` : '';
        lines.push(`• ${it.tituloVenda}${period} — ${fmt.format(Number(it.price) || 0)}`);
      });

    lines.push('');
    lines.push(`${copy.total}: ${fmt.format(total || 0)}`);

    if (wantsProposal) {
      lines.push('');
      lines.push(lang === 'en' ? 'I want a tailored proposal with bundle discounts.' : 'Quero uma proposta personalizada com desconto para combos.');
      if (lead.name) lines.push(`${copy.name}: ${lead.name}`);
      if (lead.whatsapp) lines.push(`${copy.whatsappField}: ${lead.whatsapp}`);
      if (lead.email) lines.push(`${copy.email}: ${lead.email}`);
      if (lead.message) lines.push(`${copy.message}: ${lead.message}`);
    }

    return lines.join('\n');
  }, [copy.email, copy.message, copy.name, copy.total, copy.whatsappField, fmt, lang, lead, selectedList, total, wantsProposal]);

  const goWhatsApp = useCallback(() => {
    if (!selectedCount) return;
    const url = buildWhatsAppUrl(buildSummaryText());
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [buildSummaryText, selectedCount]);

  useEffect(() => {
    try {
      const payload = {
        items: selectedList.map((it) => ({
          id: it.id,
          price: Number(it.price) || 0,
          oldPrice: Number(it.oldPrice) || 0,
          periodName: it.periodName || '',
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [selectedList]);

  /* ------------------------------------------------------------------------
     URL hydration (shareable link)
     ------------------------------------------------------------------------ */
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = {};
      let loaded = false;

      const addById = (id, periodName = '', priceOverride = null, oldPriceOverride = null) => {
        const svc = catalog.byId?.[id];
        if (!svc) return;
        const entry = buildSelectionEntry(svc, periodName);
        if (!entry) return;

        const normalizedPrice = Number(priceOverride);
        if (!Number.isNaN(normalizedPrice) && normalizedPrice > 0) entry.price = normalizedPrice;

        const normalizedOld = Number(oldPriceOverride);
        if (!Number.isNaN(normalizedOld) && normalizedOld > 0) entry.oldPrice = normalizedOld;

        next[svc.id] = entry;
      };

      // New format: itens = base64url(JSON)
      const itensB64 = params.get('itens');
      if (itensB64) {
        const decoded = b64UrlDecode(itensB64);
        if (decoded) {
          try {
            const parsed = JSON.parse(decoded);
            if (Array.isArray(parsed?.items)) {
              parsed.items.forEach((it) => {
                addById(it?.id, it?.periodName || '', it?.price, it?.oldPrice);
              });
              if (Object.keys(next).length) loaded = true;
            }
          } catch {
            // Fallback for very old format: base64("id1,id2,id3")
            decoded
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
              .forEach((id) => addById(id));
            if (Object.keys(next).length) loaded = true;
          }
        }
      }

      // Older format (legacy): servicos + periodos
      if (!loaded) {
        const servicos = params.get('servicos');
        const periodos = params.get('periodos');
        if (servicos) {
          const oldSel = JSON.parse(decodeURIComponent(servicos));
          const oldPeriods = periodos ? JSON.parse(decodeURIComponent(periodos)) : {};

          Object.entries(oldSel || {}).forEach(([catName, list]) => {
            Object.entries(list || {}).forEach(([title, price]) => {
              const catN = norm(catName);
              const titleN = norm(title);

              const match = catalog.all.find(
                (s) => s._categoriaNorm === catN && (norm(s.tituloVenda) === titleN || norm(s.titulo) === titleN)
              );
              if (!match) return;

              const chosenPeriodName = oldPeriods?.[catName]?.[title] || '';
              addById(match.id, chosenPeriodName, price);
            });
          });

          if (Object.keys(next).length) loaded = true;
        }
      }

      if (!loaded) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const parsed = raw ? JSON.parse(raw) : null;
          if (Array.isArray(parsed?.items)) {
            parsed.items.forEach((it) => {
              addById(it?.id, it?.periodName || '', it?.price, it?.oldPrice);
            });
            if (Object.keys(next).length) loaded = true;
          }
        } catch {
          // ignore
        }
      }

      if (!loaded) {
        try {
          const rawLegacy = localStorage.getItem('comerc_orcamento_itens');
          const ids = rawLegacy ? JSON.parse(rawLegacy) : [];
          if (Array.isArray(ids)) {
            ids.forEach((id) => addById(id));
            if (Object.keys(next).length) loaded = true;
          }
        } catch {
          // ignore
        }
      }

      if (loaded) {
        setSelected(next);
      }
    } catch {
      // ignore
    }
  }, [catalog.all, catalog.byId, buildSelectionEntry, lang]);

  /* ------------------------------------------------------------------------
     Filters + search
     ------------------------------------------------------------------------ */
  const q = useMemo(() => norm(search), [search]);

  const servicePassesFilter = useCallback((svc) => {
    if (filter === 'all') return true;

    if (filter === 'popular') return svc.popular || (svc.off && Number(svc.off) >= 10);

    if (filter === 'video') {
      return svc._categoriaNorm.includes('video') || svc._categoriaNorm.includes('vídeo') || svc._tagsNorm.includes('video');
    }
    if (filter === 'images') {
      return svc._categoriaNorm.includes('imagem') || svc._tagsNorm.includes('imagens') || svc._tagsNorm.includes('images');
    }
    if (filter === 'plans') {
      return svc._categoriaNorm.includes('plano') || svc._tagsNorm.includes('mensal') || svc._tagsNorm.includes('monthly');
    }
    if (filter === 'web') {
      return svc._titleNorm.includes('website') || svc._titleNorm.includes('site') || svc._titleNorm.includes('landing') || svc._tagsNorm.includes('website');
    }
    if (filter === 'char') {
      return svc._categoriaNorm.includes('person') || svc._titleNorm.includes('mascote') || svc._titleNorm.includes('personagem') || svc._tagsNorm.includes('mascot');
    }

    return true;
  }, [filter]);

  const filteredCategories = useMemo(() => {
    const cats = catalog.categorias
      .map((cat) => {
        const servicos = cat.servicos.filter((s) => {
          if (q && !s._searchNorm.includes(q)) return false;
          if (!servicePassesFilter(s)) return false;
          return true;
        });
        return { ...cat, servicos };
      })
      .filter((c) => c.servicos.length > 0);

    return cats;
  }, [catalog.categorias, q, servicePassesFilter]);

  /* ------------------------------------------------------------------------
     Default open categories
     ------------------------------------------------------------------------ */
  useEffect(() => {
    const initial = {};
    catalog.categorias.forEach((c) => {
      initial[c.nome] = true;
    });
    setOpenCats(initial);
    setOpenDetails({});
  }, [catalog.categorias]);

  const toggleCat = useCallback((name) => {
    setOpenCats((p) => ({ ...p, [name]: !p[name] }));
  }, []);

  const toggleDetails = useCallback((id) => {
    setOpenDetails((p) => ({ ...p, [id]: !p[id] }));
  }, []);

  const isCatOpen = useCallback((name) => !!openCats[name], [openCats]);
  const isDetailsOpen = useCallback((id) => !!openDetails[id], [openDetails]);

  /* ------------------------------------------------------------------------
     Bundles
     ------------------------------------------------------------------------ */
  const bundles = useMemo(() => buildBundles(catalog, lang === 'pt'), [catalog, lang]);
  const bundlePrice = useCallback((items) => items.reduce((sum, s) => sum + (Number(s.price) || 0), 0), []);

  const addBundle = useCallback((bundle) => {
    setSelected((prev) => {
      const next = { ...prev };
      bundle.items.forEach((svc) => {
        if (next[svc.id]) return;
        const entry = buildSelectionEntry(svc);
        if (entry) next[svc.id] = entry;
      });
      return next;
    });
    scrollToServices();
  }, [buildSelectionEntry, scrollToServices]);

  /* ------------------------------------------------------------------------
     UI components
     ------------------------------------------------------------------------ */
  const FilterChip = ({ id, label, icon }) => (
    <button
      type="button"
      className={`orc-filterChip ${filter === id ? 'is-active' : ''}`}
      onClick={() => setFilter(id)}
    >
      {icon ? <FontAwesomeIcon icon={icon} /> : null}
      <span>{label}</span>
    </button>
  );

  const renderPrice = (svc) => {
    const sel = selected[svc.id];
    const price = sel ? Number(sel.price) : Number(svc.price);

    let old = svc.old;
    let off = svc.off;

    if (svc.hasPeriods && sel?.periodName) {
      const p = svc.periods.find((pp) => norm(pp.name) === norm(sel.periodName));
      if (p) {
        old = p.old ?? old;
        off = p.off ?? off;
      }
    }

    return (
      <div className="orc-svcPrice">
        {old ? <div className="orc-svcOld">{fmt.format(Number(old) || 0)}</div> : null}
        <div className="orc-svcNew">{fmt.format(price || 0)}</div>
        {off ? <div className="orc-svcOff">-{Number(off)}%</div> : null}
      </div>
    );
  };

  const renderService = (svc) => {
    const isSelected = !!selected[svc.id];
    const detailsOpen = isDetailsOpen(svc.id);

    return (
      <div
        key={svc.id}
        className={`orc-svc ${isSelected ? 'is-selected' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => toggleService(svc)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') toggleService(svc);
        }}
      >
        <div className="orc-svcTop">
          <div className="orc-svcTitleRow">
            <Form.Check
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleService(svc)}
              onClick={(e) => e.stopPropagation()}
              aria-label={svc.tituloVenda}
            />
            <div style={{ minWidth: 0 }}>
              <div className="d-flex align-items-start gap-2 flex-wrap">
                <h4 className="orc-svcTitle">{svc.tituloVenda}</h4>
                <div className="orc-badges">
                  {svc.popular ? (
                    <Badge bg="warning" text="dark" className="orc-badge">
                      <FontAwesomeIcon icon={faFire} className="me-1" />
                      {lang === 'en' ? 'Best seller' : 'Mais vendido'}
                    </Badge>
                  ) : null}
                  {svc.off && Number(svc.off) >= 10 ? (
                    <Badge bg="danger" className="orc-badge">
                      <FontAwesomeIcon icon={faTag} className="me-1" />
                      -{Number(svc.off)}%
                    </Badge>
                  ) : null}
                </div>
              </div>

              {svc.descricao ? <div className="orc-svcDesc">{svc.descricao}</div> : null}
            </div>
          </div>

          {renderPrice(svc)}
        </div>

        <div className="orc-svcActions" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="orc-miniLink" onClick={() => toggleDetails(svc.id)}>
            <FontAwesomeIcon icon={detailsOpen ? faChevronUp : faChevronDown} />
            <span>{detailsOpen ? copy.hideDetails : copy.details}</span>
          </button>

          {isSelected ? (
            <Badge bg="success" className="orc-badge">
              <FontAwesomeIcon icon={faCircleCheck} className="me-1" />
              {copy.added}
            </Badge>
          ) : (
            <Badge bg="secondary" className="orc-badge">
              <FontAwesomeIcon icon={faCircleXmark} className="me-1" />
              {copy.notSelected}
            </Badge>
          )}
        </div>

        {/* periods */}
        {svc.hasPeriods && isSelected ? (
          <div className="orc-periods" onClick={(e) => e.stopPropagation()}>
            <div className="orc-periodsTitle">{copy.choosePeriod}</div>
            <div className="orc-periodGrid">
              {svc.periods.map((p) => {
                const active = norm(selected[svc.id]?.periodName) === norm(p.name);
                return (
                  <div
                    key={`${svc.id}-${p.name}`}
                    className={`orc-period ${active ? 'is-active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setPeriod(svc, p.name)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setPeriod(svc, p.name);
                    }}
                  >
                    <div className="orc-periodRow">
                      <div>
                        <div className="orc-periodName">{p.name}</div>
                        {p.old ? (
                          <div className="orc-muted" style={{ textDecoration: 'line-through' }}>
                            {fmt.format(Number(p.old) || 0)}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-end">
                        <div className="orc-periodPrice">{fmt.format(Number(p.price) || 0)}</div>
                        {p.off ? <div className="orc-periodOff">-{Number(p.off)}%</div> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* details */}
        <Collapse in={detailsOpen}>
          <div className="orc-details" onClick={(e) => e.stopPropagation()}>
            <div className="orc-detailsGrid">
              <div>
                <div className="orc-detailsTitle">{copy.includes}</div>
                {svc.inclui?.length ? (
                  <ul className="orc-detailsList">
                    {svc.inclui.map((x, idx) => (
                      <li key={idx}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="orc-muted">
                    {lang === 'en'
                      ? 'Included items will be defined in the proposal.'
                      : 'Itens inclusos serão definidos na proposta.'}
                  </div>
                )}
              </div>

              <div>
                <div className="orc-detailsTitle">{copy.benefits}</div>
                {svc.beneficios?.length ? (
                  <ul className="orc-detailsList">
                    {svc.beneficios.map((x, idx) => (
                      <li key={idx}>{x}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="orc-muted">
                    {lang === 'en'
                      ? 'Benefits depend on your goal and scope.'
                      : 'Benefícios dependem do objetivo e do escopo.'}
                  </div>
                )}
              </div>
            </div>

            <div className="orc-detailsMeta">
              {svc.prazo ? (
                <span>
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  {copy.delivery}: <strong>{svc.prazo}</strong>
                </span>
              ) : null}

              {svc.revisoes !== null ? (
                <span>
                  <FontAwesomeIcon icon={faRotateRight} className="me-2" />
                  {copy.revisions}: <strong>{svc.revisoes}</strong>
                </span>
              ) : null}

              {svc.formato?.length ? (
                <span>
                  <FontAwesomeIcon icon={faListCheck} className="me-2" />
                  {copy.formats}:{' '}
                  <strong>
                    {svc.formato.slice(0, 2).join(' • ')}
                    {svc.formato.length > 2 ? '…' : ''}
                  </strong>
                </span>
              ) : null}
            </div>
          </div>
        </Collapse>
      </div>
    );
  };

  /* ------------------------------------------------------------------------
     Main render
     ------------------------------------------------------------------------ */
  return (
    <div className="orcamento-page">
      <SEO title={copy.seoTitle} description={copy.seoDesc} />

      <Container className="orc-wrap">
        {/* HERO */}
        <div className="orc-hero">
          <div className="orc-hero-grid">
            <div>
              <div className="orc-hero-badge">
                <FontAwesomeIcon icon={faBolt} />
                <span>{catalog.hero?.badge || copy.badge}</span>
              </div>

              <h1 className="orc-hero-title">{catalog.hero?.titulo || copy.title}</h1>
              <p className="orc-hero-subtitle">{catalog.hero?.subtitulo || copy.subtitle}</p>

              <div className="orc-hero-highlights">
                {copy.highlights.map((h, i) => (
                  <div key={i} className="orc-hero-highlight">
                    <FontAwesomeIcon icon={i === 0 ? faBolt : i === 1 ? faWandMagicSparkles : faListCheck} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="orc-hero-note">{catalog.hero?.nota || copy.note}</div>
            </div>

            {/* CTA card */}
            <div>
              <div className="orc-ctaCard">
                <div className="orc-ctaTop">
                  <div>
                    <div className="orc-ctaTotalLabel">{copy.ctaTotalLabel}</div>
                    <div className="orc-ctaTotal">{fmt.format(total || 0)}</div>
                  </div>

                  <div className="orc-ctaMeta">
                    <div className="orc-chip">
                      <FontAwesomeIcon icon={faListCheck} />
                      <span>
                        {selectedCount} {copy.ctaItems}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="orc-ctaButtons">
                  <Button className="orc-btn orc-btn-primary" onClick={goToFunnel}>
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                    <span>{copy.ctaPrimary}</span>
                  </Button>

                  <Button className="orc-btn orc-btn-ghost" onClick={scrollToServices}>
                    <FontAwesomeIcon icon={faListCheck} />
                    <span>{copy.ctaSecondary}</span>
                  </Button>
                </div>

                <div className="orc-ctaLinks">
<button type="button" className="orc-link orc-linkBtn" onClick={() => setShowShare(true)}>
                    <FontAwesomeIcon icon={faShareNodes} />
                    <span>{copy.ctaShare}</span>
                  </button>

                  <button type="button" className="orc-link orc-linkBtn" onClick={handlePrint}>
                    <FontAwesomeIcon icon={faPrint} />
                    <span>{copy.ctaPrint}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="orc-proofRow">
          <div className="orc-proofItem">
            <div className="orc-proofTitle">{lang === 'en' ? 'Instant estimate' : 'Estimativa imediata'}</div>
            <div className="orc-proofText">
              {lang === 'en'
                ? 'Build your quote with transparent pricing and no wait.'
                : 'Monte seu orçamento com preços claros e sem espera.'}
            </div>
          </div>

          <div className="orc-proofItem">
            <div className="orc-proofTitle">{lang === 'en' ? 'Potential savings' : 'Economia potencial'}</div>
            <div className="orc-proofText">
              {totalSavings > 0
                ? fmt.format(totalSavings)
                : lang === 'en'
                  ? 'Bundle discounts available on proposal'
                  : 'Descontos em combo disponíveis na proposta'}
            </div>
          </div>

          <div className="orc-proofItem">
            <div className="orc-proofTitle">{lang === 'en' ? 'Average ticket' : 'Ticket médio'}</div>
            <div className="orc-proofText">{selectedCount ? fmt.format(averageTicket) : fmt.format(0)}</div>
          </div>

          <div className="orc-proofItem">
            <div className="orc-proofTitle">{lang === 'en' ? 'Included revisions' : 'Revisões inclusas'}</div>
            <div className="orc-proofText">
              {avgRevisions > 0
                ? `~${avgRevisions.toFixed(1)} ${lang === 'en' ? 'per service' : 'por serviço'}`
                : lang === 'en'
                  ? 'Defined per selected service'
                  : 'Definidas por serviço selecionado'}
            </div>
          </div>
        </div>

        {/* Bundles */}
        {bundles?.length ? (
          <Card className="orc-card mt-3">
            <Card.Body className="orc-card-body">
              <div className="orc-card-head">
                <div className="orc-step">★</div>
                <div>
                  <h2 className="orc-card-title">{copy.comboTitle}</h2>
                  <p className="orc-card-subtitle">{copy.comboSub}</p>
                </div>
              </div>

              <Row className="g-3">
                {bundles.map((b) => (
                  <Col key={b.id} md={4}>
                    <div className="orc-svc" style={{ cursor: 'default' }}>
                      <div className="orc-svcTop">
                        <div style={{ minWidth: 0 }}>
                          <h4 className="orc-svcTitle">{b.name}</h4>
                          <div className="orc-svcDesc">{b.hint}</div>
                          <div className="orc-muted" style={{ fontWeight: 900 }}>
                            {b.items.map((x) => x.tituloVenda).join(' + ')}
                          </div>
                        </div>

                        <div className="orc-svcPrice">
                          <div className="orc-svcNew">{fmt.format(bundlePrice(b.items))}</div>
                        </div>
                      </div>

                      <div className="orc-svcActions" style={{ marginTop: 12 }}>
                        <Button className="orc-btn orc-btn-primary w-100" onClick={() => addBundle(b)}>
                          <FontAwesomeIcon icon={faCircleCheck} />
                          <span>{copy.addCombo}</span>
                        </Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        ) : null}

        <div ref={servicesAnchorRef} />

        <Row className="g-3 mt-2" ref={printRef}>
          {/* LEFT */}
          <Col lg={8}>
            <Card className="orc-card">
              <Card.Body className="orc-card-body">
                <div className="orc-card-head">
                  <div className="orc-step">1</div>
                  <div>
                    <h2 className="orc-card-title">{copy.step1Title}</h2>
                    <p className="orc-card-subtitle">{copy.step1Sub}</p>
                  </div>
                </div>

                <div className="orc-searchRow">
                  <Form.Control
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={copy.searchPh}
                    aria-label={copy.searchPh}
                  />

                  <div className="orc-filterChips">
                    <FilterChip id="all" label={copy.filterAll} icon={faMagnifyingGlass} />
                    <FilterChip id="popular" label={copy.filterPopular} icon={faFire} />
                    <FilterChip id="video" label={copy.filterVideo} icon={faBolt} />
                    <FilterChip id="images" label={copy.filterImages} icon={faTag} />
                    <FilterChip id="plans" label={copy.filterPlans} icon={faListCheck} />
                    <FilterChip id="web" label={copy.filterWeb} icon={faWandMagicSparkles} />
                    <FilterChip id="char" label={copy.filterCharacter} icon={faWandMagicSparkles} />
                  </div>
                </div>

                <div className="mt-3">
                  {filteredCategories.length ? (
                    filteredCategories.map((cat) => (
                      <div key={cat.nome} className="orc-cat">
                        <button
                          type="button"
                          className={`orc-catHeader ${isCatOpen(cat.nome) ? 'is-open' : ''}`}
                          onClick={() => toggleCat(cat.nome)}
                        >
                          <div>
                            <div className="orc-catTitle">{cat.nome}</div>
                            <div className="orc-catMeta">
                              {cat.servicos.length} {lang === 'en' ? 'options' : 'opções'}
                            </div>
                          </div>

                          <div className="orc-catRight">
                            <span>
                              {isCatOpen(cat.nome)
                                ? (lang === 'en' ? 'Hide' : 'Ocultar')
                                : (lang === 'en' ? 'Show' : 'Mostrar')}
                            </span>
                            <FontAwesomeIcon icon={isCatOpen(cat.nome) ? faChevronUp : faChevronDown} />
                          </div>
                        </button>

                        <Collapse in={isCatOpen(cat.nome)}>
                          <div>{cat.servicos.map(renderService)}</div>
                        </Collapse>
                      </div>
                    ))
                  ) : (
                    <Alert variant="light" className="mb-0">
                      {copy.emptySearch}
                    </Alert>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT */}
          <Col lg={4}>
            <Card className="orc-card orc-card-sticky">
              <Card.Body className="orc-card-body">
                <div className="orc-card-head">
                  <div className="orc-step">✓</div>
                  <div>
                    <h2 className="orc-card-title">{copy.asideTitle}</h2>
                    <p className="orc-card-subtitle">
                      {lang === 'en'
                        ? 'Your total updates instantly. Request a tailored proposal only if you want.'
                        : 'Seu total atualiza na hora. Peça uma proposta personalizada só se quiser.'}
                    </p>
                  </div>
                </div>

                <div className="orc-asideLine">
                  <span>{copy.selected}</span>
                  <strong>{selectedCount}</strong>
                </div>

                <div className="orc-asideLine">
                  <span>{copy.subtotal}</span>
                  <strong>{fmt.format(total || 0)}</strong>
                </div>

                <div className="orc-asideLine">
                  <span>{copy.total}</span>
                  <strong>{fmt.format(total || 0)}</strong>
                </div>

                <div className="orc-asideLine">
                  <span>{lang === 'en' ? 'Potential savings' : 'Economia potencial'}</span>
                  <strong>{totalSavings > 0 ? fmt.format(totalSavings) : '—'}</strong>
                </div>

                <div className="orc-asideLine">
                  <span>{lang === 'en' ? 'Average ticket' : 'Ticket médio'}</span>
                  <strong>{selectedCount ? fmt.format(averageTicket) : '—'}</strong>
                </div>

                {potentialDiscount ? (
                  <div className="orc-asideHint">
                    {lang === 'en'
                      ? `Potential bundle discount: ${potentialDiscount.min}%–${potentialDiscount.max}% (upon proposal).`
                      : `Possível desconto em combos: ${potentialDiscount.min}%–${potentialDiscount.max}% (na proposta).`}
                    <div className="mt-1 orc-muted" style={{ fontWeight: 900 }}>
                      {copy.comboHint}
                    </div>
                  </div>
                ) : (
                  <div className="orc-asideHint">{copy.comboHint}</div>
                )}

                <div className="orc-asideBtns">
                  <Button className="orc-btn orc-btn-primary" onClick={goWhatsApp} disabled={!selectedCount}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>{copy.whatsapp}</span>
                  </Button>

                  <Button className="orc-btn orc-btn-ghost" onClick={() => setWantsProposal((v) => !v)}>
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                    <span>{copy.proposal}</span>
                  </Button>
                </div>

                {selectedCount ? (
                  <div className="mt-3">
                    <div className="orc-detailsTitle mb-2">{copy.itemsSelectedTitle}</div>

                    <div style={{ display: 'grid', gap: 10 }}>
                      {selectedList
                        .slice()
                        .sort((a, b) => (a.tituloVenda || '').localeCompare(b.tituloVenda || ''))
                        .map((it) => (
                          <div
                            key={it.id}
                            className="d-flex justify-content-between align-items-start gap-2"
                            style={{
                              padding: '10px 12px',
                              borderRadius: 16,
                              border: '1px solid rgba(2,8,23,0.08)',
                              background: 'rgba(255,255,255,0.70)',
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 950 }}>{it.tituloVenda}</div>
                              {it.periodName ? <div className="orc-muted" style={{ fontWeight: 900 }}>{it.periodName}</div> : null}
                              {it.prazo ? (
                                <div className="orc-muted" style={{ fontWeight: 900 }}>
                                  {copy.delivery}: {it.prazo}
                                </div>
                              ) : null}
                              <div className="orc-muted" style={{ fontWeight: 900 }}>{fmt.format(Number(it.price) || 0)}</div>
                            </div>

                            <button
                              type="button"
                              className="orc-miniLink"
                              onClick={() => removeItem(it.id)}
                              aria-label={lang === 'en' ? 'Remove' : 'Remover'}
                            >
                              <FontAwesomeIcon icon={faCircleXmark} />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : null}

                <Collapse in={wantsProposal}>
                  <div className="mt-3">
                    <Alert variant="light" className="mb-3">
                      {copy.proposalSub}
                    </Alert>

                    <Form>
                      <Form.Group className="mb-2">
                        <Form.Label>{copy.name}</Form.Label>
                        <Form.Control
                          value={lead.name}
                          onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
                          placeholder={lang === 'en' ? 'Your name' : 'Seu nome'}
                        />
                      </Form.Group>

                      <Row className="g-2">
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>{copy.whatsappField}</Form.Label>
                            <Form.Control
                              value={lead.whatsapp}
                              onChange={(e) => setLead((p) => ({ ...p, whatsapp: e.target.value }))}
                              placeholder={lang === 'en' ? '+55 ...' : '+55 ...'}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>{copy.email}</Form.Label>
                            <Form.Control
                              value={lead.email}
                              onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
                              placeholder="email@exemplo.com"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-2">
                        <Form.Label>{copy.message}</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={lead.message}
                          onChange={(e) => setLead((p) => ({ ...p, message: e.target.value }))}
                          placeholder={
                            lang === 'en'
                              ? 'Describe your idea, niche, tone, references...'
                              : 'Descreva sua ideia, nicho, tom, referências...'
                          }
                        />
                      </Form.Group>

                      <Button className="orc-btn orc-btn-primary w-100 mt-2" onClick={goWhatsApp} disabled={!selectedCount}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        <span>{copy.send}</span>
                      </Button>
                    </Form>
                  </div>
                </Collapse>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* SHARE MODAL */}
        <Modal show={showShare} onHide={() => setShowShare(false)} centered dialogClassName="orc-modal" scrollable>
          <Modal.Header closeButton>
            <Modal.Title>{copy.shareTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p className="orc-muted" style={{ fontWeight: 900 }}>
              {copy.shareDesc}
            </p>

            <Form.Control value={shareUrl} readOnly />

            <div className="d-grid gap-2 mt-3">
              <Button className="orc-btn orc-btn-primary" onClick={onCopyShare}>
                <FontAwesomeIcon icon={faClipboard} />
                <span>{copied ? copy.copied : copy.copyLink}</span>
              </Button>

              <Button className="orc-btn orc-btn-ghost" onClick={() => setShowShare(false)}>
                {copy.close}
              </Button>
            </div>

            {!selectedCount ? (
              <Alert variant="light" className="mt-3 mb-0">
                {lang === 'en'
                  ? 'Tip: select at least one service to generate a pre-filled link.'
                  : 'Dica: selecione pelo menos um serviço para gerar um link preenchido.'}
              </Alert>
            ) : null}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
