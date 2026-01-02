import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import Header from './components/Header';
import Footer from './components/Footer';
import ContactModal from './components/forms/ContactModal';
import ContactForm from './components/forms/ContactForm';
import ScrollToTop from './components/ScrollToTop'; // <--- 1. Importar

// Páginas
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import OrcamentoPage from './pages/OrcamentoPage';

import './styles/custom.css';

const LanguageLayout = () => {
  const { lang } = useParams(); 
  const { i18n } = useTranslation();
  const [showModal, setShowModal] = React.useState(false);

  const handleChatClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    if (lang && ['pt', 'en'].includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  if (lang && !['pt', 'en'].includes(lang)) {
    return <Navigate to="/pt" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header /> {/* O Header agora terá o seletor de idiomas */}
      <main className="flex-grow-1" style={{ paddingTop: '56px' }}>
        <Routes>
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
            <ScrollToTop /> {/* <--- 2. Ativar o ScrollToTop aqui */}
            <Routes>
                <Route path="/" element={<Navigate to="/pt" replace />} />
                <Route path="/:lang/*" element={<LanguageLayout />} />
            </Routes>
        </Router>
    );
};

export default App;