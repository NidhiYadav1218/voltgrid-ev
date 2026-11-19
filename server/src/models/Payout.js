import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    payoutId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    vendorId: {
      type: String,
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'REJECTED'],
      default: 'PROCESSED'
    },
    method: {
      type: String,
      default: 'Instant IMPS / NEFT Auto-Sweep'
    },
    referenceNo: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Payout = mongoose.model('Payout', payoutSchema);
