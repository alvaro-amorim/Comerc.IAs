import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons'; // Importe o ícone de chat

const Footer = ({ onChatClick }) => {
    const primaryColor = '#06243d';

    return (
        <footer style={{ backgroundColor: primaryColor }} className="text-white py-4 mt-5">
            <Container>
                <Row className="align-items-center justify-content-between text-center text-md-start">
                    <Col md={4} className="mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start">
                        <div className="d-flex space-x-3">
                            <a href="https://www.instagram.com/comerc_ias?igsh=MWFwZjVpYWJqaXh5aA==" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                                <FontAwesomeIcon icon={faInstagram} size="2x" />
                            </a>
                            <a href="https://www.tiktok.com/@comerc.ias?_t=ZM-8yGGSD03msS&_r=1" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                                <FontAwesomeIcon icon={faTiktok} size="2x" />
                            </a>
                            <a href="https://wa.me/5532991147944" target="_blank" rel="noopener noreferrer" className="text-white">
                                <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                            </a>
                        </div>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <p className="mb-0 text-sm-center text-md-center">&copy; 2025 Comerc IAs – Todos os direitos reservados.</p>
                    </Col>
                    <Col md={4} className="d-none d-md-flex justify-content-end">
                        <div onClick={onChatClick} style={{ cursor: 'pointer' }} className="d-flex align-items-center text-white">
                            <span className="me-2 fw-bold">Fale conosco!</span>
                            <FontAwesomeIcon icon={faComment} size="2x" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;