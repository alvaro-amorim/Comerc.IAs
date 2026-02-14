import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import '../styles/PortfolioMaintenancePage.css';

import character from '../assets/images/maintenance/portfolio-maintenance-character.png';
import igAvatar from '../assets/images/maintenance/logomanu.png';

const PortfolioMaintenancePage = () => {
  const { t } = useTranslation();

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
        title={t('portfolio_maintenance_seo_title', 'Portfólio em manutenção | Comerc IA’s')}
        description={t(
          'portfolio_maintenance_seo_desc',
          'Estamos aprimorando a experiência do portfólio. Enquanto isso, veja nossos trabalhos no Instagram.'
        )}
        href="/pt/portfolio"
      />

      <section className="pm-page">
        <div className="pm-wrap">
          {/* HERO */}
          <div className="pm-hero">
            <div className="pm-hero__bg" aria-hidden="true" />

            <div className="pm-hero__content">
              <div className="pm-badge">Em manutenção</div>

              <h1 className="pm-title">
                Estamos refinando esta seção para uma experiência mais premium.
              </h1>

              <p className="pm-subtitle">
                Estamos reorganizando os cases para ficarem mais rápidos, mais claros e com uma navegação melhor.
                Enquanto isso, você pode ver nossos trabalhos atualizados no Instagram.
              </p>

              <div className="pm-ctaRow">
                <a className="pm-btn pm-btn--primary" href={instaUrl} target="_blank" rel="noopener noreferrer">
                  Ver perfil no Instagram
                </a>

                <a className="pm-btn pm-btn--ghost" href="https://wa.me/5532984869192" target="_blank" rel="noopener noreferrer">
                  Falar no WhatsApp
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
                    <span>@{instaUser} • Produção Generativa • Vídeos • Sites • Criativos</span>
                  </div>
                </div>

                <div className="pm-profileCard__right">
                  <div className="pm-stat">
                    <strong>Atualizado</strong>
                    <span>toda semana</span>
                  </div>
                  <div className="pm-stat">
                    <strong>Entrega</strong>
                    <span>24–72h</span>
                  </div>
                </div>
              </div>

              <div className="pm-note">
                Dica: veja os 3 posts em destaque abaixo — são uma prévia real do nosso trabalho.
              </div>
            </div>

            {/* Personagem */}
            <div className="pm-hero__art" aria-hidden="true">
              <img className="pm-character" src={character} alt="" />
            </div>
          </div>

          {/* EMBEDS (agora vem LOGO depois do hero — não fica “lá no fim”) */}
          <div className="pm-embeds">
            <div className="pm-sectionHead">
              <h2>Prévia real do Instagram</h2>
              <p>Posts selecionados para você ver agora, sem sair da página.</p>
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
                Ver todos os posts no Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioMaintenancePage;
