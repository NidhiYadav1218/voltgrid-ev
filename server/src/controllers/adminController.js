import { Station } from '../models/Station.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { seedStations } from '../scripts/seedStations.js';
import { seedVendors } from '../scripts/seedVendors.js';
import { HttpError } from '../middleware/errorHandler.js';

export async function getAdminStats(req, res, next) {
  try {
    const [stationsCount, usersCount, vendorsCount, totalBookings] = await Promise.all([
      Station.countDocuments(),
      User.countDocuments(),
      Vendor.countDocuments(),
      Booking.countDocuments()
    ]);

    // Compute port stats
    const stations = await Station.find({});
    let totalPorts = 0;
    let availablePorts = 0;
    let reservedPorts = 0;
    let chargingPorts = 0;
    let maintenancePorts = 0;

    for (const st of stations) {
      if (st.ports && Array.isArray(st.ports)) {
        for (const p of st.ports) {
          totalPorts++;
          if (p.status === 'available') availablePorts++;
          else if (p.status === 'reserved') reservedPorts++;
          else if (p.status === 'charging') chargingPorts++;
          else if (p.status === 'maintenance') maintenancePorts++;
        }
      }
    }

    // Revenue aggregations
    const revenueStats = await Booking.aggregate([
      { $match: { status: { $in: ['CONFIRMED', 'CHARGING', 'COMPLETED'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$invoice.totalAmount' },
          platformFees: { $sum: '$platformFee' },
          vendorPayouts: { $sum: '$vendorPayout' },
          totalEnergyKwh: { $sum: '$energyKwh' }
        }
      }
    ]);

    const rev = revenueStats[0] || {
      totalRevenue: 0,
      platformFees: 0,
      vendorPayouts: 0,
      totalEnergyKwh: 0
    };

    const occupancyRate = totalPorts > 0 ? +(((reservedPorts + chargingPorts) / totalPorts) * 100).toFixed(1) : 0;

    res.status(200).json({
      counts: {
        stations: stationsCount,
        users: usersCount,
        vendors: vendorsCount,
        bookings: totalBookings
      },
      ports: {
        total: totalPorts,
        available: availablePorts,
        reserved: reservedPorts,
        charging: chargingPorts,
        maintenance: maintenancePorts,
        occupancyRate
      },
      financials: {
        totalRevenue: rev.totalRevenue,
        platformFees: rev.platformFees,
        vendorPayouts: rev.vendorPayouts,
        totalEnergyKwh: rev.totalEnergyKwh
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function resetDemo(req, res, next) {
  try {
    const allowReset = process.env.ALLOW_DEMO_RESET === 'true';
    if (!allowReset) {
      throw new HttpError(403, 'Demo reset is disabled in this environment');
    }

    const { confirm } = req.body;
    if (confirm !== 'RESET') {
      throw new HttpError(400, 'Confirmation token RESET is required in body');
    }

    // Wipe test bookings
    await Booking.deleteMany({});

    // Reseed stations and vendors
    await seedStations();
    await seedVendors();

    res.status(200).json({
      success: true,
      message: 'Demo state successfully reset. Stations and vendors re-seeded.'
    });
  } catch (error) {
    next(error);
  }
}
