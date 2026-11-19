import { Booking } from '../models/Booking.js';
import { Station } from '../models/Station.js';
import { BOOKING_STATUS, PORT_STATUS } from '../config/constants.js';

/**
 * Expires holds for a specific port before reservation attempts.
 */
export async function expireHoldsForPort(stationId, portId) {
  const now = new Date();

  // Find confirmed booking for this port whose hold expired
  const expiredBooking = await Booking.findOne({
    stationId,
    portId,
    status: BOOKING_STATUS.CONFIRMED,
    holdExpiresAt: { $lte: now }
  });

  if (expiredBooking) {
    // Atomically claim the booking
    const claimed = await Booking.findOneAndUpdate(
      { _id: expiredBooking._id, status: BOOKING_STATUS.CONFIRMED },
      { $set: { status: BOOKING_STATUS.EXPIRED } },
      { new: true }
    );

    if (claimed) {
      // Free the port only if bookingId still matches
      await Station.updateOne(
        { stationId, 'ports.portId': portId, 'ports.bookingId': claimed._id },
        {
          $set: {
            'ports.$.status': PORT_STATUS.AVAILABLE,
            'ports.$.bookingId': null,
            'ports.$.reservedBy': null,
            'ports.$.reservedAt': null,
            'ports.$.holdExpiresAt': null,
            'ports.$.startedAt': null,
            'ports.$.soc': null,
            'ports.$.kw': null
          }
        }
      );

      // Transition to REFUNDED per Section 9.5
      await Booking.updateOne(
        { _id: claimed._id },
        {
          $set: {
            status: BOOKING_STATUS.REFUNDED,
            refundReason: 'No-show: hold expired',
            refundedAt: new Date()
          }
        }
      );
    }
  }
}

/**
 * Sweeps all expired holds across the system.
 */
export async function checkExpiredHolds() {
  try {
    const now = new Date();
    const expiredBookings = await Booking.find({
      status: BOOKING_STATUS.CONFIRMED,
      holdExpiresAt: { $lte: now }
    });

    for (const b of expiredBookings) {
      // Atomically claim booking
      const claimed = await Booking.findOneAndUpdate(
        { _id: b._id, status: BOOKING_STATUS.CONFIRMED },
        { $set: { status: BOOKING_STATUS.EXPIRED } },
        { new: true }
      );

      if (claimed) {
        // Free the port
        await Station.updateOne(
          { stationId: claimed.stationId, 'ports.bookingId': claimed._id },
          {
            $set: {
              'ports.$.status': PORT_STATUS.AVAILABLE,
              'ports.$.bookingId': null,
              'ports.$.reservedBy': null,
              'ports.$.reservedAt': null,
              'ports.$.holdExpiresAt': null,
              'ports.$.startedAt': null,
              'ports.$.soc': null,
              'ports.$.kw': null
            }
          }
        );

        // Mark REFUNDED per Section 9.5
        await Booking.updateOne(
          { _id: claimed._id },
          {
            $set: {
              status: BOOKING_STATUS.REFUNDED,
              refundReason: 'No-show: hold expired',
              refundedAt: new Date()
            }
          }
        );
      }
    }
  } catch (err) {
    console.error('[Expiry Service] Error during expired holds sweep:', err.message);
  }
}

let intervalTimer = null;

export function startExpiryService() {
  // Run once immediately
  checkExpiredHolds();
  // Then every 30 seconds
  intervalTimer = setInterval(checkExpiredHolds, 30000);
}

export function stopExpiryService() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
}
