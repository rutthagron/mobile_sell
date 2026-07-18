import sql from 'mssql';
import { env } from './env.js';

const poolConfig = {
  server: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.pass,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: env.db.encrypt,
    trustServerCertificate: env.db.trustServerCert,
  },
};

let poolPromise = null;

/**
 * Return a shared connection pool, creating it on first use.
 * @returns {Promise<sql.ConnectionPool>}
 */
export function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(poolConfig)
      .connect()
      .then((pool) => {
        console.log('[db] Connected to SQL Server');
        return pool;
      })
      .catch((err) => {
        poolPromise = null;
        console.error('[db] Connection failed:', err.message);
        throw err;
      });
  }
  return poolPromise;
}

export { sql };
