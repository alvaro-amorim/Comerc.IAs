import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useConsent } from '../context/ConsentContext';
import '../styles/CookieConsent.css';

function normalizeLang(rawLang) {
  return rawLang === 'en' ? 'en' : 'pt';
}

function getCopy(lang) {
  if (lang === 'en') {
    return {
      bannerTitle: 'Cookies and Trackers',
      bannerBody:
        'We use only necessary cookies by default. Analytics is optional and disabled until you allow it.',
      dntNotice:
        'Your browser sent Do Not Track (DNT=1). Analytics remains disabled by default.',
      reject: 'Reject analytics',
      accept: 'Accept analytics',
      settings: 'Cookie settings',
      panelTitle: 'Privacy Preferences',
      panelBody:
        'Choose which categories can be used. Necessary is always enabled for site operation.',
      necessaryLabel: 'Necessary',
      necessaryDesc: 'Required for navigation and security. It cannot be disabled.',
      analyticsLabel: 'Measurement / Analytics',
      analyticsDesc: 'Audience metrics to improve pages, UX, and site performance.',
      save: 'Save preferences',
      close: 'Close',
      policyPrefix: 'Read:',
      privacyPolicy: 'Privacy Policy',
      cookiesPolicy: 'Cookies Policy',
      onLabel: 'On',
      offLabel: 'Off',
    };
  }

  return {
    bannerTitle: 'Cookies e Trackers',
    bannerBody:
      'Usamos apenas cookies necessarios por padrao. Analytics e opcional e fica desativado ate voce permitir.',
    dntNotice:
      'Seu navegador enviou Do Not Track (DNT=1). Analytics permanece desativado por padrao.',
    reject: 'Recusar analytics',
    accept: 'Aceitar analytics',
    settings: 'Configurar cookies',
    panelTitle: 'Preferencias de Privacidade',
    panelBody:
      'Escolha quais categorias podem ser usadas. Necessarios ficam sempre ativos para o funcionamento do site.',
    necessaryLabel: 'Necessarios',
    necessaryDesc: 'Obrigatorios para navegacao e seguranca. Nao podem ser desativados.',
    analyticsLabel: 'Medicao / Analytics',
    analyticsDesc: 'Metricas de audiencia para melhorar paginas, UX e desempenho do site.',
    save: 'Salvar preferencias',
    close: 'Fechar',
    policyPrefix: 'Leia:',
    privacyPolicy: 'Politica de Privacidade',
    cookiesPolicy: 'Politica de Cookies',
    onLabel: 'On',
    offLabel: 'Off',
  };
}

export default function CookieConsentManager() {
  const { lang: urlLang } = useParams();
  const lang = normalizeLang(urlLang);

  const {
    consent,
    acceptAnalytics,
    closePanel,
    openPanel,
    rejectAnalytics,
    saveAnalyticsPreference,
  } = useConsent();

  const copy = useMemo(() => getCopy(lang), [lang]);
  const [analyticsDraft, setAnalyticsDraft] = useState(consent.analytics);

  useEffect(() => {
    if (consent.isPanelOpen) {
      setAnalyticsDraft(consent.analytics);
    }
  }, [consent.analytics, consent.isPanelOpen]);

  const privacyPath = `/${lang}/privacy`;
  const cookiesPath = `/${lang}/cookies`;

  return (
    <>
      {!consent.decided ? (
        <aside className="cookie-banner" role="dialog" aria-live="polite">
          <div className="cookie-banner__title">{copy.bannerTitle}</div>
          <p className="cookie-banner__body">{copy.bannerBody}</p>
          {consent.dntDetected ? <p className="cookie-banner__dnt">{copy.dntNotice}</p> : null}
          <div className="cookie-banner__actions">
            <button type="button" className="cookie-btn cookie-btn--ghost" onClick={rejectAnalytics}>
              {copy.reject}
            </button>
            <button type="button" className="cookie-btn cookie-btn--primary" onClick={acceptAnalytics}>
              {copy.accept}
            </button>
            <button type="button" className="cookie-btn cookie-btn--link" onClick={openPanel}>
              {copy.settings}
            </button>
          </div>
          <div className="cookie-banner__links">
            <span>{copy.policyPrefix}</span>
            <Link to={privacyPath}>{copy.privacyPolicy}</Link>
            <span>|</span>
            <Link to={cookiesPath}>{copy.cookiesPolicy}</Link>
          </div>
        </aside>
      ) : null}

      {consent.isPanelOpen ? (
        <div className="cookie-modalBackdrop" role="dialog" aria-modal="true" aria-label={copy.panelTitle}>
          <div className="cookie-modal">
            <div className="cookie-modal__header">
              <h2>{copy.panelTitle}</h2>
              <button
                type="button"
                className="cookie-modal__close"
                onClick={closePanel}
                aria-label={copy.close}
              >
                x
              </button>
            </div>
            <p className="cookie-modal__body">{copy.panelBody}</p>

            <div className="cookie-category">
              <div>
                <h3>{copy.necessaryLabel}</h3>
                <p>{copy.necessaryDesc}</p>
              </div>
              <label className="cookie-switch">
                <input type="checkbox" checked readOnly disabled />
                <span>{copy.onLabel}</span>
              </label>
            </div>

            <div className="cookie-category">
              <div>
                <h3>{copy.analyticsLabel}</h3>
                <p>{copy.analyticsDesc}</p>
              </div>
              <label className="cookie-switch">
                <input
                  type="checkbox"
                  checked={analyticsDraft}
                  onChange={(event) => setAnalyticsDraft(event.target.checked)}
                />
                <span>{analyticsDraft ? copy.onLabel : copy.offLabel}</span>
              </label>
            </div>

            <div className="cookie-modal__actions">
              <button
                type="button"
                className="cookie-btn cookie-btn--ghost"
                onClick={rejectAnalytics}
              >
                {copy.reject}
              </button>
              <button
                type="button"
                className="cookie-btn cookie-btn--primary"
                onClick={() => saveAnalyticsPreference(analyticsDraft)}
              >
                {copy.save}
              </button>
            </div>

            <div className="cookie-modal__links">
              <span>{copy.policyPrefix}</span>
              <Link to={privacyPath} onClick={closePanel}>
                {copy.privacyPolicy}
              </Link>
              <span>|</span>
              <Link to={cookiesPath} onClick={closePanel}>
                {copy.cookiesPolicy}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
