import {
  CONVENIENCE_FEE_4W,
  CONVENIENCE_FEE_2W,
  GST_RATE,
  DEFAULT_COMMISSION_RATE
} from '../config/constants.js';

/**
 * Computes official server-side invoice line items.
 * Formula extracted from legacy index.html (lines 5576-5579).
 */
export function computeInvoice(energyKwh, pricePerKwh, vehicleType = '4W') {
  const kwh = Math.max(0, Number(energyKwh) || 0);
  const rate = Math.max(0, Number(pricePerKwh) || 0);

  const is2W = vehicleType === '2W';
  const convenienceFee = is2W ? CONVENIENCE_FEE_2W : CONVENIENCE_FEE_4W;
  const energyCharge = +(kwh * rate).toFixed(2);
  const gst = +((energyCharge + convenienceFee) * GST_RATE).toFixed(2);
  const totalAmount = +(energyCharge + convenienceFee + gst).toFixed(2);

  return {
    energyCharge,
    convenienceFee,
    gst,
    totalAmount
  };
}

/**
 * Computes platform fee and vendor payout based on vendor commission rate.
 * Extracted from legacy api/bookings.js (lines 171-172) & api/vendors.js.
 */
export function computePlatformSplit(totalAmount, commissionRate = DEFAULT_COMMISSION_RATE) {
  const total = Number(totalAmount) || 0;
  const rate = typeof commissionRate === 'number' ? commissionRate : DEFAULT_COMMISSION_RATE;

  const platformFee = Math.round(total * rate);
  const vendorPayout = total - platformFee;

  return {
    platformFee,
    vendorPayout
  };
}
