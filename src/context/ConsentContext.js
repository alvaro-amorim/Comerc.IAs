import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import {
  createDecision,
  getDntSignal,
  persistConsentDecision,
  readStoredConsent,
} from '../consent/consentStorage';

const ConsentContext = createContext(null);

function getInitialConsentState() {
  const storedConsent = readStoredConsent();
  const dnt = getDntSignal();

  if (storedConsent) {
    return {
      ...storedConsent,
      decided: true,
      dntDetected: dnt,
      isPanelOpen: false,
    };
  }

  return {
    necessary: true,
    analytics: false,
    decided: false,
    decidedAt: null,
    source: dnt ? 'dnt_default' : 'unset',
    dnt,
    dntDetected: dnt,
    isPanelOpen: false,
  };
}

export function ConsentProvider({ children }) {
  const [state, setState] = useState(() => getInitialConsentState());

  const saveDecision = useCallback((analyticsEnabled, source = 'user') => {
    const decision = createDecision(analyticsEnabled, {
      source,
      dnt: state.dntDetected,
    });
    persistConsentDecision(decision);
    setState((prev) => ({
      ...prev,
      ...decision,
      decided: true,
      isPanelOpen: false,
    }));
  }, [state.dntDetected]);

  const openPanel = useCallback(() => {
    setState((prev) => ({ ...prev, isPanelOpen: true }));
  }, []);

  const closePanel = useCallback(() => {
    setState((prev) => ({ ...prev, isPanelOpen: false }));
  }, []);

  const value = useMemo(
    () => ({
      consent: state,
      analyticsAllowed: state.decided && state.analytics,
      acceptAnalytics: () => saveDecision(true, 'user'),
      rejectAnalytics: () => saveDecision(false, 'user'),
      saveAnalyticsPreference: (analyticsEnabled) =>
        saveDecision(Boolean(analyticsEnabled), 'user'),
      openPanel,
      closePanel,
    }),
    [closePanel, openPanel, saveDecision, state]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
}
