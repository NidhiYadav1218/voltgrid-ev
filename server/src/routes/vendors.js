import { Router } from 'express';
import { z } from 'zod';
import {
  getAllVendors,
  getVendorMe,
  getVendorPayouts,
  requestVendorPayout
} from '../controllers/vendorsController.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

const payoutSchema = z
  .object({
    amount: z.number().positive('Payout amount must be positive'),
    method: z.string().optional()
  })
  .strict();

router.use(auth);

// Admin lists all vendors with aggregate metrics
router.get('/', requireRole(USER_ROLES.ADMIN), getAllVendors);

// Vendor endpoints
router.get('/me', requireRole(USER_ROLES.VENDOR), getVendorMe);
router.get('/me/payouts', requireRole(USER_ROLES.VENDOR), getVendorPayouts);
router.post('/me/payouts', requireRole(USER_ROLES.VENDOR), validateBody(payoutSchema), requestVendorPayout);

export default router;
