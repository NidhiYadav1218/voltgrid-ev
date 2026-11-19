import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import stationsRoutes from './routes/stations.js';
import bookingsRoutes from './routes/bookings.js';
import usersRoutes from './routes/users.js';
import vendorsRoutes from './routes/vendors.js';
import telematicsRoutes from './routes/telematics.js';
import adminRoutes from './routes/admin.js';
import reviewsRoutes from './routes/reviews.js';

export function createApp() {
  const app = express();

  // Security Headers
  app.use(helmet());

  // CORS - restricted strictly to CLIENT_ORIGIN
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, curl, server-to-server) in development/test
        if (!origin || origin === clientOrigin) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: Origin ${origin} is unauthorized`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }

  // Body parser & MongoDB injection sanitizer
  app.use(express.json({ limit: '10kb' }));
  app.use(mongoSanitize());

  // General Rate Limiter: 300 requests per 15 minutes
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
  });
  app.use('/api', generalLimiter);

  // Health check endpoint (Public)
  app.get('/api/health', (req, res) => {
    res.status(200).json({ ok: true });
  });

  // Auth Routes
  app.use('/api/auth', authRoutes);

  // Stations Routes
  app.use('/api/stations', stationsRoutes);

  // Bookings Routes
  app.use('/api/bookings', bookingsRoutes);

  // Users Routes
  app.use('/api/users', usersRoutes);

  // Vendors Routes
  app.use('/api/vendors', vendorsRoutes);

  // Telematics Routes
  app.use('/api/telematics', telematicsRoutes);

  // Admin Routes
  app.use('/api/admin', adminRoutes);

  // Reviews & Testimonials Routes
  app.use('/api/reviews', reviewsRoutes);

  // Central Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp();
