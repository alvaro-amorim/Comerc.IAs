// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

// ✅ Portfolio em manutenção (rota principal)
import PortfolioMaintenancePage from './pages/PortfolioMaintenancePage';

// Orçamento
import OrcamentoPage from './pages/OrcamentoPage';

// Contato
import ContactPage from './pages/ContactPage';

import './App.css';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />

        {/* ✅ Portfólio apontando para manutenção */}
        <Route path="/portfolio" element={<PortfolioMaintenancePage />} />

        <Route path="/orcamento" element={<OrcamentoPage />} />
        <Route path="/contato" element={<ContactPage />} />

        {/* fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      <Footer />
    </>
  );
}
