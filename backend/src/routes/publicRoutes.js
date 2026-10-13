import { Router } from 'express';
import { obterPesquisa, responder } from '../controllers/publicController.js';
import { publicReadLimiter, responseLimiter } from '../middlewares/rateLimitMiddleware.js';

const router = Router();
router.get('/pesquisas/:slug', publicReadLimiter, obterPesquisa);
router.post('/pesquisas/:slug/respostas', responseLimiter, responder);
export default router;
