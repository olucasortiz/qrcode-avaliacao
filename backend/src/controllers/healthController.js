import { getHealthStatus, getReadinessStatus } from '../services/healthService.js';

export function healthCheck(_req, res) {
  return res.status(200).json(getHealthStatus());
}

export async function readinessCheck(_req, res) {
  const readiness = await getReadinessStatus();
  const statusCode = readiness.status === 'ok' ? 200 : 503;
  return res.status(statusCode).json(readiness);
}
