import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import escritorio from '../assets/images/escritorio.png';
import FotoHome from '../assets/images/FotoHome.png';

const HomePage = () => {
  return (
    <>
      {/* Seção Principal (Desktop) - Imagem em Tela Cheia */}
      <section 
        id="fullscreen-image-section-desktop" 
        className="position-relative w-100 vh-100 overflow-hidden d-none d-md-flex align-items-center justify-content-center"
        style={{ paddingTop: '56px' }} // Adiciona o padding para a Navbar fixa
      >
        <img
          src={FotoHome}
          alt="Imagem de Fundo Principal"
          className="w-100 h-100 object-fit-cover"
        />
      </section>

      {/* Seção Principal (Mobile) - Imagem responsiva para celular */}
      <section 
        id="fullscreen-image-section-mobile" 
        className="d-block d-md-none w-100 overflow-hidden" // Visível apenas em mobile
        style={{ paddingTop: '40px' }} // Adiciona o padding para a Navbar fixa
      >
        <img
          src={FotoHome}
          alt="Imagem de Fundo Principal"
          className="img-fluid w-100" // img-fluid para responsividade
          style={{ maxHeight: '40vh', objectFit: 'cover' }} // Altura máxima para caber na tela
        />
      </section>

      {/* Seção Hero com Fundo Blur (Desktop) */}
      <section 
        id="hero-desktop" 
        className="position-relative text-center text-white overflow-hidden py-5 d-none d-md-flex align-items-center justify-content-center" 
        style={{ 
          minHeight: '80vh', 
          backgroundImage: `url(${escritorio})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-75" style={{ backdropFilter: 'blur(8px)' }}></div>
        <Container className="position-relative z-1 py-5 bg-dark bg-opacity-50 rounded-3 shadow-lg">
          <h1 className="display-4 fw-bold mb-3">Impulsione seu negócio com vídeos IA</h1>
          <p className="fs-5 mb-4">Conteúdos rápidos, realistas e totalmente customizados</p>
          <Button as={Link} to="/contact" variant="primary" size="lg" className="rounded-pill px-5">
            Fale Conosco
          </Button>
        </Container>
      </section>

      {/* Seção Hero com Fundo Blur (Mobile) */}
      <section 
        id="hero-mobile" 
        className="d-block d-md-none position-relative text-center text-white overflow-hidden py-4 d-flex align-items-center justify-content-center" // Visível apenas em mobile
        style={{ 
          minHeight: '50vh', // Altura menor para mobile
          backgroundImage: `url(${escritorio})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-75" style={{ backdropFilter: 'blur(8px)' }}></div>
        <Container className="position-relative z-1 py-3 bg-dark bg-opacity-50 rounded-3 shadow-lg mx-3"> {/* Margem horizontal */}
          <h1 className="display-6 fw-bold mb-2">Impulsione seu negócio com vídeos IA</h1> {/* Título menor */}
          <p className="fs-6 mb-3">Conteúdos rápidos, realistas e totalmente customizados</p> {/* Texto menor */}
          <Button as={Link} to="/contact" variant="primary" size="md" className="rounded-pill px-4"> {/* Botão menor */}
            Fale Conosco
          </Button>
        </Container>
      </section>
    </>
  );
};

export default HomePage;