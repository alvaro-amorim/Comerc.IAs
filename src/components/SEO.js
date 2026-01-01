// src/components/SEO.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, href }) => {
  // Definir a URL base do site (ajuste se tiveres um domínio final diferente)
  const siteUrl = 'https://comercias.com.br';
  const fullUrl = `${siteUrl}${href || ''}`;

  return (
    <Helmet>
      {/* Títulos e Descrições Básicas */}
      <title>{title} | Comerc IA's</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${title} | Comerc IA's`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Comerc IA's Produções" />
      {/* Nota: Para a imagem funcionar perfeitamente no WhatsApp, idealmente deve ser uma URL absoluta */}
      <meta property="og:image" content={`${siteUrl}/share-image.png`} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/share-image.png`} />
    </Helmet>
  );
};

export default SEO;