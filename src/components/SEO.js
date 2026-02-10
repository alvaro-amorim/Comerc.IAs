import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, href }) => {
  const siteUrl = process.env.REACT_APP_SITE_URL || "https://comercias.com.br";

  // evita duplicar marca no title (ex: "Quem Somos - Comerc IA's ..." + "| Comerc IA's")
  const brand = "Comerc IA's";
  const fullTitle = title?.toLowerCase().includes("comerc") ? title : `${title} | ${brand}`;

  const fullUrl = href ? new URL(href, siteUrl).toString() : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Comerc IA's Produções" />
      <meta property="og:image" content={`${siteUrl}/share-image.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}/share-image.png`} />
    </Helmet>
  );
};

export default SEO;
