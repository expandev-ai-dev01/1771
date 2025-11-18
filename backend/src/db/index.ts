import sql from 'mssql';
import { config } from '@/config';

const dbConfig: sql.config = {
  server: config.database.server,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  options: {
    encrypt: config.database.options.encrypt,
    trustServerCertificate: config.database.options.trustServerCertificate,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool;

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    try {
      pool = await new sql.ConnectionPool(dbConfig).connect();
      console.log('Database connection pool created successfully.');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }
  return pool;
};

export const dbRequest = async () => {
  const pool = await getPool();
  return pool.request();
};
