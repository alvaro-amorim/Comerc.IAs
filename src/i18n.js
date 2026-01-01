// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Aqui definimos os textos. Futuramente podemos mover para arquivos JSON separados.
const resources = {
  pt: {
    translation: {
      "hero_title": "VÍDEOS PROFISSIONAIS para impulsionar seu negócio!",
      "hero_subtitle": "Conteúdo bem feito, entrega rápida e total customização.",
      "btn_saiba_mais": "CONHEÇA NOSSOS SERVIÇOS"
    }
  },
  en: {
    translation: {
      "hero_title": "PROFESSIONAL VIDEOS to boost your business!",
      "hero_subtitle": "High-quality content, fast delivery, and full customization.",
      "btn_saiba_mais": "KNOW OUR SERVICES"
    }
  }
};

i18n
  .use(LanguageDetector) // Detecta o idioma do navegador
  .use(initReactI18next) // Passa a instância para o react-i18next
  .init({
    resources,
    fallbackLng: 'pt', // Se não achar o idioma, usa PT
    supportedLngs: ['pt', 'en'], // Idiomas permitidos
    
    interpolation: {
      escapeValue: false // React já protege contra XSS
    },
    detection: {
      order: ['path', 'navigator'], // Tenta ler da URL (/pt ou /en) primeiro
      lookupFromPathIndex: 0
    }
  });

export default i18n;
