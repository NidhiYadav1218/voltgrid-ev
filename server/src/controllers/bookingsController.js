import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Station } from '../models/Station.js';
import { BOOKING_STATUS, PORT_STATUS, USER_ROLES } from '../config/constants.js';
import { HttpError } from '../middleware/errorHandler.js';

export async function getBookings(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query = {};

    // Role-based filtering (Section 8)
    if (req.user.role === USER_ROLES.DRIVER) {
      query.user = req.user._id;
    } else if (req.user.role === USER_ROLES.VENDOR) {
      query.vendorId = req.user.vendorId || 'non-existent-vendor';
    }
    // Admin sees all

    if (status && Object.values(BOOKING_STATUS).includes(status)) {
      query.status = status;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Booking.countDocuments(query)
    ]);

    res.status(200).json({
      bookings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req, res, next) {
  try {
    const { id } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { bookingCode: id };
    }

    const booking = await Booking.findOne(query);
    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    const isOwner = String(booking.user) === String(req.user._id);
    const isVendor = req.user.role === USER_ROLES.VENDOR && req.user.vendorId === booking.vendorId;
    const isAdmin = req.user.role === USER_ROLES.ADMIN;

    if (!isOwner && !isVendor && !isAdmin) {
      throw new HttpError(403, 'Unauthorized to view this booking');
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
}

export async function getBookingPass(req, res, next) {
  try {
    const { id } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { bookingCode: id };
    }

    // Explicitly select the PIN (Section 9.2)
    const booking = await Booking.findOne(query).select('+pin');
    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Owner only
    if (String(booking.user) !== String(req.user._id)) {
      throw new HttpError(403, 'Only the reservation owner may access the security PIN pass');
    }

    // Only while CONFIRMED
    if (booking.status !== BOOKING_STATUS.CONFIRMED) {
      throw new HttpError(409, `PIN pass is only accessible while status is CONFIRMED (current: ${booking.status})`);
    }

    res.status(200).json({
      bookingCode: booking.bookingCode,
      stationName: booking.stationName,
      portId: booking.portId,
      status: booking.status,
      pin: booking.pin,
      holdExpiresAt: booking.holdExpiresAt
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { bookingCode: id };
    }

    const booking = await Booking.findOne(query);
    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Owner only
    if (String(booking.user) !== String(req.user._id)) {
      throw new HttpError(403, 'Unauthorized to cancel this booking');
    }

    if (booking.status !== BOOKING_STATUS.CONFIRMED) {
      throw new HttpError(409, `Cannot cancel booking with status ${booking.status}`);
    }

    // Atomically transition CONFIRMED -> CANCELLED -> REFUNDED per Section 9.9
    booking.status = BOOKING_STATUS.REFUNDED;
    booking.refundedAt = new Date();
    booking.refundReason = 'Customer cancellation';
    await booking.save();

    // Free the port
    await Station.updateOne(
      { stationId: booking.stationId, 'ports.bookingId': booking._id },
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

    res.status(200).json({
      success: true,
      message: 'Booking cancelled and refunded successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
}

export async function refundBooking(req, res, next) {
  try {
    const { id } = req.params;
    const { reason = 'Admin manual refund' } = req.body;

    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { bookingCode: id };
    }

    const booking = await Booking.findOne(query);
    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Admin can refund COMPLETED or CONFIRMED
    booking.status = BOOKING_STATUS.REFUNDED;
    booking.refundedAt = new Date();
    booking.refundReason = reason;
    await booking.save();

    // Free port if still held
    await Station.updateOne(
      { stationId: booking.stationId, 'ports.bookingId': booking._id },
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

    res.status(200).json({
      success: true,
      message: 'Booking refunded successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
}
