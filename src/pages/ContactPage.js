import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ContactForm from '../components/forms/ContactForm';
import ContactInfo from '../components/ContactInfo'; // Importa o novo componente

const ContactPage = () => {
    return (
        <section id="contact_form" className="py-5 bg-light">
            <Container>
                <Row className="justify-content-center g-4">
                    <Col md={6}>
                        <h2 className="text-primary fw-bold mb-4 text-center">Fale Conosco</h2>
                        <ContactForm />
                    </Col>
                    <Col md={4} className="d-flex align-items-center justify-content-center">
                        <ContactInfo />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ContactPage;