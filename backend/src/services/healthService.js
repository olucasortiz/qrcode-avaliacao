import { checkDatabaseReadiness } from '../config/prisma.js';

export function getHealthStatus() {
  return {
    status: 'ok',
    service: 'FeedQR API',
  };
}

export async function getReadinessStatus() {
  const db = await checkDatabaseReadiness();
  return {
    status: db.ready ? 'ok' : 'error',
    database: db.ready ? 'connected' : 'disconnected',
    ...(db.error ? { error: db.error } : {}),
  };
}
