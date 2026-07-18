import dotenv from 'dotenv';

dotenv.config();

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn(
    `[env] Missing environment variables: ${missing.join(', ')}. ` +
      'Copy .env.example to .env and fill in the values.'
  );
}

/**
 * Turn CORS_ORIGIN into a value accepted by the cors middleware.
 * Empty/'*' -> allow any origin; otherwise a single origin or an array.
 */
function parseCorsOrigin(raw) {
  if (!raw || raw.trim() === '' || raw.trim() === '*') return true;
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length === 1 ? list[0] : list;
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  // '*' allows any origin (handy on a trusted LAN); or a comma-separated list.
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
  https: {
    enabled: String(process.env.HTTPS_ENABLED).toLowerCase() === 'true',
    keyPath: process.env.HTTPS_KEY_PATH || '',
    certPath: process.env.HTTPS_CERT_PATH || '',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 1433,
    name: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASS || '',
    encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === 'true',
    trustServerCert:
      String(process.env.DB_TRUST_SERVER_CERT).toLowerCase() !== 'false',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  },
};
