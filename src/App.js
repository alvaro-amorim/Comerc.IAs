import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';
import ContactModal from './components/forms/ContactModal';
import ContactForm from './components/forms/ContactForm';
import './styles/custom.css';

const App = () => {
    const [showModal, setShowModal] = useState(false);

    const handleChatClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <Router>
            <Header />
            <div className="d-flex flex-column min-vh-100">
                <main className="flex-grow-1" style={{ paddingTop: '56px' }}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Routes>
                </main>
                <Footer onChatClick={handleChatClick} />
            </div>
            <ContactModal show={showModal} handleClose={handleCloseModal}>
                <ContactForm />
            </ContactModal>
        </Router>
    );
};

export default App;