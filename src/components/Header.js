import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logoBranca from '../assets/images/logo.branca.png';

const Header = () => {
    const primaryColor = '#06243d';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Navbar expand="md" fixed="top" style={{ backgroundColor: primaryColor }} className="shadow-sm py-4">
            <Container className="d-flex justify-content-between align-items-center">
                <Navbar.Brand as={NavLink} to="/">
                    <img
                        src={logoBranca}
                        height="48"
                        className="d-inline-block align-top rounded-md"
                        alt="Comerc IAs Logo"
                    />
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={toggleMenu} className="border-0">
                    <FontAwesomeIcon icon={faBars} style={{ color: 'white', fontSize: '1.5rem' }} />
                </Navbar.Toggle>
                
                <Navbar.Collapse id="responsive-navbar-nav" className="ms-auto d-none d-md-flex">
                    <Nav className="d-flex align-items-center">
                        <Nav.Link as={NavLink} to="/" className="text-white fw-bold me-3" activeClassName="active-link" end>
                            HOME
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/about" className="text-white fw-bold me-3" activeClassName="active-link">
                            Sobre
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/portfolio" className="text-white fw-bold me-3" activeClassName="active-link">
                            Portifólio
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/contact" className="text-white fw-bold" activeClassName="active-link">
                            Contato
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
            
            {/* Menu Mobile */}
            <div className={`mobile-menu md:hidden ${isMenuOpen ? 'open' : ''}`}>
                <button
                    className="close-menu-button"
                    onClick={toggleMenu}
                    style={{
                        backgroundColor: '#06243d',
                        color: 'white',
                        borderRadius: '50%',
                        width: '2.5rem',
                        height: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        position: 'absolute',
                        top: '1rem',
                        right: '1.5rem',
                        zIndex: 1001
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <Nav className="d-flex flex-column">
                    <Nav.Link as={NavLink} to="/" onClick={toggleMenu} className="text-white fw-bold px-4 py-3" activeClassName="active-link" end>HOME</Nav.Link>
                    <Nav.Link as={NavLink} to="/about" onClick={toggleMenu} className="text-white fw-bold px-4 py-3" activeClassName="active-link">Sobre</Nav.Link>
                    <Nav.Link as={NavLink} to="/portfolio" onClick={toggleMenu} className="text-white fw-bold px-4 py-3" activeClassName="active-link">Portifólio</Nav.Link>
                    <Nav.Link as={NavLink} to="/contact" onClick={toggleMenu} className="text-white fw-bold px-4 py-3" activeClassName="active-link">Contato</Nav.Link>
                </Nav>
            </div>

            {/* Overlay para o fundo escuro quando o menu está aberto */}
            <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
        </Navbar>
    );
};

export default Header;