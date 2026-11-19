import mongoose from 'mongoose';
import { PORT_STATUS } from '../config/constants.js';

const portSchema = new mongoose.Schema(
  {
    portId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: '150kW Fast DC'
    },
    maxKw: {
      type: Number,
      required: true
    },
    connector: {
      type: String,
      default: 'CCS2'
    },
    vehicleType: {
      type: String,
      enum: ['2W', '4W', 'BOTH'],
      default: '4W'
    },
    status: {
      type: String,
      enum: Object.values(PORT_STATUS),
      default: PORT_STATUS.AVAILABLE
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reservedAt: {
      type: Date,
      default: null
    },
    holdExpiresAt: {
      type: Date,
      default: null
    },
    startedAt: {
      type: Date,
      default: null
    },
    soc: {
      type: Number,
      default: null
    },
    kw: {
      type: Number,
      default: null
    }
  },
  { _id: false }
);

const stationSchema = new mongoose.Schema(
  {
    stationId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    city: {
      type: String,
      default: 'Ahmedabad'
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    },
    mapsUrl: {
      type: String
    },
    directionsUrl: {
      type: String
    },
    pricePerKwh: {
      type: Number,
      required: true
    },
    solar: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.8
    },
    amenities: {
      type: [String],
      default: []
    },
    vendorId: {
      type: String,
      required: true,
      index: true
    },
    vendorName: {
      type: String
    },
    vendorLogo: {
      type: String
    },
    vendorColor: {
      type: String
    },
    ports: [portSchema]
  },
  { timestamps: true }
);

stationSchema.index({ 'ports.portId': 1 });

export const Station = mongoose.model('Station', stationSchema);
