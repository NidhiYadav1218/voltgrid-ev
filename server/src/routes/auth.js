import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { register, login, getMe } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

// Rate limit: 10 requests per 15 minutes for auth endpoints (Section 10.1)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address format'),
    phone: z.string().min(8, 'Phone number must be at least 8 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    car: z.string().optional()
  })
  .strict();

const loginSchema = z
  .object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required')
  })
  .strict();

// In test environment, bypass rate limiter so acceptance tests run without 429
const applyLimiter = process.env.NODE_ENV === 'test' ? (req, res, next) => next() : authLimiter;

router.post('/register', applyLimiter, validateBody(registerSchema), register);
router.post('/login', applyLimiter, validateBody(loginSchema), login);
router.get('/me', auth, getMe);

export default router;
