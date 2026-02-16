import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioMaintenancePage from './pages/PortfolioMaintenancePage';
import OrcamentoPage from './pages/OrcamentoPage';
import ContactPage from './pages/ContactPage';

function LanguageLayout() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return (
    <>
      <Header onOpenContact={() => setContactOpen(true)} />

      <ContactModal show={contactOpen} onHide={() => setContactOpen(false)} />

      <main style={{ paddingTop: 72 }}>
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="sobre" element={<AboutPage />} />

          {/* Portfólio em manutenção (página nova) */}
          <Route path="portfolio" element={<PortfolioMaintenancePage />} />

          <Route path="orcamento" element={<OrcamentoPage />} />
          <Route path="contato" element={<ContactPage />} />

          {/* fallback dentro do idioma */}
          <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/pt" replace />} />
        <Route path="/:lang/*" element={<LanguageLayout />} />
        <Route path="*" element={<Navigate to="/pt" replace />} />
      </Routes>
    </>
  );
}
