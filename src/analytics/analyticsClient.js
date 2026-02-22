const SESSION_STORAGE_KEY = 'comercias.analytics.session_id';
const MAX_QUEUE_SIZE = 250;
const FLUSH_BATCH_SIZE = 20;
const FLUSH_INTERVAL_MS = 10_000;
const MIN_DURATION_MS = 250;
const EXCLUDED_PATH_PREFIXES = ['/pt/loginadm'];

let initialized = false;
let sessionId = null;
let queue = [];
let flushIntervalId = null;
let currentPath = '';
let currentPathStartedAt = 0;

function createSessionId() {
  const nativeCrypto = typeof window !== 'undefined' ? window.crypto : null;
  if (nativeCrypto && typeof nativeCrypto.randomUUID === 'function') {
    return nativeCrypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateSessionId() {
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const generated = createSessionId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, generated);
    return generated;
  } catch (error) {
    return createSessionId();
  }
}

function normalizePath(pathValue) {
  if (typeof pathValue !== 'string' || !pathValue.trim()) return '/';
  const trimmed = pathValue.trim().slice(0, 1024);
  try {
    const parsed = new URL(trimmed, window.location.origin);
    return parsed.pathname || '/';
  } catch (error) {
    if (!trimmed.startsWith('/')) return `/${trimmed}`;
    return trimmed.split('?')[0].split('#')[0] || '/';
  }
}

function isEditableElement(element) {
  if (!element || !(element instanceof Element)) return false;
  const tag = element.tagName ? element.tagName.toLowerCase() : '';
  if (tag === 'input' || tag === 'textarea') return true;
  return Boolean(element.isContentEditable);
}

function getClasses(element) {
  if (!element || !element.classList) return [];
  return Array.from(element.classList)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function getClosestTrackNode(element) {
  let node = element;
  while (node && node instanceof Element) {
    if (node.hasAttribute('data-track')) return node;
    node = node.parentElement;
  }
  return null;
}

function buildFallbackSelector(element) {
  const parts = [];
  let node = element;
  let depth = 0;

  while (node && depth < 3 && node instanceof Element) {
    const tag = node.tagName ? node.tagName.toLowerCase() : '';
    if (!tag) break;

    let part = tag;
    if (node.id) {
      part += `#${node.id.slice(0, 80)}`;
      parts.unshift(part);
      break;
    }

    const classes = getClasses(node);
    if (classes.length) {
      part += classes.map((item) => `.${item}`).join('');
    }

    parts.unshift(part);
    node = node.parentElement;
    depth += 1;
  }

  return parts.join(' > ').slice(0, 240);
}

function buildElementPayload(target) {
  if (!(target instanceof Element)) return null;
  if (isEditableElement(target)) return null;

  const trackedNode = getClosestTrackNode(target);
  const node = trackedNode || target;

  if (isEditableElement(node)) return null;

  const tag = node.tagName ? node.tagName.toLowerCase() : null;
  const id = node.id ? node.id.slice(0, 120) : null;
  const classes = getClasses(node);

  const dataTrackRaw = trackedNode ? trackedNode.getAttribute('data-track') : null;
  const dataTrack = typeof dataTrackRaw === 'string' ? dataTrackRaw.trim().slice(0, 120) : null;
  const selector = dataTrack ? `[data-track="${dataTrack}"]` : buildFallbackSelector(node);

  const payload = {
    selector,
    tag,
    id,
    classes,
  };

  if (dataTrack) payload.dataTrack = dataTrack;

  return payload;
}

function getCurrentPath() {
  if (typeof window === 'undefined') return '/';
  return normalizePath(window.location.pathname);
}

function isTrackablePath(pathValue) {
  return !EXCLUDED_PATH_PREFIXES.some((prefix) => pathValue.startsWith(prefix));
}

function enqueueEvent(event) {
  queue.push(event);
  if (queue.length > MAX_QUEUE_SIZE) {
    queue = queue.slice(queue.length - MAX_QUEUE_SIZE);
  }
  // Batching: evita request por clique e reduz carga no endpoint /api/track.
  if (queue.length >= FLUSH_BATCH_SIZE) {
    void flushQueue();
  }
}

async function sendBatch(events, useBeacon) {
  const body = JSON.stringify({ events });

  if (useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });
    return navigator.sendBeacon('/api/track', blob);
  }

  const response = await fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    credentials: 'same-origin',
    keepalive: true,
  });

  return response.ok;
}

async function flushQueue(options = {}) {
  if (!queue.length) return;

  const batch = queue.splice(0, queue.length);
  const useBeacon = Boolean(options.useBeacon);

  try {
    const sent = await sendBatch(batch, useBeacon);
    if (!sent) {
      queue = batch.concat(queue).slice(-MAX_QUEUE_SIZE);
    }
  } catch (error) {
    queue = batch.concat(queue).slice(-MAX_QUEUE_SIZE);
  }
}

function emitDurationIfNeeded() {
  if (!currentPath || !currentPathStartedAt) return;
  if (!isTrackablePath(currentPath)) {
    currentPathStartedAt = Date.now();
    return;
  }

  // Duration: fecha o tempo da rota atual ao trocar rota/ocultar aba/sair.
  const durationMs = Date.now() - currentPathStartedAt;
  if (durationMs >= MIN_DURATION_MS) {
    enqueueEvent({
      type: 'duration',
      path: currentPath,
      session_id: sessionId,
      duration_ms: Math.round(durationMs),
    });
  }

  currentPathStartedAt = Date.now();
}

function onDocumentClick(event) {
  if (!initialized) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const path = getCurrentPath();
  if (!isTrackablePath(path)) return;

  const element = buildElementPayload(target);
  if (!element) return;

  enqueueEvent({
    type: 'click',
    path,
    session_id: sessionId,
    element,
  });
}

function onVisibilityChange() {
  if (!initialized) return;

  if (document.visibilityState === 'hidden') {
    emitDurationIfNeeded();
    void flushQueue({ useBeacon: true });
  } else if (document.visibilityState === 'visible') {
    currentPathStartedAt = Date.now();
  }
}

function onPageHide() {
  if (!initialized) return;
  emitDurationIfNeeded();
  void flushQueue({ useBeacon: true });
}

function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;

  sessionId = getOrCreateSessionId();
  initialized = true;
  currentPath = getCurrentPath();
  currentPathStartedAt = Date.now();

  if (isTrackablePath(currentPath)) {
    enqueueEvent({
      type: 'pageview',
      path: currentPath,
      session_id: sessionId,
    });
  }

  window.addEventListener('click', onDocumentClick, true);
  document.addEventListener('visibilitychange', onVisibilityChange, true);
  window.addEventListener('pagehide', onPageHide, true);
  window.addEventListener('beforeunload', onPageHide, true);

  flushIntervalId = window.setInterval(() => {
    void flushQueue();
  }, FLUSH_INTERVAL_MS);
}

function stopAnalytics(options = {}) {
  if (!initialized || typeof window === 'undefined') return;

  window.removeEventListener('click', onDocumentClick, true);
  document.removeEventListener('visibilitychange', onVisibilityChange, true);
  window.removeEventListener('pagehide', onPageHide, true);
  window.removeEventListener('beforeunload', onPageHide, true);

  if (flushIntervalId) {
    clearInterval(flushIntervalId);
    flushIntervalId = null;
  }

  const discardQueuedEvents = Boolean(options.discardQueuedEvents);
  if (!discardQueuedEvents) {
    emitDurationIfNeeded();
    void flushQueue({ useBeacon: true });
  } else {
    queue = [];
  }

  initialized = false;
  currentPath = '';
  currentPathStartedAt = 0;
}

function trackRouteChange(pathValue) {
  if (!initialized) return;

  const nextPath = normalizePath(pathValue || getCurrentPath());
  if (!currentPath) {
    currentPath = nextPath;
    currentPathStartedAt = Date.now();
    if (isTrackablePath(currentPath)) {
      enqueueEvent({ type: 'pageview', path: currentPath, session_id: sessionId });
    }
    return;
  }

  if (currentPath !== nextPath) {
    emitDurationIfNeeded();
    currentPath = nextPath;
    currentPathStartedAt = Date.now();
    if (isTrackablePath(currentPath)) {
      enqueueEvent({ type: 'pageview', path: currentPath, session_id: sessionId });
    }
  }
}

export { flushQueue, initAnalytics, stopAnalytics, trackRouteChange };
