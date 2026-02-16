import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import '../styles/PortfolioMaintenancePage.css';

import character from '../assets/images/maintenance/portfolio-maintenance-character.png';
import igAvatar from '../assets/images/maintenance/logomanu.png';

const PortfolioMaintenancePage = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams();

  // Determina o idioma atual (pt ou en)
  const currentLang = useMemo(() => {
    if (lang === 'pt' || lang === 'en') return lang;
    const l = (i18n.language || 'pt').toLowerCase();
    return l.startsWith('en') ? 'en' : 'pt';
  }, [lang, i18n.language]);

  // Conteúdo traduzido
  const content = useMemo(() => {
    const pt = {
      seoTitle: "Portfólio em manutenção | Comerc IA’s",
      seoDesc: "Estamos aprimorando a experiência do portfólio. Enquanto isso, veja nossos trabalhos no Instagram.",
      badge: "Em manutenção",
      title: "Estamos refinando esta seção para uma experiência mais premium.",
      subtitle: "Estamos reorganizando os cases para ficarem mais rápidos, mais claros e com uma navegação melhor. Enquanto isso, você pode ver nossos trabalhos atualizados no Instagram.",
      ctaInsta: "Ver perfil no Instagram",
      ctaWhats: "Falar no WhatsApp",
      
      // Perfil Card
      profileRole: "Produção Generativa • Vídeos • Sites • Criativos",
      statUpdatedLabel: "Atualizado",
      statUpdatedValue: "toda semana",
      statDeliveryLabel: "Entrega",
      statDeliveryValue: "24–72h",
      
      note: "Dica: veja os 3 posts em destaque abaixo — são uma prévia real do nosso trabalho.",
      
      // Embeds Section
      embedTitle: "Prévia real do Instagram",
      embedDesc: "Posts selecionados para você ver agora, sem sair da página.",
      embedCta: "Ver todos os posts no Instagram"
    };

    const en = {
      seoTitle: "Portfolio Under Maintenance | Comerc IA’s",
      seoDesc: "We are upgrading the portfolio experience. Meanwhile, check our work on Instagram.",
      badge: "Under Maintenance",
      title: "We are refining this section for a premium experience.",
      subtitle: "We are reorganizing cases to be faster, clearer, and better to navigate. In the meantime, you can see our latest work on Instagram.",
      ctaInsta: "View Instagram Profile",
      ctaWhats: "Talk on WhatsApp",
      
      // Profile Card
      profileRole: "Generative Production • Videos • Sites • Creatives",
      statUpdatedLabel: "Updated",
      statUpdatedValue: "every week",
      statDeliveryLabel: "Delivery",
      statDeliveryValue: "24–72h",
      
      note: "Tip: check the 3 featured posts below — they are a real preview of our work.",
      
      // Embeds Section
      embedTitle: "Live Instagram Preview",
      embedDesc: "Selected posts for you to see right now, without leaving the page.",
      embedCta: "See all posts on Instagram"
    };

    return currentLang === 'en' ? en : pt;
  }, [currentLang]);

  const instaUser = 'comerc_ias';
  const instaUrl = `https://www.instagram.com/${instaUser}/`;

  const instagramEmbeds = [
    'https://www.instagram.com/p/DTiYtmrj5t-/',
    'https://www.instagram.com/p/DTlffYnCfmf/',
    'https://www.instagram.com/p/DSIZLIIDV0r/',
  ];

  useEffect(() => {
    const src = 'https://www.instagram.com/embed.js';

    const processEmbeds = () => {
      if (window?.instgrm?.Embeds?.process) window.instgrm.Embeds.process();
    };

    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      processEmbeds();
      return;
    }

    const s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.src = src;
    s.onload = processEmbeds;
    document.body.appendChild(s);
  }, []);

  return (
    <>
      <SEO
        title={content.seoTitle}
        description={content.seoDesc}
        href={`/${currentLang}/portfolio`}
      />

      <section className="pm-page">
        <div className="pm-wrap">
          {/* HERO */}
          <div className="pm-hero">
            <div className="pm-hero__bg" aria-hidden="true" />

            <div className="pm-hero__content">
              <div className="pm-badge">{content.badge}</div>

              <h1 className="pm-title">
                {content.title}
              </h1>

              <p className="pm-subtitle">
                {content.subtitle}
              </p>

              <div className="pm-ctaRow">
                <a className="pm-btn pm-btn--primary" href={instaUrl} target="_blank" rel="noopener noreferrer">
                  {content.ctaInsta}
                </a>

                <a className="pm-btn pm-btn--ghost" href="https://wa.me/5532984869192" target="_blank" rel="noopener noreferrer">
                  {content.ctaWhats}
                </a>
              </div>

              {/* Card perfil Instagram (premium) */}
              <div className="pm-profileCard">
                <div className="pm-profileCard__left">
                  <div className="pm-igAvatar">
                    <img src={igAvatar} alt="Foto do perfil da Comerc IA’s" />
                  </div>

                  <div className="pm-profileMeta">
                    <strong>Comerc IA’s</strong>
                    <span>@{instaUser} • {content.profileRole}</span>
                  </div>
                </div>

                <div className="pm-profileCard__right">
                  <div className="pm-stat">
                    <strong>{content.statUpdatedLabel}</strong>
                    <span>{content.statUpdatedValue}</span>
                  </div>
                  <div className="pm-stat">
                    <strong>{content.statDeliveryLabel}</strong>
                    <span>{content.statDeliveryValue}</span>
                  </div>
                </div>
              </div>

              <div className="pm-note">
                {content.note}
              </div>
            </div>

            {/* Personagem */}
            <div className="pm-hero__art" aria-hidden="true">
              <img className="pm-character" src={character} alt="" />
            </div>
          </div>

          {/* EMBEDS */}
          <div className="pm-embeds">
            <div className="pm-sectionHead">
              <h2>{content.embedTitle}</h2>
              <p>{content.embedDesc}</p>
            </div>

            <div className="pm-embedGrid">
              {instagramEmbeds.map((url) => (
                <div className="pm-embedCard" key={url}>
                  <blockquote
                    className="instagram-media pm-igEmbed"
                    data-instgrm-permalink={url}
                    data-instgrm-version="14"
                  />
                </div>
              ))}
            </div>

            <div className="pm-embedsCta">
              <a className="pm-btn pm-btn--primary" href={instaUrl} target="_blank" rel="noopener noreferrer">
                {content.embedCta}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioMaintenancePage;