import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faFilter, faPlay } from '@fortawesome/free-solid-svg-icons';
import '../styles/PortfolioPage.css';

// Helper para limpar URLs do Youtube
function withYoutubeParams(url) {
  if (!url) return url;
  if (!url.includes('youtube') && !url.includes('youtu.be')) return url;
  const joiner = url.includes('?') ? '&' : '?';
  return `${url}${joiner}rel=0&modestbranding=1&playsinline=1`;
}

const PortfolioPage = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  // Determina idioma atual
  const currentLang = useMemo(() => {
    if (lang === 'pt' || lang === 'en') return lang;
    const l = (i18n.language || 'pt').toLowerCase();
    return l.startsWith('en') ? 'en' : 'pt';
  }, [lang, i18n.language]);

  // Estados da interface
  const [activeTag, setActiveTag] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // =================================================================================
  // LISTA DE CASES (Edite os dados aqui)
  // =================================================================================
  // DICA: Para usar imagens reais depois, descomente o import no topo e use a variável.
  
  const casesData = [
    {
      id: 'case-01',
      title: 'Aurora Clínica — Reels de Venda',
      description: 'Campanha focada em tráfego local para clínica de estética. Utilizamos ganchos visuais rápidos e foco na transformação do paciente.',
      tags: ['Saúde', 'Reels', 'Venda'],
      // Usando placeholder online para garantir que o deploy funcione
      thumbnail: 'https://placehold.co/600x400/06243d/ffffff?text=Case+Aurora', 
      media_type: 'video',
      media_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Troque pelo seu link real
    },
    {
      id: 'case-02',
      title: 'Vitta Store — Lançamento E-commerce',
      description: 'Vídeo institucional para lançamento de marca de roupas. Foco em lifestyle e identidade visual premium.',
      tags: ['E-commerce', 'Institucional', 'Branding'],
      thumbnail: 'https://placehold.co/600x400/0d6efd/ffffff?text=Case+Vitta',
      media_type: 'video',
      media_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    // Adicionei mais alguns slots vazios para completar a grid
    ...Array.from({ length: 6 }).map((_, i) => ({
      id: `case-empty-${i}`,
      title: `Projeto Exemplo ${i + 3}`,
      description: 'Descrição breve do projeto. Este espaço está reservado para seus cases futuros.',
      tags: ['Categoria Exemplo'],
      thumbnail: `https://placehold.co/600x400/f1f5f9/64748b?text=Projeto+${i + 3}`,
      media_type: 'image',
      media_url: 'https://placehold.co/1200x800/f1f5f9/64748b?text=Imagem+do+Projeto',
    }))
  ];

  // Gera lista única de tags
  const allTags = useMemo(() => {
    const set = new Set();
    casesData.forEach((item) => (item.tags || []).forEach((tg) => set.add(tg)));
    return ['Todos', ...Array.from(set)];
  }, []);

  // Filtra os items
  const filteredItems = useMemo(() => {
    if (activeTag === 'Todos' || activeTag === 'All') return casesData;
    return casesData.filter((item) => (item.tags || []).includes(activeTag));
  }, [activeTag, casesData]);

  // Lógica do Modal
  const handleShow = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const selectedIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return filteredItems.findIndex((it) => it.id === selectedProject.id);
  }, [filteredItems, selectedProject]);

  const goPrev = (e) => {
    e?.stopPropagation();
    if (!filteredItems.length || selectedIndex < 0) return;
    const prevIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedProject(filteredItems[prevIndex]);
  };

  const goNext = (e) => {
    e?.stopPropagation();
    if (!filteredItems.length || selectedIndex < 0) return;
    const nextIndex = (selectedIndex + 1) % filteredItems.length;
    setSelectedProject(filteredItems[nextIndex]);
  };

  // Atalhos de teclado
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!showModal) return;
      if (e.key === 'Escape') handleClose();
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
    // eslint-disable-next-line
  }, [showModal, selectedIndex]);

  return (
    <>
      <SEO
        title={t('portfolio_seo_title', 'Portfólio | Comerc IA’s')}
        description={t('portfolio_seo_desc', 'Veja nossos cases de sucesso em vídeos, sites e criativos.')}
        href={`/${currentLang}/portfolio`}
      />

      <section className="portfolio-section">
        <div className="portfolio-wrap">
          
          {/* HERO */}
          <header className="portfolio-hero">
            <div className="portfolio-hero__bg" aria-hidden="true" />
            <div className="portfolio-hero__content">
              <div className="portfolio-badge">Portfólio</div>
              <h1 className="portfolio-title">{t('portfolio_title', 'Cases Selecionados')}</h1>
              <p className="portfolio-subtitle">
                {t('portfolio_subtitle', 'Explore nossos projetos recentes. Clique em um case para ver o conceito, estratégia e o resultado final.')}
              </p>

              <div className="portfolio-ctas">
                <Link className="p-btn p-btn-primary" to={`/${currentLang}/orcamento`}>
                  {t('btn_budget', 'Fazer orçamento')}
                </Link>
                <Link className="p-btn p-btn-secondary" to={`/${currentLang}/contact`}>
                  {t('btn_talk', 'Falar com a gente')}
                </Link>
              </div>
            </div>
          </header>

          {/* FILTRO MINIMIZÁVEL */}
          <div className="portfolio-toolbar">
            <button 
              className={`portfolio-filter-toggle ${isFilterOpen ? 'active' : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FontAwesomeIcon icon={faFilter} className="me-2" />
              {t('portfolio_filter_label', 'Filtrar por Categoria')}
              <FontAwesomeIcon icon={isFilterOpen ? faChevronUp : faChevronDown} className="ms-2" />
            </button>

            {isFilterOpen && (
              <div className="portfolio-tags-container">
                <div className="portfolio-tags" role="tablist">
                  {allTags.map((tg) => (
                    <button
                      key={tg}
                      type="button"
                      className={`portfolio-tag ${activeTag === tg ? 'active' : ''}`}
                      onClick={() => setActiveTag(tg)}
                    >
                      {tg}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                    alt={project.title}
                    className="portfolio-thumbnail"
                    loading="lazy"
                  />
                  <div className="portfolio-thumbOverlay" aria-hidden="true">
                    <span className="portfolio-play">
                      <FontAwesomeIcon icon={faPlay} />
                    </span>
                    <span className="portfolio-open">Abrir Case</span>
                  </div>
                </div>

                <div className="portfolio-cardBody">
                  <h3 className="portfolio-cardTitle">{project.title}</h3>
                  <div className="portfolio-cardTags">
                    {(project.tags || []).slice(0, 3).map((tg, idx) => (
                      <span key={idx} className="portfolio-pill">{tg}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* FOOTER CTA */}
          <div className="portfolio-foot">
            <div className="portfolio-foot__left">
              <h2 className="portfolio-h2">Gostou do que viu?</h2>
              <p className="portfolio-muted">
                Podemos criar algo nesse nível para o seu negócio.
              </p>
            </div>
            <Link className="p-btn p-btn-primary" to={`/${currentLang}/orcamento`}>
              Começar projeto
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
          >
            <div className="portfolio-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="portfolio-modal-close" onClick={handleClose}>✕</button>

              <div className="portfolio-modal-head">
                <h3 className="portfolio-modal-title">{selectedProject.title}</h3>
                <div className="portfolio-modal-tags">
                  {(selectedProject.tags || []).map((t, i) => <span key={i}>#{t} </span>)}
                </div>
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
                  
                  {/* Navegação Desktop */}
                  <div className="portfolio-modalNavOverlay">
                    <button className="portfolio-navBtn" onClick={goPrev}>←</button>
                    <button className="portfolio-navBtn" onClick={goNext}>→</button>
                  </div>
                </div>

                <div className="portfolio-description">
                  <div className="portfolio-descCard">
                    <h4 className="portfolio-descTitle">Sobre o projeto</h4>
                    <p className="portfolio-descText">{selectedProject.description}</p>

                    <div className="portfolio-descCtas">
                      <Link className="p-btn p-btn-primary" to={`/${currentLang}/orcamento`} onClick={handleClose}>
                        Pedir orçamento igual
                      </Link>
                      <a className="p-btn p-btn-ghost" href="https://wa.me/5532991147944" target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </div>

                    <div className="portfolio-modalNavCompact">
                      <button className="portfolio-navBtnCompact" onClick={goPrev}>← Anterior</button>
                      <button className="portfolio-navBtnCompact" onClick={goNext}>Próximo →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default PortfolioPage;