import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Componentes Estruturais
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';
import StructuredData from './components/StructuredData';
import CookieConsentManager from './components/CookieConsentManager';
import AnalyticsRouteTracker from './analytics/AnalyticsRouteTracker';
import { initAnalytics, stopAnalytics } from './analytics/analyticsClient';
import { useConsent } from './context/ConsentContext';

// Componentes de Contato
import ContactModal from './components/forms/ContactModal';
import ContactForm from './components/forms/ContactForm';

// Páginas
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioMaintenancePage from './pages/PortfolioMaintenancePage';
import OrcamentoPage from './pages/OrcamentoPage';
import OrcamentoFunnel from './pages/OrcamentoFunnel';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiesPolicyPage from './pages/CookiesPolicyPage';

import './App.css';

function LanguageGate({ onChatClick, onOpenCookieSettings }) {
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

      <Footer onChatClick={onChatClick} onOpenCookieSettings={onOpenCookieSettings} />
      <CookieConsentManager />
    </>
  );
}

export default function App() {
  const [showContact, setShowContact] = useState(false);
  const { analyticsAllowed, openPanel: openCookieSettings } = useConsent();
  const analyticsHardDisabled = process.env.REACT_APP_DISABLE_ANALYTICS === 'true';

  const openContact = () => setShowContact(true);
  const closeContact = () => setShowContact(false);

  useEffect(() => {
    if (analyticsHardDisabled) {
      stopAnalytics({ discardQueuedEvents: true });
      return undefined;
    }

    if (!analyticsAllowed) {
      stopAnalytics({ discardQueuedEvents: true });
      return undefined;
    }

    initAnalytics();
    return () => stopAnalytics({ discardQueuedEvents: true });
  }, [analyticsAllowed, analyticsHardDisabled]);

  return (
    <>
      <AnalyticsRouteTracker />

      <Routes>
        <Route path="/" element={<Navigate to="/pt" replace />} />
        <Route path="/pt/loginadm" element={<AdminDashboardPage />} />

        <Route
          path="/:lang"
          element={
            <LanguageGate onChatClick={openContact} onOpenCookieSettings={openCookieSettings} />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="portfolio" element={<PortfolioMaintenancePage />} />
          <Route path="orcamento/funil" element={<OrcamentoFunnel />} />
          <Route path="orcamento" element={<OrcamentoPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="cookies" element={<CookiesPolicyPage />} />
          <Route path="*" element={<Navigate to="/pt" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/pt" replace />} />
      </Routes>

      <ContactModal show={showContact} handleClose={closeContact}>
        <ContactForm />
      </ContactModal>
    </>
  );
}
