import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { getStats } from '../controllers/admin.controller.js';

const router = Router();

router.get('/stats', requireAuth, requireAdmin, getStats);

export default router;