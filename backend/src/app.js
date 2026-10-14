import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { authLimiter } from './middlewares/rateLimitMiddleware.js';
import { env } from './config/env.js';
import { AppError } from './utils/AppError.js';

const app = express();
app.disable('x-powered-by');

if (env.trustProxy) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    callback(new AppError(403, 'Origem nao permitida.'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
  exposedHeaders: ['Content-Disposition', 'Retry-After'],
}));
app.use('/api/auth', authLimiter);
app.use(express.json({ limit: '64kb' }));

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
