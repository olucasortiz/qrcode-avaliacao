import { Router } from 'express';

import healthRoutes from './healthRoutes.js';
import adminRoutes from './adminRoutes.js';
import publicRoutes from './publicRoutes.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use(adminRoutes);

export default router;
