import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Hook para usar tradução
import Header from './components/Header';
import Footer from './components/Footer';
import ContactModal from './components/forms/ContactModal';
import ContactForm from './components/forms/ContactForm';

// Páginas
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import OrcamentoPage from './pages/OrcamentoPage';

import './styles/custom.css';

// Componente "Wrapper" que verifica o idioma na URL e atualiza o site
const LanguageLayout = () => {
  const { lang } = useParams(); // Pega o "pt" ou "en" da URL
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = React.useState(false);

  const handleChatClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Efeito para trocar o idioma quando a URL muda
  useEffect(() => {
    if (lang && ['pt', 'en'].includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  // Se o idioma na URL não for suportado (ex: /fr/), força volta para /pt
  if (lang && !['pt', 'en'].includes(lang)) {
    return <Navigate to="/pt" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1" style={{ paddingTop: '56px' }}>
        <Routes>
          {/* Rotas internas (agora relativas ao /:lang) */}
          <Route path="/" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="orcamento" element={<OrcamentoPage />} />
          <Route path="contact" element={<ContactPage />} />
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
            <Routes>
                {/* 1. Se acessar a raiz pura, redireciona para /pt */}
                <Route path="/" element={<Navigate to="/pt" replace />} />

                {/* 2. Qualquer rota começando com idioma cai no Layout */}
                <Route path="/:lang/*" element={<LanguageLayout />} />
            </Routes>
        </Router>
    );
};

export default App;