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

  // ===== TRADUÇÕES E CONTEÚDO =====
  const content = useMemo(() => {
    const pt = {
      seoTitle: "Comerc IA's - Vídeos, Criativos e Experiências Digitais",
      seoDesc: "Produção audiovisual, criativos e presença digital com foco em conversão.",
      
      // Hero Dinâmico
      heroTitleWow: "Comerc IA's: VÍDEOS de ALTO IMPACTO para impulsionar seu negócio!",
      heroSubtitleWow: "Sua produtora ágil: entrega rápida, acabamento premium e foco em conversão — sem burocracia.",
      heroTitleQuick: "Direto ao ponto: portfólio + orçamento em poucos cliques.",
      heroSubtitleQuick: "Sem enrolação: veja cases, entenda o processo e peça um orçamento rápido.",
      
      trust1: "Resposta em até 1 hora útil",
      trust2: "Entrega a partir de 48h",
      trust3: "Direção criativa inclusa",
      
      btnWow: "Quero ser encantado",
      btnQuick: "Estou com pressa",
      
      ctaBudget: "Fazer orçamento",
      ctaPortfolio: "Ver portfólio",
      cta3d: "Ver a experiência 3D →",
      
      // Callout
      calloutTitle: "Escolha seu caminho",
      calloutText: "Quer o “wow”? Explore a proposta do escritório virtual 3D no desktop. Está com pressa? Use o site normal e peça orçamento em segundos.",
      calloutBtn3d: "Quero ver o 3D",
      calloutBtnBudget: "Quero orçamento agora",
      
      // Hero Card
      cardKicker: "Apresentação",
      cardTitle: "Assista em 30s",
      cardBody: "Um resumo rápido do que entregamos e como seu criativo fica com cara de marca grande.",
      btnWatch: "Assistir vídeo",
      btnHow: "Como funciona",
      proof1t: "criativos entregues",
      proof2t: "avaliação média",
      proof3t: "prazo comum",
      
      // Serviços
      servTitle: "Serviços",
      servSubtitle: "Três frentes para elevar sua marca com estética premium e foco em conversão.",
      s1Title: "Criativos e anúncios",
      s1Desc: "Reels, anúncios e peças que chamam atenção e geram ação.",
      s1Cta: "Ver cases",
      s2Title: "Animação e 3D",
      s2Desc: "Motion, hologramas, cenas 3D e elementos que diferenciam.",
      s2Cta: "Pedir proposta",
      s3Title: "Sites e Landing Pages",
      s3Desc: "Páginas rápidas, elegantes e pensadas para converter.",
      s3Cta: "Começar agora",
      
      // Diferenciais
      diff1k: "Velocidade",
      diff1t: "Do briefing ao criativo pronto",
      diff1d: "Processo enxuto, alinhamento claro e entrega objetiva — sem travar sua operação.",
      diff2k: "Qualidade",
      diff2t: "Acabamento premium (sem “cara de template”)",
      diff2d: "Direção visual, motion e ritmo para prender atenção — com consistência de marca.",
      diff3k: "Conversão",
      diff3t: "Tudo com CTA e intenção",
      diff3d: "Cada parte do material é pensada para levar o público ao clique, DM ou formulário.",
      
      met1t: "marcas atendidas",
      met2t: "criativos entregues",
      met3t: "prazo médio",
      met4t: "satisfação",
      
      // Prova Social
      socialTitle: "Prova social",
      socialSubtitle: "Algumas marcas que já contrataram criativos, vídeos e peças para campanhas.",
      test1Role: "Saúde • Juiz de Fora",
      test1Text: "“O padrão subiu muito. O material ficou com estética de marca grande e o retorno veio rápido — principalmente nos stories.”",
      test2Role: "Serviços • MG",
      test2Text: "“A edição é muito bem pensada. O vídeo prende e direciona pro WhatsApp. Em 2 semanas já vimos mais agendamentos.”",
      test3Role: "Varejo • Brasil",
      test3Text: "“Criativos consistentes e com identidade. A campanha ficou alinhada com a marca e melhorou o desempenho dos anúncios.”",
      
      // 3D
      immTitle: "A próxima fase: site imersivo em 3D (WebGL)",
      immText: "Um “escritório virtual” para explorar: sala de portfólio, sala de orçamento, atendimento e experiências com telas 3D — mantendo a versão normal rápida para quem está com pressa.",
      btnEnter3d: "Entrar no escritório 3D (em breve)",
      btnBudget3d: "Quero orçamento agora",
      
      rd1k: "Lobby",
      rd1t: "Recepção + atalhos rápidos",
      rd1d: "Acesso direto a WhatsApp, portfólio e orçamento, sem menus chatos.",
      rd2k: "Portfólio",
      rd2t: "Galeria com telas e vídeos",
      rd2d: "Cases exibidos em painéis 3D com vídeos reais e interação.",
      rd3k: "Orçamento",
      rd3t: "Trigger e formulário instantâneo",
      rd3d: "Aproximou → interagiu → abre o formulário React sem perder performance.",
      
      immCard1Title: "Por que isso vende?",
      immCard1Text: "Porque aumenta o tempo de permanência e transforma o site em experiência. A pessoa explora, se envolve e chega mais quente no orçamento.",
      immCard1Text2: "E o melhor: quem não curte 3D continua com a navegação normal, rápida e direta.",
      immCard2Title: "Modelo escalável (SaaS)",
      immCard2Text: "Depois do MVP, a base vira template: troca logos, cores, textos e cases — e cada empresa ganha o próprio “metaverso corporativo”.",
      
      // FAQ
      faqTitle: "Perguntas rápidas",
      faqSubtitle: "Dúvidas comuns antes de pedir orçamento.",
      q1: "Você faz só IA ou produção completa?",
      a1: "Produção completa. IA entra quando ajuda em velocidade ou ideias, mas o foco é entregar um material final com cara profissional e pensado para converter.",
      q2: "Dá pra adaptar para qualquer nicho?",
      a2: "Sim. Mudamos linguagem, estilo e abordagem para o público — mantendo a mesma estrutura de conversão (gancho + prova + CTA).",
      q3: "O site imersivo substitui o site normal?",
      a3: "Não. A proposta é ter os dois: React para rapidez e acessibilidade + Unity no desktop para quem quer explorar o “wow”.",
      q4: "Como eu peço um orçamento?",
      a4: "Clique em “Fazer orçamento”. Você vai direto para o formulário e recebe retorno com o próximo passo e opções de pacote.",
      
      modalTitle: "Vídeo institucional",
      modalNote: "Quer esse estilo de vídeo com a sua marca? Pede um orçamento e eu te envio as opções de formato."
    };

    const en = {
      seoTitle: "Comerc IA's - Videos, Creatives & Digital Experiences",
      seoDesc: "Audiovisual production, creatives, and digital presence focused on conversion.",
      
      // Dynamic Hero
      heroTitleWow: "Comerc IA's: HIGH-IMPACT VIDEO to boost your business!",
      heroSubtitleWow: "Your agile studio: fast delivery, premium finish, and conversion focus — zero bureaucracy.",
      heroTitleQuick: "Straight to the point: portfolio + quote in a few clicks.",
      heroSubtitleQuick: "No fluff: see cases, understand the process, and get a quick quote.",
      
      trust1: "Reply within 1 business hour",
      trust2: "Delivery starting at 48h",
      trust3: "Creative direction included",
      
      btnWow: "I want to be amazed",
      btnQuick: "I'm in a hurry",
      
      ctaBudget: "Get a quote",
      ctaPortfolio: "View portfolio",
      cta3d: "View 3D experience →",
      
      // Callout
      calloutTitle: "Choose your path",
      calloutText: "Want the 'wow'? Explore the 3D virtual office concept on desktop. In a hurry? Use the standard site and get a quote in seconds.",
      calloutBtn3d: "I want to see the 3D",
      calloutBtnBudget: "I want a quote now",
      
      // Hero Card
      cardKicker: "Presentation",
      cardTitle: "Watch in 30s",
      cardBody: "A quick summary of what we deliver and how your creative gets that big-brand look.",
      btnWatch: "Watch video",
      btnHow: "How it works",
      proof1t: "creatives delivered",
      proof2t: "avg rating",
      proof3t: "typical deadline",
      
      // Services
      servTitle: "Services",
      servSubtitle: "Three fronts to elevate your brand with premium aesthetics and conversion focus.",
      s1Title: "Creatives & Ads",
      s1Desc: "Reels, ads, and pieces that grab attention and drive action.",
      s1Cta: "View cases",
      s2Title: "Animation & 3D",
      s2Desc: "Motion, holograms, 3D scenes, and elements that differentiate.",
      s2Cta: "Request proposal",
      s3Title: "Sites & Landing Pages",
      s3Desc: "Fast, elegant pages designed to convert.",
      s3Cta: "Start now",
      
      // Differentials
      diff1k: "Speed",
      diff1t: "From brief to ready-to-post",
      diff1d: "Lean process, clear alignment, and objective delivery — without stalling your operation.",
      diff2k: "Quality",
      diff2t: "Premium finish (no 'template look')",
      diff2d: "Visual direction, motion, and pacing to hold attention — with brand consistency.",
      diff3k: "Conversion",
      diff3t: "Everything with intent & CTA",
      diff3d: "Every part of the asset is designed to lead the audience to a click, DM, or form.",
      
      met1t: "brands served",
      met2t: "creatives delivered",
      met3t: "avg deadline",
      met4t: "satisfaction",
      
      // Social Proof
      socialTitle: "Social Proof",
      socialSubtitle: "Some brands that have already commissioned creatives, videos, and campaign assets.",
      test1Role: "Health • Local Traffic",
      test1Text: "“The standard went way up. The material got a big-brand aesthetic and the return came fast — especially on stories.”",
      test2Role: "Services • BR",
      test2Text: "“The editing is very well thought out. The video hooks you and directs to WhatsApp. We saw more bookings in 2 weeks.”",
      test3Role: "Retail • National",
      test3Text: "“Consistent creatives with identity. The campaign aligned with the brand and improved ad performance.”",
      
      // 3D
      immTitle: "Next Level: Immersive 3D Site (WebGL)",
      immText: "A 'virtual office' to explore: portfolio room, quote room, service desk, and 3D screen experiences — keeping the standard version fast for those in a hurry.",
      btnEnter3d: "Enter 3D Office (Coming Soon)",
      btnBudget3d: "I want a quote now",
      
      rd1k: "Lobby",
      rd1t: "Reception + quick shortcuts",
      rd1d: "Direct access to WhatsApp, portfolio, and quotes, without boring menus.",
      rd2k: "Portfolio",
      rd2t: "Gallery with screens and videos",
      rd2d: "Cases displayed on 3D panels with real videos and interaction.",
      rd3k: "Quote",
      rd3t: "Trigger and instant form",
      rd3d: "Approach → interact → opens the React form without losing performance.",
      
      immCard1Title: "Why does this sell?",
      immCard1Text: "Because it increases dwell time and turns the site into an experience. The user explores, engages, and arrives warmer at the quote stage.",
      immCard1Text2: "And the best part: those who don't like 3D keep the standard, fast, direct navigation.",
      immCard2Title: "Scalable Model (SaaS)",
      immCard2Text: "After the MVP, the base becomes a template: swap logos, colors, texts, and cases — and each company gets its own 'corporate metaverse'.",
      
      // FAQ
      faqTitle: "Quick Questions",
      faqSubtitle: "Common doubts before requesting a quote.",
      q1: "Do you do only AI or full production?",
      a1: "Full production. AI comes in to help with speed or ideas, but the focus is delivering a final material with a professional look designed to convert.",
      q2: "Can it be adapted to any niche?",
      a2: "Yes. We change the language, style, and approach for the audience — keeping the same conversion structure (hook + proof + CTA).",
      q3: "Does the immersive site replace the normal site?",
      a3: "No. The proposal is to have both: React for speed and accessibility + Unity on desktop for those who want to explore the 'wow'.",
      q4: "How do I request a quote?",
      a4: "Click 'Get a quote'. You go straight to the form and receive a reply with the next step and package options.",
      
      modalTitle: "Institutional Video",
      modalNote: "Want this video style with your brand? Request a quote and I'll send you format options."
    };

    return currentLang === "en" ? en : pt;
  }, [currentLang]);

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

  return (
    <>
      <SEO
        title={content.seoTitle}
        description={content.seoDesc}
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
                  {journey === "wow" ? content.heroTitleWow : content.heroTitleQuick}
                </motion.h1>

                <motion.p variants={fadeUp} className="home-hero__subtitle">
                  {journey === "wow" ? content.heroSubtitleWow : content.heroSubtitleQuick}
                </motion.p>

                <motion.div variants={fadeUp} className="hero-trustline">
                  <span>{content.trust1}</span>
                  <span className="dot" />
                  <span>{content.trust2}</span>
                  <span className="dot" />
                  <span>{content.trust3}</span>
                </motion.div>

                {/* Switch */}
                <motion.div variants={fadeUp} className="home-hero__switch">
                  <button
                    type="button"
                    className={`switch-pill ${journey === "wow" ? "active" : ""}`}
                    onClick={() => setJourney("wow")}
                  >
                    {content.btnWow}
                  </button>
                  <button
                    type="button"
                    className={`switch-pill ${journey === "quick" ? "active" : ""}`}
                    onClick={() => setJourney("quick")}
                  >
                    {content.btnQuick}
                  </button>
                </motion.div>

                {/* CTA */}
                <motion.div variants={fadeUp} className="home-hero__cta">
                  <Link to={`/${currentLang}/orcamento`} className="link-clean">
                    <MagneticButton className="btn btn-primary btn-lg btn-glow">
                      {content.ctaBudget}
                    </MagneticButton>
                  </Link>

                  <Link to={`/${currentLang}/portfolio`} className="link-clean">
                    <MagneticButton className="btn btn-outline-light btn-lg">
                      {content.ctaPortfolio}
                    </MagneticButton>
                  </Link>

                  <a href="#experiencia-3d" className="cta-link">
                    {content.cta3d}
                  </a>
                </motion.div>

                {/* Callout */}
                <motion.div variants={fadeUp} className="callout-card mt-4">
                  <div className="callout-title">{content.calloutTitle}</div>
                  <div className="callout-text">{content.calloutText}</div>
                  <div className="callout-actions">
                    <a href="#experiencia-3d" className="link-clean">
                      <MagneticButton className="btn btn-outline-primary">
                        {content.calloutBtn3d}
                      </MagneticButton>
                    </a>
                    <Link to={`/${currentLang}/orcamento`} className="link-clean">
                      <MagneticButton className="btn btn-dark">
                        {content.calloutBtnBudget}
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
                    <div className="mini-kicker">{content.cardKicker}</div>
                    <div className="mini-title">{content.cardTitle}</div>
                  </div>
                </div>

                <div className="hero-card__body">
                  <p className="muted mb-3">{content.cardBody}</p>

                  <div className="d-flex gap-2 flex-wrap">
                    <MagneticButton
                      className="btn btn-dark"
                      onClick={() => setShowVideo(true)}
                    >
                      {content.btnWatch}
                    </MagneticButton>

                    <Link to={`/${currentLang}/about`} className="link-clean">
                      <MagneticButton className="btn btn-outline-secondary">
                        {content.btnHow}
                      </MagneticButton>
                    </Link>
                  </div>

                  <div className="mini-proof mt-3">
                    <div className="mini-proof__item">
                      <div className="mini-proof__k">+120</div>
                      <div className="mini-proof__t">{content.proof1t}</div>
                    </div>
                    <div className="mini-proof__item">
                      <div className="mini-proof__k">4,9/5</div>
                      <div className="mini-proof__t">{content.proof2t}</div>
                    </div>
                    <div className="mini-proof__item">
                      <div className="mini-proof__k">48–72h</div>
                      <div className="mini-proof__t">{content.proof3t}</div>
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
            <h2 className="section-title">{content.servTitle}</h2>
            <p className="section-subtitle">{content.servSubtitle}</p>
          </motion.div>

          <motion.div variants={stagger}>
            <Row className="g-3">
              {[
                {
                  icon: iconVideo,
                  img: service01,
                  title: content.s1Title,
                  desc: content.s1Desc,
                  cta: content.s1Cta,
                  to: `/${currentLang}/portfolio`,
                },
                {
                  icon: icon3d,
                  img: service02,
                  title: content.s2Title,
                  desc: content.s2Desc,
                  cta: content.s2Cta,
                  to: `/${currentLang}/orcamento`,
                },
                {
                  icon: iconWeb,
                  img: service03,
                  title: content.s3Title,
                  desc: content.s3Desc,
                  cta: content.s3Cta,
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
                  k: content.diff1k,
                  t: content.diff1t,
                  d: content.diff1d,
                },
                {
                  k: content.diff2k,
                  t: content.diff2t,
                  d: content.diff2d,
                },
                {
                  k: content.diff3k,
                  t: content.diff3t,
                  d: content.diff3d,
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
              <div className="metrics__t">{content.met1t}</div>
            </div>
            <div className="metrics__item">
              <div className="metrics__k">+120</div>
              <div className="metrics__t">{content.met2t}</div>
            </div>
            <div className="metrics__item">
              <div className="metrics__k">48–72h</div>
              <div className="metrics__t">{content.met3t}</div>
            </div>
            <div className="metrics__item">
              <div className="metrics__k">4,9/5</div>
              <div className="metrics__t">{content.met4t}</div>
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
            <h2 className="section-title">{content.socialTitle}</h2>
            <p className="section-subtitle">{content.socialSubtitle}</p>
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
                  role: content.test1Role,
                  text: content.test1Text,
                },
                {
                  a: avatar02,
                  name: "Barbearia Atlas",
                  role: content.test2Role,
                  text: content.test2Text,
                },
                {
                  a: avatar03,
                  name: "Loja Vento Norte",
                  role: content.test3Role,
                  text: content.test3Text,
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
                  {content.immTitle}
                </motion.h2>

                <motion.p variants={fadeUp} className="immersive-text">
                  {content.immText}
                </motion.p>

                <motion.div variants={fadeUp} className="d-flex gap-2 flex-wrap">
                  <MagneticButton className="btn btn-light" disabled>
                    {content.btnEnter3d}
                  </MagneticButton>

                  <Link to={`/${currentLang}/orcamento`} className="link-clean">
                    <MagneticButton className="btn btn-outline-light">
                      {content.btnBudget3d}
                    </MagneticButton>
                  </Link>
                </motion.div>

                <motion.div variants={fadeUp} className="roadmap mt-4">
                  <div className="roadmap__item">
                    <div className="roadmap__k">{content.rd1k}</div>
                    <div className="roadmap__t">{content.rd1t}</div>
                    <div className="roadmap__d">{content.rd1d}</div>
                  </div>
                  <div className="roadmap__item">
                    <div className="roadmap__k">{content.rd2k}</div>
                    <div className="roadmap__t">{content.rd2t}</div>
                    <div className="roadmap__d">{content.rd2d}</div>
                  </div>
                  <div className="roadmap__item">
                    <div className="roadmap__k">{content.rd3k}</div>
                    <div className="roadmap__t">{content.rd3t}</div>
                    <div className="roadmap__d">{content.rd3d}</div>
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
                  <div className="immersive-card__title">{content.immCard1Title}</div>
                  <div className="immersive-card__text">{content.immCard1Text}</div>
                  <div className="immersive-card__text mt-2">{content.immCard1Text2}</div>
                </motion.div>

                <motion.div variants={fadeUp} className="immersive-card mt-3">
                  <div className="immersive-card__title">{content.immCard2Title}</div>
                  <div className="immersive-card__text">{content.immCard2Text}</div>
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
            <h2 className="section-title">{content.faqTitle}</h2>
            <p className="section-subtitle">{content.faqSubtitle}</p>
          </div>

          <Accordion className="faq">
            <Accordion.Item eventKey="0">
              <Accordion.Header>{content.q1}</Accordion.Header>
              <Accordion.Body>{content.a1}</Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>{content.q2}</Accordion.Header>
              <Accordion.Body>{content.a2}</Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>{content.q3}</Accordion.Header>
              <Accordion.Body>{content.a3}</Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>{content.q4}</Accordion.Header>
              <Accordion.Body>{content.a4}</Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <div className="text-center mt-4">
            <Link to={`/${currentLang}/orcamento`} className="link-clean">
              <MagneticButton className="btn btn-primary btn-lg btn-glow">
                {content.ctaBudget}
              </MagneticButton>
            </Link>
          </div>
        </Container>
      </section>

      {/* MODAL DO VÍDEO */}
      <Modal show={showVideo} onHide={() => setShowVideo(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{content.modalTitle}</Modal.Title>
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
            {content.modalNote}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HomePage;