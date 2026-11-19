import { Router } from 'express';
import { z } from 'zod';
import { getAdminStats, resetDemo } from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

const resetSchema = z
  .object({
    confirm: z.string()
  })
  .strict();

router.use(auth);
router.use(requireRole(USER_ROLES.ADMIN));

router.get('/stats', getAdminStats);
router.post('/reset-demo', validateBody(resetSchema), resetDemo);

export default router;
