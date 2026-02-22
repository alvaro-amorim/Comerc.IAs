import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';

import '../styles/Footer.css';

const Footer = ({ onChatClick, onOpenCookieSettings }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || '').toLowerCase().startsWith('en') ? 'en' : 'pt';

  const chatLabel = t('footer_chat', { defaultValue: 'Fale conosco!' });
  const privacyLabel = t('footer_privacy_policy', { defaultValue: 'Politica de Privacidade' });
  const cookiesLabel = t('footer_cookies_policy', { defaultValue: 'Politica de Cookies' });
  const settingsLabel = t('footer_cookie_settings', { defaultValue: 'Configurar cookies' });

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

          <Col md={4} className="footer-col footer-col--legal">
            <div className="footer-legalLinks">
              <Link to={`/${currentLang}/privacy`} className="footer-legalLink">
                {privacyLabel}
              </Link>
              <Link to={`/${currentLang}/cookies`} className="footer-legalLink">
                {cookiesLabel}
              </Link>
              <button
                type="button"
                className="footer-legalBtn"
                onClick={onOpenCookieSettings}
              >
                {settingsLabel}
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
