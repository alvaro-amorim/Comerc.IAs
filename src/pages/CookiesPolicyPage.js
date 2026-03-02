import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import SEO from '../components/SEO';
import '../styles/LegalPages.css';

function getContent(lang) {
  if (lang === 'en') {
    return {
      title: 'Cookies and Trackers Policy',
      seoTitle: "Cookies Policy | Comerc IA's",
      seoDescription:
        'Learn about cookie categories, consent control, Do Not Track, and how to revoke analytics tracking.',
      lastUpdated: 'Last updated: March 1, 2026',
      sections: [
        {
          heading: '1. Categories',
          body: [
            'Necessary: always active for security, core navigation, and basic access counting.',
            'Measurement / Analytics: optional detailed metrics (such as clicks and page duration), disabled by default and activated only after user consent.',
          ],
        },
        {
          heading: '2. Consent and Revocation',
          body: [
            'You can accept or reject analytics without blocking website usage.',
            'You can reopen cookie settings at any time through the footer link "Cookie settings". Revocation is as easy as acceptance.',
          ],
        },
        {
          heading: '3. Do Not Track',
          body: [
            'If the browser sends DNT=1, detailed analytics remains disabled by default unless you actively change preferences.',
          ],
        },
        {
          heading: '4. Stored Preference',
          body: [
            'Consent choice is stored in localStorage and in a first-party cookie, with decision timestamp for auditability.',
          ],
        },
        {
          heading: '5. Data Minimization',
          body: [
            'Analytics does not capture typed form content.',
            'Tracked clicks prioritize data-track labels and use a short fallback selector only when necessary.',
          ],
        },
      ],
    };
  }

  return {
    title: 'Politica de Cookies e Trackers',
    seoTitle: "Politica de Cookies | Comerc IA's",
    seoDescription:
      'Saiba quais categorias de cookies usamos, como revogar consentimento e como funciona o modo com DNT.',
    lastUpdated: 'Ultima atualizacao: 1 de marco de 2026',
    sections: [
      {
        heading: '1. Categorias',
        body: [
          'Necessarios: sempre ativos para seguranca, navegacao essencial e contagem basica de acessos.',
          'Medicao / Analytics: metricas detalhadas (como cliques e tempo por pagina), opcionais, desativadas por padrao e ativadas somente apos consentimento do usuario.',
        ],
      },
      {
        heading: '2. Consentimento e Revogacao',
        body: [
          'Voce pode aceitar ou recusar analytics sem bloquear o uso normal do site.',
          'Voce pode reabrir as preferencias a qualquer momento no link "Configurar cookies" no rodape. Revogar e tao facil quanto aceitar.',
        ],
      },
      {
        heading: '3. Do Not Track',
        body: [
          'Se o navegador enviar DNT=1, analytics detalhado permanece desativado por padrao, salvo mudanca ativa da sua preferencia.',
        ],
      },
      {
        heading: '4. Registro da Preferencia',
        body: [
          'A escolha de consentimento e armazenada em localStorage e cookie de primeira parte, com timestamp da decisao para auditoria.',
        ],
      },
      {
        heading: '5. Minimizacao de Dados',
        body: [
          'Analytics nao captura conteudo digitado em formularios.',
          'Cliques rastreados priorizam data-track e usam fallback de seletor curto somente quando necessario.',
        ],
      },
    ],
  };
}

export default function CookiesPolicyPage() {
  const { lang: langParam } = useParams();
  const lang = langParam === 'en' ? 'en' : 'pt';
  const content = getContent(lang);

  return (
    <>
      <SEO title={content.seoTitle} description={content.seoDescription} href={`/${lang}/cookies`} />
      <section className="legal-page">
        <Container className="legal-page__container">
          <h1>{content.title}</h1>
          <p className="legal-page__updated">{content.lastUpdated}</p>

          {content.sections.map((section) => (
            <article key={section.heading} className="legal-page__section">
              <h2>{section.heading}</h2>
              {section.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </article>
          ))}
        </Container>
      </section>
    </>
  );
}
