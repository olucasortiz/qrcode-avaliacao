import { getHealthStatus, getReadinessStatus } from '../services/healthService.js';

export function healthCheck(_req, res) {
  res.set('Cache-Control', 'no-store');
  return res.status(200).json(getHealthStatus());
}

export async function readinessCheck(_req, res) {
  res.set('Cache-Control', 'no-store');
  const readiness = await getReadinessStatus();
  const statusCode = readiness.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(readiness);
}
