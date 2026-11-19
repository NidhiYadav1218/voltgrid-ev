import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import { Booking } from '../models/Booking.js';
import { DEFAULT_COMMISSION_RATE, VOLTGRID_COMMISSION_RATE } from '../config/constants.js';

function mapStatus(status) {
  if (!status) return 'CONFIRMED';
  const s = status.toUpperCase();
  if (s === 'RESERVED') return 'CONFIRMED';
  if (s === 'CHARGING') return 'COMPLETED';
  if (s === 'COMPLETED') return 'COMPLETED';
  if (s === 'REFUNDED') return 'REFUNDED';
  if (s === 'EXPIRED') return 'EXPIRED';
  if (s === 'CANCELLED') return 'CANCELLED';
  return 'CONFIRMED';
}

function maskPhone(phone) {
  if (!phone) return '+91 XXXXX XX01';
  const clean = String(phone).replace(/\D/g, '');
  const last2 = clean.slice(-2) || '01';
  return `+91 XXXXX XX${last2}`;
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return 'driver@example.com';
  const [, domain] = email.split('@');
  return `driver.xx@${domain}`;
}

export async function migrateLegacy() {
  const legacyUri = process.env.MONGODB_URI_LEGACY;
  if (!legacyUri) {
    throw new Error('MONGODB_URI_LEGACY is required to run migration.');
  }

  console.log('[Migrate Legacy] Connecting to legacy database in read-only mode...');
  const legacyConn = await mongoose.createConnection(legacyUri, { readPreference: 'secondaryPreferred' }).asPromise();
  const legacyBookingsCol = legacyConn.collection('bookings');

  const legacyBookings = await legacyBookingsCol.find({}).sort({ createdAt: 1 }).toArray();
  console.log(`[Migrate Legacy] Fetched ${legacyBookings.length} legacy bookings.`);

  let importedCount = 0;
  let skippedDuplicates = 0;

  // Track recent bookings for 2-second window deduplication
  const seen = [];

  for (const b of legacyBookings) {
    const createdAtTime = new Date(b.createdAt || Date.now()).getTime();

    // Check duplicate: customerPhone, stationId, portId and createdAt within 2000ms
    const isDuplicate = seen.some(
      (s) =>
        s.customerPhone === b.customerPhone &&
        s.stationId === b.stationId &&
        s.portId === b.portId &&
        Math.abs(s.time - createdAtTime) <= 2000
    );

    if (isDuplicate) {
      skippedDuplicates++;
      continue;
    }

    seen.push({
      customerPhone: b.customerPhone,
      stationId: b.stationId,
      portId: b.portId,
      time: createdAtTime
    });

    const totalAmount = Number(b.totalAmount) || 180;
    const vendorId = b.vendorId || 'vendor-jiobp';
    const rate = vendorId === 'vendor-voltgrid' ? VOLTGRID_COMMISSION_RATE : DEFAULT_COMMISSION_RATE;
    const platformFee = b.platformFee !== undefined ? Number(b.platformFee) : Math.round(totalAmount * rate);
    const vendorPayout = b.vendorPayout !== undefined ? Number(b.vendorPayout) : totalAmount - platformFee;

    const bookingCode = b.id || b.bookingId || `BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const bookingDoc = {
      bookingCode,
      user: new mongoose.Types.ObjectId(), // Placeholder ObjectId since users re-register
      customerName: b.customerName || 'EV Driver',
      customerPhone: maskPhone(b.customerPhone),
      customerEmail: maskEmail(b.customerEmail),
      vehicleModel: b.vehicleModel || 'MG ZS EV',
      stationId: b.stationId || 'st-01',
      stationName: b.stationName || 'VoltGrid Hub',
      vendorId,
      vendorName: b.vendorName || 'VoltGrid Direct',
      portId: b.portId || 'Bay 01',
      energyKwh: Number(b.energyKwh) || 20,
      pricePerKwh: Number(b.pricePerKwh) || 25,
      invoice: {
        energyCharge: Math.round((Number(b.energyKwh) || 20) * (Number(b.pricePerKwh) || 25)),
        convenienceFee: 40,
        gst: Math.round(totalAmount * 0.18),
        totalAmount
      },
      platformFee,
      vendorPayout,
      status: mapStatus(b.status),
      paymentStatus: b.paymentStatus || 'ESCROW_SETTLED',
      pin: b.pin || '1234',
      holdExpiresAt: new Date(createdAtTime + 15 * 60 * 1000),
      createdAt: new Date(createdAtTime),
      idempotencyKey: `legacy-${bookingCode}`
    };

    await Booking.findOneAndUpdate({ bookingCode }, { $set: bookingDoc }, { upsert: true });
    importedCount++;
  }

  await legacyConn.close();
  console.log(`[Migrate Legacy] Finished. Imported: ${importedCount}, Skipped duplicates: ${skippedDuplicates}`);
}

// Allow direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  connectDB()
    .then(() => migrateLegacy())
    .then(() => disconnectDB())
    .then(() => {
      console.log('[Migrate Legacy] Process finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Migrate Legacy] Error:', err);
      process.exit(1);
    });
}
