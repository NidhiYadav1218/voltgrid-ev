import { Router } from 'express';
import { z } from 'zod';
import {
  getBookings,
  getBookingById,
  getBookingPass,
  cancelBooking,
  refundBooking
} from '../controllers/bookingsController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

const refundSchema = z
  .object({
    reason: z.string().optional()
  })
  .strict();

// All booking routes require authentication
router.use(auth);

router.get('/', getBookings);
router.get('/:id', getBookingById);
router.get('/:id/pass', getBookingPass);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/refund', requireRole(USER_ROLES.ADMIN), validateBody(refundSchema), refundBooking);

export default router;
