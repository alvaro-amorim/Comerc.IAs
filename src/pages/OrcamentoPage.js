import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Collapse,
  Modal,
  Badge,
  Alert,
  ProgressBar,
} from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faWandMagicSparkles,
  faListCheck,
  faChevronDown,
  faChevronUp,
  faArrowUpRightFromSquare,
  faShareNodes,
  faPrint,
  faClipboard,
  faPaperPlane,
  faCircleCheck,
  faCircleXmark,
  faMagnifyingGlass,
  faFire,
  faTag,
  faClock,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';

import SEO from '../components/SEO';
import '../styles/OrcamentoPage.css';

import precosPT from '../data/precos.json';
import precosEN from '../data/precos_en.json';

const QUIZ_URL = 'https://auxiliar-de-escolha.vercel.app/';

// ---------- helpers ----------
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

const moneyFormatter = (lang) =>
  new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'pt-BR', {
    style: 'currency',
    currency: lang === 'en' ? 'USD' : 'BRL',
    maximumFractionDigits: 2,
  });

const pickLang = (i18n) => ((i18n?.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt');
const getDataByLang = (lang) => (lang === 'en' ? precosEN : precosPT);

const normalizeCatalog = (raw) => {
  const hero = raw?.orcamento?.hero || {};
  const categorias = (raw?.orcamento?.categorias || []).map((cat) => {
    const servicos = (cat?.servicos || []).map((svc) => {
      const titulo = svc?.titulo || '';
      const tituloVenda = svc?.titulo_venda || titulo || '';
      const id = svc?.id || `${slug(cat?.nome)}__${slug(tituloVenda || titulo)}`;

      const base = {
        id,
        categoria: cat?.nome || 'Categoria',
        titulo,
        tituloVenda,
        descricao: svc?.descricao || '',
        inclui: Array.isArray(svc?.inclui) ? svc.inclui : [],
        beneficios: Array.isArray(svc?.beneficios) ? svc.beneficios : [],
        prazo: svc?.prazo_entrega || '',
        revisoes: svc?.revisoes_incluidas ?? null,
        formato: Array.isArray(svc?.formato_entrega) ? svc.formato_entrega : [],
        tags: Array.isArray(svc?.tags) ? svc.tags : [],
        popular: !!svc?.popular,
      };

      const hasPeriods = Array.isArray(svc?.precos_por_periodo) && svc.precos_por_periodo.length > 0;
      const periods = hasPeriods
        ? svc.precos_por_periodo.map((p) => ({
            name: p?.periodo || '',
            price: p?.preco ?? 0,
            old: p?.preco_original ?? null,
            off: p?.desconto_percentual ?? null,
          }))
        : null;

      const price = svc?.preco ?? 0;
      const old = svc?.preco_original ?? null;
      const off =
        svc?.desconto_percentual ??
        (old && price ? Math.round((1 - Number(price) / Number(old)) * 100) : null);

      return { ...base, hasPeriods, periods, price: Number(price) || 0, old, off };
    });

    return { nome: cat?.nome || 'Categoria', servicos };
  });

  const all = categorias.flatMap((c) => c.servicos);
  return { hero, categorias, all };
};

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

const buildWhatsAppUrl = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;

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
    meta: 'Info rápida',
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
    meta: 'Quick info',
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
  },
};

// ---------- quiz model ----------
const QUIZ_STEPS = (c) => [
  {
    id: 'goal',
    title: c.quizQ1,
    options: [
      { value: 'sales', label: c.goal1 },
      { value: 'brand', label: c.goal2 },
      { value: 'recurring', label: c.goal3 },
      { value: 'character', label: c.goal4 },
    ],
  },
  {
    id: 'channel',
    title: c.quizQ2,
    options: [
      { value: 'ig', label: c.ch1 },
      { value: 'ads', label: c.ch2 },
      { value: 'web', label: c.ch3 },
      { value: 'mix', label: c.ch4 },
    ],
  },
  {
    id: 'deadline',
    title: c.quizQ3,
    options: [
      { value: 'fast', label: c.dl1 },
      { value: 'normal', label: c.dl2 },
      { value: 'flex', label: c.dl3 },
    ],
  },
  {
    id: 'budget',
    title: c.quizQ4,
    options: [
      { value: 'low', label: c.bud1 },
      { value: 'mid', label: c.bud2 },
      { value: 'high', label: c.bud3 },
    ],
  },
];

const scoreService = (svc, ans) => {
  const t = norm(`${svc.tituloVenda} ${svc.categoria} ${(svc.tags || []).join(' ')}`);

  let score = 0;

  // goal
  if (ans.goal === 'sales') {
    if (t.includes('website') || t.includes('site') || t.includes('landing')) score += 5;
    if (t.includes('video') || t.includes('vídeo') || t.includes('reels') || t.includes('short')) score += 4;
    if (t.includes('poster') || t.includes('imagens') || t.includes('design')) score += 2;
  }

  if (ans.goal === 'brand') {
    if (t.includes('identidade') || t.includes('branding') || t.includes('logo')) score += 6;
    if (t.includes('website') || t.includes('site')) score += 3;
    if (t.includes('video') || t.includes('vídeo') || t.includes('story')) score += 3;
    if (t.includes('pack') || t.includes('imagens')) score += 2;
  }

  if (ans.goal === 'recurring') {
    if (t.includes('plano') || t.includes('monthly') || t.includes('mensal')) score += 7;
    if (t.includes('pack') || t.includes('imagens')) score += 3;
    if (t.includes('video') || t.includes('vídeo')) score += 3;
  }

  if (ans.goal === 'character') {
    if (t.includes('personagem') || t.includes('mascote') || t.includes('character')) score += 7;
    if (t.includes('anim') || t.includes('cinematic')) score += 4;
  }

  // channel
  if (ans.channel === 'ig') {
    if (t.includes('reels') || t.includes('short') || t.includes('story')) score += 4;
    if (t.includes('imagens') || t.includes('images') || t.includes('feed') || t.includes('stories')) score += 3;
    if (t.includes('plano') || t.includes('monthly') || t.includes('mensal')) score += 2;
  }
  if (ans.channel === 'ads') {
    if (t.includes('video') || t.includes('vídeo')) score += 4;
    if (t.includes('poster') || t.includes('imagens') || t.includes('design')) score += 3;
    if (t.includes('landing') || t.includes('website') || t.includes('site')) score += 2;
  }
  if (ans.channel === 'web') {
    if (t.includes('website') || t.includes('site') || t.includes('landing')) score += 7;
    if (t.includes('branding') || t.includes('identidade') || t.includes('logo')) score += 2;
  }
  if (ans.channel === 'mix') {
    score += 1;
    if (t.includes('plano') || t.includes('monthly') || t.includes('mensal')) score += 2;
  }

  // deadline
  if (ans.deadline === 'fast') {
    if (t.includes('rapido') || t.includes('rápido') || t.includes('short') || t.includes('pack')) score += 3;
    if (t.includes('pro') || t.includes('premium') || t.includes('cinematic')) score -= 1;
  }
  if (ans.deadline === 'flex') {
    if (t.includes('premium') || t.includes('pro') || t.includes('cinematic')) score += 1;
  }

  // budget
  if (ans.budget === 'low') score += svc.price <= 150 ? 2 : -1;
  if (ans.budget === 'high') score += svc.price >= 200 ? 1 : 0;

  // best sellers
  if (svc.popular) score += 1;

  return score;
};

const buildRecommendation = (catalog, ans) => {
  const scored = catalog.all
    .map((svc) => ({ svc, score: scoreService(svc, ans) }))
    .sort((a, b) => b.score - a.score);

  const top = scored.filter((x) => x.score > 0).slice(0, 4).map((x) => x.svc);

  // ensure not empty
  if (top.length) return top;

  // fallback: pick popular first
  const popular = catalog.all.filter((s) => s.popular).slice(0, 4);
  return popular.length ? popular : catalog.all.slice(0, 3);
};

// ---------- bundles ----------
const buildBundles = (catalog, c) => {
  // This is “best-effort”. If a service isn't found, the bundle is skipped.
  const bundles = [];

  const addBundle = (id, name, hint, pickerList) => {
    const items = pickerList.map((p) => findService(catalog, p)).filter(Boolean);
    if (items.length >= 2) {
      bundles.push({ id, name, hint, items });
    }
  };

  const findService = (cat, p) => {
    const catNeed = (p.catIncludes || []).map(norm);
    const titleNeed = (p.titleIncludes || []).map(norm);
    for (const ccat of cat.categorias) {
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

  // PT keywords are also attempted; EN file has English titles. Our find is tolerant.
  addBundle(
    'bundle-social-boost',
    (c.pt ? 'Combo Social Boost' : 'Social Boost Bundle'),
    (c.pt ? 'Mais conteúdo para redes + vídeo curto para conversão.' : 'More social content + a short video for conversion.'),
    [
      { catIncludes: ['imagens', 'images'], titleIncludes: ['10'] },
      { catIncludes: ['videos', 'vídeos'], titleIncludes: ['short'] },
    ]
  );

  addBundle(
    'bundle-launch',
    (c.pt ? 'Combo Lançamento' : 'Launch Bundle'),
    (c.pt ? 'Vídeo + artes + site para campanha completa.' : 'Video + designs + website for a full campaign.'),
    [
      { catIncludes: ['videos', 'vídeos'], titleIncludes: ['30'] },
      { catIncludes: ['imagens', 'images'], titleIncludes: ['15'] },
      { catIncludes: ['servicos', 'services'], titleIncludes: ['website'] },
    ]
  );

  addBundle(
    'bundle-brand',
    (c.pt ? 'Combo Marca' : 'Brand Bundle'),
    (c.pt ? 'Identidade + website para presença profissional.' : 'Brand identity + website for a professional presence.'),
    [
      { catIncludes: ['servicos', 'services'], titleIncludes: ['identidade'] },
      { catIncludes: ['servicos', 'services'], titleIncludes: ['website'] },
    ]
  );

  return bundles.slice(0, 3);
};

// ---------- component ----------
export default function OrcamentoPage() {
  const { i18n } = useTranslation();
  const lang = pickLang(i18n);
  const copy = COPY[lang];
  const catalog = useMemo(() => normalizeCatalog(getDataByLang(lang)), [lang]);
  const fmt = useMemo(() => moneyFormatter(lang), [lang]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [openCats, setOpenCats] = useState(() => ({}));
  const [openDetails, setOpenDetails] = useState(() => ({}));

  // selection: id -> { id, title, category, price, periodName }
  const [selected, setSelected] = useState(() => ({}));

  // Proposal form (optional)
  const [wantsProposal, setWantsProposal] = useState(false);
  const [lead, setLead] = useState({ name: '', whatsapp: '', email: '', message: '' });

  // Modals
  const [showQuiz, setShowQuiz] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // Quiz state
  const steps = useMemo(() => QUIZ_STEPS(copy), [copy]);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({ goal: '', channel: '', deadline: '', budget: '' });
  const [quizResult, setQuizResult] = useState(null);

  // print
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: lang === 'en' ? 'Comerc IAs - Quote' : 'Comerc IAs - Orçamento',
  });

  const servicesAnchorRef = useRef(null);
  const scrollToServices = () => {
    try {
      servicesAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // ignore
    }
  };

  // ====== URL hydration (shareable link) ======
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      // New: itens = base64url(JSON)
      const itensB64 = params.get('itens');
      if (itensB64) {
        const decoded = b64UrlDecode(itensB64);
        const parsed = JSON.parse(decoded);
        if (Array.isArray(parsed?.items)) {
          const next = {};
          parsed.items.forEach((it) => {
            if (!it?.id) return;
            const svc = catalog.all.find((s) => s.id === it.id);
            if (!svc) return;
            const chosen = {
              id: svc.id,
              categoria: svc.categoria,
              tituloVenda: svc.tituloVenda,
              price: Number(it.price ?? svc.price) || svc.price,
              periodName: it.periodName || '',
            };

            // if service has periods and a periodName is provided, take that price
            if (svc.hasPeriods && it.periodName) {
              const p = svc.periods.find((pp) => norm(pp.name) === norm(it.periodName));
              if (p) chosen.price = Number(p.price) || chosen.price;
            }

            next[svc.id] = chosen;
          });

          if (Object.keys(next).length) setSelected(next);
          return;
        }
      }

      // Old: servicos = JSON nested
      const servicos = params.get('servicos');
      const periodos = params.get('periodos');
      if (servicos) {
        const oldSel = JSON.parse(decodeURIComponent(servicos));
        const oldPeriods = periodos ? JSON.parse(decodeURIComponent(periodos)) : {};
        const next = {};

        Object.entries(oldSel || {}).forEach(([catName, list]) => {
          Object.entries(list || {}).forEach(([title, price]) => {
            // find best match in catalog
            const match = catalog.all.find(
              (s) => norm(s.categoria) === norm(catName) && (norm(s.tituloVenda) === norm(title) || norm(s.titulo) === norm(title))
            );
            if (!match) return;
            const chosenPeriodName = oldPeriods?.[catName]?.[title] || '';
            let finalPrice = Number(price) || match.price;

            if (match.hasPeriods && chosenPeriodName) {
              const p = match.periods.find((pp) => norm(pp.name) === norm(chosenPeriodName));
              if (p) finalPrice = Number(p.price) || finalPrice;
            }

            next[match.id] = {
              id: match.id,
              categoria: match.categoria,
              tituloVenda: match.tituloVenda,
              price: finalPrice,
              periodName: chosenPeriodName,
            };
          });
        });

        if (Object.keys(next).length) setSelected(next);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog.all.length]);

  // ====== selection helpers ======
  const toggleService = (svc) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[svc.id]) {
        delete next[svc.id];
        return next;
      }

      // if has periods: auto-select first period (best value)
      if (svc.hasPeriods && svc.periods?.length) {
        const best = [...svc.periods].sort((a, b) => Number(a.price) - Number(b.price))[0];
        next[svc.id] = {
          id: svc.id,
          categoria: svc.categoria,
          tituloVenda: svc.tituloVenda,
          price: Number(best.price) || svc.price,
          periodName: best.name || '',
        };
        return next;
      }

      next[svc.id] = { id: svc.id, categoria: svc.categoria, tituloVenda: svc.tituloVenda, price: svc.price, periodName: '' };
      return next;
    });
  };

  const setPeriod = (svc, periodName) => {
    setSelected((prev) => {
      const next = { ...prev };
      const current = next[svc.id] || { id: svc.id, categoria: svc.categoria, tituloVenda: svc.tituloVenda, price: svc.price, periodName: '' };

      const period = svc.periods?.find((p) => norm(p.name) === norm(periodName));
      if (period) {
        next[svc.id] = { ...current, periodName: period.name, price: Number(period.price) || current.price };
      } else {
        next[svc.id] = { ...current, periodName: '', price: svc.price };
      }
      return next;
    });
  };

  const removeItem = (id) => setSelected((prev) => {
    const next = { ...prev };
    delete next[id];
    return next;
  });

  const selectedList = useMemo(() => Object.values(selected), [selected]);

  const subtotal = useMemo(
    () => selectedList.reduce((sum, it) => sum + (Number(it.price) || 0), 0),
    [selectedList]
  );

  // optional: show “potential discount range” hint (not applied)
  const potentialDiscount = useMemo(() => {
    const count = selectedList.length;
    if (count < 2) return null;
    if (count >= 6) return { min: 10, max: 20 };
    if (count >= 4) return { min: 8, max: 15 };
    return { min: 5, max: 12 };
  }, [selectedList.length]);

  // Filters + search
  const serviceMatches = (svc) => {
    const q = norm(search);
    if (!q) return true;
    const hay = norm(`${svc.tituloVenda} ${svc.titulo} ${svc.descricao} ${svc.categoria} ${(svc.tags || []).join(' ')}`);
    return hay.includes(q);
  };

  const servicePassesFilter = (svc) => {
    if (filter === 'all') return true;
    if (filter === 'popular') return svc.popular || (svc.off && Number(svc.off) >= 10);
    if (filter === 'video') return norm(svc.categoria).includes('video') || norm(svc.categoria).includes('vídeo') || norm(svc.tags?.join(' ')).includes('video');
    if (filter === 'images') return norm(svc.categoria).includes('imagem') || norm(svc.tags?.join(' ')).includes('imagens') || norm(svc.tags?.join(' ')).includes('images');
    if (filter === 'plans') return norm(svc.categoria).includes('plano') || norm(svc.tags?.join(' ')).includes('mensal') || norm(svc.tags?.join(' ')).includes('monthly');
    if (filter === 'web') return norm(`${svc.tituloVenda} ${svc.tags?.join(' ')}`).includes('website') || norm(`${svc.tituloVenda}`).includes('site') || norm(`${svc.tituloVenda}`).includes('landing');
    if (filter === 'char') return norm(svc.categoria).includes('person') || norm(`${svc.tituloVenda} ${svc.tags?.join(' ')}`).includes('mascot') || norm(`${svc.tituloVenda}`).includes('mascote');
    return true;
  };

  const filteredCategories = useMemo(() => {
    const cats = catalog.categorias.map((cat) => ({
      ...cat,
      servicos: cat.servicos.filter((s) => serviceMatches(s) && servicePassesFilter(s)),
    }));
    return cats.filter((c) => c.servicos.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog.categorias, search, filter]);

  const toggleCat = (name) => setOpenCats((p) => ({ ...p, [name]: !p[name] }));
  const isCatOpen = (name) => !!openCats[name];

  const toggleDetails = (id) => setOpenDetails((p) => ({ ...p, [id]: !p[id] }));
  const isDetailsOpen = (id) => !!openDetails[id];

  // Bundles for quick add
  const bundles = useMemo(() => buildBundles(catalog, { pt: lang === 'pt' }), [catalog, lang]);

  const bundlePrice = (items) => items.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const addBundle = (bundle) => {
    setSelected((prev) => {
      const next = { ...prev };
      bundle.items.forEach((svc) => {
        if (next[svc.id]) return;

        if (svc.hasPeriods && svc.periods?.length) {
          const best = [...svc.periods].sort((a, b) => Number(a.price) - Number(b.price))[0];
          next[svc.id] = {
            id: svc.id,
            categoria: svc.categoria,
            tituloVenda: svc.tituloVenda,
            price: Number(best.price) || svc.price,
            periodName: best.name || '',
          };
        } else {
          next[svc.id] = {
            id: svc.id,
            categoria: svc.categoria,
            tituloVenda: svc.tituloVenda,
            price: svc.price,
            periodName: '',
          };
        }
      });
      return next;
    });

    scrollToServices();
  };

  // Share link
  const shareUrl = useMemo(() => {
    const payload = {
      items: selectedList.map((it) => ({
        id: it.id,
        price: Number(it.price) || 0,
        periodName: it.periodName || '',
      })),
    };

    const encoded = b64UrlEncode(JSON.stringify(payload));
    if (!encoded) return window.location.href;

    const base = `${window.location.origin}${window.location.pathname}`;
    return `${base}?itens=${encoded}`;
  }, [selectedList]);

  const onCopyShare = async () => {
    setCopied(false);
    const ok = await safeCopy(shareUrl);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 1500);
  };

  // WhatsApp message
  const buildSummaryText = () => {
    const lines = [];
    lines.push(lang === 'en' ? 'Hello! I’d like a quote:' : 'Olá! Quero um orçamento:');
    lines.push('');

    selectedList
      .sort((a, b) => (a.categoria || '').localeCompare(b.categoria || ''))
      .forEach((it) => {
        const period = it.periodName ? ` (${it.periodName})` : '';
        lines.push(`• ${it.tituloVenda}${period} — ${fmt.format(Number(it.price) || 0)}`);
      });

    lines.push('');
    lines.push(`${copy.total}: ${fmt.format(subtotal)}`);

    if (wantsProposal) {
      lines.push('');
      lines.push(lang === 'en' ? 'I want a tailored proposal with bundle discounts.' : 'Quero uma proposta personalizada com desconto para combos.');
      if (lead.name) lines.push(`${copy.name}: ${lead.name}`);
      if (lead.whatsapp) lines.push(`${copy.whatsappField}: ${lead.whatsapp}`);
      if (lead.email) lines.push(`${copy.email}: ${lead.email}`);
      if (lead.message) lines.push(`${copy.message}: ${lead.message}`);
    }

    return lines.join('\n');
  };

  const goWhatsApp = () => {
    const url = buildWhatsAppUrl(buildSummaryText());
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sendProposal = () => {
    if (!selectedList.length) return;
    goWhatsApp();
  };

  // ===== quiz handlers =====
  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({ goal: '', channel: '', deadline: '', budget: '' });
    setQuizResult(null);
  };

  const setQuizAnswer = (stepId, value) => {
    setQuizAnswers((p) => ({ ...p, [stepId]: value }));
  };

  const canGoNext = () => {
    const step = steps[quizStep];
    if (!step) return false;
    return !!quizAnswers[step.id];
  };

  const onQuizNext = () => {
    if (!canGoNext()) return;
    if (quizStep < steps.length - 1) setQuizStep((s) => s + 1);
  };

  const onQuizBack = () => setQuizStep((s) => Math.max(0, s - 1));

  const onQuizFinish = () => {
    const rec = buildRecommendation(catalog, quizAnswers);
    setQuizResult(rec);
  };

  const applyRecommendation = () => {
    if (!quizResult?.length) return;

    setSelected((prev) => {
      const next = { ...prev };
      quizResult.forEach((svc) => {
        if (next[svc.id]) return;

        if (svc.hasPeriods && svc.periods?.length) {
          const best = [...svc.periods].sort((a, b) => Number(a.price) - Number(b.price))[0];
          next[svc.id] = {
            id: svc.id,
            categoria: svc.categoria,
            tituloVenda: svc.tituloVenda,
            price: Number(best.price) || svc.price,
            periodName: best.name || '',
          };
        } else {
          next[svc.id] = {
            id: svc.id,
            categoria: svc.categoria,
            tituloVenda: svc.tituloVenda,
            price: svc.price,
            periodName: '',
          };
        }
      });
      return next;
    });

    setShowQuiz(false);
    scrollToServices();
  };

  // ===== UI helpers =====
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
    // if selected with period override:
    const sel = selected[svc.id];
    const price = sel ? Number(sel.price) : Number(svc.price);

    // show “old” and “off” when present (for base) or for selected period (if it has one)
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
              {lang === 'en' ? 'Added' : 'Adicionado'}
            </Badge>
          ) : (
            <Badge bg="secondary" className="orc-badge">
              <FontAwesomeIcon icon={faCircleXmark} className="me-1" />
              {lang === 'en' ? 'Not selected' : 'Não selecionado'}
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
                        {p.old ? <div className="orc-muted" style={{ textDecoration: 'line-through' }}>{fmt.format(Number(p.old) || 0)}</div> : null}
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
                  <div className="orc-muted">{lang === 'en' ? 'Included items will be defined in the proposal.' : 'Itens inclusos serão definidos na proposta.'}</div>
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
                  <div className="orc-muted">{lang === 'en' ? 'Benefits depend on your goal and scope.' : 'Benefícios dependem do objetivo e do escopo.'}</div>
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
                  {copy.formats}: <strong>{svc.formato.slice(0, 2).join(' • ')}{svc.formato.length > 2 ? '…' : ''}</strong>
                </span>
              ) : null}
            </div>
          </div>
        </Collapse>
      </div>
    );
  };

  // default open categories (first render)
  useEffect(() => {
    if (Object.keys(openCats).length) return;
    const initial = {};
    catalog.categorias.forEach((c) => {
      initial[c.nome] = true;
    });
    setOpenCats(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog.categorias.length]);

  const selectedCount = selectedList.length;

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
                    <div className="orc-ctaTotal">{fmt.format(subtotal || 0)}</div>
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
                  <Button className="orc-btn orc-btn-primary" onClick={() => setShowQuiz(true)}>
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                    <span>{copy.ctaPrimary}</span>
                  </Button>

                  <Button className="orc-btn orc-btn-ghost" onClick={scrollToServices}>
                    <FontAwesomeIcon icon={faListCheck} />
                    <span>{copy.ctaSecondary}</span>
                  </Button>
                </div>

                <div className="orc-ctaLinks">
                  {/* External quiz: show ONCE, only here */}
                  <a className="orc-link" href={QUIZ_URL} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    <span>{copy.ctaExtQuiz}</span>
                  </a>

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

        {/* Combos (optional but premium) */}
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
                    <div className="orc-svc" style={{ marginTop: 0, cursor: 'default' }}>
                      <div className="orc-svcTop">
                        <div style={{ minWidth: 0 }}>
                          <h4 className="orc-svcTitle">{b.name}</h4>
                          <div className="orc-svcDesc" style={{ marginBottom: 8 }}>{b.hint}</div>
                          <div className="orc-muted" style={{ fontWeight: 900 }}>
                            {b.items.map((x) => x.tituloVenda).join(' + ')}
                          </div>
                        </div>

                        <div className="orc-svcPrice" style={{ minWidth: 0 }}>
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
                            <span>{isCatOpen(cat.nome) ? (lang === 'en' ? 'Hide' : 'Ocultar') : (lang === 'en' ? 'Show' : 'Mostrar')}</span>
                            <FontAwesomeIcon icon={isCatOpen(cat.nome) ? faChevronUp : faChevronDown} />
                          </div>
                        </button>

                        <Collapse in={isCatOpen(cat.nome)}>
                          <div>
                            {cat.servicos.map(renderService)}
                          </div>
                        </Collapse>
                      </div>
                    ))
                  ) : (
                    <Alert variant="light" className="mb-0">
                      {lang === 'en'
                        ? 'No services found. Try a different search.'
                        : 'Nenhum serviço encontrado. Tente outra busca.'}
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
                  <strong>{fmt.format(subtotal || 0)}</strong>
                </div>

                <div className="orc-asideLine">
                  <span>{copy.total}</span>
                  <strong>{fmt.format(subtotal || 0)}</strong>
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
                  <Button
                    className="orc-btn orc-btn-primary"
                    onClick={goWhatsApp}
                    disabled={!selectedCount}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>{copy.whatsapp}</span>
                  </Button>

                  <Button
                    className="orc-btn orc-btn-ghost"
                    onClick={() => setWantsProposal((v) => !v)}
                  >
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                    <span>{copy.proposal}</span>
                  </Button>
                </div>

                {selectedCount ? (
                  <div className="mt-3">
                    <div className="orc-detailsTitle mb-2">{lang === 'en' ? 'Selected items' : 'Itens selecionados'}</div>
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
                              <div style={{ fontWeight: 950, color: '#071a2d' }}>{it.tituloVenda}</div>
                              {it.periodName ? (
                                <div className="orc-muted" style={{ fontWeight: 900 }}>{it.periodName}</div>
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

                      <Button
                        className="orc-btn orc-btn-primary w-100 mt-2"
                        onClick={sendProposal}
                        disabled={!selectedCount}
                      >
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

        {/* QUIZ MODAL */}
        <Modal show={showQuiz} onHide={() => setShowQuiz(false)} centered dialogClassName="orc-modal" scrollable>
          <Modal.Header closeButton>
            <Modal.Title>{copy.quizTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="orc-muted" style={{ fontWeight: 900 }}>{copy.quizDesc}</p>

            {!quizResult ? (
              <>
                <ProgressBar
                  now={clamp(((quizStep + 1) / steps.length) * 100, 0, 100)}
                  style={{ height: 10, borderRadius: 999, background: 'rgba(2,8,23,0.06)' }}
                  className="mb-3"
                />

                <div style={{ fontWeight: 950, marginBottom: 10 }}>{steps[quizStep].title}</div>

                <div style={{ display: 'grid', gap: 10 }}>
                  {steps[quizStep].options.map((op) => {
                    const active = quizAnswers[steps[quizStep].id] === op.value;
                    return (
                      <button
                        key={op.value}
                        type="button"
                        className={`orc-filterChip ${active ? 'is-active' : ''}`}
                        onClick={() => setQuizAnswer(steps[quizStep].id, op.value)}
                        style={{ textAlign: 'left', borderRadius: 16, padding: '12px 14px' }}
                      >
                        {active ? <FontAwesomeIcon icon={faCircleCheck} className="me-2" /> : null}
                        <span style={{ fontWeight: 950 }}>{op.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="d-flex justify-content-between gap-2 mt-3">
                  <Button className="orc-btn orc-btn-ghost" onClick={onQuizBack} disabled={quizStep === 0}>
                    {copy.back}
                  </Button>

                  {quizStep < steps.length - 1 ? (
                    <Button className="orc-btn orc-btn-primary" onClick={onQuizNext} disabled={!canGoNext()}>
                      {copy.next}
                    </Button>
                  ) : (
                    <Button className="orc-btn orc-btn-primary" onClick={onQuizFinish} disabled={!canGoNext()}>
                      {copy.finish}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <Alert variant="light" className="mb-3">
                  <div style={{ fontWeight: 950, marginBottom: 6 }}>{copy.recTitle}</div>
                  <div className="orc-muted" style={{ fontWeight: 900 }}>{copy.recSub}</div>
                </Alert>

                <div style={{ display: 'grid', gap: 10 }}>
                  {quizResult.map((svc) => (
                    <div
                      key={svc.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 18,
                        border: '1px solid rgba(2,8,23,0.08)',
                        background: 'rgba(255,255,255,0.80)',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 950 }}>{svc.tituloVenda}</div>
                          <div className="orc-muted" style={{ fontWeight: 900 }}>{svc.categoria}</div>
                        </div>
                        <div style={{ fontWeight: 950 }}>{fmt.format(svc.price || 0)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert variant="light" className="mt-3 mb-0">
                  <div style={{ fontWeight: 950 }}>{copy.why}</div>
                  <div className="orc-muted" style={{ fontWeight: 900 }}>{copy.whySub}</div>
                </Alert>

                <div className="d-grid gap-2 mt-3">
                  <Button className="orc-btn orc-btn-primary" onClick={applyRecommendation}>
                    <FontAwesomeIcon icon={faCircleCheck} />
                    <span>{copy.apply}</span>
                  </Button>
                  <Button className="orc-btn orc-btn-ghost" onClick={resetQuiz}>
                    <span>{copy.restart}</span>
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className="orc-btn orc-btn-ghost" onClick={() => { setShowQuiz(false); }}>
              {copy.close}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* SHARE MODAL */}
        <Modal show={showShare} onHide={() => setShowShare(false)} centered dialogClassName="orc-modal" scrollable>
          <Modal.Header closeButton>
            <Modal.Title>{copy.shareTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="orc-muted" style={{ fontWeight: 900 }}>{copy.shareDesc}</p>

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
