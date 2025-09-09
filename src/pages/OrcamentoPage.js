import React, { useState, useRef } from 'react';
import { Container, Form, Button, Row, Col, Card, Collapse, Alert, Modal } from 'react-bootstrap';
import precosData from '../data/precos.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faPrint, faShareAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useReactToPrint } from 'react-to-print';
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
  const [showResultCard, setShowResultCard] = useState(false);
  const [agreedToContact, setAgreedToContact] = useState(false); // Adicionado
  const [showShareModal, setShowShareModal] = useState(false);
  const componentRef = useRef();

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

  const handleAgreementChange = (e) => {
    setAgreedToContact(e.target.checked);
  };

  const calculateBudget = () => {
    setAlert(null);
    setShowResultCard(false);

    if (!userData.nome || !userData.email || !userData.empresa || !userData.telefone) {
      setAlert({ variant: 'danger', message: 'Por favor, preencha todos os seus dados.' });
      return;
    }

    if (!agreedToContact) {
      setAlert({ variant: 'danger', message: 'Você precisa aceitar ser contactado para gerar o orçamento.' });
      return;
    }

    const selectedCount = Object.keys(selectedServices).reduce((count, category) => count + Object.keys(selectedServices[category]).length, 0);
    if (selectedCount === 0) {
      setAlert({ variant: 'danger', message: 'Selecione pelo menos um serviço para gerar o orçamento.' });
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
    
    sendEmail(finalPrice, discount);
    setShowResultCard(true);
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
      await fetch(formspreeUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          from: "comerc.ias.prod@gmail.com",
          to: "comerc.ias.prod@gmail.com",
          _replyto: userData.email,
          subject: "Novo Orçamento - Comerc IAs",
          body: emailContent
        })
      });

      setAlert({ variant: 'success', message: 'Orçamento enviado com sucesso! Verifique seu e-mail.' });
      setShowResultCard(true);
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Houve um erro ao enviar o orçamento. Tente novamente.' });
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Orçamento Comerc IAs - ${userData.nome}`
  });

  const getShareText = () => {
    const serviceList = Object.entries(selectedServices)
      .map(([category, services]) => {
        const serviceItems = Object.entries(services)
          .map(([title, itemPrice]) => `• ${title} (R$ ${itemPrice.toFixed(2)})`)
          .join('\n');
        return `*${category}*\n${serviceItems}`;
      })
      .join('\n\n');
    
    return `Olá, ${userData.nome}!
O seu orçamento com a Comerc IAs ficou assim:

${serviceList}

Total: R$ ${(finalPrice + appliedDiscount).toFixed(2)}
Desconto: R$ ${appliedDiscount.toFixed(2)}
Preço Final: R$ ${finalPrice.toFixed(2)}

Qualquer dúvida, é só nos chamar!`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareText());
    setAlert({ variant: 'success', message: 'Orçamento copiado para a área de transferência!' });
    setShowShareModal(false);
  };

  const handleDownload = () => {
    const contentToDownload = `
      Orçamento Comerc IAs

      Cliente: ${userData.nome}
      E-mail: ${userData.email}
      Telefone: ${userData.telefone}
      Empresa: ${userData.empresa}

      --------------------------------------

      Serviços Selecionados:
      ${Object.entries(selectedServices).map(([category, services]) => 
          `\n*${category}*\n${Object.entries(services).map(([title, price]) => 
            `- ${title} (R$ ${price.toFixed(2)})`
          ).join('\n')}`
      ).join('\n')}

      --------------------------------------

      Total Bruto: R$ ${(finalPrice + appliedDiscount).toFixed(2)}
      Desconto: R$ ${appliedDiscount.toFixed(2)}
      Preço Final: R$ ${finalPrice.toFixed(2)}

      --------------------------------------

      Observações: ${precosData.orcamento.observacoes}
    `;
    const blob = new Blob([contentToDownload], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orcamento-comerc-ias.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <Container className="py-5">
      <h2 className="text-primary fw-bold text-center mb-4">Gerador de Orçamento</h2>
      
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
              
              {/* Checkbox de aceite */}
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  id="agreedToContact" 
                  label="Aceito ser contactado pelas formas de contato fornecidas."
                  checked={agreedToContact}
                  onChange={handleAgreementChange}
                />
              </Form.Group>
              
              {alert && <Alert variant={alert.variant} className="mb-3">{alert.message}</Alert>}

              <Button onClick={calculateBudget} className="w-100 rounded-pill mt-3">
                Calcular Orçamento
              </Button>
            </Form>

            <div className="mt-4">
              <h6>Observações:</h6>
              <p>{precosData.orcamento.observacoes}</p>
            </div>
          </Card>
          
          {showResultCard && (
            <Card className="p-4 shadow mt-4" ref={componentRef}>
              <h4 className="text-center">Seu Orçamento Final</h4>
              <hr />
              <div className="orcamento-detalhes">
                <p><strong>Nome:</strong> {userData.nome}</p>
                <p><strong>E-mail:</strong> {userData.email}</p>
                <p><strong>Empresa:</strong> {userData.empresa}</p>
                <p><strong>Telefone:</strong> {userData.telefone}</p>
                <h5 className="mt-4">Serviços Selecionados:</h5>
                <ul className="list-unstyled">
                  {Object.entries(selectedServices).map(([category, services]) => (
                    <li key={category}>
                      <strong>{category}</strong>
                      <ul>
                        {Object.entries(services).map(([title, price]) => (
                          <li key={title}>{title} - R$ {price.toFixed(2)}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
              <hr />
              <div className="orcamento-valores text-end">
                <p><strong>Total Bruto:</strong> R$ {(finalPrice + appliedDiscount).toFixed(2)}</p>
                <p><strong>Desconto Aplicado:</strong> R$ {appliedDiscount.toFixed(2)}</p>
                <h5 className="text-primary fw-bold">Preço Final: R$ {finalPrice.toFixed(2)}</h5>
              </div>
              
              <div className="mt-4 d-flex justify-content-center gap-3">
                <Button variant="outline-primary" onClick={handlePrint}>
                  <FontAwesomeIcon icon={faPrint} className="me-2" /> Imprimir
                </Button>
                <Button variant="outline-primary" onClick={handleShare}>
                  <FontAwesomeIcon icon={faShareAlt} className="me-2" /> Compartilhar
                </Button>
                <Button variant="outline-primary" onClick={handleDownload}>
                  <FontAwesomeIcon icon={faDownload} className="me-2" /> Baixar
                </Button>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Compartilhar Orçamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Copie o texto abaixo para compartilhar o orçamento:</p>
          <Form.Control
            as="textarea"
            rows={10}
            readOnly
            value={getShareText()}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShareModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={copyToClipboard}>
            Copiar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrcamentoPage;