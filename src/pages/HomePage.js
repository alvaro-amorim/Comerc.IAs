import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- Importante
import escritorio from '../assets/images/escritorio.png';
import '../styles/HomePage.css';
import saibaMaisImg from "../assets/images/saiba-mais.png";
import headerImage from '../assets/images/header.png';
import SEO from '../components/SEO';

const HomePage = () => {
  const { t, i18n } = useTranslation(); // <--- Hook de tradução
  const currentLang = i18n.language || 'pt';

  return (
    <>
      {/* Nota: O SEO também pode ser traduzido se quiseres, mas vamos focar no visível primeiro */}
      <SEO 
        title="Vídeos Comerciais com IA e Marketing Digital" 
        description="Impulsione o seu negócio com vídeos profissionais..."
        href="/"
      />

      <section className="top-image-section">
        <Container fluid>
          <img src={headerImage} alt="Cabeçalho Comerc IA's" className="img-fluid w-100" />
        </Container>
      </section>

      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="text-center text-md-start">
              {/* TÍTULO TRADUZIDO */}
              <h1 className="hero-title">
                {t('hero_title')}
              </h1>

              <div className="hero-video-wrapper">
                <iframe 
                  src="https://youtube.com/embed/ZgXP3sqBH7Q"
                  title="Vídeo Institucional"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="hero-video"
                ></iframe>
                
                {/* DESCRIÇÃO TRADUZIDA */}
                <div className="hero-description">
                  <p>{t('hero_desc_1')}</p> 
                  <p>{t('hero_desc_2')}</p>
                </div>
              </div>
              
              {/* BOTÃO TRADUZIDO */}
              <Button 
                as={Link} 
                to={`/${currentLang}/about`} 
                variant="primary" 
                size="lg" 
                className="hero-button"
              >
                {t('btn_know_services')}
              </Button>
              
              <Link to={`/${currentLang}/about`}>
                <img src={saibaMaisImg} alt="Saiba mais" className="hero-button-2" />
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="hero-desktop" style={{ backgroundImage: `url(${escritorio})` }}>
        <div className="hero-desktop-overlay"></div>
        <Container className="hero-desktop-container">
          {/* SECÇÃO DESKTOP TRADUZIDA */}
          <h2 className="hero-desktop-title">{t('desktop_title')}</h2>
          <p className="hero-desktop-text">{t('desktop_text')}</p>
          <Button 
            as={Link} 
            to={`/${currentLang}/portfolio`} 
            variant="light" 
            size="md" 
            className="hero-desktop-button"
          >
            {t('btn_check_work')}
          </Button>
        </Container>
      </section>
    </>
  );
};

export default HomePage;