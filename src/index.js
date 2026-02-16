import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import './i18n';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

/* ==========================================================================
   POLYFILL PARA REACT-SNAP
   Corrige o erro "e.replaceAll is not a function" durante o build.
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
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Hidratação (boa para react-snap)
if (container && container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(app);
}
