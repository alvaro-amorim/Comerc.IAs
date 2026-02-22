const STORE_KEY = '__comerciasRateLimitStore';

const store = globalThis[STORE_KEY] || new Map();
globalThis[STORE_KEY] = store;

function cleanupExpiredEntries(now) {
  if (store.size < 5000) return;
  for (const [key, value] of store.entries()) {
    if (!value || value.resetAt <= now) {
      store.delete(key);
    }
  }
}

function takeRateLimitToken(key, options) {
  const limit = options && options.limit ? options.limit : 60;
  const windowMs = options && options.windowMs ? options.windowMs : 60_000;

  const now = Date.now();
  cleanupExpiredEntries(now);

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}

module.exports = {
  takeRateLimitToken,
};
