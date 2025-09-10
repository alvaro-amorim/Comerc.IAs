import React, { useState } from 'react';
import '../styles/PortfolioPage.css';

// Imagens
import tumbMarcos from '../assets/images/tumb.marcos.png';
import blueMarine from '../assets/images/blue.marine.jpg';
import fotoTom from '../assets/images/foto.tom.png';
import fotoComerc from '../assets/images/foto.comerc.jpg';
import promoComerc from '../assets/images/promoComerc.png';

// Links do YouTube (embed)
const portfolioItemsData = [
  {
    thumbnail: fotoComerc,
    media_type: "video",
    media_url: "https://www.youtube.com/embed/uYZeMRy9g-E",
    title: "Apresentação de Marca",
    description: `Apresentar sua marca ao mundo nunca foi tão fácil — e tão inovador — faça o seu cliente conhecer o seu trabalho de forma prática!`,
  },
  {
    thumbnail: tumbMarcos,
    media_type: "video",
    media_url: "https://www.youtube.com/embed/pcl1pZejmgs",
    title: "Vídeos Storytelling com IA",
    description: `Transformamos ideias criativas em roteiros impactantes, misturando humor, storytelling e total identidade da sua marca!`,
  },
  {
    thumbnail: blueMarine,
    media_type: "video",
    media_url: "https://www.youtube.com/embed/fXJ_CIXnhVs",
    title: "Apresentações Comerciais",
    description: `Neste exemplo, usamos IA para desenvolver uma apresentação moderna de um empreendimento para divulgação de uma corretora imobiliária!`,
  },
  {
    thumbnail: fotoTom,
    media_type: "video",
    media_url: fotoTom,
    title: "Personagens a partir de fotos",
    description: `Com apenas uma imagem estática, conseguimos gerar cenas animadas, para melhorar a qualidade do seu conteúdo!.`,
  },
  {
    thumbnail: promoComerc,
    media_type: "video",
    media_url: "https://www.youtube.com/embed/Xfmcg0axl-s",
    title: "Vídeo de Promoção e Divulgação",
    description: "Uma campanha de promoção que prende o seu cliente! Humor, Identidade e Conversão!",
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
  );
};

export default PortfolioPage;
