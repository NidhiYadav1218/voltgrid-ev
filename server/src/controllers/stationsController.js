import { Station } from '../models/Station.js';
import { Booking } from '../models/Booking.js';
import { Vendor } from '../models/Vendor.js';
import { reservePort } from '../services/reservationService.js';
import { computeInvoice, computePlatformSplit } from '../services/pricingService.js';
import {
  PORT_STATUS,
  BOOKING_STATUS,
  DEFAULT_PIN_MAX_ATTEMPTS,
  DEFAULT_COMMISSION_RATE
} from '../config/constants.js';
import { HttpError } from '../middleware/errorHandler.js';

function sanitizeStation(station, userId) {
  const obj = station.toObject ? station.toObject() : { ...station };

  if (obj.ports && Array.isArray(obj.ports)) {
    obj.ports = obj.ports.map((port) => {
      const isMine = Boolean(userId && port.reservedBy && String(port.reservedBy) === String(userId));
      return {
        portId: port.portId,
        name: port.name,
        type: port.type,
        maxKw: port.maxKw,
        connector: port.connector,
        vehicleType: port.vehicleType,
        status: port.status,
        holdExpiresAt: port.holdExpiresAt,
        startedAt: port.startedAt,
        soc: port.soc,
        kw: port.kw,
        isMine
      };
    });
  }

  return obj;
}

export async function getStations(req, res, next) {
  try {
    const stations = await Station.find({}).sort({ stationId: 1 });
    const userId = req.user ? req.user._id : null;
    const sanitized = stations.map((s) => sanitizeStation(s, userId));
    res.status(200).json(sanitized);
  } catch (error) {
    next(error);
  }
}

export async function getStationById(req, res, next) {
  try {
    const { stationId } = req.params;
    const station = await Station.findOne({ stationId });
    if (!station) {
      throw new HttpError(404, 'Charging station not found');
    }

    const userId = req.user ? req.user._id : null;
    res.status(200).json(sanitizeStation(station, userId));
  } catch (error) {
    next(error);
  }
}

export async function handleReservePort(req, res, next) {
  try {
    const { stationId, portId } = req.params;
    const { vehicleModel, energyKwh, idempotencyKey } = req.body;

    const result = await reservePort({
      stationId,
      portId,
      user: req.user,
      vehicleModel,
      energyKwh,
      idempotencyKey
    });

    if (result.isIdempotent) {
      return res.status(200).json(result.booking);
    }

    return res.status(201).json({
      booking: result.booking,
      pin: result.pin
    });
  } catch (error) {
    next(error);
  }
}

export async function handleStartCharging(req, res, next) {
  try {
    const { stationId, portId } = req.params;
    const { pin } = req.body;

    if (!pin) {
      throw new HttpError(400, 'PIN is mandatory to start charging');
    }

    const station = await Station.findOne({ stationId });
    if (!station) {
      throw new HttpError(404, 'Station not found');
    }

    const port = station.ports.find((p) => p.portId === portId);
    if (!port) {
      throw new HttpError(404, 'Port not found');
    }

    if (port.status !== PORT_STATUS.RESERVED) {
      throw new HttpError(409, `Port is not in reserved state (current: ${port.status})`);
    }

    // Must be the booking owner
    if (!port.reservedBy || String(port.reservedBy) !== String(req.user._id)) {
      throw new HttpError(403, 'You are not authorized to start charging on this port');
    }

    const booking = await Booking.findOne({
      _id: port.bookingId,
      status: BOOKING_STATUS.CONFIRMED
    }).select('+pin');

    if (!booking) {
      throw new HttpError(404, 'Active reservation booking not found');
    }

    // Check hold expiry
    if (new Date() > new Date(booking.holdExpiresAt)) {
      throw new HttpError(409, 'Reservation hold has expired');
    }

    // Check lock attempts limit
    const maxAttempts = DEFAULT_PIN_MAX_ATTEMPTS;
    if (booking.pinAttempts >= maxAttempts) {
      throw new HttpError(423, 'Booking is locked due to too many failed PIN attempts');
    }

    // Verify PIN
    if (String(booking.pin).trim() !== String(pin).trim()) {
      const updatedBooking = await Booking.findByIdAndUpdate(
        booking._id,
        { $inc: { pinAttempts: 1 } },
        { new: true }
      );

      if (updatedBooking.pinAttempts >= maxAttempts) {
        throw new HttpError(423, 'Booking locked: maximum 5 incorrect PIN attempts reached');
      }

      throw new HttpError(403, 'Incorrect security PIN');
    }

    // Correct PIN: move to charging atomically
    const now = new Date();
    await Station.updateOne(
      { stationId, 'ports.portId': portId, 'ports.status': PORT_STATUS.RESERVED },
      {
        $set: {
          'ports.$.status': PORT_STATUS.CHARGING,
          'ports.$.startedAt': now,
          'ports.$.soc': port.soc || 25,
          'ports.$.kw': port.maxKw || 60
        }
      }
    );

    await Booking.updateOne(
      { _id: booking._id, status: BOOKING_STATUS.CONFIRMED },
      {
        $set: {
          status: BOOKING_STATUS.CHARGING,
          startedAt: now
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Charging session started successfully'
    });
  } catch (error) {
    next(error);
  }
}

export async function handleReleasePort(req, res, next) {
  try {
    const { stationId, portId } = req.params;

    const station = await Station.findOne({ stationId });
    if (!station) {
      throw new HttpError(404, 'Station not found');
    }

    const port = station.ports.find((p) => p.portId === portId);
    if (!port) {
      throw new HttpError(404, 'Port not found');
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = port.reservedBy && String(port.reservedBy) === String(req.user._id);

    if (!isAdmin && !isOwner) {
      throw new HttpError(403, 'Unauthorized to release this port');
    }

    const now = new Date();
    let completedBooking = null;

    if (port.bookingId) {
      const booking = await Booking.findById(port.bookingId);
      if (booking && (booking.status === BOOKING_STATUS.CHARGING || booking.status === BOOKING_STATUS.CONFIRMED)) {
        // Calculate delivered kWh based on elapsed charging time (or booked target if short)
        let deliveredKwh = booking.energyKwh;
        if (booking.startedAt) {
          const elapsedHours = Math.max(0.05, (now.getTime() - new Date(booking.startedAt).getTime()) / (1000 * 3600));
          const effectiveKw = port.maxKw || 60;
          deliveredKwh = Math.min(booking.energyKwh, +(elapsedHours * effectiveKw).toFixed(2));
          if (deliveredKwh < 1) deliveredKwh = booking.energyKwh;
        }

        const vendorDoc = await Vendor.findOne({ vendorId: station.vendorId });
        const commissionRate = vendorDoc ? vendorDoc.commissionRate : DEFAULT_COMMISSION_RATE;
        const vehicleType = port.vehicleType === '2W' ? '2W' : '4W';
        const updatedInvoice = computeInvoice(deliveredKwh, station.pricePerKwh, vehicleType);
        const { platformFee, vendorPayout } = computePlatformSplit(updatedInvoice.totalAmount, commissionRate);

        completedBooking = await Booking.findByIdAndUpdate(
          booking._id,
          {
            $set: {
              status: BOOKING_STATUS.COMPLETED,
              completedAt: now,
              energyKwh: deliveredKwh,
              invoice: updatedInvoice,
              platformFee,
              vendorPayout
            }
          },
          { new: true }
        );
      }
    }

    // Section 9.4: Clear every session field on the port
    await Station.updateOne(
      { stationId, 'ports.portId': portId },
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
      message: 'Port released and reset to available',
      booking: completedBooking
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStation(req, res, next) {
  try {
    const { stationId } = req.params;
    const station = await Station.findOne({ stationId });
    if (!station) {
      throw new HttpError(404, 'Station not found');
    }

    const isAdmin = req.user.role === 'admin';
    const isVendorOfStation = req.user.role === 'vendor' && req.user.vendorId === station.vendorId;

    if (!isAdmin && !isVendorOfStation) {
      throw new HttpError(403, 'Unauthorized to update this station');
    }

    if (!isAdmin && isVendorOfStation) {
      // Vendors may change only pricePerKwh (Section 8)
      if (req.body.pricePerKwh === undefined) {
        throw new HttpError(400, 'Vendors may only update pricePerKwh');
      }
      station.pricePerKwh = Number(req.body.pricePerKwh);
    } else {
      // Admin may change any field
      Object.assign(station, req.body);
    }

    await station.save();
    res.status(200).json(station);
  } catch (error) {
    next(error);
  }
}

export async function createStation(req, res, next) {
  try {
    const newStation = await Station.create(req.body);
    res.status(201).json(newStation);
  } catch (error) {
    next(error);
  }
}

export async function deleteStation(req, res, next) {
  try {
    const { stationId } = req.params;
    const deleted = await Station.findOneAndDelete({ stationId });
    if (!deleted) {
      throw new HttpError(404, 'Station not found');
    }
    res.status(200).json({ success: true, message: 'Station deleted successfully' });
  } catch (error) {
    next(error);
  }
}
