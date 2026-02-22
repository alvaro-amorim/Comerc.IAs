const crypto = require('crypto');

function toBase64Url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function fromBase64Url(input) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const paddingSize = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(paddingSize);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function signPart(data, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function safeCompareString(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signJwt(payload, secret, expiresInSeconds) {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const fullPayload = {
    ...payload,
    iat: nowInSeconds,
    exp: nowInSeconds + expiresInSeconds,
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(fullPayload));
  const signature = signPart(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJwt(token, secret) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = signPart(`${encodedHeader}.${encodedPayload}`, secret);
  if (!safeCompareString(signature, expectedSignature)) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload));
  } catch (error) {
    return null;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= nowInSeconds) {
    return null;
  }

  if (typeof payload.nbf === 'number' && payload.nbf > nowInSeconds) {
    return null;
  }

  return payload;
}

module.exports = {
  signJwt,
  verifyJwt,
};
