const crypto = require('crypto');

const { getRequiredEnv, isProduction } = require('./env');
const { parseCookies, serializeCookie } = require('./cookies');
const { signJwt, verifyJwt } = require('./jwt');

const SESSION_COOKIE_NAME = 'adm_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret() {
  return getRequiredEnv('JWT_SECRET');
}

function issueSessionToken() {
  return signJwt({ role: 'admin' }, getJwtSecret(), SESSION_MAX_AGE_SECONDS);
}

function setSessionCookie(res, token) {
  const cookie = serializeCookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  res.setHeader('Set-Cookie', cookie);
}

function clearSessionCookie(res) {
  const cookie = serializeCookie(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'Lax',
    path: '/',
    maxAge: 0,
  });

  res.setHeader('Set-Cookie', cookie);
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return null;
  try {
    return verifyJwt(token, getJwtSecret());
  } catch (error) {
    return null;
  }
}

function requireAdminSession(req) {
  const session = getSessionFromRequest(req);
  if (!session || session.role !== 'admin') return null;
  return session;
}

function timingSafePasswordMatch(passwordInput, configuredPassword) {
  // Hash em tamanho fixo evita vazar detalhes de tamanho antes do timingSafeEqual.
  const inputHash = crypto.createHash('sha256').update(String(passwordInput || '')).digest();
  const configuredHash = crypto
    .createHash('sha256')
    .update(String(configuredPassword || ''))
    .digest();

  return crypto.timingSafeEqual(inputHash, configuredHash);
}

module.exports = {
  clearSessionCookie,
  issueSessionToken,
  requireAdminSession,
  setSessionCookie,
  timingSafePasswordMatch,
};
