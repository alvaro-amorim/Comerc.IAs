function getEnv(name) {
  return process.env[name];
}

function getRequiredEnv(name) {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function isProduction() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
}

module.exports = {
  getEnv,
  getRequiredEnv,
  isProduction,
};
