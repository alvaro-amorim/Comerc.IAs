import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  motion,
  useReducedMotion,
} from "framer-motion";

import SEO from "../components/SEO";
import "../styles/AboutPage.css";

import servicos from "../assets/images/servicos.png";

const AboutPage = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams();
  const reduceMotion = useReducedMotion();

  const currentLang = useMemo(() => {
    if (lang === "pt" || lang === "en") return lang;
    const l = (i18n.language || "pt").toLowerCase();
    return l.startsWith("en") ? "en" : "pt";
  }, [lang, i18n.language]);

  const content = useMemo(() => {
    const pt = {
      seoTitle: "Comerc IA's — Sobre",
      seoDesc:
        "Produção audiovisual e criativos premium para marcas que querem conversão e estética de marca grande.",
      badge: "Comerc IA's",
      heroTitle: "Criativos que parecem marca grande — sem burocracia.",
      heroSubtitle:
        "A Comerc IA’s é um estúdio de produção audiovisual focado em velocidade, acabamento premium e conversão. A gente entra para transformar atenção em clique, DM e vendas.",
      cta1: "Ver portfólio",
      cta2: "Fazer orçamento",

      sectionTitle: "O que é a Comerc IA's",
      lead:
        "Nós criamos vídeos, criativos e experiências digitais com uma lógica simples: prender atenção rápido, construir confiança e entregar um CTA claro.",

      deliverTitle: "O que entregamos",
      deliverTag: "Foco em conversão",
      deliverItems: [
        { strong: "Reels e anúncios", text: "com gancho forte, ritmo e final que chama para ação." },
        { strong: "Motion e 3D", text: "para elevar o nível visual e criar diferenciação." },
        { strong: "Landing pages", text: "rápidas e premium, com estrutura pensada para converter." },
        { strong: "Pacotes mensais", text: "consistência e identidade visual ao longo das semanas." },
        { strong: "Direção criativa", text: "ideias, copy e melhoria do material antes de editar." },
        { strong: "Entrega pronta para postar", text: "formatos corretos, variações e organização." },
      ],
      deliverSummary:
        "Você não compra “um vídeo”. Você compra um processo que transforma a sua marca em algo que dá orgulho de postar — e que vende.",

      whyTitle: "Por que funciona",
      whyBullets: [
        "Porque o criativo não é bonito “por acaso”: ele tem intenção (gancho → prova → CTA).",
        "Porque consistência de identidade visual aumenta confiança e percepção de valor.",
        "Porque o material vem pronto para rodar: do orgânico ao anúncio.",
      ],

      howTitle: "Como trabalhamos",
      steps: [
        { title: "Briefing rápido", desc: "Entendemos objetivo, público, referência e oferta." },
        { title: "Roteiro + direção", desc: "Organizamos ideias e estruturamos a mensagem para converter." },
        { title: "Produção", desc: "Edição, motion, 3D e IA quando fizer sentido — sem perder qualidade." },
        { title: "Entrega + ajustes", desc: "Você recebe pronto para postar, com refinamento e variações." },
      ],

      statsTitle: "Números (exemplo)",
      stats: [
        { k: "+35", t: "marcas atendidas" },
        { k: "+120", t: "criativos entregues" },
        { k: "48–72h", t: "prazo comum" },
        { k: "4,9/5", t: "satisfação" },
      ],

      principlesTitle: "Nosso padrão",
      principles: [
        { t: "Ritmo e clareza", d: "Sem enrolação: o público entende e age." },
        { t: "Estética premium", d: "Acabamento limpo, moderno e consistente." },
        { t: "Entrega prática", d: "Arquivos organizados, formatos certos e variações." },
        { t: "Foco em resultado", d: "Criativo é bonito quando performa." },
      ],

      ctaBarTitle: "Vamos criar algo que pareça marca grande?",
      ctaBarText:
        "Você manda a ideia (ou só a oferta), e eu te devolvo uma proposta clara com caminho de produção.",
      ctaBarBtn: "Pedir orçamento",

      sideTitle: "Preview visual",
      sideText:
        "Esse painel é um exemplo de como deixamos o site “caro”: estrutura clara, blocos fortes e microinterações suaves.",
      sideBtn: "Ver exemplos no portfólio",

      noteTitle: "Transparência",
      noteText:
        "A gente é rápido, mas não é corrido. Preferimos poucos projetos bem feitos do que volume sem padrão.",
    };

    const en = {
      seoTitle: "Comerc IA's — About",
      seoDesc:
        "Premium audiovisual and creatives for brands that want conversion and big-brand aesthetics.",
      badge: "Comerc IA's",
      heroTitle: "Big-brand creatives — without the bureaucracy.",
      heroSubtitle:
        "Comerc IA’s is a fast, premium audiovisual studio focused on conversion. We turn attention into clicks, DMs, and sales.",
      cta1: "View portfolio",
      cta2: "Get a quote",

      sectionTitle: "What is Comerc IA's",
      lead:
        "We create videos, ads, and digital experiences with a simple logic: hook fast, build trust, and deliver a clear CTA.",

      deliverTitle: "What we deliver",
      deliverTag: "Conversion-first",
      deliverItems: [
        { strong: "Reels and Ads", text: "with strong hooks, pacing, and CTA endings." },
        { strong: "Motion and 3D", text: "to elevate visuals and create differentiation." },
        { strong: "Landing Pages", text: "fast, premium, and structured to convert." },
        { strong: "Monthly Packages", text: "consistency and visual identity week after week." },
        { strong: "Creative Direction", text: "ideas, copywriting, and refinement before editing." },
        { strong: "Ready-to-post Delivery", text: "correct formats, variations, and organized files." },
      ],
      deliverSummary:
        "You don’t just buy “a video”. You buy a process that transforms your brand into something worth posting — and that sells.",

      whyTitle: "Why it works",
      whyBullets: [
        "Because the creative isn't beautiful 'by accident': it has intent (hook → proof → CTA).",
        "Because consistent visual identity builds trust and value perception.",
        "Because the material arrives ready to run: from organic to paid ads.",
      ],

      howTitle: "How we work",
      steps: [
        { title: "Quick Briefing", desc: "We understand the goal, audience, references, and offer." },
        { title: "Script + Direction", desc: "We structure ideas and craft the message to convert." },
        { title: "Production", desc: "Editing, motion, 3D, and AI where it makes sense — without losing quality." },
        { title: "Delivery + Tweaks", desc: "You receive it ready to post, with polish and variations." },
      ],

      statsTitle: "Numbers (Snapshot)",
      stats: [
        { k: "+35", t: "brands served" },
        { k: "+120", t: "creatives delivered" },
        { k: "48–72h", t: "typical deadline" },
        { k: "4.9/5", t: "satisfaction" },
      ],

      principlesTitle: "Our Standard",
      principles: [
        { t: "Pacing & Clarity", d: "No fluff: the audience understands and acts." },
        { t: "Premium Aesthetics", d: "Clean, modern, and consistent finishing." },
        { t: "Practical Delivery", d: "Organized files, correct formats, and variations." },
        { t: "Results-Driven", d: "Creative is beautiful when it performs." },
      ],

      ctaBarTitle: "Ready to look like a major brand?",
      ctaBarText:
        "You send the idea (or just the offer), and I return a clear proposal with a production roadmap.",
      ctaBarBtn: "Get a quote",

      sideTitle: "Visual Preview",
      sideText:
        "This panel is an example of the 'expensive' look we build: clear structure, strong blocks, and smooth micro-interactions.",
      sideBtn: "See examples in portfolio",

      noteTitle: "Transparency",
      noteText:
        "We are fast, not rushed. We prefer fewer projects with higher standards than volume without quality.",
    };

    return currentLang === "en" ? en : pt;
  }, [currentLang]);

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
  };

  const inViewProps = { viewport: { once: true, amount: 0.22 } };

  return (
    <>
      <SEO title={content.seoTitle} description={content.seoDesc} href={`/${currentLang}/about`} />

      <section className="about-page">
        <div className="about-wrap">
          {/* HERO */}
          <header className="about-hero">
            <div className="about-hero__bg" aria-hidden="true" />

            <motion.div
              className="about-hero__content"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp} className="about-badge">
                {content.badge}
              </motion.div>

              <motion.h1 variants={fadeUp} className="about-title">
                {content.heroTitle}
              </motion.h1>

              <motion.p variants={fadeUp} className="about-subtitle">
                {content.heroSubtitle}
              </motion.p>

              <motion.div variants={fadeUp} className="about-ctas">
                <Link className="c-btn c-btn-primary" to={`/${currentLang}/portfolio`}>
                  {content.cta1}
                </Link>
                <Link className="c-btn c-btn-secondary" to={`/${currentLang}/orcamento`}>
                  {content.cta2}
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="about-heroChips">
                <span className="about-heroChip">
                  {currentLang === 'en' ? 'Fast Delivery' : 'Entrega rápida'}
                </span>
                <span className="about-heroChip">
                  {currentLang === 'en' ? 'Premium Aesthetic' : 'Estética premium'}
                </span>
                <span className="about-heroChip">
                  {currentLang === 'en' ? 'CTA & Conversion' : 'CTA e conversão'}
                </span>
              </motion.div>
            </motion.div>
          </header>

          {/* CONTENT GRID */}
          <div className="about-grid">
            {/* LEFT */}
            <article className="about-main">
              <motion.div {...inViewProps} initial="hidden" whileInView="show" variants={stagger}>
                <motion.h2 variants={fadeUp} className="about-h2">
                  {content.sectionTitle}
                </motion.h2>

                <motion.p variants={fadeUp} className="about-lead">
                  {content.lead}
                </motion.p>

                {/* Deliver */}
                <motion.div variants={fadeUp} className="about-card">
                  <div className="about-card__head">
                    <h3 className="about-h3">{content.deliverTitle}</h3>
                    <span className="about-chip">{content.deliverTag}</span>
                  </div>

                  <ul className="about-services" aria-label="Serviços oferecidos">
                    {content.deliverItems.map((it) => (
                      <li key={it.strong}>
                        <strong>{it.strong}</strong> — {it.text}
                      </li>
                    ))}
                  </ul>

                  <p className="about-summary">{content.deliverSummary}</p>
                </motion.div>

                {/* Split: Why + How */}
                <div className="about-split">
                  <motion.div variants={fadeUp} className="about-card about-card--soft">
                    <h3 className="about-h3">{content.whyTitle}</h3>
                    <ul className="about-bullets">
                      {content.whyBullets.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div variants={fadeUp} className="about-card about-card--soft">
                    <h3 className="about-h3">{content.howTitle}</h3>
                    <ol className="about-steps">
                      {content.steps.map((s) => (
                        <li key={s.title}>
                          <strong>{s.title}</strong>
                          <span>{s.desc}</span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                </div>

                {/* Stats */}
                <motion.div variants={fadeUp} className="about-card about-card--soft about-statsCard">
                  <div className="about-card__head">
                    <h3 className="about-h3">{content.statsTitle}</h3>
                    <span className="about-chip">
                      {currentLang === 'en' ? 'Snapshot' : 'Benchmark'}
                    </span>
                  </div>

                  <div className="about-stats">
                    {content.stats.map((s) => (
                      <div className="about-stat" key={s.t}>
                        <div className="about-statK">{s.k}</div>
                        <div className="about-statT">{s.t}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Principles */}
                <motion.div variants={fadeUp} className="about-card about-card--soft">
                  <div className="about-card__head">
                    <h3 className="about-h3">{content.principlesTitle}</h3>
                    <span className="about-chip">
                      {currentLang === 'en' ? 'Standard' : 'Padrão'}
                    </span>
                  </div>

                  <div className="about-principles">
                    {content.principles.map((p) => (
                      <div className="about-principle" key={p.t}>
                        <div className="about-principleT">{p.t}</div>
                        <div className="about-principleD">{p.d}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA BAR */}
                <motion.div variants={fadeUp} className="about-ctaBar">
                  <div className="about-ctaBar__text">
                    <h3 className="about-h3">{content.ctaBarTitle}</h3>
                    <p className="about-muted">{content.ctaBarText}</p>
                  </div>

                  <Link className="c-btn c-btn-primary" to={`/${currentLang}/orcamento`}>
                    {content.ctaBarBtn}
                  </Link>
                </motion.div>
              </motion.div>
            </article>

            {/* RIGHT */}
            <aside className="about-side">
              <motion.div {...inViewProps} initial="hidden" whileInView="show" variants={stagger}>
                <motion.div variants={fadeUp} className="about-sideCard">
                  <img
                    src={servicos}
                    alt="Serviços e soluções da Comerc IA's"
                    className="about-sideCard__img"
                    loading="lazy"
                  />

                  <div className="about-sideCard__inner">
                    <h3 className="about-h3">{content.sideTitle}</h3>
                    <p className="about-muted">{content.sideText}</p>

                    <Link className="c-btn c-btn-ghost" to={`/${currentLang}/portfolio`}>
                      {content.sideBtn}
                    </Link>

                    <div className="about-note">
                      <div className="about-noteTitle">{content.noteTitle}</div>
                      <div className="about-noteText">{content.noteText}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;