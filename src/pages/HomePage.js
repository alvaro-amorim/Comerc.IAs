import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import escritorio from '../assets/images/escritorio.png';
import '../styles/HomePage.css'; // Import do CSS
import saibaMaisImg from "../assets/images/saiba-mais.png"; // caminho da imagem
import headerImage from '../assets/images/header.png'; // 👈 Import da imagem do topo
import SEO from '../components/SEO'; // <--- 1. Importar o componente SEO

const HomePage = () => {
  return (
    <>
      {/* 1. Configuração de SEO para a Página Inicial */}
      <SEO 
        title="Vídeos Comerciais com IA e Marketing Digital" 
        description="Impulsione o seu negócio com vídeos profissionais, avatares realistas e produção audiovisual com Inteligência Artificial. Entrega rápida e alta qualidade."
        href="/"
      />

      {/* Seção da Imagem no Topo */}
      <section className="top-image-section">
        <Container fluid>
          <img 
            src={headerImage} 
            alt="Cabeçalho da Página Inicial - Comerc IA's" 
            className="img-fluid w-100"
          />
        </Container>
      </section>

      {/* Seção Principal (Hero) */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="text-center text-md-start">
              {/* Mantivemos este como o H1 Principal */}
              <h1 className="hero-title">
                VÍDEOS PROFISSIONAIS para impulsionar seu negócio!
              </h1>
              <div className="hero-video-wrapper">
                <iframe 
                  src="https://www.youtube.com/embed/Ee41a_djLX0"
                  title="Vídeo de apresentação Comerc IA's" // Melhorado o título do iframe para acessibilidade
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="hero-video"
                ></iframe>
                
                {/* 3. Correção: Trocado <p> externo por <div> para evitar HTML inválido (<p> dentro de <p>) */}
                <div className="hero-description">
                  <p>Na Comerc IA's nós temos o compromisso de entrega rápida, um material de extrema qualidade e ótimo custo-benefício!</p> 
                  <p>Vídeos feitos por profissionais em Edição de Vídeo, com imagens e cenas geradas com Inteligência Artificial.</p>
                </div>

              </div>
              
              {/* 4. Correção: Texto do botão mais descritivo para SEO */}
              <Button 
                as={Link} 
                to="/about" 
                variant="primary" 
                size="lg" 
                className="hero-button"
              >
                CONHEÇA NOSSOS SERVIÇOS
              </Button>
              
              <Link to="/about">
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

      {/* Hero Desktop */}
      <section 
        className="hero-desktop"
        style={{ backgroundImage: `url(${escritorio})` }}
      >
        <div className="hero-desktop-overlay"></div>
        <Container className="hero-desktop-container">
          {/* 2. Correção: Mudado de H1 para H2 para manter a hierarquia correta */}
          <h2 className="hero-desktop-title">IMPULSIONE SEU NEGÓCIO COM PUBLICIDADE DE QUALIDADE!</h2>
          <p className="hero-desktop-text">Conteúdo bem feito, entrega rápida e total customização à sua necessidade</p>
          <Button 
            as={Link} 
            to="/portfolio" 
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