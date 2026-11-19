import { Router } from 'express';
import { z } from 'zod';
import { getMe, updateMe, getAllUsers } from '../controllers/usersController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

const updateMeSchema = z
  .object({
    name: z.string().min(2).optional(),
    phone: z.string().min(8).optional(),
    car: z.string().optional()
  })
  .strict();

router.use(auth);

router.get('/me', getMe);
router.patch('/me', validateBody(updateMeSchema), updateMe);
router.get('/', requireRole(USER_ROLES.ADMIN), getAllUsers);

export default router;
