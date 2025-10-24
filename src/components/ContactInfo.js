import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const ContactInfo = () => {
    return (
        <Card className="p-4 text-center">
            <h5 className="fw-bold">Outras maneiras de entrar em contato!</h5>
            <p className="text-muted">(A resposta pode ser mais rápida.)</p>
            <div className="d-flex justify-content-center mt-4">
                <a href="https://wa.me/5532984869192" target="_blank" rel="noopener noreferrer" className="text-decoration-none me-4">
                    <FontAwesomeIcon icon={faWhatsapp} size="3x" style={{ color: '#25D366' }} />
                </a>
                <a href="https://www.instagram.com/comerc_ias?igsh=MWFwZjVpYWJqaXh5aA==" target="_blank" rel="noopener noreferrer" className="text-decoration-none me-4">
                    <FontAwesomeIcon icon={faInstagram} size="3x" style={{ color: '#E4405F' }} />
                </a>
                <a href="tel:+5532984869192" className="text-decoration-none">
                    <FontAwesomeIcon icon={faPhone} size="3x" style={{ color: '#007ACC' }} />
                </a>
            </div>
        </Card>
    );
};

export default ContactInfo;