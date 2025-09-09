import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Collapse, Alert } from 'react-bootstrap';
import precosData from '../data/precos.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../styles/OrcamentoPage.css';

const OrcamentoPage = () => {
  const [selectedServices, setSelectedServices] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    empresa: '',
    telefone: '',
    cupom: ''
  });
  const [finalPrice, setFinalPrice] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [alert, setAlert] = useState(null);

  const toggleCategory = (categoryName) => {
    setOpenCategories(prevState => ({
      ...prevState,
      [categoryName]: !prevState[categoryName]
    }));
  };

  const handleServiceSelect = (categoryName, serviceTitle, price) => {
    setSelectedServices(prevState => {
      const isSelected = prevState[categoryName] && prevState[categoryName][serviceTitle];
      const newSelection = { ...prevState };

      if (isSelected) {
        const updatedCategory = { ...newSelection[categoryName] };
        delete updatedCategory[serviceTitle];

        if (Object.keys(updatedCategory).length === 0) {
          delete newSelection[categoryName];
        } else {
          newSelection[categoryName] = updatedCategory;
        }
      } else {
        newSelection[categoryName] = {
          ...newSelection[categoryName],
          [serviceTitle]: price
        };
      }
      return newSelection;
    });
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };

  const calculateBudget = () => {
    if (!userData.nome || !userData.email || !userData.empresa || !userData.telefone) {
      setAlert({ variant: 'danger', message: 'Por favor, preencha todos os seus dados.' });
      return;
    }

    let total = 0;
    for (const category in selectedServices) {
      for (const service in selectedServices[category]) {
        total += selectedServices[category][service];
      }
    }

    let discount = 0;
    if (userData.cupom.toUpperCase() === 'IA20') {
      discount = total * 0.20;
    }

    const finalPrice = total - discount;
    setFinalPrice(finalPrice);
    setAppliedDiscount(discount);

    const confirmation = window.confirm(`O seu orçamento será enviado para o seu e-mail. Ao confirmar, você nos autoriza a entrar em contato pelos meios fornecidos.`);
    if (confirmation) {
      sendEmail(finalPrice, discount);
    }
  };

  const sendEmail = async (price, discount) => {
    const serviceList = Object.entries(selectedServices)
      .map(([category, services]) => {
        const serviceItems = Object.entries(services)
          .map(([title, itemPrice]) => `- ${title} (R$ ${itemPrice.toFixed(2)})`)
          .join('\n');
        return `*${category}*\n${serviceItems}`;
      })
      .join('\n\n');

    const emailContent = `
      Novo Orçamento de ${userData.nome}
      E-mail: ${userData.email}
      Telefone: ${userData.telefone || 'Não informado'}
      Empresa/Instagram: ${userData.empresa || 'Não informado'}

      ---
      
      Serviços selecionados:
      
      ${serviceList}
      
      ---
      
      Total do Orçamento: R$ ${(price + discount).toFixed(2)}
      Desconto Aplicado: R$ ${discount.toFixed(2)}
      Preço Final: R$ ${price.toFixed(2)}
    `;

    try {
      const formspreeUrl = "https://formspree.io/f/xwpnyvba"; 
      const response = await fetch(formspreeUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          from: "comerc.ias.prod@gmail.com",
          to: "comerc.ias.prod@gmail.com",
          _replyto: userData.email, // Adiciona o e-mail do usuário para que você possa responder
          subject: "Novo Orçamento - Comerc IAs",
          body: emailContent
        })
      });

      if (response.ok) {
        setAlert({ variant: 'success', message: 'Orçamento enviado com sucesso! Verifique seu e-mail.' });
      } else {
        setAlert({ variant: 'danger', message: 'Houve um erro ao enviar o orçamento. Tente novamente.' });
      }
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Houve um erro de conexão. Tente novamente.' });
    }
  };

  return (
    <Container className="py-5">
      <h2 className="text-primary fw-bold text-center mb-4">Gerador de Orçamento</h2>
      
      {alert && <Alert variant={alert.variant}>{alert.message}</Alert>}

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow">
            <h4 className="mb-3">Selecione os Serviços</h4>
            <div className="orcamento-list mb-4">
              {precosData.orcamento.categorias.map(categoria => (
                <div key={categoria.nome} className="category-item mb-2">
                  <div
                    onClick={() => toggleCategory(categoria.nome)}
                    className="d-flex justify-content-between align-items-center p-3 rounded"
                    style={{ backgroundColor: '#f0f0f0', cursor: 'pointer' }}
                  >
                    <h5 className="mb-0">{categoria.nome}</h5>
                    <FontAwesomeIcon icon={openCategories[categoria.nome] ? faChevronUp : faChevronDown} />
                  </div>
                  <Collapse in={openCategories[categoria.nome]}>
                    <div className="services-list p-3 border rounded">
                      {categoria.servicos.map((servico, index) => (
                        <Form.Check
                          key={index}
                          type="checkbox"
                          id={`${categoria.nome}-${servico.titulo}`}
                          label={`${servico.titulo} - R$ ${servico.preco.toFixed(2)}`}
                          onChange={() => handleServiceSelect(categoria.nome, servico.titulo, servico.preco)}
                          checked={selectedServices[categoria.nome] && selectedServices[categoria.nome][servico.titulo]}
                        />
                      ))}
                    </div>
                  </Collapse>
                </div>
              ))}
            </div>

            <h4 className="mb-3">Suas Informações</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nome:</Form.Label>
                <Form.Control type="text" name="nome" value={userData.nome} onChange={handleUserInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>E-mail:</Form.Label>
                <Form.Control type="email" name="email" value={userData.email} onChange={handleUserInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nome da Empresa ou Instagram:</Form.Label>
                <Form.Control type="text" name="empresa" value={userData.empresa} onChange={handleUserInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Telefone (com DDD):</Form.Label>
                <Form.Control type="tel" name="telefone" value={userData.telefone} onChange={handleUserInputChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cupom de Desconto:</Form.Label>
                <Form.Control type="text" name="cupom" value={userData.cupom} onChange={handleUserInputChange} />
              </Form.Group>
              <Button onClick={calculateBudget} className="w-100 rounded-pill mt-3">
                Calcular Orçamento
              </Button>
            </Form>

            <div className="mt-4">
              <h6>Observações:</h6>
              <p>{precosData.orcamento.observacoes}</p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrcamentoPage;