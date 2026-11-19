import crypto from 'crypto';
import { Vendor } from '../models/Vendor.js';
import { Booking } from '../models/Booking.js';
import { Payout } from '../models/Payout.js';
import { HttpError } from '../middleware/errorHandler.js';

export async function getAllVendors(req, res, next) {
  try {
    const vendors = await Vendor.find({}).sort({ name: 1 });

    // Aggregate stats per vendor
    const stats = await Booking.aggregate([
      { $match: { status: { $in: ['CONFIRMED', 'CHARGING', 'COMPLETED'] } } },
      {
        $group: {
          _id: '$vendorId',
          totalBookings: { $sum: 1 },
          grossRevenue: { $sum: '$invoice.totalAmount' },
          totalPlatformFee: { $sum: '$platformFee' },
          totalVendorPayout: { $sum: '$vendorPayout' },
          totalKwh: { $sum: '$energyKwh' }
        }
      }
    ]);

    const statsMap = stats.reduce((acc, curr) => {
      acc[curr._id] = curr;
      return acc;
    }, {});

    const enrichedVendors = vendors.map((v) => {
      const s = statsMap[v.vendorId] || {
        totalBookings: 0,
        grossRevenue: 0,
        totalPlatformFee: 0,
        totalVendorPayout: 0,
        totalKwh: 0
      };
      return {
        ...v.toObject(),
        stats: s
      };
    });

    res.status(200).json(enrichedVendors);
  } catch (error) {
    next(error);
  }
}

export async function getVendorMe(req, res, next) {
  try {
    const vendorId = req.user.vendorId;
    if (!vendorId) {
      throw new HttpError(403, 'Vendor ID not linked to this account');
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      throw new HttpError(404, 'Vendor profile not found');
    }

    const [stats] = await Booking.aggregate([
      {
        $match: {
          vendorId,
          status: { $in: ['CONFIRMED', 'CHARGING', 'COMPLETED'] }
        }
      },
      {
        $group: {
          _id: '$vendorId',
          totalBookings: { $sum: 1 },
          grossRevenue: { $sum: '$invoice.totalAmount' },
          platformCommission: { $sum: '$platformFee' },
          netEarnings: { $sum: '$vendorPayout' },
          totalKwhDelivered: { $sum: '$energyKwh' }
        }
      }
    ]);

    // Compute payout totals
    const payouts = await Payout.find({ vendorId });
    const paidOut = payouts
      .filter((p) => p.status === 'PROCESSED' || p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    const netEarnings = stats ? stats.netEarnings : 0;
    const availableBalance = Math.max(0, netEarnings - paidOut);

    res.status(200).json({
      vendor,
      stats: stats || {
        totalBookings: 0,
        grossRevenue: 0,
        platformCommission: 0,
        netEarnings: 0,
        totalKwhDelivered: 0
      },
      payoutSummary: {
        totalEarned: netEarnings,
        totalPaidOut: paidOut,
        availableBalance
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getVendorPayouts(req, res, next) {
  try {
    const vendorId = req.user.vendorId;
    if (!vendorId) {
      throw new HttpError(403, 'Vendor ID missing');
    }

    const payouts = await Payout.find({ vendorId }).sort({ createdAt: -1 });
    res.status(200).json(payouts);
  } catch (error) {
    next(error);
  }
}

export async function requestVendorPayout(req, res, next) {
  try {
    const vendorId = req.user.vendorId;
    if (!vendorId) {
      throw new HttpError(403, 'Vendor ID missing');
    }

    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      throw new HttpError(400, 'Invalid payout amount');
    }

    // Check available balance
    const [stats] = await Booking.aggregate([
      {
        $match: {
          vendorId,
          status: { $in: ['CONFIRMED', 'CHARGING', 'COMPLETED'] }
        }
      },
      {
        $group: {
          _id: '$vendorId',
          netEarnings: { $sum: '$vendorPayout' }
        }
      }
    ]);

    const netEarnings = stats ? stats.netEarnings : 0;
    const existingPayouts = await Payout.find({ vendorId });
    const committed = existingPayouts
      .filter((p) => p.status === 'PROCESSED' || p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    const available = netEarnings - committed;
    if (amount > available) {
      throw new HttpError(400, `Requested amount exceeds available balance (Available: ₹${available})`);
    }

    const payout = await Payout.create({
      payoutId: `PO-${crypto.randomInt(10000, 100000)}`,
      vendorId,
      amount,
      status: 'PROCESSED',
      method: req.body.method || 'Instant IMPS / NEFT Auto-Sweep',
      referenceNo: `REF-${Date.now()}`
    });

    res.status(201).json(payout);
  } catch (error) {
    next(error);
  }
}
