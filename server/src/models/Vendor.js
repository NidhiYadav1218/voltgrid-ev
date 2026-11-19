import mongoose from 'mongoose';
import { DEFAULT_COMMISSION_RATE } from '../config/constants.js';

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    logo: {
      type: String,
      default: '⚡'
    },
    color: {
      type: String,
      default: 'emerald'
    },
    contactEmail: {
      type: String,
      required: true
    },
    supportPhone: {
      type: String,
      required: true
    },
    gstin: {
      type: String,
      required: true
    },
    commissionRate: {
      type: Number,
      default: DEFAULT_COMMISSION_RATE
    },
    bankAccountMasked: {
      type: String,
      required: true
    },
    payoutMethod: {
      type: String,
      default: 'Instant IMPS / NEFT Auto-Sweep'
    },
    rating: {
      type: Number,
      default: 4.8
    }
  },
  { timestamps: true }
);

export const Vendor = mongoose.model('Vendor', vendorSchema);
