import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';

import '../styles/Footer.css';

const Footer = ({ onChatClick }) => {
  const { t } = useTranslation();
  const chatLabel = t('footer_chat', { defaultValue: 'Fale conosco!' });

  return (
    <footer className="custom-footer">
      <Container>
        <Row className="footer-row">
          <Col md={4} className="footer-col">
            <div className="footer-socials">
              <a
                href="https://www.instagram.com/comerc_ias?igsh=MWFwZjVpYWJqaXh5aA=="
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram da Comerc IAs"
              >
                <FontAwesomeIcon icon={faInstagram} size="3x" />
              </a>

              <a
                href="https://www.tiktok.com/@comerc.ias?_t=ZM-8yGGSD03msS&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="TikTok da Comerc IAs"
              >
                <FontAwesomeIcon icon={faTiktok} size="3x" />
              </a>

              <a
                href="https://wa.me/5532984869192"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp da Comerc IAs"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="3x" />
              </a>
            </div>
          </Col>

          <Col md={4} className="footer-col">
            <button
              type="button"
              onClick={onChatClick}
              className="footer-chat"
              aria-label={chatLabel}
              style={{ background: 'none', border: 'none' }}
            >
              <span>{chatLabel}</span>
              <FontAwesomeIcon icon={faComment} size="2x" />
            </button>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
