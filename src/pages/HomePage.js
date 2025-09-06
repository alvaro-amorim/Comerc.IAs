import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import escritorio from '../assets/images/escritorio.png';
import '../styles/HomePage.css'; // Import do CSS
import saibaMaisImg from "../assets/images/saiba-mais.png"; // caminho da imagem

const HomePage = () => {
  return (
    <>
      {/* Nova Seção Principal (Hero) */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="text-center text-md-start">
              <h1 className="hero-title">
                Vídeos Profissionais para impulsionar seu negócio!
              </h1>
              <div className="hero-video-wrapper">
                <iframe 
                  src="https://www.youtube.com/embed/pkc_jAEFdmQ"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="hero-video"
                ></iframe>
                
                <p className="hero-description">
                  <p>Na Comerc IA's nós temos o compromisso de entrega rápida, um material de extrema qualidade e ótimo custo-benefício!</p> 
                  <p>Vídeos feitos por profissionais em Edição de Vídeo, com imagens e cenas geradas com Inteligência Artificial.</p>
                </p>

              </div>
              <Button 
                as={Link} 
                to="/about" 
                variant="primary" 
                size="lg" 
                className="hero-button"
              >
                CLIQUE AQUI E SAIBA MAIS!
              </Button>
              
              <Link to="/about">
                <img 
                  src={saibaMaisImg} 
                  alt="Saiba mais" 
                  className="hero-button-2"
                />
              </Link>
            </Col>

          </Row>
        </Container>
      </section>

      {/* Hero Desktop */}
      <section 
        className="hero-desktop"
        style={{ backgroundImage: `url(${escritorio})` }}
      >
        <div className="hero-desktop-overlay"></div>
        <Container className="hero-desktop-container">
          <h1 className="hero-desktop-title">IMPULSIONE SEU NEGÓCIO COM PUBLICIDADE DE QUALIDADE!</h1>
          <p className="hero-desktop-text">Conteúdo bem feito, entrega rápida e total customização à sua necessidade</p>
          <Button 
            as={Link} 
            to="/portfolio" 
            variant="primary" 
            size="lg" 
            className="hero-desktop-button"
          >
            CONFIRA NOSSO TRABALHO
          </Button>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
