import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { USER_ROLES } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandler.js';

function generateToken(userId, role) {
  const secret = process.env.JWT_SECRET || 'dev-secret-key-voltgrid';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId, role }, secret, { expiresIn });
}

function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, car } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new HttpError(409, 'An account with this email address already exists');
    }

    // Hash password with bcryptjs cost 10
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash,
      role: USER_ROLES.DRIVER,
      car: car || 'MG ZS EV'
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Query user and explicitly select passwordHash
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Authentication required');
    }
    res.status(200).json(sanitizeUser(req.user));
  } catch (error) {
    next(error);
  }
}
