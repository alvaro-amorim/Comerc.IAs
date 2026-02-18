import React, { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import logoBranca from '../assets/images/logo.branca.png';
import '../styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = useMemo(() => {
    const l = (i18n.language || 'pt').toLowerCase();
    return l.startsWith('en') ? 'en' : 'pt';
  }, [i18n.language]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const switchLanguage = (targetLang) => {
    if (targetLang === currentLang) return;

    // Troca somente o prefixo /pt ou /en no começo da URL
    const newPath = location.pathname.replace(/^\/(pt|en)(?=\/|$)/, `/${targetLang}`);
    i18n.changeLanguage(targetLang);
    navigate(newPath);
    closeMenu();
  };

  const navItems = [
    { to: `/${currentLang}`, label: t('nav_home') },
    { to: `/${currentLang}/about`, label: t('nav_about') },
    { to: `/${currentLang}/portfolio`, label: t('nav_portfolio') },
    { to: `/${currentLang}/contact`, label: t('nav_contact') },
  ];

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <Container className="site-header__container">
          {/* Brand */}
          <NavLink to={`/${currentLang}`} className="brand" onClick={closeMenu} aria-label="Ir para Home">
            <img src={logoBranca} alt="Comerc IAs" className="brand__logo" />
          </NavLink>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Menu principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === `/${currentLang}`}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="header-right">
            {/* Desktop language pill */}
            <div className="lang-pill" role="group" aria-label="Idioma">
              <button
                type="button"
                className={`lang-btn ${currentLang === 'pt' ? 'active' : ''}`}
                onClick={() => switchLanguage('pt')}
              >
                BR&nbsp;PT
              </button>
              <span className="lang-divider">|</span>
              <button
                type="button"
                className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
                onClick={() => switchLanguage('en')}
              >
                US&nbsp;EN
              </button>
            </div>

            {/* CTA único (sem repetir no menu) */}
            <NavLink to={`/${currentLang}/orcamento`} className="header-cta" onClick={closeMenu}>
              {t('nav_orcamento')}
            </NavLink>

            {/* Burger (mobile) */}
            <button
              type="button"
              className="burger"
              onClick={toggleMenu}
              aria-label="Abrir menu"
              aria-expanded={isMenuOpen}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </Container>
      </header>

      {/* Overlay */}
      <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu} />

      {/* Mobile drawer */}
      <aside className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
        <button className="close-menu-button" onClick={closeMenu} aria-label="Fechar menu">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="mobile-menu__head">
          <div className="mobile-menu__brand">
            <img src={logoBranca} alt="Comerc IAs" className="mobile-menu__logo" />
          </div>

          <div className="mobile-menu__langs" role="group" aria-label="Idioma">
            <button
              type="button"
              className={`mobile-lang ${currentLang === 'pt' ? 'active' : ''}`}
              onClick={() => switchLanguage('pt')}
            >
              BR&nbsp;PT
            </button>
            <button
              type="button"
              className={`mobile-lang ${currentLang === 'en' ? 'active' : ''}`}
              onClick={() => switchLanguage('en')}
            >
              US&nbsp;EN
            </button>
          </div>
        </div>

        <nav className="mobile-menu__nav" aria-label="Menu mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${currentLang}`}
              className="nav-link"
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mobile-menu__cta">
          <NavLink to={`/${currentLang}/orcamento`} className="mobile-cta" onClick={closeMenu}>
            {t('nav_orcamento')}
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Header;