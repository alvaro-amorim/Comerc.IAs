import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // <--- Hook
import SEO from '../components/SEO';
import '../styles/PortfolioPage.css';

// Imagens
import tumbMarcos from '../assets/images/tumb.marcos.png';
import blueMarine from '../assets/images/blue.marine.png';
import fotoTom from '../assets/images/foto.tom.png';
import fotoComerc from '../assets/images/foto.comerc.jpg';
import promoComerc from '../assets/images/promoComerc.png';

const PortfolioPage = () => {
  const { t } = useTranslation(); // <--- Inicializa tradução
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Mover dados para DENTRO do componente para usar t()
  const portfolioItemsData = [
    {
      thumbnail: fotoComerc,
      media_type: "video",
      media_url: "https://www.youtube.com/embed/uYZeMRy9g-E",
      title: t('port_item_1_title'),
      description: t('port_item_1_desc'),
    },
    {
      thumbnail: tumbMarcos,
      media_type: "video",
      media_url: "https://www.youtube.com/embed/pcl1pZejmgs",
      title: t('port_item_2_title'),
      description: t('port_item_2_desc'),
    },
    {
      thumbnail: blueMarine,
      media_type: "video",
      media_url: "https://www.youtube.com/embed/HXK0NjQgCjE",
      title: t('port_item_3_title'),
      description: t('port_item_3_desc'),
    },
    {
      thumbnail: fotoTom,
      media_type: "video",
      media_url: "https://www.youtube.com/embed/55RzdM2dfKk",
      title: t('port_item_4_title'),
      description: t('port_item_4_desc'),
    },
    {
      thumbnail: promoComerc,
      media_type: "video",
      media_url: "https://www.youtube.com/embed/Xfmcg0axl-s",
      title: t('port_item_5_title'),
      description: t('port_item_5_desc'),
    }
  ];

  const handleShow = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  return (
    <>
      <SEO 
        title={t('portfolio_seo_title')} 
        description={t('portfolio_seo_desc')}
        href="/portfolio"
      />

      <section id="portfolio" className="portfolio-section">
        <div className="portfolio-container">
          <h1 className="portfolio-title">{t('portfolio_title')}</h1>
          
          <div className="portfolio-grid">
            {portfolioItemsData.map((project, index) => (
              <div
                key={index}
                className="portfolio-card"
                onClick={() => handleShow(project)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleShow(project)}
              >
                <img
                  src={project.thumbnail}
                  alt={`Thumbnail: ${project.title}`}
                  className="portfolio-thumbnail"
                />
                <div className="portfolio-card-body">
                  <h3 className="portfolio-card-title">
                    {/* Caso tenha <br> na tradução no futuro */}
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedProject && (
          <div className={`portfolio-modal ${showModal ? 'show' : ''}`} onClick={handleClose}>
            <div className="portfolio-modal-content" onClick={e => e.stopPropagation()}>
              <button className="portfolio-modal-close" onClick={handleClose} aria-label={t('btn_close')}>
                ✕
              </button>
              <h3 className="portfolio-modal-title">{selectedProject.title}</h3>
              <div className="portfolio-modal-body">
                <div className="portfolio-media">
                  {selectedProject.media_type === "image" ? (
                    <img
                      src={selectedProject.media_url}
                      alt={selectedProject.title}
                      className="portfolio-media-img"
                    />
                  ) : (
                    <iframe
                      src={selectedProject.media_url}
                      title={selectedProject.title}
                      className="portfolio-media-video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <div className="portfolio-description">
                  <p>{selectedProject.description}</p>
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