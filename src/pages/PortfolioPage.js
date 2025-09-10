import React, { useState } from 'react';
import '../styles/PortfolioPage.css';

// Imagens
import tumbMarcos from '../assets/images/tumb.marcos.png';
import blueMarine from '../assets/images/blue.marine.jpg';
import fotoTom from '../assets/images/foto.tom.jpg';
import fotoComerc from '../assets/images/foto.comerc.jpg';

// Vídeos
import reelMarcos from '../assets/videos/reel.marcos.mp4';
import apresentacaoTalita from '../assets/videos/apresentacao.talita.mp4';
import videoTom from '../assets/videos/video.tom.mp4';
import comercApresenta from '../assets/videos/comerc.apresenta.mp4';

const portfolioItemsData = [
  {
    thumbnail: fotoComerc,
    media_type: "video",
    media_url: comercApresenta,
    title: "Apresentação de Marca",
    description: `Apresentar sua marca ao mundo nunca foi tão fácil — e tão inovador...`
  },
  {
    thumbnail: tumbMarcos,
    media_type: "video",
    media_url: reelMarcos,
    title: "Vídeos Gerados com IA",
    description: `Transformamos ideias criativas em roteiros impactantes...`
  },
  {
    thumbnail: blueMarine,
    media_type: "video",
    media_url: apresentacaoTalita,
    title: "Apresentações Comerciais",
    description: `Neste exemplo, usamos IA para desenvolver uma apresentação moderna...`
  },
  {
    thumbnail: fotoTom,
    media_type: "video",
    media_url: videoTom,
    title: "Vídeos IA a Partir de Fotos",
    description: `Com apenas uma imagem estática, conseguimos gerar cenas...`
  }
];

const PortfolioPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleShow = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="portfolio-container">
        <h2 className="portfolio-title">Portfólio</h2>
        <div className="portfolio-grid">
          {portfolioItemsData.map((project, index) => (
            <div
              key={index}
              className="portfolio-card"
              onClick={() => handleShow(project)}
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="portfolio-thumbnail"
              />
              <div className="portfolio-card-body">
                <h3 className="portfolio-card-title">
                  {project.title.replace('<br>', ' ')}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className={`portfolio-modal ${showModal ? 'show' : ''}`}>
          <div className="portfolio-modal-content">
            <button className="portfolio-modal-close" onClick={handleClose}>
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
                  <video
                    src={selectedProject.media_url}
                    controls
                    autoPlay
                    muted
                    loop
                    className="portfolio-media-video"
                  />
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
  );
};

export default PortfolioPage;
