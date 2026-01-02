import React from 'react';
import { Helmet } from 'react-helmet-async';

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoProductionService", // Mudança crítica: Tipo específico
    "name": "Comerc IA's",
    "alternateName": "Comerc IAs Produções",
    "url": "https://comercias.com.br",
    "logo": "https://comercias.com.br/logo.png",
    "description": "Produtora de vídeos focada em comerciais, marketing digital e inteligência artificial.",
    "sameAs": [
      "https://www.instagram.com/comerc_ias",
      "https://www.tiktok.com/@comerc.ias",
      "https://wa.me/5532984869192"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-32-98486-9192",
      "contactType": "customer service",
      "areaServed": ["BR", "US"],
      "availableLanguage": ["Portuguese", "English"]
    },
    "priceRange": "$$"
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const VideoSchema = ({ title, description, thumbUrl, videoUrl, uploadDate, duration }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": title,
    "description": description,
    "thumbnailUrl": thumbUrl,
    "uploadDate": uploadDate, 
    "duration": duration, 
    "contentUrl": videoUrl,
    "publisher": {
      "@type": "VideoProductionService",
      "name": "Comerc IA's",
      "logo": {
        "@type": "ImageObject",
        "url": "https://comercias.com.br/logo.png"
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};