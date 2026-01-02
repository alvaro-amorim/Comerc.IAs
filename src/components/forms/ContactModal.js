import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // <--- Import

const ContactModal = ({ show, handleClose, children }) => {
    const { t } = useTranslation(); // <--- Hook

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('contact_title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
};

export default ContactModal;