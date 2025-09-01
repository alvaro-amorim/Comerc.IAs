import React from 'react';
import { Modal } from 'react-bootstrap';

const ContactModal = ({ show, handleClose, children }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Fale Conosco</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
        </Modal>
    );
};

export default ContactModal;