import { Router } from 'express';
import { getTelematics, upsertTelematics } from '../controllers/telematicsController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

router.use(auth);
router.use(requireRole(USER_ROLES.DRIVER, USER_ROLES.ADMIN));

router.get('/', getTelematics);
router.post('/', upsertTelematics);

export default router;
