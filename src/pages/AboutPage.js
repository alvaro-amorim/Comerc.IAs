import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from 'react-i18next';
import SEO from "../components/SEO";
import "../styles/AboutPage.css";
import servicos from "../assets/images/servicos.png";

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'pt';

  return (
    <>
      <SEO 
        title={t('about_seo_title')}
        description={t('about_seo_desc')}
        href="/about"
      />

      <section id="about" className="about-section">
        <div className="container-lg about-container">
          <header className="about-hero">
            <h1 className="about-title">{t('about_hero_title')}</h1>
            <p className="about-subtitle">
              <Trans i18nKey="about_hero_subtitle">
                Na <strong>Comerc IA's</strong> criamos comerciais...
              </Trans>
            </p>
            <div className="about-ctas">
              <Link className="btn btn-primary" to={`/${currentLang}/portfolio`}>{t('about_btn_portfolio')}</Link>
              <Link className="btn btn-secondary" to={`/${currentLang}/orcamento`}>{t('about_btn_budget')}</Link>
            </div>
          </header>

          <div className="about-grid">
            <article className="about-text">
              <h2 className="section-heading">{t('about_section_title')}</h2>

              <p className="lead">{t('about_lead')}</p>

              <ul className="services-list" aria-label="Serviços oferecidos">
                {/* CORREÇÃO: Usando a prop 'components' para injetar a tag strong onde está o <1> */}
                <li><Trans i18nKey="about_service_1" components={{ 1: <strong /> }} /></li>
                <li><Trans i18nKey="about_service_2" components={{ 1: <strong /> }} /></li>
                <li><Trans i18nKey="about_service_3" components={{ 1: <strong /> }} /></li>
                <li><Trans i18nKey="about_service_4" components={{ 1: <strong /> }} /></li>
                <li><Trans i18nKey="about_service_5" components={{ 1: <strong /> }} /></li>
                <li><Trans i18nKey="about_service_6" components={{ 1: <strong /> }} /></li>
              </ul>

              <p className="summary">{t('about_summary')}</p>

              <div className="why-choose">
                <h3>{t('about_why_title')}</h3>
                <ul>
                  <li>{t('about_why_1')}</li>
                  <li>{t('about_why_2')}</li>
                  <li>{t('about_why_3')}</li>
                </ul>
              </div>

              <div className="about-ctas-bottom">
                <a 
                  className="btn btn-primary" 
                  href="https://wa.me/5532991147944"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('about_cta_talk')}
                </a>
              </div>
            </article>

            <aside className="about-panel">
              <div className="panel-inner">
                {/* NOTA: Esta imagem contém texto. O código não consegue traduzir o conteúdo da imagem. */}
                <img 
                  src={servicos} 
                  alt="Serviços e soluções da Comerc IA's" 
                  className="panel-image" 
                />

                <div className="panel-cta">
                  <Link className="btn btn-light" to={`/${currentLang}/portfolio`}>{t('about_cta_examples')}</Link>
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