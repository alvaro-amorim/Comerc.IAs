const { URL } = require('url');

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function setCorsHeaders(res, allowedOrigin) {
  if (!allowedOrigin) return;
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Vary', 'Origin');
}

function handleOptions(req, res, allowedOrigin) {
  if (req.method !== 'OPTIONS') return false;
  setCorsHeaders(res, allowedOrigin);
  res.statusCode = 204;
  res.end();
  return true;
}

function ensureMethod(req, res, allowedMethods) {
  if (allowedMethods.includes(req.method)) {
    return true;
  }
  res.setHeader('Allow', allowedMethods.join(', '));
  sendJson(res, 405, { error: 'method_not_allowed' });
  return false;
}

function toSingleValue(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function getQuery(req) {
  if (req.query && typeof req.query === 'object') {
    return req.query;
  }
  const url = new URL(req.url, 'http://localhost');
  const query = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}

function getClientIp(req) {
  const forwarded = toSingleValue(req.headers['x-forwarded-for']);
  if (forwarded && typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  const realIp = toSingleValue(req.headers['x-real-ip']);
  if (realIp && typeof realIp === 'string') {
    return realIp;
  }
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : '0.0.0.0';
}

function enforceAllowedOrigin(req, res, allowedOrigin) {
  if (!allowedOrigin) return true;
  const origin = toSingleValue(req.headers.origin);
  if (!origin || origin === allowedOrigin) {
    setCorsHeaders(res, allowedOrigin);
    return true;
  }
  sendJson(res, 403, { error: 'origin_not_allowed' });
  return false;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    const trimmed = req.body.trim();
    return trimmed ? JSON.parse(trimmed) : {};
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) return {};
  return JSON.parse(raw);
}

module.exports = {
  ensureMethod,
  enforceAllowedOrigin,
  getClientIp,
  getQuery,
  handleOptions,
  readJsonBody,
  sendJson,
  setCorsHeaders,
};
