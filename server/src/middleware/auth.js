import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { HttpError } from './errorHandler.js';

export async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpError(401, 'Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'dev-secret-key-voltgrid';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      throw new HttpError(401, 'Invalid or expired authentication token');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new HttpError(401, 'User account no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// Optional auth for public endpoints that enhance response if logged in (e.g., isMine flag on ports)
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'dev-secret-key-voltgrid';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  next();
}
