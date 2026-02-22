const { clearSessionCookie } = require('../_lib/auth');
const { getEnv } = require('../_lib/env');
const { ensureMethod, enforceAllowedOrigin, handleOptions, sendJson } = require('../_lib/http');

module.exports = async function handler(req, res) {
  const allowedOrigin = getEnv('ALLOWED_ORIGIN');

  if (handleOptions(req, res, allowedOrigin)) return;
  if (!ensureMethod(req, res, ['POST', 'OPTIONS'])) return;
  if (!enforceAllowedOrigin(req, res, allowedOrigin)) return;

  clearSessionCookie(res);
  return sendJson(res, 200, { ok: true });
};
