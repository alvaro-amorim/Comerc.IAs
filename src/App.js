import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';
import StructuredData from './components/StructuredData';

// ✅ GARANTA QUE ESSES ARQUIVOS EXISTAM EXATAMENTE NESTES CAMINHOS:
import ContactModal from './components/ContactModal';
import ContactForm from './components/ContactForm';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioMaintenancePage from './pages/PortfolioMaintenancePage';
import OrcamentoPage from './pages/OrcamentoPage';
import ContactPage from './pages/ContactPage';

function LanguageGate({ onChatClick }) {
  const { i18n, t } = useTranslation();
  const { lang } = useParams();

  const supported = useMemo(() => ['pt', 'en'], []);

  useEffect(() => {
    if (!lang || !supported.includes(lang)) return;
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n, supported]);

  if (!lang || !supported.includes(lang)) {
    return <Navigate to="/pt" replace />;
  }

  const seoData = {
    title: t('seo_title') || "Comerc IA's | Produção Generativa IA",
    description:
      t('seo_description') ||
      "Vídeos, animações, imagens e landing pages com estética premium para impulsionar sua marca.",
    canonical: `${window.location.origin}/${lang}`,
    lang,
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Comerc IA's",
    url: `${window.location.origin}/${lang}`,
    sameAs: ['https://www.instagram.com/comerc_ias/'],
  };

  return (
    <>
      <SEO {...seoData} />
      <StructuredData data={structuredData} />

      <Header />
      <ScrollToTop />

      <main>
        <Outlet />
      </main>

      <Footer onChatClick={onChatClick} />
    </>
  );
}

export default function App() {
  const [showContact, setShowContact] = useState(false);

  const openContact = () => setShowContact(true);
  const closeContact = () => setShowContact(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/pt" replace />} />

        <Route path="/:lang" element={<LanguageGate onChatClick={openContact} />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="portfolio" element={<PortfolioMaintenancePage />} />
          <Route path="orcamento" element={<OrcamentoPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/pt" replace />} />
        </Route>
      </Routes>

      <ContactModal show={showContact} handleClose={closeContact}>
        <ContactForm />
      </ContactModal>
    </>
  );
}
