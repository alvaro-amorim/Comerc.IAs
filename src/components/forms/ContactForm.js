import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ContactForm = () => {
  const { t } = useTranslation();

  const [status, setStatus] = useState({
    isSubmitted: false,
    message: null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus({ isSubmitted: false, message: null });

    const form = event.target;
    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setStatus({ isSubmitted: true, message: t('form_success') });
        form.reset();
      } else {
        const result = await response.json();
        if (result.errors) {
          setStatus({
            isSubmitted: false,
            message: 'Erro: ' + result.errors.map((e) => e.message).join(', '),
          });
        } else {
          setStatus({ isSubmitted: false, message: t('form_error_generic') });
        }
      }
    } catch {
      setStatus({ isSubmitted: false, message: t('form_error_connection') });
    }
  };

  return (
    <>
      {status.message && (
        <Alert variant={status.isSubmitted ? 'success' : 'danger'} className="mb-3">
          {status.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} action="https://formspree.io/f/xkgzjyjn" method="POST">
        <Form.Group className="mb-3">
          <Form.Label>{t('form_name')}</Form.Label>
          <Form.Control type="text" name="Nome" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('form_phone')}</Form.Label>
          <Form.Control type="tel" name="Telefone" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('form_email')}</Form.Label>
          <Form.Control type="email" name="E-mail" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('form_company')}</Form.Label>
          <Form.Control type="text" name="Empresa" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('form_message')}</Form.Label>
          <Form.Control as="textarea" name="Mensagem" rows={5} required />
        </Form.Group>

        <Button type="submit" className="w-100 rounded-pill mt-3 c-contactSubmitBtn">
          {t('btn_send')}
        </Button>
      </Form>
    </>
  );
};

export default ContactForm;
