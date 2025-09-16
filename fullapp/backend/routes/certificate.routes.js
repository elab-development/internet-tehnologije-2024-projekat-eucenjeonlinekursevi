import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  listCertificates,
  getCertificate,
  createCertificate,
} from '../controllers/certificate.controller.js';

const router = Router();

router.get('/', requireAuth, listCertificates);
router.get('/:certificateId', getCertificate);
router.post('/', requireAuth, createCertificate);

export default router;