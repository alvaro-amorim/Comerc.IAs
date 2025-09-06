import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logoBranca from '../assets/images/logo.branca.png';
import '../styles/Header.css'; // Import do CSS

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Navbar expand="md" fixed="top" className="custom-navbar">
      <Container className="custom-navbar-container">
        {/* Logo */}
        <Navbar.Brand as={NavLink} to="/">
          <img
            src={logoBranca}
            alt="Comerc IAs Logo"
            className="navbar-logo"
          />
        </Navbar.Brand>

        {/* Botão Toggle */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={toggleMenu} className="navbar-toggle">
          <FontAwesomeIcon icon={faBars} />
        </Navbar.Toggle>

        {/* Menu Desktop */}
        <Navbar.Collapse id="responsive-navbar-nav" className="d-none d-md-flex">
          <Nav className="navbar-links">
            <Nav.Link as={NavLink} to="/" className="navbar-link" activeClassName="active-link" end>
              HOME
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="navbar-link" activeClassName="active-link">
              Sobre
            </Nav.Link>
            <Nav.Link as={NavLink} to="/portfolio" className="navbar-link" activeClassName="active-link">
              Portfólio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" className="navbar-link" activeClassName="active-link">
              Contato
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Menu Mobile */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <Nav className="d-flex flex-column">
          <Nav.Link as={NavLink} to="/" onClick={toggleMenu} className="nav-link" activeClassName="active-link" end>
            HOME
          </Nav.Link>
          <Nav.Link as={NavLink} to="/about" onClick={toggleMenu} className="nav-link" activeClassName="active-link">
            Sobre
          </Nav.Link>
          <Nav.Link as={NavLink} to="/portfolio" onClick={toggleMenu} className="nav-link" activeClassName="active-link">
            Portfólio
          </Nav.Link>
          <Nav.Link as={NavLink} to="/contact" onClick={toggleMenu} className="nav-link" activeClassName="active-link">
            Contato
          </Nav.Link>
        </Nav>
      </div>

      {/* Overlay */}
      <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
    </Navbar>
  );
};

export default Header;
