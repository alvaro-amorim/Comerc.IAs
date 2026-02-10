import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import '../styles/PortfolioPage.css';

// Imagens reais
import tumbMarcos from '../assets/images/tumb.marcos.png';
import blueMarine from '../assets/images/blue.marine.png';
import fotoTom from '../assets/images/foto.tom.png';
import fotoComerc from '../assets/images/foto.comerc.jpg';
import promoComerc from '../assets/images/promoComerc.png';

function withYoutubeParams(url) {
  if (!url) return url;
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}rel=0&modestbranding=1&playsinline=1`;
}

const SORT = {
  RECENT: 'recent',
  AZ: 'az',
  ZA: 'za',
  TAG: 'tag',
};

const PortfolioPage = () => {
  const { t, i18n } = useTranslation();

  const currentLang = useMemo(() => {
    const l = (i18n.language || 'pt').toLowerCase();
    return l.startsWith('en') ? 'en' : 'pt';
  }, [i18n.language]);

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [sortKey, setSortKey] = useState(SORT.RECENT);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const inventedCopy = useMemo(() => {
    const pt = {
      items: [
        {
          id: 'case-novae',
          title: 'Novae Skincare — Reels de lançamento',
          description:
            'Conceito focado em “desejo + prova rápida”. Abertura com gancho visual (macro textura), sequência de benefícios em 3 cortes e final com CTA direto para WhatsApp.',
          tags: ['Beleza', 'Reels', 'Conversão'],
        },
        {
          id: 'case-aurora',
          title: 'Aurora Clínica — Campanha de agendamentos',
          description:
            'Criativos com linguagem premium e estrutura de performance: dor real → autoridade → oferta → CTA. Versões para story e feed com variações de copy.',
          tags: ['Saúde', 'Performance', 'Anúncio'],
        },
        {
          id: 'case-ironpeak',
          title: 'IronPeak Gym — Série semanal “Antes/Depois”',
          description:
            'Formato recorrente com identidade fixa, ritmo rápido e trilha moderna. Série pensada para criar hábito: sempre o mesmo padrão visual, sempre um micro-gancho.',
          tags: ['Fitness', 'Conteúdo', 'Série'],
        },
        {
          id: 'case-skyline',
          title: 'Skyline Imóveis — VSL curta para leads',
          description:
            'VSL enxuta com narrativa de valor: cenário + diferenciais + prova social + urgência. Ideal para campanhas de captação e remarketing.',
          tags: ['Imobiliário', 'VSL', 'Leads'],
        },
        {
          id: 'case-moonbrew',
          title: 'MoonBrew Café — Promo sazonal',
          description:
            'Vídeo de oferta com “cara de marca grande”: transições limpas, tipografia forte e destaque visual do produto. Final com CTA para pedido rápido.',
          tags: ['Gastronomia', 'Promo', 'Oferta'],
        },
        {
          id: 'case-zenith',
          title: 'Zenith Tech — Vídeo de produto (app)',
          description:
            'Motion minimalista com telas do app, foco em clareza e confiança. Sequência: problema → solução → “como funciona” → CTA para demo.',
          tags: ['Tecnologia', 'Motion', 'Produto'],
        },
        {
          id: 'case-velvet',
          title: 'Velvet Boutique — Editorial vertical',
          description:
            'Conteúdo premium para posicionamento: estética, iluminação e cortes suaves. Ideal para elevar valor percebido e gerar desejo.',
          tags: ['Moda', 'Branding', 'Social'],
        },
        {
          id: 'case-atlas',
          title: 'Atlas Consultoria — Institucional moderno',
          description:
            'Institucional com narrativa direta e sofisticada: autoridade, cases, método e chamada para reunião. Identidade visual consistente e “limpa”.',
          tags: ['B2B', 'Institucional', 'Marca'],
        },
        {
          id: 'case-volt',
          title: 'Volt Auto — Reels de “review rápido”',
          description:
            'Reels com estrutura de retenção: abertura com detalhe impactante, cortes dinâmicos e entrega de valor em 20–30s com CTA no final.',
          tags: ['Automotivo', 'Reels', 'Engajamento'],
        },
        {
          id: 'case-lumina',
          title: 'Lumina Eventos — Aftermovie premium',
          description:
            'Aftermovie com estética cinematográfica: ritmo musical, highlights e final com assinatura de marca. Perfeito para fortalecer autoridade e fechar novos eventos.',
          tags: ['Eventos', 'Cinemático', 'Autoridade'],
        },
      ],
      heroSubtitle:
        'Clique em um case para ver o conceito e o tipo de entrega. Aqui você encontra exemplos de branding, performance e conteúdos recorrentes.',
      modalHint: 'Visualize o conceito e use como referência para o seu projeto.',
      descTitle: 'O que foi feito',
      btnBudget: 'Fazer orçamento',
      btnTalk: 'Falar com a gente',
      btnOpen: 'Abrir case',
      searchPlaceholder: 'Buscar por nome, categoria ou descrição...',
      filterAll: 'Todos',
      nextTitle: 'Quer algo nesse nível para o seu negócio?',
      nextDesc: 'Me diga seu objetivo e eu te devolvo uma ideia pronta para conversão.',
      sortLabel: 'Ordenar:',
      sortRecent: 'Mais recentes',
      sortAZ: 'A → Z',
      sortZA: 'Z → A',
      sortTag: 'Por categoria',
      navPrev: 'Anterior',
      navNext: 'Próximo',
    };

    const en = {
      items: [
        {
          id: 'case-novae',
          title: 'Novae Skincare — Launch Reels',
          description:
            'Concept focused on “desire + quick proof”. Strong visual hook, benefit cuts, and a direct CTA to WhatsApp.',
          tags: ['Beauty', 'Reels', 'Conversion'],
        },
        {
          id: 'case-aurora',
          title: 'Aurora Clinic — Booking campaign',
          description:
            'Premium creatives built for performance: pain → authority → offer → CTA. Variations for story and feed.',
          tags: ['Health', 'Performance', 'Ads'],
        },
        {
          id: 'case-ironpeak',
          title: 'IronPeak Gym — Weekly series',
          description:
            'Recurring format with consistent identity and fast pacing. Built to create habit and retention.',
          tags: ['Fitness', 'Content', 'Series'],
        },
        {
          id: 'case-skyline',
          title: 'Skyline Real Estate — Short VSL for leads',
          description:
            'A concise VSL: scenario + differentiators + social proof + urgency. Great for acquisition and remarketing.',
          tags: ['Real Estate', 'VSL', 'Leads'],
        },
        {
          id: 'case-moonbrew',
          title: 'MoonBrew Café — Seasonal promo',
          description:
            'Offer video with a big-brand feel: clean transitions, strong type, product emphasis, clear CTA.',
          tags: ['Food', 'Promo', 'Offer'],
        },
        {
          id: 'case-zenith',
          title: 'Zenith Tech — Product video (app)',
          description:
            'Minimal motion with app screens. Flow: problem → solution → how it works → CTA for demo.',
          tags: ['Tech', 'Motion', 'Product'],
        },
        {
          id: 'case-velvet',
          title: 'Velvet Boutique — Vertical editorial',
          description:
            'Premium positioning content: aesthetics, lighting, smooth cuts. Designed to increase perceived value.',
          tags: ['Fashion', 'Branding', 'Social'],
        },
        {
          id: 'case-atlas',
          title: 'Atlas Consulting — Modern institutional',
          description:
            'Direct, sophisticated story: authority, cases, method, and a call for a meeting. Clean visual identity.',
          tags: ['B2B', 'Institutional', 'Brand'],
        },
        {
          id: 'case-volt',
          title: 'Volt Auto — Quick review Reels',
          description:
            'Retention structure: strong detail hook, dynamic cuts, value in 20–30s, CTA at the end.',
          tags: ['Auto', 'Reels', 'Engagement'],
        },
        {
          id: 'case-lumina',
          title: 'Lumina Events — Premium aftermovie',
          description:
            'Cinematic feel: music pacing, highlights, brand signature ending. Great for authority and sales.',
          tags: ['Events', 'Cinematic', 'Authority'],
        },
      ],
      heroSubtitle:
        'Click a case to see the concept and delivery style. Examples across branding, performance and recurring content.',
      modalHint: 'Use this concept as a reference for your project.',
      descTitle: 'What was done',
      btnBudget: 'Get a quote',
      btnTalk: 'Talk to us',
      btnOpen: 'Open case',
      searchPlaceholder: 'Search by name, category or description...',
      filterAll: 'All',
      nextTitle: 'Want this level for your business?',
      nextDesc: 'Tell me your goal and I’ll return a conversion-ready idea.',
      sortLabel: 'Sort:',
      sortRecent: 'Most recent',
      sortAZ: 'A → Z',
      sortZA: 'Z → A',
      sortTag: 'By category',
      navPrev: 'Previous',
      navNext: 'Next',
    };

    return currentLang === 'en' ? en : pt;
  }, [currentLang]);

  const placeholderThumb = fotoComerc; // foto padrão para os cases inventados (troca depois)

  const portfolioItemsData = useMemo(() => {
    const base = [
      {
        id: 'case-comerc',
        thumbnail: fotoComerc,
        media_type: 'video',
        media_url: 'https://www.youtube.com/embed/uYZeMRy9g-E',
        title: t('port_item_1_title'),
        description: t('port_item_1_desc'),
        tags: ['Institucional', 'Marca'],
      },
      {
        id: 'case-marcos',
        thumbnail: tumbMarcos,
        media_type: 'video',
        media_url: 'https://www.youtube.com/embed/pcl1pZejmgs',
        title: t('port_item_2_title'),
        description: t('port_item_2_desc'),
        tags: ['Reels', 'Criativo'],
      },
      {
        id: 'case-blue',
        thumbnail: blueMarine,
        media_type: 'video',
        media_url: 'https://www.youtube.com/embed/HXK0NjQgCjE',
        title: t('port_item_3_title'),
        description: t('port_item_3_desc'),
        tags: ['Promo', 'Oferta'],
      },
      {
        id: 'case-tom',
        thumbnail: fotoTom,
        media_type: 'video',
        media_url: 'https://www.youtube.com/embed/55RzdM2dfKk',
        title: t('port_item_4_title'),
        description: t('port_item_4_desc'),
        tags: ['Social', 'Conteúdo'],
      },
      {
        id: 'case-promo',
        thumbnail: promoComerc,
        media_type: 'video',
        media_url: 'https://www.youtube.com/embed/Xfmcg0axl-s',
        title: t('port_item_5_title'),
        description: t('port_item_5_desc'),
        tags: ['Anúncio', 'Performance'],
      },
    ];

    const invented = inventedCopy.items.map((it) => ({
      ...it,
      thumbnail: placeholderThumb,
      media_type: 'image',
      media_url: placeholderThumb,
    }));

    // Mantém ordem "recent" como a ordem do array (base + inventados)
    return [...base, ...invented];
  }, [t, inventedCopy.items, placeholderThumb]);

  const allTags = useMemo(() => {
    const set = new Set();
    portfolioItemsData.forEach((item) => (item.tags || []).forEach((tg) => set.add(tg)));
    return ['all', ...Array.from(set)];
  }, [portfolioItemsData]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = portfolioItemsData.filter((item) => {
      const matchesQuery =
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.tags || []).join(' ').toLowerCase().includes(q);

      const matchesTag = activeTag === 'all' || (item.tags || []).includes(activeTag);
      return matchesQuery && matchesTag;
    });

    // Ordenação
    const sorted = [...list];
    if (sortKey === SORT.AZ) {
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'pt-BR'));
    } else if (sortKey === SORT.ZA) {
      sorted.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'pt-BR'));
    } else if (sortKey === SORT.TAG) {
      // Ordena pela 1ª tag (ou vazio), depois por título
      sorted.sort((a, b) => {
        const ta = (a.tags && a.tags[0]) ? a.tags[0] : '';
        const tb = (b.tags && b.tags[0]) ? b.tags[0] : '';
        const tagCmp = ta.localeCompare(tb, 'pt-BR');
        if (tagCmp !== 0) return tagCmp;
        return (a.title || '').localeCompare(b.title || '', 'pt-BR');
      });
    } else {
      // "recent" = ordem original (não mexe)
    }

    return sorted;
  }, [portfolioItemsData, query, activeTag, sortKey]);

  const selectedIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return filteredItems.findIndex((it) => it.id === selectedProject.id);
  }, [filteredItems, selectedProject]);

  const handleShow = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const goPrev = () => {
    if (!filteredItems.length || selectedIndex < 0) return;
    const prevIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedProject(filteredItems[prevIndex]);
  };

  const goNext = () => {
    if (!filteredItems.length || selectedIndex < 0) return;
    const nextIndex = (selectedIndex + 1) % filteredItems.length;
    setSelectedProject(filteredItems[nextIndex]);
  };

  // ESC para fechar + trava scroll quando modal aberto + setas p/ navegar
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
      if (!showModal) return;

      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };

    if (showModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, selectedIndex, filteredItems.length]);

  return (
    <>
      <SEO
        title={t('portfolio_seo_title')}
        description={t('portfolio_seo_desc')}
        href={`/${currentLang}/portfolio`}
      />

      <section className="portfolio-section">
        <div className="portfolio-wrap">
          {/* HERO PREMIUM */}
          <header className="portfolio-hero">
            <div className="portfolio-hero__bg" aria-hidden="true" />
            <div className="portfolio-hero__content">
              <div className="portfolio-badge">Portfólio</div>

              <h1 className="portfolio-title">{t('portfolio_title')}</h1>

              <p className="portfolio-subtitle">
                {t('portfolio_subtitle_fallback', inventedCopy.heroSubtitle)}
              </p>

              <div className="portfolio-ctas">
                <Link className="p-btn p-btn-primary" to={`/${currentLang}/orcamento`}>
                  {t('btn_budget_fallback', inventedCopy.btnBudget)}
                </Link>
                <Link className="p-btn p-btn-secondary" to={`/${currentLang}/contact`}>
                  {t('btn_talk_fallback', inventedCopy.btnTalk)}
                </Link>
              </div>
            </div>
          </header>

          {/* TOOLBAR (busca + filtros + ordenar) */}
          <div className="portfolio-toolbar">
            <div className="portfolio-toolbarTop">
              <div className="portfolio-search">
                <span className="portfolio-search__icon" aria-hidden="true">
                  ⌕
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="portfolio-search__input"
                  placeholder={t('portfolio_search_fallback', inventedCopy.searchPlaceholder)}
                  aria-label={t('portfolio_search_aria_fallback', 'Buscar no portfólio')}
                />
              </div>

              <div className="portfolio-sort">
                <span className="portfolio-sort__label">
                  {t('portfolio_sort_label_fallback', inventedCopy.sortLabel)}
                </span>
                <select
                  className="portfolio-sort__select"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  aria-label={t('portfolio_sort_aria_fallback', 'Ordenar portfólio')}
                >
                  <option value={SORT.RECENT}>
                    {t('portfolio_sort_recent_fallback', inventedCopy.sortRecent)}
                  </option>
                  <option value={SORT.AZ}>
                    {t('portfolio_sort_az_fallback', inventedCopy.sortAZ)}
                  </option>
                  <option value={SORT.ZA}>
                    {t('portfolio_sort_za_fallback', inventedCopy.sortZA)}
                  </option>
                  <option value={SORT.TAG}>
                    {t('portfolio_sort_tag_fallback', inventedCopy.sortTag)}
                  </option>
                </select>
              </div>
            </div>

            <div className="portfolio-tags" role="tablist" aria-label="Filtros">
              {allTags.map((tg) => {
                const label =
                  tg === 'all'
                    ? t('portfolio_filter_all_fallback', inventedCopy.filterAll)
                    : tg;
                const isActive = activeTag === tg;
                return (
                  <button
                    key={tg}
                    type="button"
                    className={`portfolio-tag ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTag(tg)}
                    role="tab"
                    aria-selected={isActive}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GRID */}
          <div className="portfolio-grid">
            {filteredItems.map((project) => (
              <button
                key={project.id}
                className="portfolio-card"
                onClick={() => handleShow(project)}
                type="button"
              >
                <div className="portfolio-thumb">
                  <img
                    src={project.thumbnail}
                    alt={`Thumbnail: ${project.title}`}
                    className="portfolio-thumbnail"
                    loading="lazy"
                  />
                  <div className="portfolio-thumbOverlay" aria-hidden="true">
                    <span className="portfolio-play">▶</span>
                    <span className="portfolio-open">
                      {t('portfolio_open_fallback', inventedCopy.btnOpen)}
                    </span>
                  </div>
                </div>

                <div className="portfolio-cardBody">
                  <h3 className="portfolio-cardTitle">{project.title}</h3>

                  <div className="portfolio-cardTags" aria-hidden="true">
                    {(project.tags || []).slice(0, 3).map((tg) => (
                      <span key={`${project.id}-${tg}`} className="portfolio-pill">
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* FOOT CTA */}
          <div className="portfolio-foot">
            <div className="portfolio-foot__left">
              <h2 className="portfolio-h2">
                {t('portfolio_next_title_fallback', inventedCopy.nextTitle)}
              </h2>
              <p className="portfolio-muted">
                {t('portfolio_next_desc_fallback', inventedCopy.nextDesc)}
              </p>
            </div>

            <Link className="p-btn p-btn-primary" to={`/${currentLang}/orcamento`}>
              {t('btn_budget_fallback', inventedCopy.btnBudget)}
            </Link>
          </div>
        </div>

        {/* MODAL */}
        {selectedProject && (
          <div
            className={`portfolio-modal ${showModal ? 'show' : ''}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
          >
            <div className="portfolio-modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="portfolio-modal-close"
                onClick={handleClose}
                aria-label={t('btn_close')}
                type="button"
              >
                ✕
              </button>

              <div className="portfolio-modal-head">
                <h3 className="portfolio-modal-title">{selectedProject.title}</h3>
                <p className="portfolio-modal-sub">
                  {t('portfolio_modal_hint_fallback', inventedCopy.modalHint)}
                </p>
              </div>

              <div className="portfolio-modal-body">
                <div className="portfolio-media">
                  {selectedProject.media_type === 'image' ? (
                    <img
                      src={selectedProject.media_url}
                      alt={selectedProject.title}
                      className="portfolio-media-img"
                    />
                  ) : (
                    <div className="portfolio-videoWrap">
                      <iframe
                        src={withYoutubeParams(selectedProject.media_url)}
                        title={selectedProject.title}
                        className="portfolio-media-video"
                        frameBorder="0"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Nav overlay (desktop) */}
                  <div className="portfolio-modalNavOverlay" aria-hidden="true">
                    <button className="portfolio-navBtn" type="button" onClick={goPrev}>
                      ← {t('portfolio_nav_prev_fallback', inventedCopy.navPrev)}
                    </button>
                    <button className="portfolio-navBtn" type="button" onClick={goNext}>
                      {t('portfolio_nav_next_fallback', inventedCopy.navNext)} →
                    </button>
                  </div>
                </div>

                <div className="portfolio-description">
                  <div className="portfolio-descCard">
                    <h4 className="portfolio-descTitle">
                      {t('portfolio_desc_title_fallback', inventedCopy.descTitle)}
                    </h4>
                    <p className="portfolio-descText">{selectedProject.description}</p>

                    <div className="portfolio-descCtas">
                      <Link
                        className="p-btn p-btn-primary"
                        to={`/${currentLang}/orcamento`}
                        onClick={handleClose}
                      >
                        {t('btn_budget_fallback', inventedCopy.btnBudget)}
                      </Link>

                      <a
                        className="p-btn p-btn-ghost"
                        href="https://wa.me/5532991147944"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('btn_whatsapp_fallback', 'WhatsApp')}
                      </a>
                    </div>

                    {/* Nav compact (mobile) */}
                    <div className="portfolio-modalNavCompact">
                      <button className="portfolio-navBtnCompact" type="button" onClick={goPrev}>
                        ← {t('portfolio_nav_prev_fallback', inventedCopy.navPrev)}
                      </button>
                      <button className="portfolio-navBtnCompact" type="button" onClick={goNext}>
                        {t('portfolio_nav_next_fallback', inventedCopy.navNext)} →
                      </button>
                    </div>

                    <div className="portfolio-modalCounter" aria-hidden="true">
                      {selectedIndex >= 0 ? `${selectedIndex + 1} / ${filteredItems.length}` : ''}
                    </div>

                    <div className="portfolio-modalHintKeys" aria-hidden="true">
                      Dica: use ← → para navegar
                    </div>
                  </div>
                </div>
              </div>

              <div className="portfolio-modal-foot" />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default PortfolioPage;
