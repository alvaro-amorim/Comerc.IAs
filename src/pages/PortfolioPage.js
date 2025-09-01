import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';

// Importe as imagens do portfólio como módulos
// Ajustado para importar da pasta 'images'
import tumbMarcos from '../assets/images/tumb.marcos.png';
import blueMarine from '../assets/images/blue.marine.jpg';
import fotoTom from '../assets/images/foto.tom.jpg';
import fotoComerc from '../assets/images/foto.comerc.jpg';

// Importe os vídeos do portfólio como módulos
// Ajustado para importar da pasta 'videos'
import reelMarcos from '../assets/videos/reel.marcos.mp4';
import apresentacaoTalita from '../assets/videos/apresentacao.talita.mp4';
import videoTom from '../assets/videos/video.tom.mp4';
import comercApresenta from '../assets/videos/comerc.apresenta.mp4';

// Dados dos projetos do portfólio
const portfolioItemsData = [
    {
        thumbnail: fotoComerc,
        media_type: "video",
        media_url: comercApresenta,
        title: "Apresentação de Marca",
        description: `Apresentar sua marca ao mundo nunca foi tão fácil — e tão inovador. Combinamos inteligência artificial, identidade visual e narrativa para criar vídeos institucionais que impressionam desde o primeiro segundo. Neste exemplo, você vê como tornamos a primeira impressão da nossa própria marca algo marcante e inesquecível.
        👉 Sua marca também merece um vídeo à altura. Entre em contato e vamos criar juntos sua identidade audiovisual.`
    },
    {
        thumbnail: tumbMarcos,
        media_type: "video",
        media_url: reelMarcos,
        title: "Vídeos Gerados com IA",
        description: `Transformamos ideias criativas em roteiros impactantes e cenas envolventes com o uso de inteligência artificial. Este vídeo mostra como usamos humor, storytelling e tecnologia para divulgar serviços e produtos de forma original, memorável e cativante. Criamos personagens consistentes, construímos cenas realistas e desenvolvemos narrativas que conectam com o público — tudo com agilidade e alto nível visual.
        👉 Quer uma campanha que chame atenção de verdade? Fale com a gente e transforme sua ideia em um vídeo inesquecível.`
    },
    {
        thumbnail: blueMarine,
        media_type: "video",
        media_url: apresentacaoTalita,
        title: "Apresentações Comerciais",
        description: `Neste exemplo, usamos IA para desenvolver uma apresentação moderna, dinâmica e visualmente rica para um empreendimento imobiliário. A proposta é substituir slides estáticos por vídeos imersivos que valorizam cada detalhe do seu produto ou serviço, tornando mais fácil conquistar investidores, clientes e parceiros.
        👉 Apresente seus projetos com o impacto que eles merecem. Solicite sua apresentação em vídeo agora mesmo.`
    },
    {
        thumbnail: fotoTom,
        media_type: "video",
        media_url: videoTom,
        title: "Vídeos IA a Partir de Fotos",
        description: `Com apenas uma imagem estática, conseguimos gerar cenas com personagens interagindo, animações realistas e qualidade visual ampliada. Esta tecnologia é ideal para transformar catálogos, portfólios, fotos de produtos ou até mesmo momentos simples em conteúdo altamente compartilhável e profissional.
        👉 Tem uma foto e quer ver ela ganhar vida? Envie pra gente e descubra o que podemos criar com ela.`
    }
];

const PortfolioPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleShow = (project) => {
        setSelectedProject(project);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedProject(null);
    };

    return (
        <section id="portfolio" className="py-5 bg-light">
            <Container className="text-center">
                <h2 className="text-primary fw-bold mb-5">Portifólio</h2>
                <Row className="g-4">
                    {portfolioItemsData.map((project, index) => (
                        <Col key={index} xs={12} sm={6} lg={3}>
                            <Card className="shadow-sm border-0 h-100" onClick={() => handleShow(project)} style={{ cursor: 'pointer' }}>
                                <Card.Img variant="top" src={project.thumbnail} alt={project.title} style={{ height: '200px', objectFit: 'cover' }} />
                                <Card.Body className="d-flex flex-column justify-content-center">
                                    <Card.Title className="fw-bold text-primary mb-0">{project.title.replace('<br>', ' ')}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {selectedProject && (
                <Modal show={showModal} onHide={handleClose} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedProject.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="d-flex flex-column flex-md-row align-items-center">
                        <div className="w-100 mb-4 mb-md-0 d-flex justify-content-center align-items-center">
                            {selectedProject.media_type === "image" ? (
                                <img src={selectedProject.media_url} alt={selectedProject.title} className="img-fluid rounded-lg" />
                            ) : (
                                <video src={selectedProject.media_url} controls autoPlay muted loop className="w-100 rounded-lg" />
                            )}
                        </div>
                        <div className="w-100 ms-md-4">
                            <p className="lead">{selectedProject.description}</p>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </section>
    );
};

export default PortfolioPage;