import React from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="c-contactInfo">
      <div className="c-contactInfo__row">
        <a
          className="c-contactInfo__item"
          href="https://wa.me/5532984869192"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <span className="c-contactInfo__icon" aria-hidden="true">
            <FontAwesomeIcon icon={faWhatsapp} />
          </span>
          <span className="c-contactInfo__text">
            <strong>{t('contact_whatsapp', 'WhatsApp')}</strong>
            <small>{t('contact_whatsapp_hint', 'Clique para conversar')}</small>
          </span>
        </a>

        <a
          className="c-contactInfo__item"
          href="https://www.instagram.com/comerc_ias"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <span className="c-contactInfo__icon" aria-hidden="true">
            <FontAwesomeIcon icon={faInstagram} />
          </span>
          <span className="c-contactInfo__text">
            <strong>{t('contact_instagram', 'Instagram')}</strong>
            <small>{t('contact_instagram_hint', 'Veja nossos criativos')}</small>
          </span>
        </a>

        <a className="c-contactInfo__item" href="tel:+5532984869192" aria-label="Telefone">
          <span className="c-contactInfo__icon" aria-hidden="true">
            <FontAwesomeIcon icon={faPhone} />
          </span>
          <span className="c-contactInfo__text">
            <strong>{t('contact_phone', 'Telefone')}</strong>
            <small>{t('contact_phone_hint', 'Ligar agora')}</small>
          </span>
        </a>
      </div>

      <div className="c-contactInfo__note">
        {t(
          'contact_note_fallback',
          'Dica: se você enviar referência (exemplo) + objetivo, o retorno fica MUITO mais rápido.'
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
