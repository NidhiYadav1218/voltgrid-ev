export function computePreviewInvoice(energyKwh, pricePerKwh, vehicleType = '4W') {
  const kwh = Math.max(0, Number(energyKwh) || 0);
  const rate = Math.max(0, Number(pricePerKwh) || 0);

  const is2W = vehicleType === '2W';
  const convenienceFee = is2W ? 15.00 : 40.00;
  const energyCharge = +(kwh * rate).toFixed(2);
  const gst = +((energyCharge + convenienceFee) * 0.18).toFixed(2);
  const totalAmount = +(energyCharge + convenienceFee + gst).toFixed(2);

  return {
    energyCharge,
    convenienceFee,
    gst,
    totalAmount
  };
}
