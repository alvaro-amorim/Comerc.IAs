import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- Importante
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logoBranca from '../assets/images/logo.branca.png';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { i18n } = useTranslation(); // <--- Pegar o idioma atual
  
  // Garante que temos um idioma definido, ou usa 'pt' como padrão
  const currentLang = i18n.language || 'pt';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar expand="md" fixed="top" className="custom-navbar">
      <Container className="custom-navbar-container">
        {/* Logo manda para a raiz do idioma atual */}
        <Navbar.Brand as={NavLink} to={`/${currentLang}`}>
          <img
            src={logoBranca}
            alt="Comerc IAs Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={toggleMenu} className="navbar-toggle">
          <FontAwesomeIcon icon={faBars} color="white"/>
        </Navbar.Toggle>

        <Navbar.Collapse id="responsive-navbar-nav" className="d-none d-md-flex">
          <Nav className="navbar-links ms-auto">
            {/* CORREÇÃO: Todos os links agora usam ${currentLang} antes */}
            <Nav.Link as={NavLink} to={`/${currentLang}`} className="navbar-link" end>
              HOME
            </Nav.Link>
            <Nav.Link as={NavLink} to={`/${currentLang}/about`} className="navbar-link">
              Sobre
            </Nav.Link>
            <Nav.Link as={NavLink} to={`/${currentLang}/portfolio`} className="navbar-link">
              Portfólio
            </Nav.Link>
            <Nav.Link as={NavLink} to={`/${currentLang}/orcamento`} className="navbar-link">
              Orçamento
            </Nav.Link>
            <Nav.Link as={NavLink} to={`/${currentLang}/contact`} className="navbar-link">
              Contato
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Menu Mobile também precisa ser corrigido */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <Nav className="d-flex flex-column">
          <Nav.Link as={NavLink} to={`/${currentLang}`} onClick={toggleMenu} className="nav-link" end>
            HOME
          </Nav.Link>
          <Nav.Link as={NavLink} to={`/${currentLang}/about`} onClick={toggleMenu} className="nav-link">
            Sobre
          </Nav.Link>
          <Nav.Link as={NavLink} to={`/${currentLang}/portfolio`} onClick={toggleMenu} className="nav-link">
            Portfólio
          </Nav.Link>
          <Nav.Link as={NavLink} to={`/${currentLang}/orcamento`} onClick={toggleMenu} className="nav-link">
            Orçamento
          </Nav.Link>
          <Nav.Link as={NavLink} to={`/${currentLang}/contact`} onClick={toggleMenu} className="nav-link">
            Contato
          </Nav.Link>
        </Nav>
      </div>

      <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
    </Navbar>
  );
};

export default Header;