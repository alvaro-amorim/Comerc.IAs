import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import servicos from '../assets/images/servicos.png'; // Importa a imagem como um módulo

const AboutPage = () => {
    return (
        <section id="about" className="py-5 bg-white">
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="mb-4 mb-md-0">
                        <h2 className="text-primary fw-bold mb-4">Quem Somos</h2>
                        <p className="lead text-gray-700">
                            Na Comerc IAs, criamos vídeos hiper realistas com inteligência artificial para transformar sua comunicação. Entre os nossos serviços estão:
                        </p>
                        <ul className="list-unstyled text-gray-700">
                            <li>• Vídeos para redes sociais (Instagram, TikTok e outras) com linguagem dinâmica e engajante;</li>
                            <li>• Apresentações comerciais de empreendimentos e produtos, substituindo slides por vídeos imersivos;</li>
                            <li>• Apresentações institucionais de marcas com personagens realistas falantes em português;</li>
                            <li>• Transformações de fotos comuns em vídeos interativos de alta qualidade;</li>
                            <li>• Videoclipes musicais com criação e direção baseadas em IA;</li>
                            <li>• Produção de vídeos para treinamentos e reuniões corporativas com avatares personalizados.</li>
                        </ul>
                        <p className="lead text-gray-700">
                            Tudo com roteiros detalhados, realismo impressionante, entrega ágil e total adaptação à sua necessidade.
                        </p>
                    </Col>
                    <Col md={6}>
                        <Image src={servicos} alt="Sobre a Comerc IAs" fluid rounded className="shadow-lg" />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AboutPage;