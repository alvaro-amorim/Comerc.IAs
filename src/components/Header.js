import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <--- Importante
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logoBranca from '../assets/images/logo.branca.png';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation(); // <--- Hook t() para traduzir
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentLang = i18n.language || 'pt';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchLanguage = (targetLang) => {
    if (targetLang === currentLang) return;
    const newPath = location.pathname.replace(`/${currentLang}`, `/${targetLang}`);
    i18n.changeLanguage(targetLang);
    navigate(newPath);
    setIsMenuOpen(false);
  };

  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar">
      <Container className="custom-navbar-container">
        <Navbar.Brand as={NavLink} to={`/${currentLang}`}>
          <img src={logoBranca} alt="Comerc IAs Logo" className="navbar-logo" />
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-3">
            {/* Seletor Mobile */}
            <div className="d-md-none language-selector-mobile">
                <span className={currentLang === 'pt' ? 'lang-active' : ''} onClick={() => switchLanguage('pt')}>🇧🇷</span>
                <span className="divider">|</span>
                <span className={currentLang === 'en' ? 'lang-active' : ''} onClick={() => switchLanguage('en')}>🇺🇸</span>
            </div>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={toggleMenu} className="navbar-toggle">
                <FontAwesomeIcon icon={faBars} color="white"/>
            </Navbar.Toggle>
        </div>

        <Navbar.Collapse id="responsive-navbar-nav" className="d-none d-md-flex">
          <Nav className="navbar-links ms-auto align-items-center">
            {/* LINKS TRADUZIDOS COM t() */}
            <Nav.Link as={NavLink} to={`/${currentLang}`} className="navbar-link" end>
              {t('nav_home')}
            </Nav.Link>
            <Nav.Link as={NavLink} to={`/${currentLang}/about`} className="navbar-link">
              {t('nav_about')}
            </Nav.Link>
            <Nav.Link as={NavLink} to={`/${currentLang}/portfolio`} className="navbar-link">
              {t('nav_portfolio')}
            </Nav.Link>
            <Nav.Link as={NavLink} to={`/${currentLang}/orcamento`} className="navbar-link">
              {t('nav_orcamento')}
            </Nav.Link>
            <Nav.Link as={NavLink} to={`/${currentLang}/contact`} className="navbar-link">
              {t('nav_contact')}
            </Nav.Link>
            
            {/* Seletor Desktop */}
            <div className="language-selector-desktop ms-4">
                <Button variant="link" className={`lang-btn ${currentLang === 'pt' ? 'active' : ''}`} onClick={() => switchLanguage('pt')}>
                    🇧🇷 PT
                </Button>
                <span className="text-white">|</span>
                <Button variant="link" className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`} onClick={() => switchLanguage('en')}>
                    🇺🇸 EN
                </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Menu Mobile */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <Nav className="d-flex flex-column">
          <Nav.Link as={NavLink} to={`/${currentLang}`} onClick={toggleMenu} className="nav-link" end>{t('nav_home')}</Nav.Link>
          <Nav.Link as={NavLink} to={`/${currentLang}/about`} onClick={toggleMenu} className="nav-link">{t('nav_about')}</Nav.Link>
          <Nav.Link as={NavLink} to={`/${currentLang}/portfolio`} onClick={toggleMenu} className="nav-link">{t('nav_portfolio')}</Nav.Link>
          <Nav.Link as={NavLink} to={`/${currentLang}/orcamento`} onClick={toggleMenu} className="nav-link">{t('nav_orcamento')}</Nav.Link>
          <Nav.Link as={NavLink} to={`/${currentLang}/contact`} onClick={toggleMenu} className="nav-link">{t('nav_contact')}</Nav.Link>
        </Nav>
      </div>

      <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
    </Navbar>
  );
};

export default Header;