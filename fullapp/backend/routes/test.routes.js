import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  listTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
} from '../controllers/test.controller.js';

const router = Router();

router.get('/', requireAuth, listTests);
router.get('/:id', requireAuth, getTest);

router.post('/', requireAuth, requireAdmin, createTest);
router.put('/:id', requireAuth, requireAdmin, updateTest);
router.delete('/:id', requireAuth, requireAdmin, deleteTest);

export default router;