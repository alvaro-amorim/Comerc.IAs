import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ContactForm from '../components/forms/ContactForm';
import ContactInfo from '../components/ContactInfo';
import '../styles/ContactPage.css'; // import do CSS separado

const ContactPage = () => {
    return (
        <section id="contact-page" className="contact-page-section">
            <Container className="contact-page-container">
                <Row className="contact-page-row">
                    {/* Coluna do formulário */}
                    <Col md={6} className="contact-form-col">
                        <h2 className="contact-title">Fale Conosco</h2>
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
