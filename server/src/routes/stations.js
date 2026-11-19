import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import {
  getStations,
  getStationById,
  handleReservePort,
  handleStartCharging,
  handleReleasePort,
  updateStation,
  createStation,
  deleteStation
} from '../controllers/stationsController.js';
import { auth, optionalAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { validateBody } from '../middleware/validate.js';
import { USER_ROLES } from '../config/constants.js';

const router = Router();

// Rate limit for start-charging: 20 per 15 mins (Section 10.1)
const startChargingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many start-charging requests. Please wait a few minutes.' }
});

const applyStartLimiter = process.env.NODE_ENV === 'test' ? (req, res, next) => next() : startChargingLimiter;

// Zod schemas
const reserveSchema = z
  .object({
    vehicleModel: z.string().min(1, 'vehicleModel is required'),
    energyKwh: z.number().positive('energyKwh must be a positive number'),
    idempotencyKey: z.string().min(1, 'idempotencyKey is required')
  })
  .strict();

const startChargingSchema = z
  .object({
    pin: z.string().min(1, 'pin is required')
  })
  .strict();

// Public routes (with optional auth to mark isMine)
router.get('/', optionalAuth, getStations);
router.get('/:stationId', optionalAuth, getStationById);

// Driver reservation
router.post(
  '/:stationId/ports/:portId/reserve',
  auth,
  requireRole(USER_ROLES.DRIVER),
  validateBody(reserveSchema),
  handleReservePort
);

// Start charging
router.post(
  '/:stationId/ports/:portId/start',
  auth,
  applyStartLimiter,
  validateBody(startChargingSchema),
  handleStartCharging
);

// Release charging
router.post(
  '/:stationId/ports/:portId/release',
  auth,
  handleReleasePort
);

// Update station (Vendor or Admin)
router.patch(
  '/:stationId',
  auth,
  requireRole(USER_ROLES.VENDOR, USER_ROLES.ADMIN),
  updateStation
);

// Create / Delete station (Admin only)
router.post(
  '/',
  auth,
  requireRole(USER_ROLES.ADMIN),
  createStation
);

router.delete(
  '/:stationId',
  auth,
  requireRole(USER_ROLES.ADMIN),
  deleteStation
);

export default router;
