import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // <--- Importação
import SEO from "../components/SEO";
import "../styles/AboutPage.css";
import servicos from "../assets/images/servicos.png";

const AboutPage = () => {
  const { i18n } = useTranslation(); // <--- Hook
  const currentLang = i18n.language || 'pt'; // Idioma atual

  return (
    <>
      <SEO 
        title="Quem Somos - Produtora de Vídeos com IA" 
        description="Criamos vídeos hiper-realistas para empresas: comerciais, reels, vídeos institucionais e treinamentos com avatares e narração em português. Conheça a Comerc IA's."
        href="/about"
      />

      <section id="about" className="about-section">
        <div className="container-lg about-container">
          <header className="about-hero">
            <h1 className="about-title">Transformamos ideias em vídeos que convertem</h1>
            <p className="about-subtitle">
              Na <strong>Comerc IA's</strong> criamos comerciais e conteúdos em vídeo que
              contam histórias reais e vendem sem precisar gritar. Unimos roteiro
              estratégico, avatares e narração natural em português com as melhores
              tecnologias de inteligência artificial.
            </p>
            <div className="about-ctas">
              {/* CORREÇÃO: Links com idioma dinâmico */}
              <Link className="btn btn-primary" to={`/${currentLang}/portfolio`}>Ver portfólio</Link>
              <Link className="btn btn-secondary" to={`/${currentLang}/orcamento`}>Simular orçamento</Link>
            </div>
          </header>

          <div className="about-grid">
            <article className="about-text">
              <h2 className="section-heading">Quem Somos</h2>

              <p className="lead">
                Somos uma produtora especializada em vídeos comerciais e conteúdo
                corporativo com suporte de IA. Criamos roteiros orientados a resultados,
                produções hiper-realistas e narrativas que aumentam engajamento, autoridade
                e conversões.
              </p>

              <ul className="services-list" aria-label="Serviços oferecidos">
                <li><strong>Comerciais e reels para redes sociais</strong> (Instagram, TikTok, YouTube) com linguagem dinâmica e foco em conversão.</li>
                <li><strong>Vídeos institucionais e corporativos</strong> com personagens e avatares que falam a mesma língua do seu público.</li>
                <li><strong>Transformação de imagens em vídeos</strong>: fotos estáticas que ganham movimento e narrativa.</li>
                <li><strong>Mini-documentários e cases</strong> com narração profissional para reforçar credibilidade.</li>
                <li><strong>Videoclipes e peças criativas</strong> com direção orientada por IA.</li>
                <li><strong>Treinamentos e apresentações personalizadas</strong> para times e clientes.</li>
              </ul>

              <p className="summary">
                Entregamos roteiros detalhados, narração natural em português, realismo impressionante e total adaptação ao seu briefing — rapidamente e com qualidade escalável.
              </p>

              <div className="why-choose">
                <h3>Por que escolher a Comerc IAs</h3>
                <ul>
                  <li>Roteiros orientados a resultado (engajamento → conversão).</li>
                  <li>Produção ágil e escalável sem perder personalidade.</li>
                  <li>Criações que respeitam a identidade da marca — nada que pareça “feito por IA”.</li>
                </ul>
              </div>

              <div className="about-ctas-bottom">
                <a 
                  className="btn btn-primary" 
                  href="https://wa.me/5532991147944"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fale com um de nossos especialistas!
                </a>
              </div>
            </article>

            <aside className="about-panel">
              <div className="panel-inner">
                <img 
                  src={servicos} 
                  alt="Serviços e soluções da Comerc IA's" 
                  className="panel-image" 
                />

                <div className="panel-cta">
                  <Link className="btn btn-light" to={`/${currentLang}/portfolio`}>Ver exemplos</Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;