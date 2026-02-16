import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams,
  useLocation,
} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioMaintenancePage from './pages/PortfolioMaintenancePage';
import OrcamentoPage from './pages/OrcamentoPage';
import ContactPage from './pages/ContactPage';
import ContactForm from './pages/ContactForm';

import ContactModal from './components/ContactModal';

import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';

function LanguageLayout() {
  const { lang } = useParams();
  const { i18n: i18next } = useTranslation();

  // Garante que o i18n e a URL fiquem sempre alinhados
  useEffect(() => {
    if (lang && ['pt', 'en'].includes(lang)) {
      if (i18next.language !== lang) i18next.changeLanguage(lang);
    }
  }, [lang, i18next]);

  if (lang && !['pt', 'en'].includes(lang)) return <Navigate to="/pt" replace />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1" style={{ paddingTop: '56px' }}>
        <Outlet />
      </main>
      <Footer />

      {/* Modal global (chat/contato rápido) */}
      <ContactModal />
    </div>
  );
}

function RootRedirect() {
  const location = useLocation();

  // Mantém querystring e hash ao redirecionar para /pt
  const to = `/pt${location.pathname}${location.search}${location.hash}`;
  return <Navigate to={to} replace />;
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <ScrollToTop />

        <Routes>
          {/* / -> /pt (preservando params) */}
          <Route path="/" element={<RootRedirect />} />

          {/* Rotas com idioma */}
          <Route path="/:lang(pt|en)" element={<LanguageLayout />}>
            <Route index element={<HomePage />} />
            <Route path="sobre" element={<AboutPage />} />

            {/* Portfolio em manutenção */}
            <Route path="portfolio" element={<PortfolioMaintenancePage />} />

            <Route path="orcamento" element={<OrcamentoPage />} />
            <Route path="contato" element={<ContactPage />} />
            <Route path="formulario" element={<ContactForm />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/pt" replace />} />
        </Routes>
      </Router>
    </I18nextProvider>
  );
}

export default App;
