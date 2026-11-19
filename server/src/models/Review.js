import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    userName: {
      type: String,
      required: true,
      trim: true
    },
    userCity: {
      type: String,
      default: 'Ahmedabad'
    },
    vehicleModel: {
      type: String,
      default: 'MG ZS EV'
    },
    stationId: {
      type: String,
      required: false
    },
    stationName: {
      type: String,
      default: 'Gujarat Supergrid Hub'
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: false
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    verifiedDriver: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Review = mongoose.model('Review', reviewSchema);
