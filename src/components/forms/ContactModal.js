import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ContactModal = ({ show, handleClose, children }) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="c-contactModalDialog"
      contentClassName="c-contactModal"
      backdropClassName="c-contactModalBackdrop"
    >
      <div className="c-contactModal__topGlow" aria-hidden="true" />

      <Modal.Header className="c-contactModalHeader">
        <Modal.Title className="c-contactModalTitle">
          {t('contact_title', 'Fale com a gente')}
        </Modal.Title>

        <button
          type="button"
          className="c-contactModalClose"
          onClick={handleClose}
          aria-label={t('btn_close', 'Fechar')}
          title={t('btn_close', 'Fechar')}
        >
          ✕
        </button>
      </Modal.Header>

      <Modal.Body className="c-contactModalBody">{children}</Modal.Body>
    </Modal>
  );
};

export default ContactModal;
