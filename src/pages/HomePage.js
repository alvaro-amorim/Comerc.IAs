import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- Importação
import escritorio from '../assets/images/escritorio.png';
import '../styles/HomePage.css';
import saibaMaisImg from "../assets/images/saiba-mais.png";
import headerImage from '../assets/images/header.png';
import SEO from '../components/SEO';

const HomePage = () => {
  const { i18n } = useTranslation(); // <--- Hook
  const currentLang = i18n.language || 'pt'; // Idioma atual

  return (
    <>
      <SEO 
        title="Vídeos Comerciais com IA e Marketing Digital" 
        description="Impulsione o seu negócio com vídeos profissionais, avatares realistas e produção audiovisual com Inteligência Artificial. Entrega rápida e alta qualidade."
        href="/"
      />

      <section className="top-image-section">
        <Container fluid>
          <img 
            src={headerImage} 
            alt="Cabeçalho da Página Inicial - Comerc IA's" 
            className="img-fluid w-100"
          />
        </Container>
      </section>

      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="text-center text-md-start">
              <h1 className="hero-title">
                VÍDEOS de ALTO IMPACTO para impulsionar seu negócio!
              </h1>
              <div className="hero-video-wrapper">
                <iframe 
                  src="https://www.youtube.com/embed/Ee41a_djLX0"
                  title="Vídeo de apresentação Comerc IA's"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="hero-video"
                ></iframe>
                
                <div className="hero-description">
                  <p>Na Comerc IA's nós temos o compromisso de entrega rápida, um material de extrema qualidade e ótimo custo-benefício!</p> 
                  <p>Vídeos feitos por profissionais em Edição de Vídeo, com imagens e cenas geradas com Inteligência Artificial.</p>
                </div>

              </div>
              
              {/* CORREÇÃO: Link com idioma dinâmico */}
              <Button 
                as={Link} 
                to={`/${currentLang}/about`} 
                variant="primary" 
                size="lg" 
                className="hero-button"
              >
                CONHEÇA NOSSOS SERVIÇOS
              </Button>
              
              <Link to={`/${currentLang}/about`}>
                <img 
                  src={saibaMaisImg} 
                  alt="Saiba mais sobre nossos serviços" 
                  className="hero-button-2"
                />
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      <section 
        className="hero-desktop"
        style={{ backgroundImage: `url(${escritorio})` }}
      >
        <div className="hero-desktop-overlay"></div>
        <Container className="hero-desktop-container">
          <h2 className="hero-desktop-title">IMPULSIONE SEU NEGÓCIO COM PUBLICIDADE DE QUALIDADE!</h2>
          <p className="hero-desktop-text">Conteúdo bem feito, entrega rápida e total customização à sua necessidade</p>
          <Button 
            as={Link} 
            to={`/${currentLang}/portfolio`} 
            variant="light" 
            size="md" 
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