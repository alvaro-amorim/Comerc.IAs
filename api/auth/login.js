const { issueSessionToken, setSessionCookie, timingSafePasswordMatch } = require('../_lib/auth');
const { getEnv, getRequiredEnv } = require('../_lib/env');
const {
  ensureMethod,
  enforceAllowedOrigin,
  getClientIp,
  handleOptions,
  readJsonBody,
  sendJson,
} = require('../_lib/http');
const { takeRateLimitToken } = require('../_lib/rateLimit');

module.exports = async function handler(req, res) {
  const allowedOrigin = getEnv('ALLOWED_ORIGIN');

  if (handleOptions(req, res, allowedOrigin)) return;
  if (!ensureMethod(req, res, ['POST', 'OPTIONS'])) return;
  if (!enforceAllowedOrigin(req, res, allowedOrigin)) return;

  const ip = getClientIp(req);
  const rateLimitResult = takeRateLimitToken(`login:${ip}`, {
    limit: 8,
    windowMs: 15 * 60_000,
  });

  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000));
    return sendJson(res, 429, { error: 'too_many_attempts' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: 'invalid_json' });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  const expectedPassword = getRequiredEnv('ADMIN_PASSWORD');

  if (!timingSafePasswordMatch(password, expectedPassword)) {
    return sendJson(res, 401, { error: 'invalid_credentials' });
  }

  // Cookie HttpOnly com JWT assinado evita expor sessão ao front-end.
  const token = issueSessionToken();
  setSessionCookie(res, token);

  return sendJson(res, 200, { authenticated: true });
};
