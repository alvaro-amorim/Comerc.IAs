import React, { useMemo, useState } from "react";
import { Container, Row, Col, Modal, Badge, Accordion } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import SEO from "../components/SEO";
import "../styles/HomePage.css";

// ===== HOME ASSETS =====
import heroBg from "../assets/images/home/home-hero-bg.png";
import heroMockup from "../assets/images/home/home-hero-mockup.jpg";

import badgeIcon from "../assets/images/home/home-hero-badge-icon.svg";

import iconVideo from "../assets/images/home/home-icon-video.svg";
import icon3d from "../assets/images/home/home-icon-3d.svg";
import iconWeb from "../assets/images/home/home-icon-web.svg";

import service01 from "../assets/images/home/home-services-01.jpg";
import service02 from "../assets/images/home/home-services-02.jpg";
import service03 from "../assets/images/home/home-services-03.jpg";

import logoStrip from "../assets/images/home/home-logo-strip.png";

import avatar01 from "../assets/images/home/home-testimonial-avatar-01.png";
import avatar02 from "../assets/images/home/home-testimonial-avatar-02.png";
import avatar03 from "../assets/images/home/home-testimonial-avatar-03.png";

import enter3dCard from "../assets/images/home/home-enter-3d-card.jpg";

/** Card com tilt sutil (premium) */
function TiltCard({ className = "", children, disabled = false }) {
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 260, damping: 22, mass: 0.7 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);

  const onMove = (e) => {
    if (disabled || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        disabled || reduceMotion
          ? undefined
          : {
              transformStyle: "preserve-3d",
              rotateX,
              rotateY,
            }
      }
    >
      {children}
    </motion.div>
  );
}

/** Botão “magnético” (efeito marca grande) */
function MagneticButton({ className = "", children, ...props }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 320, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 320, damping: 18, mass: 0.5 });

  const onMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - (rect.left + rect.width / 2);
    const py = e.clientY - (rect.top + rect.height / 2);
    x.set(px * 0.18);
    y.set(py * 0.18);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      type="button"
      className={`magnetic-btn ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduceMotion ? undefined : { x: sx, y: sy }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

const HomePage = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const reduceMotion = useReducedMotion();

  const currentLang = useMemo(() => {
    if (lang === "pt" || lang === "en") return lang;
    const l = (i18n.language || "pt").toLowerCase();
    return l.startsWith("en") ? "en" : "pt";
  }, [lang, i18n.language]);

  const [journey, setJourney] = useState("wow"); // "wow" | "quick"
  const [showVideo, setShowVideo] = useState(false);

  // ===== Motion helpers =====
  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
  };

  const inViewProps = { viewport: { once: true, amount: 0.22 } };

  const heroTitle =
    journey === "wow"
      ? "Comerc IA's: VÍDEOS de ALTO IMPACTO para impulsionar seu negócio!"
      : "Direto ao ponto: portfólio + orçamento em poucos cliques.";

  const heroSubtitle =
    journey === "wow"
      ? "Sua produtora ágil: entrega rápida, acabamento premium e foco em conversão — sem burocracia."
      : "Sem enrolação: veja cases, entenda o processo e peça um orçamento rápido.";

  return (
    <>
      <SEO
        title="Comerc IA's - Vídeos, Criativos e Experiências Digitais"
        description="Produção audiovisual, criativos e presença digital com foco em conversão."
        href={`/${currentLang}`}
      />

      {/* HERO */}
      <section className="home-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="home-hero__overlay" />

        <Container className="home-hero__container">
          <Row className="g-4 align-items-center">
            <Col lg={7}>
              <motion.div variants={stagger} initial="hidden" animate="show">
                <motion.div variants={fadeUp} className="home-hero__badge">
                  <Badge bg="primary" className="me-2">
                    Comerc IA&apos;s
                  </Badge>
                  <span className="text-white-50 d-flex align-items-center gap-2">
                    <img
                      src={badgeIcon}
                      alt=""
                      aria-hidden="true"
                      className="home-badgeIcon"
                    />
                    Audiovisual • Criativos • Web
                  </span>
                </motion.div>

                <motion.h1 variants={fadeUp} className="home-hero__title">
                  {heroTitle}
                </motion.h1>

                <motion.p variants={fadeUp} className="home-hero__subtitle">
                  {heroSubtitle}
                </motion.p>

                <motion.div variants={fadeUp} className="hero-trustline">
                  <span>Resposta em até 1 hora útil</span>
                  <span className="dot" />
                  <span>Entrega a partir de 48h</span>
                  <span className="dot" />
                  <span>Direção criativa inclusa</span>
                </motion.div>

                {/* Switch */}
                <motion.div variants={fadeUp} className="home-hero__switch">
                  <button
                    type="button"
                    className={`switch-pill ${journey === "wow" ? "active" : ""}`}
                    onClick={() => setJourney("wow")}
                  >
                    Quero ser encantado
                  </button>
                  <button
                    type="button"
                    className={`switch-pill ${journey === "quick" ? "active" : ""}`}
                    onClick={() => setJourney("quick")}
                  >
                    Estou com pressa
                  </button>
                </motion.div>

                {/* CTA */}
                <motion.div variants={fadeUp} className="home-hero__cta">
                  <Link to={`/${currentLang}/orcamento`} className="link-clean">
                    <MagneticButton className="btn btn-primary btn-lg btn-glow">
                      Fazer orçamento
                    </MagneticButton>
                  </Link>

                  <Link to={`/${currentLang}/portfolio`} className="link-clean">
                    <MagneticButton className="btn btn-outline-light btn-lg">
                      Ver portfólio
                    </MagneticButton>
                  </Link>

                  <a href="#experiencia-3d" className="cta-link">
                    Ver a experiência 3D →
                  </a>
                </motion.div>

                {/* “Pop-up” substituído por bloco real (limpo e pronto) */}
                <motion.div variants={fadeUp} className="callout-card mt-4">
                  <div className="callout-title">Escolha seu caminho</div>
                  <div className="callout-text">
                    Quer o “wow”? Explore a proposta do escritório virtual 3D no desktop.
                    Está com pressa? Use o site normal e peça orçamento em segundos.
                  </div>
                  <div className="callout-actions">
                    <a href="#experiencia-3d" className="link-clean">
                      <MagneticButton className="btn btn-outline-primary">
                        Quero ver o 3D
                      </MagneticButton>
                    </a>
                    <Link to={`/${currentLang}/orcamento`} className="link-clean">
                      <MagneticButton className="btn btn-dark">
                        Quero orçamento agora
                      </MagneticButton>
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </Col>

            <Col lg={5}>
              <TiltCard className="hero-card hero-card--mock">
                <div
                  className="hero-card__media"
                  style={{ backgroundImage: `url(${heroMockup})` }}
                >
                  <div className="hero-card__mediaOverlay" />
                  <div className="hero-card__mediaText">
                    <div className="mini-kicker">Apresentação</div>
                    <div className="mini-title">Assista em 30s</div>
                  </div>
                </div>

                <div className="hero-card__body">
                  <p className="muted mb-3">
                    Um resumo rápido do que entregamos e como seu criativo fica com
                    cara de marca grande.
                  </p>

                  <div className="d-flex gap-2 flex-wrap">
                    <MagneticButton
                      className="btn btn-dark"
                      onClick={() => setShowVideo(true)}
                    >
                      Assistir vídeo
                    </MagneticButton>

                    <Link to={`/${currentLang}/about`} className="link-clean">
                      <MagneticButton className="btn btn-outline-secondary">
                        Como funciona
                      </MagneticButton>
                    </Link>
                  </div>

                  <div className="mini-proof mt-3">
                    <div className="mini-proof__item">
                      <div className="mini-proof__k">+120</div>
                      <div className="mini-proof__t">criativos entregues</div>
                    </div>
                    <div className="mini-proof__item">
                      <div className="mini-proof__k">4,9/5</div>
                      <div className="mini-proof__t">avaliação média</div>
                    </div>
                    <div className="mini-proof__item">
                      <div className="mini-proof__k">48–72h</div>
                      <div className="mini-proof__t">prazo comum</div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SERVIÇOS */}
      <motion.section
        className="section"
        {...inViewProps}
        initial="hidden"
        whileInView="show"
      >
        <Container>
          <motion.div variants={fadeUp} className="section-head">
            <h2 className="section-title">Serviços</h2>
            <p className="section-subtitle">
              Três frentes para elevar sua marca com estética premium e foco em conversão.
            </p>
          </motion.div>

          <motion.div variants={stagger}>
            <Row className="g-3">
              {[
                {
                  icon: iconVideo,
                  img: service01,
                  title: "Criativos e anúncios",
                  desc: "Reels, anúncios e peças que chamam atenção e geram ação.",
                  cta: "Ver cases",
                  to: `/${currentLang}/portfolio`,
                },
                {
                  icon: icon3d,
                  img: service02,
                  title: "Animação e 3D",
                  desc: "Motion, hologramas, cenas 3D e elementos que diferenciam.",
                  cta: "Pedir proposta",
                  to: `/${currentLang}/orcamento`,
                },
                {
                  icon: iconWeb,
                  img: service03,
                  title: "Sites e Landing Pages",
                  desc: "Páginas rápidas, elegantes e pensadas para converter.",
                  cta: "Começar agora",
                  to: `/${currentLang}/orcamento`,
                },
              ].map((s) => (
                <Col md={4} key={s.title}>
                  <motion.div variants={fadeUp}>
                    <TiltCard className="service-card tilt-shadow">
                      <div
                        className="service-card__media"
                        style={{ backgroundImage: `url(${s.img})` }}
                      >
                        <div className="service-card__mediaOverlay" />
                        <div className="service-card__iconWrap">
                          <img
                            src={s.icon}
                            alt=""
                            aria-hidden="true"
                            className="service-card__icon"
                          />
                        </div>
                      </div>

                      <div className="service-card__body">
                        <div className="service-card__title">{s.title}</div>
                        <div className="service-card__text">{s.desc}</div>

                        <div className="service-card__cta mt-3">
                          <Link to={s.to} className="link-clean">
                            <MagneticButton className="btn btn-outline-primary btn-sm">
                              {s.cta}
                            </MagneticButton>
                          </Link>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </motion.section>

      {/* DIFERENCIAIS + MÉTRICAS */}
      <motion.section
        className="section"
        {...inViewProps}
        initial="hidden"
        whileInView="show"
      >
        <Container>
          <motion.div variants={stagger}>
            <Row className="g-3">
              {[
                {
                  k: "Velocidade",
                  t: "Do briefing ao criativo pronto",
                  d: "Processo enxuto, alinhamento claro e entrega objetiva — sem travar sua operação.",
                },
                {
                  k: "Qualidade",
                  t: "Acabamento premium (sem “cara de template”)",
                  d: "Direção visual, motion e ritmo para prender atenção — com consistência de marca.",
                },
                {
                  k: "Conversão",
                  t: "Tudo com CTA e intenção",
                  d: "Cada parte do material é pensada para levar o público ao clique, DM ou formulário.",
                },
              ].map((p) => (
                <Col md={4} key={p.k}>
                  <motion.div variants={fadeUp}>
                    <TiltCard className="surface-card tilt-shadow">
                      <div className="surface-kicker">{p.k}</div>
                      <div className="surface-title">{p.t}</div>
                      <div className="surface-text">{p.d}</div>
                    </TiltCard>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          <motion.div variants={fadeUp} className="metrics mt-4">
            <div className="metrics__item">
              <div className="metrics__k">+35</div>
              <div className="metrics__t">marcas atendidas</div>
            </div>
            <div className="metrics__item">
              <div className="metrics__k">+120</div>
              <div className="metrics__t">criativos entregues</div>
            </div>
            <div className="metrics__item">
              <div className="metrics__k">48–72h</div>
              <div className="metrics__t">prazo médio</div>
            </div>
            <div className="metrics__item">
              <div className="metrics__k">4,9/5</div>
              <div className="metrics__t">satisfação</div>
            </div>
          </motion.div>
        </Container>
      </motion.section>

      {/* PROVA SOCIAL */}
      <motion.section
        className="section section-alt"
        {...inViewProps}
        initial="hidden"
        whileInView="show"
      >
        <Container>
          <motion.div variants={fadeUp} className="section-head">
            <h2 className="section-title">Prova social</h2>
            <p className="section-subtitle">
              Algumas marcas que já contrataram criativos, vídeos e peças para campanhas.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="logo-infinite">
            <div className="logo-track">
              <img src={logoStrip} alt="Logos de clientes (exemplo)" />
              <img src={logoStrip} alt="" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.div variants={stagger} className="mt-4">
            <Row className="g-3">
              {[
                {
                  a: avatar01,
                  name: "Clínica Aurora",
                  role: "Saúde • Juiz de Fora",
                  text:
                    "“O padrão subiu muito. O material ficou com estética de marca grande e o retorno veio rápido — principalmente nos stories.”",
                },
                {
                  a: avatar02,
                  name: "Barbearia Atlas",
                  role: "Serviços • MG",
                  text:
                    "“A edição é muito bem pensada. O vídeo prende e direciona pro WhatsApp. Em 2 semanas já vimos mais agendamentos.”",
                },
                {
                  a: avatar03,
                  name: "Loja Vento Norte",
                  role: "Varejo • Brasil",
                  text:
                    "“Criativos consistentes e com identidade. A campanha ficou alinhada com a marca e melhorou o desempenho dos anúncios.”",
                },
              ].map((x) => (
                <Col md={4} key={x.name}>
                  <motion.div variants={fadeUp}>
                    <TiltCard className="testimonial-card tilt-shadow">
                      <div className="testimonial-top">
                        <img
                          className="testimonial-avatar"
                          src={x.a}
                          alt=""
                          aria-hidden="true"
                        />
                        <div>
                          <div className="testimonial-name">{x.name}</div>
                          <div className="testimonial-role">{x.role}</div>
                        </div>
                      </div>
                      <div className="testimonial-text">{x.text}</div>
                    </TiltCard>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </motion.section>

      {/* EXPERIÊNCIA 3D */}
      <section
        id="experiencia-3d"
        className="section section-immersive"
        style={{ backgroundImage: `url(${enter3dCard})` }}
      >
        <div className="immersive-overlay" />

        <Container className="immersive-content">
          <Row className="g-4 align-items-center">
            <Col lg={7}>
              <motion.div
                {...inViewProps}
                initial="hidden"
                whileInView="show"
                variants={stagger}
              >
                <motion.h2 variants={fadeUp} className="immersive-title">
                  A próxima fase: site imersivo em 3D (WebGL)
                </motion.h2>

                <motion.p variants={fadeUp} className="immersive-text">
                  Um “escritório virtual” para explorar: sala de portfólio, sala de orçamento,
                  atendimento e experiências com telas 3D — mantendo a versão normal rápida
                  para quem está com pressa.
                </motion.p>

                <motion.div variants={fadeUp} className="d-flex gap-2 flex-wrap">
                  <MagneticButton className="btn btn-light" disabled>
                    Entrar no escritório 3D (em breve)
                  </MagneticButton>

                  <Link to={`/${currentLang}/orcamento`} className="link-clean">
                    <MagneticButton className="btn btn-outline-light">
                      Quero orçamento agora
                    </MagneticButton>
                  </Link>
                </motion.div>

                <motion.div variants={fadeUp} className="roadmap mt-4">
                  <div className="roadmap__item">
                    <div className="roadmap__k">Lobby</div>
                    <div className="roadmap__t">Recepção + atalhos rápidos</div>
                    <div className="roadmap__d">
                      Acesso direto a WhatsApp, portfólio e orçamento, sem menus chatos.
                    </div>
                  </div>
                  <div className="roadmap__item">
                    <div className="roadmap__k">Portfólio</div>
                    <div className="roadmap__t">Galeria com telas e vídeos</div>
                    <div className="roadmap__d">
                      Cases exibidos em painéis 3D com vídeos reais e interação.
                    </div>
                  </div>
                  <div className="roadmap__item">
                    <div className="roadmap__k">Orçamento</div>
                    <div className="roadmap__t">Trigger e formulário instantâneo</div>
                    <div className="roadmap__d">
                      Aproximou → interagiu → abre o formulário React sem perder performance.
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </Col>

            <Col lg={5}>
              <motion.div
                {...inViewProps}
                initial="hidden"
                whileInView="show"
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="immersive-card">
                  <div className="immersive-card__title">Por que isso vende?</div>
                  <div className="immersive-card__text">
                    Porque aumenta o tempo de permanência e transforma o site em experiência.
                    A pessoa explora, se envolve e chega mais quente no orçamento.
                  </div>
                  <div className="immersive-card__text mt-2">
                    E o melhor: quem não curte 3D continua com a navegação normal, rápida e direta.
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="immersive-card mt-3">
                  <div className="immersive-card__title">Modelo escalável (SaaS)</div>
                  <div className="immersive-card__text">
                    Depois do MVP, a base vira template: troca logos, cores, textos e cases —
                    e cada empresa ganha o próprio “metaverso corporativo”.
                  </div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ */}
      <section className="section section-alt">
        <Container>
          <div className="section-head">
            <h2 className="section-title">Perguntas rápidas</h2>
            <p className="section-subtitle">Dúvidas comuns antes de pedir orçamento.</p>
          </div>

          <Accordion className="faq">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Você faz só IA ou produção completa?</Accordion.Header>
              <Accordion.Body>
                Produção completa. IA entra quando ajuda em velocidade ou ideias, mas o foco é
                entregar um material final com cara profissional e pensado para converter.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Dá pra adaptar para qualquer nicho?</Accordion.Header>
              <Accordion.Body>
                Sim. Mudamos linguagem, estilo e abordagem para o público — mantendo a mesma
                estrutura de conversão (gancho + prova + CTA).
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>O site imersivo substitui o site normal?</Accordion.Header>
              <Accordion.Body>
                Não. A proposta é ter os dois: React para rapidez e acessibilidade + Unity no
                desktop para quem quer explorar o “wow”.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Como eu peço um orçamento?</Accordion.Header>
              <Accordion.Body>
                Clique em “Fazer orçamento”. Você vai direto para o formulário e recebe retorno
                com o próximo passo e opções de pacote.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="text-center mt-4">
            <Link to={`/${currentLang}/orcamento`} className="link-clean">
              <MagneticButton className="btn btn-primary btn-lg btn-glow">
                Fazer orçamento
              </MagneticButton>
            </Link>
          </div>
        </Container>
      </section>

      {/* MODAL DO VÍDEO */}
      <Modal show={showVideo} onHide={() => setShowVideo(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vídeo institucional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="video-embed">
            <iframe
              src="https://youtube.com/embed/ZgXP3sqBH7Q"
              title="Vídeo Institucional"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="video-note mt-3">
            Quer esse estilo de vídeo com a sua marca? Pede um orçamento e eu te envio as opções de formato.
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HomePage;
