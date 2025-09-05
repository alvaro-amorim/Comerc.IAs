import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import '../styles/Footer.css'; // Import do CSS

const Footer = ({ onChatClick }) => {
  return (
    <footer className="custom-footer">
      <Container>
        <Row className="footer-row">
          {/* Coluna Social */}
          <Col md={4} className="footer-col">
            <div className="footer-socials">
              <a
                href="https://www.instagram.com/comerc_ias?igsh=MWFwZjVpYWJqaXh5aA=="
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <FontAwesomeIcon icon={faInstagram} size="3x" />
              </a>
              <a
                href="https://www.tiktok.com/@comerc.ias?_t=ZM-8yGGSD03msS&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <FontAwesomeIcon icon={faTiktok} size="3x" />
              </a>
              <a
                href="https://wa.me/5532991147944"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="3x" />
              </a>
            </div>
          </Col>

          {/* Coluna Chat */}
          <Col md={4} className="footer-col">
            <div onClick={onChatClick} className="footer-chat">
              <span>Fale conosco!</span>
              <FontAwesomeIcon icon={faComment} size="2x" />
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
