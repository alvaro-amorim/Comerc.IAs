const EVENT_TYPES = new Set(['click', 'pageview', 'duration']);

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeString(value, maxLength) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function sanitizePath(value) {
  const path = sanitizeString(value, 1024);
  if (!path) return null;
  try {
    const parsed = new URL(path, 'https://comercias.local');
    return parsed.pathname || '/';
  } catch (error) {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return normalized.split('?')[0].split('#')[0] || '/';
  }
}

function sanitizeClasses(value) {
  const candidates = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(/\s+/)
      : [];

  return candidates
    .map((item) => sanitizeString(item, 80))
    .filter(Boolean)
    .slice(0, 3);
}

function sanitizeElement(value) {
  if (!isPlainObject(value)) return null;

  const selector = sanitizeString(value.selector, 240);
  const tag = sanitizeString(value.tag, 40);
  const id = sanitizeString(value.id, 120);
  const dataTrack = sanitizeString(value.dataTrack, 120);
  const classes = sanitizeClasses(value.classes);

  const element = {};
  if (selector) element.selector = selector;
  if (tag) element.tag = tag;
  if (id) element.id = id;
  if (classes.length > 0) element.classes = classes;
  if (dataTrack) element.dataTrack = dataTrack;

  return Object.keys(element).length > 0 ? element : null;
}

function sanitizeEvent(rawEvent) {
  if (!isPlainObject(rawEvent)) return null;

  const type = sanitizeString(rawEvent.type, 24);
  if (!type || !EVENT_TYPES.has(type)) return null;

  const path = sanitizePath(rawEvent.path);
  if (!path) return null;

  const sessionId = sanitizeString(rawEvent.session_id, 120);
  if (!sessionId) return null;

  const event = {
    type,
    path,
    session_id: sessionId,
  };

  if (type === 'click') {
    const element = sanitizeElement(rawEvent.element);
    if (element) event.element = element;
  }

  if (type === 'duration') {
    const durationMs = Number(rawEvent.duration_ms);
    if (!Number.isFinite(durationMs) || durationMs < 0 || durationMs > 86_400_000) {
      return null;
    }
    event.duration_ms = Math.round(durationMs);
  }

  return event;
}

function sanitizeEventsBatch(rawEvents, maxEvents) {
  if (!Array.isArray(rawEvents)) return [];
  const limit = maxEvents || 100;

  const sanitized = [];
  for (const rawEvent of rawEvents.slice(0, limit)) {
    const safeEvent = sanitizeEvent(rawEvent);
    if (safeEvent) sanitized.push(safeEvent);
  }
  return sanitized;
}

module.exports = {
  sanitizeEventsBatch,
};
