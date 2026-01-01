import React from 'react';
import { Helmet } from 'react-helmet-async';

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Comerc IAs",
    "url": "https://comercias.com.br",
    "logo": "https://comercias.com.br/logo.png",
    "sameAs": [
      "https://www.instagram.com/comerc_ias",
      "https://wa.me/5532984869192"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-32-98486-9192",
      "contactType": "customer service",
      "areaServed": ["BR", "US"],
      "availableLanguage": ["Portuguese", "English"]
    }
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
    "uploadDate": uploadDate, // ISO 8601
    "duration": duration, // ISO 8601 (PT1M30S)
    "contentUrl": videoUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Comerc IAs",
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