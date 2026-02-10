import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import './i18n';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

/* ==========================================================================
   POLYFILL PARA REACT-SNAP
   Isso corrige o erro "e.replaceAll is not a function" durante o build.
   ========================================================================== */
if (!String.prototype.replaceAll) {
  // eslint-disable-next-line no-extend-native
  String.prototype.replaceAll = function (str, newStr) {
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr);
    }
    return this.replace(new RegExp(str, 'g'), newStr);
  };
}
/* FIM DO POLYFILL */

const container = document.getElementById('root');

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Mantém sua lógica de hidratação (ótima para react-snap) :contentReference[oaicite:3]{index=3}
if (container && container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(app);
}
