import mongoose from 'mongoose';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../config/constants.js';

const invoiceSchema = new mongoose.Schema(
  {
    energyCharge: {
      type: Number,
      required: true
    },
    convenienceFee: {
      type: Number,
      required: true
    },
    gst: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerPhone: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    vehicleModel: {
      type: String,
      required: true
    },
    stationId: {
      type: String,
      required: true
    },
    stationName: {
      type: String,
      required: true
    },
    vendorId: {
      type: String,
      required: true,
      index: true
    },
    vendorName: {
      type: String,
      required: true
    },
    portId: {
      type: String,
      required: true
    },
    energyKwh: {
      type: Number,
      required: true
    },
    pricePerKwh: {
      type: Number,
      required: true
    },
    invoice: {
      type: invoiceSchema,
      required: true
    },
    platformFee: {
      type: Number,
      required: true
    },
    vendorPayout: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.CONFIRMED,
      index: true
    },
    paymentStatus: {
      type: String,
      default: PAYMENT_STATUS.ESCROW_SETTLED
    },
    pin: {
      type: String,
      required: true,
      select: false
    },
    pinAttempts: {
      type: Number,
      default: 0
    },
    holdExpiresAt: {
      type: Date,
      required: true
    },
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
    refundedAt: {
      type: Date,
      default: null
    },
    refundReason: {
      type: String,
      default: null
    },
    idempotencyKey: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Indexes per MIGRATION_PLAN.md Section 7
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ vendorId: 1, createdAt: -1 });
bookingSchema.index({ stationId: 1, portId: 1, status: 1 });
bookingSchema.index({ user: 1, idempotencyKey: 1 }, { unique: true });

export const Booking = mongoose.model('Booking', bookingSchema);
