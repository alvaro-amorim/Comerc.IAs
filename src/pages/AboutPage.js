import React from "react";
import "../styles/AboutPage.css";
import servicos from "../assets/images/servicos.png"; // ajuste o caminho se necessário

// Meta (adicione ao head da página / servidor se preferir):
// <title>Comerc IAs — Vídeos comerciais com IA e alto impacto</title>
// <meta name="description" content="Criamos vídeos hiper-realistas para empresas: comerciais, reels, vídeos institucionais e treinamentos com avatares e narração em português. Portfólio e orçamento rápido." />
// Keywords sugestão: vídeos comerciais com inteligência artificial, comerciais com IA, vídeos hiper-realistas para redes sociais, reels comerciais para produtos

const AboutPage = () => {
  return (
    <section id="about" className="about-section">
      <div className="container-lg about-container">
        {/* HERO / TOP */}
        <header className="about-hero">
          <h1 className="about-title">Transformamos ideias em vídeos que convertem</h1>
          <p className="about-subtitle">
            Na <strong>Comerc IAs</strong> criamos comerciais e conteúdos em vídeo que
            contam histórias reais e vendem sem precisar gritar. Unimos roteiro
            estratégico, avatares e narração natural em português com as melhores
            tecnologias de inteligência artificial.
          </p>
          <div className="about-ctas">
            <a className="btn btn-primary" href="/portfolio">Ver portfólio</a>
            <a className="btn btn-secondary" href="/contact">Solicitar orçamento</a>
          </div>
        </header>

        <div className="about-grid">
          {/* LEFT: texto detalhado */}
          <div className="about-text">
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
                <li>Otimização para plataformas sociais e SEO de vídeo (títulos, descrições e tags).</li>
                <li>Criações que respeitam a identidade da marca — nada que pareça “feito por IA”.</li>
              </ul>
            </div>

            <div className="about-ctas-bottom">
              <a className="btn btn-primary" href="https://wa.me/5532991147944">Fale com um de nossos especialistas!</a>
            </div>
          </div>

          {/* RIGHT: painel visual com imagem / serviços em destaque */}
          <aside className="about-panel" aria-hidden="false">
            <div className="panel-inner">
              <img src={servicos} alt="Serviços Comerc IAs" className="panel-image" />

              <div className="panel-cta">
                <a className="btn btn-light" href="/portfolio">Ver exemplos</a>
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER NOTE / SUGGESTED SEO KEYWORDS (visível apenas para admins if needed) */}
        <small className="visually-hidden meta-keywords" aria-hidden="true">
          palavras-chave: vídeos comerciais com inteligência artificial, comerciais com IA para empresas, vídeos hiper-realistas para redes sociais, reels comerciais para produtos, transformação de fotos em vídeo, vídeo institucional com avatares, treinamento em vídeo com IA
        </small>
      </div>
    </section>
  );
};

export default AboutPage;
