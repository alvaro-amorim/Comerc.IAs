const CONSENT_STORAGE_KEY = 'comercias.consent.v1';
const CONSENT_COOKIE_NAME = 'comercias_consent';
const CONSENT_VERSION = 1;
const CONSENT_COOKIE_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

function getDntSignal() {
  if (typeof window === 'undefined') return false;

  const navigatorDnt = window.navigator ? window.navigator.doNotTrack : null;
  const windowDnt = window.doNotTrack;
  const msDnt = window.navigator ? window.navigator.msDoNotTrack : null;

  const candidates = [navigatorDnt, windowDnt, msDnt].map((value) =>
    value === null || value === undefined ? '' : String(value)
  );

  return candidates.includes('1') || candidates.includes('yes');
}

function normalizeBoolean(value, fallbackValue) {
  if (typeof value === 'boolean') return value;
  return fallbackValue;
}

function normalizeTimestamp(value) {
  if (typeof value !== 'string') return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function toSerializedConsent(rawValue) {
  const value = rawValue && typeof rawValue === 'object' ? rawValue : {};
  const decidedAt = normalizeTimestamp(value.decidedAt);

  if (!decidedAt) return null;

  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: normalizeBoolean(value.analytics, false),
    decidedAt,
    source: typeof value.source === 'string' ? value.source : 'user',
    dnt: normalizeBoolean(value.dnt, false),
  };
}

function readCookieValue(name) {
  if (typeof document === 'undefined') return null;
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookieValue(name, value, maxAgeSeconds) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function readStoredConsent() {
  if (typeof window === 'undefined') return null;

  let fromStorage = null;
  try {
    fromStorage = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    fromStorage = null;
  }

  if (fromStorage) {
    try {
      const parsed = JSON.parse(fromStorage);
      const normalized = toSerializedConsent(parsed);
      if (normalized) return normalized;
    } catch (error) {
      // Ignora valor invalido e tenta fallback por cookie.
    }
  }

  const fromCookie = readCookieValue(CONSENT_COOKIE_NAME);
  if (!fromCookie) return null;

  try {
    const parsed = JSON.parse(fromCookie);
    const normalized = toSerializedConsent(parsed);
    if (normalized) return normalized;
  } catch (error) {
    return null;
  }

  return null;
}

function persistConsentDecision(consent) {
  if (typeof window === 'undefined') return;
  const normalized = toSerializedConsent(consent);
  if (!normalized) return;

  const serialized = JSON.stringify(normalized);
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
  } catch (error) {
    // Segue com cookie mesmo se localStorage estiver indisponivel.
  }
  writeCookieValue(CONSENT_COOKIE_NAME, serialized, CONSENT_COOKIE_MAX_AGE_SECONDS);
}

function createDecision(analyticsEnabled, options = {}) {
  return {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: Boolean(analyticsEnabled),
    decidedAt: new Date().toISOString(),
    source: options.source || 'user',
    dnt: Boolean(options.dnt),
  };
}

export { createDecision, getDntSignal, persistConsentDecision, readStoredConsent };
