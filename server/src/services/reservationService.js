import crypto from 'crypto';
import mongoose from 'mongoose';
import { Station } from '../models/Station.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { computeInvoice, computePlatformSplit } from './pricingService.js';
import { expireHoldsForPort } from './expiryService.js';
import {
  PORT_STATUS,
  BOOKING_STATUS,
  DEFAULT_HOLD_MINUTES,
  DEFAULT_COMMISSION_RATE,
  MONEY_SAVED_PER_KWH,
  CO2_SAVED_PER_KWH
} from '../config/constants.js';
import { HttpError } from '../middleware/errorHandler.js';

export async function reservePort({
  stationId,
  portId,
  user,
  vehicleModel,
  energyKwh,
  idempotencyKey
}) {
  // 1. Idempotency Check (Section 9.7)
  const existingBooking = await Booking.findOne({
    user: user._id,
    idempotencyKey
  });

  if (existingBooking) {
    return {
      isIdempotent: true,
      booking: existingBooking
    };
  }

  // 2. Pre-check expired holds for this port (Section 9.5)
  await expireHoldsForPort(stationId, portId);

  // 3. Find station and specific port
  const stationDoc = await Station.findOne({ stationId });
  if (!stationDoc) {
    throw new HttpError(404, 'Charging station hub not found');
  }

  const targetPort = stationDoc.ports.find((p) => p.portId === portId);
  if (!targetPort) {
    throw new HttpError(404, 'Charging port not found at this station');
  }

  if (targetPort.status !== PORT_STATUS.AVAILABLE) {
    throw new HttpError(409, 'Port is no longer available');
  }

  // 4. Time calculations
  const now = new Date();
  const holdMinutes = DEFAULT_HOLD_MINUTES;
  const holdExpiresAt = new Date(now.getTime() + holdMinutes * 60 * 1000);

  // 5. Vendor information & Pricing
  const vendorDoc = await Vendor.findOne({ vendorId: stationDoc.vendorId });
  const commissionRate = vendorDoc ? vendorDoc.commissionRate : DEFAULT_COMMISSION_RATE;

  const kwh = Math.max(1, Number(energyKwh) || 25);
  const vehicleType = targetPort.vehicleType === '2W' ? '2W' : '4W';
  const invoice = computeInvoice(kwh, stationDoc.pricePerKwh, vehicleType);
  const { platformFee, vendorPayout } = computePlatformSplit(invoice.totalAmount, commissionRate);

  // 6. Generate PIN (Section 9.2) & Booking Code
  const pin = String(crypto.randomInt(1000, 10000));
  const bookingCode = `BK-${crypto.randomInt(10000, 100000)}`;

  // 7. Atomic update on station port matching status 'available' (Section 9.1)
  let session = null;
  let useTransaction = false;

  try {
    session = await mongoose.startSession();
    // Test if replica set is active for transactions
    if (mongoose.connection.client.topology && mongoose.connection.client.topology.description.type !== 'Single') {
      session.startTransaction();
      useTransaction = true;
    }
  } catch (err) {
    session = null;
  }

  try {
    const updatedStation = await Station.findOneAndUpdate(
      {
        stationId,
        ports: { $elemMatch: { portId, status: PORT_STATUS.AVAILABLE } }
      },
      {
        $set: {
          'ports.$.status': PORT_STATUS.RESERVED,
          'ports.$.reservedBy': user._id,
          'ports.$.reservedAt': now,
          'ports.$.holdExpiresAt': holdExpiresAt
        }
      },
      { new: true, session: useTransaction ? session : undefined }
    );

    if (!updatedStation) {
      throw new HttpError(409, 'Port is no longer available');
    }

    // 8. Create Booking record
    const bookingData = {
      bookingCode,
      user: user._id,
      customerName: user.name,
      customerPhone: user.phone,
      customerEmail: user.email,
      vehicleModel: vehicleModel || user.car || 'MG ZS EV',
      stationId: stationDoc.stationId,
      stationName: stationDoc.name,
      vendorId: stationDoc.vendorId,
      vendorName: stationDoc.vendorName || (vendorDoc ? vendorDoc.name : 'EV Network'),
      portId,
      energyKwh: kwh,
      pricePerKwh: stationDoc.pricePerKwh,
      invoice,
      platformFee,
      vendorPayout,
      status: BOOKING_STATUS.CONFIRMED,
      pin,
      pinAttempts: 0,
      holdExpiresAt,
      idempotencyKey
    };

    const [createdBooking] = await Booking.create([bookingData], {
      session: useTransaction ? session : undefined
    });

    // 9. Attach bookingId to port
    await Station.updateOne(
      { stationId, 'ports.portId': portId },
      { $set: { 'ports.$.bookingId': createdBooking._id } },
      { session: useTransaction ? session : undefined }
    );

    // 10. Update user profile statistics (Section 9.8)
    await User.updateOne(
      { _id: user._id },
      {
        $inc: {
          sessionsCount: 1,
          totalKwhCharged: kwh,
          totalMoneySaved: Math.round(kwh * MONEY_SAVED_PER_KWH),
          totalCo2Saved: Math.round(kwh * CO2_SAVED_PER_KWH)
        }
      },
      { session: useTransaction ? session : undefined }
    );

    if (useTransaction && session) {
      await session.commitTransaction();
    }

    // Return created booking with one-time visible PIN
    const bookingObj = createdBooking.toObject();
    bookingObj.pin = pin;

    return {
      isIdempotent: false,
      booking: bookingObj,
      pin
    };
  } catch (err) {
    if (useTransaction && session) {
      await session.abortTransaction();
    }
    throw err;
  } finally {
    if (session) {
      session.endSession();
    }
  }
}
