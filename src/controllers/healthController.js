import { getHealthStatus } from '../services/healthService.js';

export function healthCheck(_req, res) {
  return res.status(200).json(getHealthStatus());
}
