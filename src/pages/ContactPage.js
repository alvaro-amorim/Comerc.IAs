import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // <--- Importação
import ContactForm from '../components/forms/ContactForm';
import ContactInfo from '../components/ContactInfo';
import '../styles/ContactPage.css';

const ContactPage = () => {
    const { t } = useTranslation(); // <--- Hook

    return (
        <section id="contact-page" className="contact-page-section">
            <Container className="contact-page-container">
                <Row className="contact-page-row">
                    {/* Coluna do formulário */}
                    <Col md={6} className="contact-form-col">
                        <h2 className="contact-title">{t('contact_title')}</h2>
                        <div className="contact-card">
                            <div className="contact-form-wrapper">
                                <ContactForm />
                            </div>
                        </div>
                    </Col>

                    {/* Coluna das informações de contato */}
                    <Col md={4} className="contact-info-col">
                        <div className="contact-info-wrapper">
                            <ContactInfo />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ContactPage;