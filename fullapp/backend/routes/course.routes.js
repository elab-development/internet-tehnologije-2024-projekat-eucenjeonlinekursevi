import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadResources,
  removeResource,
} from '../controllers/course.controller.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', requireAuth, listCourses);
router.get('/:id', requireAuth, getCourse);

router.post('/', requireAuth, requireAdmin, createCourse);
router.put('/:id', requireAuth, requireAdmin, updateCourse);
router.delete('/:id', requireAuth, requireAdmin, deleteCourse);

router.post(
  '/:id/resources',
  requireAuth,
  requireAdmin,
  upload.array('files'),
  uploadResources
);
router.delete('/:id/resources', requireAuth, requireAdmin, removeResource);

export default router;