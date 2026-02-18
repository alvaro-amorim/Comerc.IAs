import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isNeon = theme === 'neon';

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05, backgroundColor: isNeon ? 'rgba(0, 243, 255, 0.15)' : 'rgba(0,0,0,0.05)' }}
      className={`theme-toggle-btn ${className}`}
      aria-label="Alternar tema"
      style={{
        background: 'transparent',
        border: '1px solid var(--header-border)', // Usa a variável da borda do header
        cursor: 'pointer',
        padding: '0', // Removi padding interno para centralizar melhor o ícone SVG
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-main)',
        transition: 'all 0.3s ease',
        width: '38px', // Tamanho fixo ligeiramente menor para alinhar com o menu
        height: '38px',
        marginRight: '12px' // Espaçamento padrão à direita
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isNeon ? 360 : 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isNeon ? (
          /* Ícone de Lua (Neon Mode) */
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
        ) : (
          /* Ícone de Sol (Light Mode) */
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f59e0b' }}>
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;