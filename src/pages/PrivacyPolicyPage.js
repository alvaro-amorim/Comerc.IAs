import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import SEO from '../components/SEO';
import '../styles/LegalPages.css';

function getContent(lang) {
  if (lang === 'en') {
    return {
      title: 'Privacy Policy',
      seoTitle: "Privacy Policy | Comerc IA's",
      seoDescription:
        'Understand how Comerc IA collects audience metrics, legal basis, retention period, and data subject rights.',
      lastUpdated: 'Last updated: February 22, 2026',
      sections: [
        {
          heading: '1. Scope',
          body: [
            'This policy explains how Comerc IA processes audience measurement data when you browse this website.',
          ],
        },
        {
          heading: '2. Data We Collect',
          body: [
            'For optional analytics, we collect click events, page path, page duration, timestamp, session identifier, browser user-agent, referrer, and a salted IP hash.',
            'We do not store the raw IP address and do not collect typed form content.',
          ],
        },
        {
          heading: '3. Purpose',
          body: [
            'Data is used only for audience measurement, UX improvements, content optimization, and website performance monitoring.',
          ],
        },
        {
          heading: '4. Legal Basis (LGPD and GDPR/ePrivacy)',
          body: [
            'Under LGPD, processing may rely on legitimate interest for strictly necessary technical operation, while optional analytics is processed only after user consent in this website.',
            'For EU/EEA visitors, analytics trackers are disabled by default and activated only after explicit consent (GDPR + ePrivacy model).',
          ],
        },
        {
          heading: '5. Retention',
          body: [
            'Analytics events are kept for up to 90 days by default and then deleted or anonymized in aggregated reports.',
          ],
        },
        {
          heading: '6. Data Subject Rights',
          body: [
            'You may request information, deletion, or objection through our contact page.',
            'Use the route /en/contact (or /pt/contact) and mention "Privacy Request".',
          ],
        },
        {
          heading: '7. Controller Contact',
          body: [
            "Controller: Comerc IA's.",
            'Contact channel: website contact form and official WhatsApp listed in the footer.',
          ],
        },
      ],
    };
  }

  return {
    title: 'Politica de Privacidade',
    seoTitle: "Politica de Privacidade | Comerc IA's",
    seoDescription:
      'Entenda como a Comerc IA coleta metricas de audiencia, base legal, prazo de retencao e direitos do titular.',
    lastUpdated: 'Ultima atualizacao: 22 de fevereiro de 2026',
    sections: [
      {
        heading: '1. Escopo',
        body: [
          'Esta politica explica como a Comerc IA trata dados de medicao de audiencia quando voce navega neste site.',
        ],
      },
      {
        heading: '2. Dados Coletados',
        body: [
          'Para analytics opcional, coletamos eventos de clique, path da pagina, tempo de permanencia, timestamp, identificador de sessao, user-agent do navegador, referrer e hash de IP com sal.',
          'Nao armazenamos IP em formato puro e nao coletamos conteudo digitado em formularios.',
        ],
      },
      {
        heading: '3. Finalidade',
        body: [
          'Os dados sao usados exclusivamente para medicao de audiencia, melhoria de UX, otimizacao de conteudo e monitoramento de desempenho do site.',
        ],
      },
      {
        heading: '4. Base Legal (LGPD e GDPR/ePrivacy)',
        body: [
          'Na LGPD, o tratamento pode se apoiar em legitimo interesse para operacao tecnica estritamente necessaria, enquanto analytics opcional neste site e processado somente apos consentimento do usuario.',
          'Para visitantes da UE/EEE, trackers de analytics ficam desativados por padrao e so sao ativados apos consentimento explicito (modelo GDPR + ePrivacy).',
        ],
      },
      {
        heading: '5. Retencao',
        body: [
          'Eventos de analytics sao mantidos por ate 90 dias por padrao e depois removidos ou anonimizados em relatorios agregados.',
        ],
      },
      {
        heading: '6. Direitos do Titular',
        body: [
          'Voce pode solicitar informacoes, exclusao ou oposicao ao tratamento pelos nossos canais de contato.',
          'Use a rota /pt/contact (ou /en/contact) e informe "Solicitacao de Privacidade".',
        ],
      },
      {
        heading: '7. Contato do Controlador',
        body: [
          "Controlador: Comerc IA's.",
          'Canal de contato: formulario do site e WhatsApp oficial listado no rodape.',
        ],
      },
    ],
  };
}

export default function PrivacyPolicyPage() {
  const { lang: langParam } = useParams();
  const lang = langParam === 'en' ? 'en' : 'pt';
  const content = getContent(lang);

  return (
    <>
      <SEO title={content.seoTitle} description={content.seoDescription} href={`/${lang}/privacy`} />
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
