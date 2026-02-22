const crypto = require('crypto');

const { getEnv, getRequiredEnv } = require('./_lib/env');
const {
  ensureMethod,
  enforceAllowedOrigin,
  getClientIp,
  handleOptions,
  readJsonBody,
  sendJson,
} = require('./_lib/http');
const { takeRateLimitToken } = require('./_lib/rateLimit');
const { insertEvents } = require('./_lib/supabase');
const { sanitizeEventsBatch } = require('./_lib/trackValidation');

function hashIp(ip, secret) {
  return crypto.createHash('sha256').update(`${ip}|${secret}`).digest('hex');
}

module.exports = async function handler(req, res) {
  const allowedOrigin = getEnv('ALLOWED_ORIGIN');

  if (handleOptions(req, res, allowedOrigin)) return;
  if (!ensureMethod(req, res, ['POST', 'OPTIONS'])) return;
  if (!enforceAllowedOrigin(req, res, allowedOrigin)) return;

  const ip = getClientIp(req);
  const rateLimitResult = takeRateLimitToken(`track:${ip}`, {
    limit: 180,
    windowMs: 60_000,
  });

  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000));
    return sendJson(res, 429, { error: 'rate_limited' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: 'invalid_json' });
  }

  const events = sanitizeEventsBatch(body.events, 120);
  if (!events.length) {
    return sendJson(res, 400, { error: 'invalid_events' });
  }

  const userAgentHeader = req.headers['user-agent'];
  const refererHeader = req.headers.referer || req.headers.referrer;
  const userAgent = typeof userAgentHeader === 'string' ? userAgentHeader.slice(0, 512) : null;
  const referrer = typeof refererHeader === 'string' ? refererHeader.slice(0, 1024) : null;

  let ipHash = null;
  try {
    ipHash = hashIp(ip, getRequiredEnv('JWT_SECRET'));
  } catch (error) {
    return sendJson(res, 500, { error: 'server_misconfigured' });
  }

  const rows = events.map((event) => ({
    ...event,
    user_agent: userAgent,
    referrer,
    ip_hash: ipHash,
  }));

  try {
    await insertEvents(rows);
  } catch (error) {
    return sendJson(res, 500, { error: 'failed_to_store_events' });
  }

  return sendJson(res, 200, {
    ok: true,
    accepted: rows.length,
  });
};
