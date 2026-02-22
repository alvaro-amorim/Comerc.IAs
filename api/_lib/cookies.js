function parseCookies(cookieHeader) {
  if (!cookieHeader || typeof cookieHeader !== 'string') {
    return {};
  }

  return cookieHeader.split(';').reduce((acc, part) => {
    const [rawName, ...rawValue] = part.split('=');
    const name = rawName ? rawName.trim() : '';
    if (!name) return acc;
    acc[name] = decodeURIComponent(rawValue.join('=').trim());
    return acc;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  const pieces = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) pieces.push(`Max-Age=${options.maxAge}`);
  if (options.httpOnly) pieces.push('HttpOnly');
  if (options.secure) pieces.push('Secure');
  if (options.sameSite) pieces.push(`SameSite=${options.sameSite}`);
  pieces.push(`Path=${options.path || '/'}`);

  return pieces.join('; ');
}

module.exports = {
  parseCookies,
  serializeCookie,
};
