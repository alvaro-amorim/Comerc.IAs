const fs = require('fs');
const path = require('path');

// 1. Configurações Globais
const DOMAIN = 'https://comercias.com.br';
const OUTPUT_DIR = path.join(__dirname, '../build'); // Salva direto na pasta build
const DATA_ATUAL = new Date().toISOString();

// 2. Definição das Rotas e Idiomas
const LANGUAGES = ['pt', 'en'];
const PAGES = [
  '',           // Home
  'about',      // Sobre
  'portfolio',  // Portfólio
  'orcamento',  // Orçamento
  'contact'     // Contato
];

// 3. Dados dos Vídeos (Baseado no teu PortfolioPage.js)
// Isso ajuda a aparecer na aba "Vídeos" do Google
const VIDEOS = [
  {
    page: 'portfolio',
    title: 'Apresentação de Marca',
    desc: 'Apresentar sua marca ao mundo de forma prática e inovadora.',
    thumb: `${DOMAIN}/assets/images/foto.comerc.jpg`, // Idealmente, usar URLs absolutas reais
    loc: 'https://www.youtube.com/embed/uYZeMRy9g-E',
    duration: '120' // Segundos aproximados
  },
  {
    page: 'portfolio',
    title: 'Vídeos Storytelling com IA',
    desc: 'Transformamos ideias criativas em roteiros impactantes.',
    thumb: `${DOMAIN}/assets/images/tumb.marcos.png`,
    loc: 'https://www.youtube.com/embed/pcl1pZejmgs',
    duration: '60'
  }
  // Podes adicionar os outros vídeos aqui depois
];

const generateSitemaps = () => {
  // Garantir que a pasta build existe
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error('❌ Erro: Pasta build não encontrada. Rode "npm run build" antes.');
    return;
  }

  console.log('🔄 Gerando Sitemaps...');

  // --- A. Gerar Sitemaps de Páginas (com hreflang) ---
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Adiciona a raiz (redirecionamento)
  sitemapContent += `
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${DATA_ATUAL}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  LANGUAGES.forEach(lang => {
    PAGES.forEach(page => {
      // Constrói a URL: ex: https://comercias.com.br/pt/about
      const route = page ? `${lang}/${page}` : lang;
      const fullUrl = `${DOMAIN}/${route}`;
      
      // Define a alternativa (outro idioma)
      const altLang = lang === 'pt' ? 'en' : 'pt';
      const altRoute = page ? `${altLang}/${page}` : altLang;
      const altUrl = `${DOMAIN}/${altRoute}`;

      sitemapContent += `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${DATA_ATUAL}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="${lang}" href="${fullUrl}"/>
    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>
  </url>`;
    });
  });

  sitemapContent += '\n</urlset>';
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemapContent);
  console.log('✅ sitemap.xml gerado (Padrão + Hreflang)');


  // --- B. Gerar Sitemap de Vídeos (Video SEO) ---
  let videoSitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  VIDEOS.forEach(video => {
    // Assumimos que o vídeo está na página de portfólio em PT (principal)
    const locUrl = `${DOMAIN}/pt/${video.page}`;
    
    videoSitemapContent += `
  <url>
    <loc>${locUrl}</loc>
    <video:video>
      <video:thumbnail_loc>${video.thumb}</video:thumbnail_loc>
      <video:title>${video.title}</video:title>
      <video:description>${video.desc}</video:description>
      <video:player_loc>${video.loc}</video:player_loc>
      <video:duration>${video.duration}</video:duration>
      <video:publication_date>${DATA_ATUAL}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:live>no</video:live>
    </video:video>
  </url>`;
  });

  videoSitemapContent += '\n</urlset>';
  fs.writeFileSync(path.join(OUTPUT_DIR, 'video-sitemap.xml'), videoSitemapContent);
  console.log('✅ video-sitemap.xml gerado (Google Video SEO)');


  // --- C. Atualizar Robots.txt ---
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
Sitemap: ${DOMAIN}/video-sitemap.xml`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), robotsContent);
  console.log('✅ robots.txt atualizado na build');
};

generateSitemaps();