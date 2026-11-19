import mongoose from 'mongoose';

const telematicsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    make: {
      type: String,
      default: 'MG'
    },
    model: {
      type: String,
      default: 'ZS EV'
    },
    year: {
      type: Number,
      default: 2024
    },
    vin: {
      type: String,
      default: '1MGZS48EV20265921'
    },
    battery: {
      percentRemaining: { type: Number, default: 22 },
      rangeKm: { type: Number, default: 88 },
      capacityKwh: { type: Number, default: 50.3 },
      voltage: { type: Number, default: 362.4 },
      temperatureC: { type: Number, default: 28.5 }
    },
    odometer: {
      totalKm: { type: Number, default: 14272.8 }
    },
    trip: {
      distanceCoveredKm: { type: Number, default: 22.8 },
      energyConsumedKwh: { type: Number, default: 3.35 },
      initialSoc: { type: Number, default: 100 },
      currentSoc: { type: Number, default: 22 }
    },
    speed: {
      type: Number,
      default: 0
    },
    gear: {
      type: String,
      default: 'P'
    },
    isDriving: {
      type: Boolean,
      default: false
    },
    esim: {
      carrier: { type: String, default: 'Airtel IoT India' },
      status: { type: String, default: 'ACTIVE_4G_VOLTE' },
      signalStrengthDbm: { type: Number, default: -74 },
      ip: { type: String, default: '10.45.12.98' }
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const Telematics = mongoose.model('Telematics', telematicsSchema);
