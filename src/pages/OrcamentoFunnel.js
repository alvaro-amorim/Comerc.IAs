import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, ProgressBar, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faChevronLeft,
  faCircleCheck,
  faCircleXmark,
  faListCheck,
  faPaperPlane,
  faRotateRight,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';

import SEO from '../components/SEO';
import '../styles/OrcamentoPage.css';

import precosPT from '../data/precos.json';
import precosEN from '../data/precos_en.json';

const WHATSAPP_NUMBER = '5532991147944';
const isBrowser = typeof window !== 'undefined';

const norm = (s) =>
  (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const pickLang = (i18n) => ((i18n?.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt');
const getDataByLang = (lang) => (lang === 'en' ? precosEN : precosPT);

const money = (lang) =>
  new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });

const buildWhatsAppUrl = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const normalizeCatalog = (raw) => {
  const categorias = (raw?.orcamento?.categorias || []).map((cat) => {
    const categoriaNome = cat?.nome || 'Categoria';
    const categoriaNorm = norm(categoriaNome);

    const servicos = (cat?.servicos || []).map((svc) => {
      const titulo = svc?.titulo || '';
      const tituloVenda = svc?.titulo_venda || titulo || '';

      const id = svc?.id || `${categoriaNorm}__${norm(tituloVenda).replace(/[^a-z0-9]+/g, '-')}`;

      const inclui = Array.isArray(svc?.inclui) ? svc.inclui : [];
      const beneficios = Array.isArray(svc?.beneficios) ? svc.beneficios : [];
      const formato = Array.isArray(svc?.formato_entrega) ? svc.formato_entrega : [];
      const tags = Array.isArray(svc?.tags) ? svc.tags : [];

      const hasPeriods = Array.isArray(svc?.precos_por_periodo) && svc.precos_por_periodo.length > 0;

      const periods = hasPeriods
        ? svc.precos_por_periodo.map((p) => {
            const name = p?.periodo || '';
            const meses = Number(p?.meses || 0) || null;

            const monthly =
              Number(p?.preco_mensal_efetivo) ||
              Number(p?.preco) ||
              (Number(p?.preco_total_com_desc) && meses ? Number(p?.preco_total_com_desc) / meses : 0);

            const oldMonthly =
              Number(p?.preco_original) ||
              (Number(p?.preco_total_sem_desc) && meses ? Number(p?.preco_total_sem_desc) / meses : null);

            const off = p?.desconto_percentual ?? p?.desconto_perc ?? null;
            const termTotal = Number(p?.preco_total_com_desc) || null;

            return {
              name,
              price: Number.isFinite(monthly) ? monthly : 0,
              old: oldMonthly,
              off,
              meses,
              termTotal,
            };
          })
        : [];

      const defaultPeriod = hasPeriods
        ? periods.find((pp) => norm(pp.name).includes('mensal') || norm(pp.name).includes('monthly')) || periods[0] || null
        : null;

      const price = Number(svc?.preco) || Number(defaultPeriod?.price) || 0;
      const old = svc?.preco_original ?? defaultPeriod?.old ?? null;
      const off = svc?.desconto_percentual ?? (old && price ? Math.round((1 - price / old) * 100) : null);

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

        _categoriaNorm: categoriaNorm,
        _searchNorm: searchNorm,
        _titleNorm: norm(`${tituloVenda} ${titulo}`),
      };
    });

    return { nome: categoriaNome, _nomeNorm: categoriaNorm, servicos };
  });

  const all = categorias.flatMap((c) => c.servicos);
  const byId = all.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  return { categorias, all, byId, observacoes: raw?.orcamento?.observacoes || '' };
};

const COPY = {
  pt: {
    seoTitle: 'Orçamento (Funil) — Comerc IAs',
    seoDesc: 'Responda o quiz e receba 3 ofertas claras para finalizar no WhatsApp.',
    badge: 'Orçamento premium',
    title: 'Receba 3 ofertas claras em 45 segundos',
    subtitle:
      'Responda o quiz e veja 3 opções (essencial, custo-benefício e avançada). Depois é só finalizar pelo WhatsApp.',
    start: 'Começar agora',
    restart: 'Reiniciar',
    back: 'Voltar',
    next: 'Continuar',
    skip: 'Pular',
    optional: 'Opcional',
    chooseOne: 'Escolha 1 opção para continuar',
    offersTitle: 'Escolha sua oferta',
    offersSub: '3 opções claras e limpas. Você escolhe 1 e finaliza no WhatsApp.',
    essential: 'Essencial',
    bestValue: 'Custo-benefício',
    advanced: 'Avançada',
    bestSeller: 'MAIS VENDIDA',
    estTotal: 'Total estimado',
    save: 'Você economiza',
    details: 'Ver o que está incluso',
    choose: 'Escolher esta oferta',
    customizeTitle: 'Ajuste fino (opcional)',
    customizeSub: 'Opcional: adicione 1–2 extras relevantes (sem poluir a tela).',
    included: 'Incluso na oferta',
    extras: 'Extras sugeridos',
    note: 'Observações rápidas (opcional):',
    notePh: 'Ex.: Quero focar em promoções da semana, público X, referência de estilo…',
    sendWa: 'Enviar no WhatsApp',
    totalNow: 'Total agora',
    summary: 'Resumo do quiz',
    obs: 'Observação',
    // Questions
    q_goal: 'Qual é o seu objetivo principal?',
    q_need: 'O que você precisa agora?',
    q_volume: 'Qual volume você imagina?',
    q_invest: 'Investimento desejado',
    q_deadline: 'Prazo desejado',
    // Options
    goal_sales: 'Gerar vendas / conversão',
    goal_brand: 'Fortalecer marca / identidade',
    goal_social: 'Conteúdo para redes sociais',
    goal_edu: 'Educativo / explicativo',
    goal_intl: 'Internacionalizar (idiomas)',
    goal_launch: 'Lançamento / campanha',
    need_images: 'Artes e imagens',
    need_videos: 'Vídeos (Reels/Ads)',
    need_plan: 'Plano mensal de conteúdo',
    need_oneoff: 'Serviços avulsos (logo, site, etc.)',
    need_mascot: 'Personagem / mascote',
    need_unsure: 'Não tenho certeza',
    vol_low: 'Baixo (rápido / essencial)',
    vol_mid: 'Médio (consistente)',
    vol_high: 'Alto (campanha forte)',
    vol_mega: 'Muito alto (máxima presença)',
    inv_100: 'Até R$100',
    inv_300: 'Até R$300',
    inv_600: 'Até R$600',
    inv_1000: 'Até R$1.000',
    inv_2000: 'Até R$2.000',
    d1: 'Urgente (até 2 dias)',
    d2: 'Até 7 dias',
    d3: 'Flexível',
  },
  en: {
    seoTitle: 'Quote Funnel — Comerc IAs',
    seoDesc: 'Answer the quiz and get 3 clear offers to finish on WhatsApp.',
    badge: 'Premium quote',
    title: 'Get 3 clear offers in 45 seconds',
    subtitle:
      'Answer the quiz and see 3 options (simple, best value, advanced). Then finish via WhatsApp.',
    start: 'Start now',
    restart: 'Restart',
    back: 'Back',
    next: 'Continue',
    skip: 'Skip',
    optional: 'Optional',
    chooseOne: 'Choose 1 option to continue',
    offersTitle: 'Choose your offer',
    offersSub: '3 clean options. Pick one and finish on WhatsApp.',
    essential: 'Simple',
    bestValue: 'Best value',
    advanced: 'Advanced',
    bestSeller: 'BEST SELLER',
    estTotal: 'Estimated total',
    save: 'You save',
    details: 'See what’s included',
    choose: 'Choose this offer',
    customizeTitle: 'Fine-tune (optional)',
    customizeSub: 'Optional: add 1–2 relevant add-ons (kept minimal).',
    included: 'Included in the offer',
    extras: 'Suggested add-ons',
    note: 'Quick notes (optional):',
    notePh: 'E.g., weekly promos, audience X, style reference…',
    sendWa: 'Send on WhatsApp',
    totalNow: 'Total now',
    summary: 'Quiz summary',
    obs: 'Note',
    // Questions
    q_goal: 'What’s your main goal?',
    q_need: 'What do you need right now?',
    q_volume: 'What volume are you aiming for?',
    q_invest: 'Desired budget',
    q_deadline: 'Desired timeline',
    // Options
    goal_sales: 'Sales / conversion',
    goal_brand: 'Brand / identity',
    goal_social: 'Social media content',
    goal_edu: 'Educational / explanatory',
    goal_intl: 'Go international (languages)',
    goal_launch: 'Launch / campaign',
    need_images: 'Designs & images',
    need_videos: 'Videos (Reels/Ads)',
    need_plan: 'Monthly content plan',
    need_oneoff: 'One-off services (logo, website, etc.)',
    need_mascot: 'Character / mascot',
    need_unsure: 'Not sure yet',
    vol_low: 'Low (fast / essential)',
    vol_mid: 'Medium (consistent)',
    vol_high: 'High (strong campaign)',
    vol_mega: 'Very high (maximum presence)',
    inv_100: 'Up to R$100',
    inv_300: 'Up to R$300',
    inv_600: 'Up to R$600',
    inv_1000: 'Up to R$1,000',
    inv_2000: 'Up to R$2,000',
    d1: 'Urgent (up to 2 days)',
    d2: 'Up to 7 days',
    d3: 'Flexible',
  },
};

const isPlan = (s) => !!s?.hasPeriods;

const findService = (catalog, { catIncludes = [], titleIncludes = [], titleAny = [] }) => {
  const catNeed = catIncludes.map(norm);
  const titleNeed = titleIncludes.map(norm);
  const titleAnyNeed = titleAny.map(norm);

  for (const cat of catalog.categorias) {
    const cn = norm(cat.nome);
    if (catNeed.length && !catNeed.some((x) => cn.includes(x))) continue;

    for (const s of cat.servicos) {
      const tn = norm(s.tituloVenda || s.titulo);
      if (titleNeed.length && !titleNeed.every((x) => tn.includes(x))) continue;
      if (titleAnyNeed.length && !titleAnyNeed.some((x) => tn.includes(x))) continue;
      return s;
    }
  }
  return null;
};

const uniquePush = (arr, svc) => {
  if (!svc) return;
  if (arr.find((x) => x.id === svc.id)) return;
  arr.push(svc);
};

const anchorByVolume = (vol) => {
  if (vol === 'low') return 300;
  if (vol === 'mid') return 600;
  if (vol === 'high') return 1000;
  return 2000;
};

const calcTotals = (items, discountPerc, periodById) => {
  let subtotal = 0;
  let originalSubtotal = 0;

  const lines = items.map((s) => {
    if (isPlan(s)) {
      const period = periodById.get(s.id) || (s.periods?.[0]?.name || '');
      const p = s.periods.find((pp) => norm(pp.name) === norm(period)) || s.periods[0];
      const monthly = Number(p?.price || 0);
      const oldMonthly = Number(p?.old || monthly);

      subtotal += monthly;
      originalSubtotal += oldMonthly;

      return { svc: s, kind: 'plan', period: p?.name || period, monthly, oldMonthly };
    }

    const price = Number(s.price || 0);
    const old = Number(s.old || price);

    subtotal += price;
    originalSubtotal += old;

    return { svc: s, kind: 'oneoff', price, old };
  });

  const discount = Math.round(subtotal * (discountPerc / 100));
  const total = subtotal - discount;

  const instantSave = Math.max(0, Math.round(originalSubtotal - subtotal));
  const totalSave = instantSave + discount;

  return { lines, subtotal, originalSubtotal, discount, total, totalSave };
};

const pickCore = (catalog, answers, tier) => {
  const pick = (a, b, c) => (tier === 'simple' ? a : tier === 'value' ? b : c);

  const need = answers.need;
  const vol = answers.volume;
  const goal = answers.goal;

  // Images packs
  if (need === 'images') {
    const low = findService(catalog, { catIncludes: ['imagens', 'images'], titleAny: ['5'] });
    const mid = findService(catalog, { catIncludes: ['imagens', 'images'], titleAny: ['10'] });
    const high = findService(catalog, { catIncludes: ['imagens', 'images'], titleAny: ['15'] });

    if (vol === 'high' || vol === 'mega') return pick(mid, high, high);
    return pick(low, mid, high);
  }

  // Videos
  if (need === 'videos') {
    const s15 = findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['15'] });
    const s30 = findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['30'] });
    const s60 = findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['60'] });
    const s120 = findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['120'] });

    if (vol === 'mega') return pick(s30, s60, s120);
    if (vol === 'high') return pick(s15, s30, s60);
    return pick(s15, s30, s60);
  }

  // Plans
  if (need === 'plan') {
    const basic = findService(catalog, { catIncludes: ['plano', 'plan'], titleAny: ['básico', 'basic'] });
    const standard = findService(catalog, { catIncludes: ['plano', 'plan'], titleAny: ['standart', 'standard'] });
    const premium = findService(catalog, { catIncludes: ['plano', 'plan'], titleAny: ['premium'] });
    return pick(basic, standard, premium);
  }

  // Mascot
  if (need === 'mascot') {
    const ill = findService(catalog, { catIncludes: ['personagem', 'mascot', 'character'], titleAny: ['ilustr', 'illustr'] });
    const anim30 = findService(catalog, { catIncludes: ['personagem', 'mascot', 'character'], titleAny: ['30'] });
    const anim60 = findService(catalog, { catIncludes: ['personagem', 'mascot', 'character'], titleAny: ['1', '60', 'cinem'] });

    if (goal === 'launch' || vol === 'mega') return pick(ill, anim30, anim60);
    return pick(ill, anim30, anim60);
  }

  // One-off / unsure: choose by goal
  if (goal === 'brand') {
    const logo = findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['logo', 'identidade'] });
    const site = findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['website', 'site'] });
    return pick(logo, site, site);
  }

  if (goal === 'sales') {
    const poster = findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['poster', 'cartaz'] });
    const shooting = findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['shoot', 'ensaio'] });
    return pick(poster, shooting, shooting);
  }

  if (goal === 'intl') {
    const dub = findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['dubl', 'dub'] });
    return pick(dub, dub, dub);
  }

  if (goal === 'edu') {
    const voice = findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['voz', 'voice'] });
    return pick(voice, voice, voice);
  }

  if (goal === 'launch') {
    const poster = findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['poster', 'cartaz'] });
    const s30 = findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['30'] });
    const s60 = findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['60'] });
    return pick(poster, s30, s60);
  }

  // fallback
  const poster = findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['poster', 'cartaz'] });
  const midImg = findService(catalog, { catIncludes: ['imagens', 'images'], titleAny: ['10'] });
  const s60 = findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['60'] });
  return pick(poster, midImg, s60);
};

const suggestExtras = (catalog, answers, tier, core) => {
  const maxExtras = tier === 'simple' ? 1 : 2;
  const extras = [];
  const goal = answers.goal;
  const need = answers.need;

  const add = (svc) => uniquePush(extras, svc);

  // Cross-sell: video + images
  if (core && norm(core.categoria).includes('vídeo') || norm(core.categoria).includes('video')) {
    add(findService(catalog, { catIncludes: ['imagens', 'images'], titleAny: ['10'] }));
  }
  if (core && (norm(core.categoria).includes('imagens') || norm(core.categoria).includes('images'))) {
    add(findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['30'] }));
  }

  if (goal === 'sales' || goal === 'launch') {
    add(findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['poster', 'cartaz'] }));
    if (tier !== 'simple') add(findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['shoot', 'ensaio'] }));
  }
  if (goal === 'brand') {
    add(findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['logo', 'identidade'] }));
    if (tier !== 'simple') add(findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['website', 'site'] }));
  }
  if (goal === 'edu') {
    add(findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['voz', 'voice'] }));
  }
  if (goal === 'intl') {
    add(findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['dubl', 'dub'] }));
  }

  if (need === 'plan' && tier === 'advanced') {
    add(findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['30'] }));
  }

  const filtered = extras.filter((x) => x && (!core || x.id !== core.id));
  return filtered.slice(0, maxExtras);
};

const buildOffers = (catalog, answers) => {
  const anchor = typeof answers.invest === 'number' ? answers.invest : anchorByVolume(answers.volume || 'mid');

  const discounts = { simple: 0, value: 10, advanced: 12 };
  const periodByTier = { simple: ['Mensal', 'Monthly'], value: ['Trimestral', 'Quarterly'], advanced: ['Semestral', 'Semiannual'] };

  const pickPeriodName = (svc, preferList) => {
    if (!isPlan(svc)) return '';
    const candidates = preferList.map(norm);
    const match = svc.periods.find((p) => candidates.some((c) => norm(p.name).includes(c)));
    return match?.name || svc.periods[0]?.name || '';
  };

  const buildTier = (tier) => {
    const core = pickCore(catalog, answers, tier);
    const items = [];
    uniquePush(items, core);
    suggestExtras(catalog, answers, tier, core).forEach((x) => uniquePush(items, x));

    const periodById = new Map();
    items.forEach((s) => {
      if (isPlan(s)) periodById.set(s.id, pickPeriodName(s, periodByTier[tier] || ['Mensal', 'Monthly']));
    });

    let totals = calcTotals(items, discounts[tier] || 0, periodById);

    // soft target to keep offers balanced
    const target = tier === 'simple' ? anchor * 0.75 : tier === 'value' ? anchor * 1.0 : anchor * 1.45;
    if (tier !== 'simple' && totals.total > target * 1.35 && items.length > 1) {
      items.pop();
      totals = calcTotals(items, discounts[tier] || 0, periodById);
    }

    return { tier, items, periodById, discountPerc: discounts[tier] || 0, ...totals };
  };

  return [buildTier('simple'), buildTier('value'), buildTier('advanced')];
};

export default function OrcamentoFunnel() {
  const { i18n } = useTranslation();
  const lang = pickLang(i18n);
  const copy = COPY[lang];
  const fmt = useMemo(() => money(lang), [lang]);

  const catalog = useMemo(() => normalizeCatalog(getDataByLang(lang)), [lang]);

  const [view, setView] = useState('intro'); // intro | quiz | offers | customize
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    goal: null,
    need: null,
    volume: null,
    invest: null,
    deadline: null,
  });

  const [chosenTier, setChosenTier] = useState('value');
  const [selectedExtras, setSelectedExtras] = useState(new Set());
  const [note, setNote] = useState('');

  const offers = useMemo(() => {
    if (view === 'intro') return null;
    if (!answers.goal || !answers.need || !answers.volume) return null;
    return buildOffers(catalog, answers);
  }, [catalog, answers, view]);

  const chosenOffer = useMemo(() => {
    if (!offers) return null;
    return offers.find((o) => o.tier === chosenTier) || offers[1] || null;
  }, [offers, chosenTier]);

  const steps = useMemo(() => {
    return [
      {
        id: 'goal',
        title: copy.q_goal,
        optional: false,
        options: [
          { v: 'sales', label: copy.goal_sales },
          { v: 'brand', label: copy.goal_brand },
          { v: 'social', label: copy.goal_social },
          { v: 'edu', label: copy.goal_edu },
          { v: 'intl', label: copy.goal_intl },
          { v: 'launch', label: copy.goal_launch },
        ],
      },
      {
        id: 'need',
        title: copy.q_need,
        optional: false,
        options: [
          { v: 'images', label: copy.need_images },
          { v: 'videos', label: copy.need_videos },
          { v: 'plan', label: copy.need_plan },
          { v: 'oneoff', label: copy.need_oneoff },
          { v: 'mascot', label: copy.need_mascot },
          { v: 'unsure', label: copy.need_unsure },
        ],
      },
      {
        id: 'volume',
        title: copy.q_volume,
        optional: false,
        options: [
          { v: 'low', label: copy.vol_low },
          { v: 'mid', label: copy.vol_mid },
          { v: 'high', label: copy.vol_high },
          { v: 'mega', label: copy.vol_mega },
        ],
      },
      {
        id: 'invest',
        title: copy.q_invest,
        optional: true,
        options: [
          { v: 100, label: copy.inv_100 },
          { v: 300, label: copy.inv_300 },
          { v: 600, label: copy.inv_600 },
          { v: 1000, label: copy.inv_1000 },
          { v: 2000, label: copy.inv_2000 },
        ],
      },
      {
        id: 'deadline',
        title: copy.q_deadline,
        optional: true,
        options: [
          { v: 'urgent', label: copy.d1 },
          { v: 'week', label: copy.d2 },
          { v: 'flex', label: copy.d3 },
        ],
      },
    ];
  }, [copy]);

  const progressPct = useMemo(() => {
    const total = steps.length + 2; // offers + customize
    const done =
      view === 'intro' ? 0 : view === 'quiz' ? stepIndex : view === 'offers' ? steps.length : steps.length + 1;
    return Math.round((done / total) * 100);
  }, [stepIndex, steps.length, view]);

  const resetAll = useCallback(() => {
    setView('intro');
    setStepIndex(0);
    setAnswers({ goal: null, need: null, volume: null, invest: null, deadline: null });
    setChosenTier('value');
    setSelectedExtras(new Set());
    setNote('');
  }, []);

  const goStart = useCallback(() => {
    setView('quiz');
    setStepIndex(0);
  }, []);

  const setAnswer = useCallback((id, v) => {
    setAnswers((p) => ({ ...p, [id]: v }));
  }, []);

  const goNext = useCallback(() => {
    const cur = steps[stepIndex];
    if (!cur) return;

    if (!cur.optional && (answers[cur.id] === null || typeof answers[cur.id] === 'undefined')) return;

    if (stepIndex >= steps.length - 1) {
      setView('offers');
      return;
    }
    setStepIndex((s) => Math.min(steps.length - 1, s + 1));
  }, [answers, stepIndex, steps]);

  const goBack = useCallback(() => {
    if (view === 'quiz') setStepIndex((s) => Math.max(0, s - 1));
    if (view === 'offers') setView('quiz');
    if (view === 'customize') setView('offers');
  }, [view]);

  const skipStep = useCallback(() => {
    const cur = steps[stepIndex];
    if (!cur?.optional) return;
    setAnswers((p) => ({ ...p, [cur.id]: null }));
    goNext();
  }, [goNext, stepIndex, steps]);

  const openCustomize = useCallback(
    (tier) => {
      setChosenTier(tier);
      setSelectedExtras(new Set());
      setView('customize');
    },
    []
  );

  const extrasPool = useMemo(() => {
    if (!chosenOffer) return [];
    // Reuse suggestion logic but allow up to 6 extra options
    const core = chosenOffer.items[0] || null;
    const base = suggestExtras(catalog, answers, chosenOffer.tier, core);

    // Expand pool with common add-ons (safe duplicates are removed by uniquePush)
    const pool = [];
    base.forEach((x) => uniquePush(pool, x));
    uniquePush(pool, findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['poster', 'cartaz'] }));
    uniquePush(pool, findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['logo', 'identidade'] }));
    uniquePush(pool, findService(catalog, { catIncludes: ['serviços', 'services', 'avuls'], titleAny: ['website', 'site'] }));
    uniquePush(pool, findService(catalog, { catIncludes: ['vídeos', 'videos', 'video'], titleAny: ['30'] }));
    uniquePush(pool, findService(catalog, { catIncludes: ['imagens', 'images'], titleAny: ['10'] }));

    // Remove already included
    const includedIds = new Set((chosenOffer.items || []).map((s) => s.id));
    return pool.filter((s) => s && !includedIds.has(s.id)).slice(0, 6);
  }, [catalog, answers, chosenOffer]);

  const totals = useMemo(() => {
    if (!chosenOffer) return null;

    const items = [...chosenOffer.items];
    selectedExtras.forEach((id) => {
      const svc = catalog.byId[id];
      if (svc) uniquePush(items, svc);
    });

    return calcTotals(items, chosenOffer.discountPerc || 0, chosenOffer.periodById || new Map());
  }, [catalog.byId, chosenOffer, selectedExtras]);

  const offerTitle = useCallback(
    (tier) => (tier === 'simple' ? copy.essential : tier === 'value' ? copy.bestValue : copy.advanced),
    [copy]
  );

  const buildWhatsAppMessage = useCallback(() => {
    if (!chosenOffer || !totals) return '';

    const lines = [];
    lines.push(lang === 'en' ? 'Hi! I want a quote with Comerc IAs.' : 'Olá! Quero um orçamento com a Comerc IAs.');
    lines.push('');
    lines.push((lang === 'en' ? 'Chosen offer: ' : 'Oferta escolhida: ') + offerTitle(chosenOffer.tier));
    lines.push('');

    lines.push(lang === 'en' ? 'Quiz summary:' : 'Resumo do quiz:');
    lines.push(`- ${copy.q_goal} ${answers.goal || '-'}`);
    lines.push(`- ${copy.q_need} ${answers.need || '-'}`);
    lines.push(`- ${copy.q_volume} ${answers.volume || '-'}`);
    lines.push(`- ${copy.q_invest} ${answers.invest ?? '—'}`);
    lines.push(`- ${copy.q_deadline} ${answers.deadline ?? '—'}`);
    lines.push('');

    lines.push(lang === 'en' ? 'Included services:' : 'Serviços incluídos:');
    totals.lines.forEach((x) => {
      if (x.kind === 'plan') {
        lines.push(`- ${x.svc.tituloVenda} — ${fmt.format(x.monthly)}/mês (${x.period})`);
      } else {
        lines.push(`- ${x.svc.tituloVenda} — ${fmt.format(x.price)}`);
      }
    });

    lines.push('');
    lines.push((lang === 'en' ? 'Estimated total: ' : 'Total estimado: ') + fmt.format(totals.total));
    if (totals.totalSave) {
      lines.push((lang === 'en' ? 'Estimated savings: ' : 'Economia estimada: ') + fmt.format(totals.totalSave));
    }

    if (note && note.trim()) {
      lines.push('');
      lines.push(lang === 'en' ? 'Notes:' : 'Observações:');
      lines.push(note.trim());
    }

    lines.push('');
    lines.push(lang === 'en' ? 'Can you confirm availability and next steps?' : 'Pode me confirmar disponibilidade e próximos passos?');

    return lines.join('\n');
  }, [answers, chosenOffer, copy, fmt, lang, note, offerTitle, totals]);

  const sendWhatsApp = useCallback(() => {
    const msg = buildWhatsAppMessage();
    if (!msg || !isBrowser) return;
    window.open(buildWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
  }, [buildWhatsAppMessage]);

  const anchorRef = useRef(null);
  useEffect(() => {
    if (!isBrowser) return;
    try {
      anchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      // ignore
    }
  }, [view]);

  const currentStep = steps[stepIndex];

  return (
    <div className="orcamento-page">
      <SEO title={copy.seoTitle} description={copy.seoDesc} />

      <Container className="orc-wrap">
        <div className="orc-hero">
          <div className="orc-hero-grid">
            <div>
              <div className="orc-hero-badge">
                <FontAwesomeIcon icon={faBolt} />
                <span>{copy.badge}</span>
              </div>

              <h1 className="orc-hero-title">{copy.title}</h1>
              <p className="orc-hero-subtitle">{copy.subtitle}</p>

              <div className="orc-hero-note">
                {copy.obs}: {catalog.observacoes}
              </div>
            </div>

            <div>
              <div className="orc-ctaCard">
                <div className="orc-ctaTop">
                  <div>
                    <div className="orc-ctaTotalLabel">{copy.totalNow}</div>
                    <div className="orc-ctaTotal">{totals ? fmt.format(totals.total) : fmt.format(0)}</div>
                  </div>
                  <div className="orc-ctaMeta">
                    <span className="orc-chip">
                      <FontAwesomeIcon icon={faListCheck} />
                      <span>{Math.max(0, progressPct)}%</span>
                    </span>
                  </div>
                </div>

                <div className="orc-ctaButtons">
                  {view === 'intro' ? (
                    <>
                      <Button className="orc-btn orc-btn-primary" onClick={goStart}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} />
                        <span>{copy.start}</span>
                      </Button>
                      <Button className="orc-btn orc-btn-ghost" onClick={resetAll}>
                        <FontAwesomeIcon icon={faRotateRight} />
                        <span>{copy.restart}</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="orc-btn orc-btn-ghost" onClick={goBack} disabled={view === 'quiz' && stepIndex === 0}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span>{copy.back}</span>
                      </Button>
                      <Button className="orc-btn orc-btn-primary" onClick={resetAll}>
                        <FontAwesomeIcon icon={faRotateRight} />
                        <span>{copy.restart}</span>
                      </Button>
                    </>
                  )}
                </div>

                <div className="mt-3">
                  <ProgressBar
                    now={progressPct}
                    style={{ height: 10, borderRadius: 999, background: 'rgba(2,8,23,0.06)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={anchorRef} />

        <Row className="g-3 mt-3">
          <Col lg={12}>
            <Card className="orc-card">
              <Card.Body className="orc-card-body">
                {view === 'intro' ? (
                  <div className="text-center">
                    <div className="orc-card-head" style={{ justifyContent: 'center' }}>
                      <div className="orc-step">★</div>
                      <div>
                        <h2 className="orc-card-title">{copy.title}</h2>
                        <p className="orc-card-subtitle">{copy.subtitle}</p>
                      </div>
                    </div>

                    <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
                      <Button className="orc-btn orc-btn-primary" onClick={goStart}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} />
                        <span>{copy.start}</span>
                      </Button>
                      <Button className="orc-btn orc-btn-ghost" onClick={resetAll}>
                        <FontAwesomeIcon icon={faRotateRight} />
                        <span>{copy.restart}</span>
                      </Button>
                    </div>
                  </div>
                ) : null}

                {view === 'quiz' && currentStep ? (
                  <>
                    <div className="orc-card-head">
                      <div className="orc-step">{stepIndex + 1}</div>
                      <div style={{ minWidth: 0 }}>
                        <h2 className="orc-card-title">{currentStep.title}</h2>
                        <p className="orc-card-subtitle">{copy.chooseOne}</p>
                      </div>
                      {currentStep.optional ? (
                        <Badge bg="secondary" className="orc-badge">
                          {copy.optional}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="mt-3" style={{ display: 'grid', gap: 10 }}>
                      {currentStep.options.map((op) => {
                        const active = String(answers[currentStep.id]) === String(op.v);
                        return (
                          <button
                            key={String(op.v)}
                            type="button"
                            className={`orc-filterChip ${active ? 'is-active' : ''}`}
                            style={{ textAlign: 'left', borderRadius: 16, padding: '12px 14px' }}
                            onClick={() => setAnswer(currentStep.id, op.v)}
                          >
                            {active ? <FontAwesomeIcon icon={faCircleCheck} className="me-2" /> : null}
                            <span style={{ fontWeight: 950 }}>{op.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="d-flex justify-content-between gap-2 mt-3 flex-wrap">
                      <Button className="orc-btn orc-btn-ghost" onClick={goBack} disabled={stepIndex === 0}>
                        {copy.back}
                      </Button>

                      <div className="d-flex gap-2">
                        {currentStep.optional ? (
                          <Button className="orc-btn orc-btn-ghost" onClick={skipStep}>
                            {copy.skip}
                          </Button>
                        ) : null}
                        <Button className="orc-btn orc-btn-primary" onClick={goNext}>
                          {copy.next}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : null}

                {view === 'offers' && offers ? (
                  <>
                    <div className="orc-card-head">
                      <div className="orc-step">✓</div>
                      <div style={{ minWidth: 0 }}>
                        <h2 className="orc-card-title">{copy.offersTitle}</h2>
                        <p className="orc-card-subtitle">{copy.offersSub}</p>
                      </div>
                    </div>

                    <Row className="g-3 mt-2">
                      {offers.map((of) => {
                        const best = of.tier === 'value';
                        return (
                          <Col key={of.tier} md={4}>
                            <div className={`orc-svcCard ${best ? 'is-selected' : ''}`} style={{ cursor: 'default' }}>
                              <div className="d-flex justify-content-between align-items-start gap-2">
                                <div style={{ minWidth: 0 }}>
                                  <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <div style={{ fontWeight: 950 }}>{offerTitle(of.tier)}</div>
                                    {best ? (
                                      <Badge bg="warning" text="dark" className="orc-badge">
                                        {copy.bestSeller}
                                      </Badge>
                                    ) : null}
                                  </div>
                                  <div className="orc-muted" style={{ fontWeight: 900 }}>{copy.estTotal}</div>
                                </div>
                                <div className="text-end">
                                  <div style={{ fontWeight: 950, fontSize: '1.35rem' }}>{fmt.format(of.total)}</div>
                                  <div className="orc-muted" style={{ fontWeight: 900 }}>
                                    {copy.save}: {of.totalSave ? fmt.format(of.totalSave) : '—'}
                                  </div>
                                </div>
                              </div>

                              <details className="mt-3">
                                <summary className="orc-miniLink" style={{ fontWeight: 950 }}>
                                  {copy.details}
                                </summary>
                                <div className="mt-2" style={{ display: 'grid', gap: 8 }}>
                                  {of.lines.map((x) => (
                                    <div key={x.svc.id} className="orc-pill" style={{ justifyContent: 'space-between' }}>
                                      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {x.svc.tituloVenda}
                                      </span>
                                      <span style={{ fontWeight: 950 }}>
                                        {x.kind === 'plan' ? `${fmt.format(x.monthly)}/m` : fmt.format(x.price)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </details>

                              <div className="mt-3 d-grid">
                                <Button className={`orc-btn ${best ? 'orc-btn-primary' : 'orc-btn-ghost'}`} onClick={() => openCustomize(of.tier)}>
                                  <FontAwesomeIcon icon={faCircleCheck} />
                                  <span>{copy.choose}</span>
                                </Button>
                              </div>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </>
                ) : null}

                {view === 'customize' && chosenOffer && totals ? (
                  <>
                    <div className="orc-card-head">
                      <div className="orc-step">✓</div>
                      <div style={{ minWidth: 0 }}>
                        <h2 className="orc-card-title">{copy.customizeTitle}</h2>
                        <p className="orc-card-subtitle">{copy.customizeSub}</p>
                      </div>
                      <div className="text-end">
                        <div className="orc-muted" style={{ fontWeight: 900 }}>{copy.estTotal}</div>
                        <div style={{ fontWeight: 950, fontSize: '1.35rem' }}>{fmt.format(totals.total)}</div>
                      </div>
                    </div>

                    <Row className="g-3 mt-2">
                      <Col lg={6}>
                        <div className="orc-detailsTitle">{copy.included}</div>
                        <div className="mt-2" style={{ display: 'grid', gap: 10 }}>
                          {chosenOffer.lines.map((x) => (
                            <div key={x.svc.id} className="orc-svcCard" style={{ cursor: 'default' }}>
                              <div className="d-flex justify-content-between align-items-start gap-2">
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontWeight: 950 }}>{x.svc.tituloVenda}</div>
                                  <div className="orc-muted" style={{ fontWeight: 900 }}>{x.svc.categoria}</div>
                                  {x.kind === 'plan' ? (
                                    <div className="orc-muted" style={{ fontWeight: 900 }}>{x.period}</div>
                                  ) : null}
                                </div>
                                <div style={{ fontWeight: 950 }}>
                                  {x.kind === 'plan' ? `${fmt.format(x.monthly)}/mês` : fmt.format(x.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <div className="orc-detailsTitle">{copy.extras}</div>
                          <Badge bg="secondary" className="orc-badge">
                            {copy.optional}
                          </Badge>
                        </div>

                        <div className="mt-2" style={{ display: 'grid', gap: 10 }}>
                          {extrasPool.length ? (
                            extrasPool.map((s) => {
                              const checked = selectedExtras.has(s.id);
                              return (
                                <label key={s.id} className="orc-svcCard" style={{ cursor: 'pointer' }}>
                                  <div className="d-flex align-items-start gap-3">
                                    <Form.Check
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        setSelectedExtras((prev) => {
                                          const next = new Set(prev);
                                          if (next.has(s.id)) next.delete(s.id);
                                          else next.add(s.id);
                                          return next;
                                        });
                                      }}
                                    />
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                      <div className="d-flex justify-content-between align-items-start gap-2">
                                        <div style={{ minWidth: 0 }}>
                                          <div style={{ fontWeight: 950 }}>{s.tituloVenda}</div>
                                          <div className="orc-muted orc-clamp2" style={{ fontWeight: 900 }}>{s.descricao}</div>
                                        </div>
                                        <div style={{ fontWeight: 950 }}>{isPlan(s) ? `${fmt.format(s.price)}/m` : fmt.format(s.price)}</div>
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              );
                            })
                          ) : (
                            <Alert variant="light" className="mb-0">
                              {lang === 'en' ? 'No suggested add-ons.' : 'Sem extras sugeridos.'}
                            </Alert>
                          )}
                        </div>

                        <div className="mt-3">
                          <div className="orc-detailsTitle">{copy.note}</div>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={copy.notePh}
                            className="mt-2"
                          />
                        </div>

                        <div className="d-grid gap-2 mt-3">
                          <Button className="orc-btn orc-btn-primary" onClick={sendWhatsApp}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                            <span>{copy.sendWa}</span>
                          </Button>
                          <Button className="orc-btn orc-btn-ghost" onClick={goBack}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <span>{copy.back}</span>
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}