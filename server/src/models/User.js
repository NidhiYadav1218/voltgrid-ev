import mongoose from 'mongoose';
import { USER_ROLES } from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.DRIVER
    },
    vendorId: {
      type: String,
      default: null
    },
    car: {
      type: String,
      default: 'MG ZS EV'
    },
    sessionsCount: {
      type: Number,
      default: 0
    },
    totalKwhCharged: {
      type: Number,
      default: 0
    },
    totalMoneySaved: {
      type: Number,
      default: 0
    },
    totalCo2Saved: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
