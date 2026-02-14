import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import Footer from './components/Footer';
import ContactModal from './components/forms/ContactModal';
import ContactForm from './components/forms/ContactForm';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import OrcamentoPage from './pages/OrcamentoPage';
import PortfolioMaintenancePage from './pages/PortfolioMaintenancePage';

import './styles/custom.css';

const SUPPORTED_LANGS = ['pt', 'en'];

function normalizeLang(lang) {
  return SUPPORTED_LANGS.includes(lang) ? lang : 'pt';
}

const LanguageLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const currentLang = useMemo(() => normalizeLang(lang), [lang]);

  const handleChatClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    // Garante que o i18n e a URL fiquem sempre alinhados :contentReference[oaicite:4]{index=4}
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }

    // Ajuda SEO/acessibilidade: <html lang="...">
    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';
  }, [currentLang, i18n]);

  // Se vier /xx/... joga pra /pt
  if (lang && !SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to="/pt" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1" style={{ paddingTop: '72px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="portfolio" element={<PortfolioMaintenancePage />} />
          <Route path="orcamento" element={<OrcamentoPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* Fallback dentro do idioma */}
          <Route path="*" element={<Navigate to={`/${currentLang}`} replace />} />
        </Routes>
      </main>

      <Footer onChatClick={handleChatClick} />

      <ContactModal show={showModal} handleClose={handleCloseModal}>
        <ContactForm />
      </ContactModal>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/pt" replace />} />
        <Route path="/:lang/*" element={<LanguageLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
