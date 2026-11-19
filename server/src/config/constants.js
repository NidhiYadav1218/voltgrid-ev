/**
 * VoltGrid Business Constants and Rules
 * Extracted directly from legacy implementations.
 */

// From index.html line 5577: const gridFee = isFull ? 0 : (is2W ? 15.00 : 40.00);
export const CONVENIENCE_FEE_4W = 40.00;
export const CONVENIENCE_FEE_2W = 15.00;

// From index.html line 5578: const gst = isFull ? 0 : +((baseCost + gridFee) * 0.18).toFixed(2);
export const GST_RATE = 0.18;

// From api/bookings.js line 193: totalMoneySaved: Math.round(kwh * 18)
export const MONEY_SAVED_PER_KWH = 18;

// From api/bookings.js line 194: totalCo2Saved: Math.round(kwh * 1.8)
export const CO2_SAVED_PER_KWH = 1.8;

// From api/vendors.js line 28 & 88: commissionRate 0.15 (standard) and 0.05 (VoltGrid Direct)
export const DEFAULT_COMMISSION_RATE = 0.15;
export const VOLTGRID_COMMISSION_RATE = 0.05;

// From index.html & MIGRATION_PLAN.md Section 6: default hold minutes and PIN attempt limits
export const DEFAULT_HOLD_MINUTES = parseInt(process.env.HOLD_MINUTES || '15', 10);
export const DEFAULT_PIN_MAX_ATTEMPTS = parseInt(process.env.PIN_MAX_ATTEMPTS || '5', 10);

// Status enums from MIGRATION_PLAN.md Sections 7 and 9.9
export const BOOKING_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CHARGING: 'CHARGING',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

export const PORT_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  CHARGING: 'charging',
  MAINTENANCE: 'maintenance'
};

export const USER_ROLES = {
  DRIVER: 'driver',
  VENDOR: 'vendor',
  ADMIN: 'admin'
};

export const PAYMENT_STATUS = {
  ESCROW_SETTLED: 'ESCROW_SETTLED'
};
