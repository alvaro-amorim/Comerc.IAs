import React, { useState } from 'react';
import SEO from '../components/SEO'; // <--- Importação do componente SEO
import '../styles/PortfolioPage.css';

// Imagens
import tumbMarcos from '../assets/images/tumb.marcos.png';
import blueMarine from '../assets/images/blue.marine.png';
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
    media_url: "https://www.youtube.com/embed/HXK0NjQgCjE",
    title: "Branding e Propostas Criativas",
    description: 'Neste exemplo, usamos IA para desenvolver diversos cenários surreais mantendo o logotipo e branding da marca!',
  },
  {
    thumbnail: fotoTom,
    media_type: "video",
    media_url: "https://www.youtube.com/embed/55RzdM2dfKk",
    title: "Efeitos Especiais Para Prender a Atenção",
    description: `Conteúdos realistas e que prendem o lead até ouvir sua mensagem! Infinitas possibilidades!`,
  },
  {
    thumbnail: promoComerc,
    media_type: "video",
    media_url: "https://www.youtube.com/embed/Xfmcg0axl-s",
    title: "Vídeo de Promoção ou Divulgação",
    description: "Uma campanha de promoção ou divulgação que prende o seu cliente! Humor, Identidade e Conversão!",
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
    <>
      {/* Configuração de SEO para a página de Portfólio */}
      <SEO 
        title="Portfólio - Vídeos com IA e Storytelling" 
        description="Veja exemplos reais dos nossos vídeos comerciais, campanhas de branding e efeitos visuais criados com Inteligência Artificial. Inspire-se com o nosso portfólio."
        href="/portfolio"
      />

      <section id="portfolio" className="portfolio-section">
        <div className="portfolio-container">
          {/* Correção: Alterado de H2 para H1 para hierarquia correta */}
          <h1 className="portfolio-title">Portfólio</h1>
          
          <div className="portfolio-grid">
            {portfolioItemsData.map((project, index) => (
              <div
                key={index}
                className="portfolio-card"
                onClick={() => handleShow(project)}
                // Adicionado role e tabIndex para acessibilidade no clique da div
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleShow(project)}
              >
                <img
                  src={project.thumbnail}
                  alt={`Thumbnail do projeto: ${project.title}`}
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
          <div className={`portfolio-modal ${showModal ? 'show' : ''}`} onClick={handleClose}>
            <div className="portfolio-modal-content" onClick={e => e.stopPropagation()}>
              <button className="portfolio-modal-close" onClick={handleClose} aria-label="Fechar modal">
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
                      title={`Vídeo do projeto: ${selectedProject.title}`} // Título descritivo para acessibilidade
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