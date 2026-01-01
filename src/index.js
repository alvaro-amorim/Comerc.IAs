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
   O navegador do react-snap é antigo e precisa dessa ajuda.
   ==========================================================================
*/
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

// Estrutura da aplicação encapsulada
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Lógica de Hidratação para SEO (react-snap)
// Verifica se o react-snap já preencheu o HTML. Se sim, hidrata. Se não, renderiza.
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else {
  const root = ReactDOM.createRoot(container);
  root.render(app);
}