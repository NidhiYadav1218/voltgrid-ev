import apiClient from './client.js';

export async function getAllVendors() {
  return apiClient('/vendors');
}

export async function getVendorMe() {
  return apiClient('/vendors/me');
}

export async function getVendorPayouts() {
  return apiClient('/vendors/me/payouts');
}
export const getPayouts = getVendorPayouts;

export async function requestVendorPayout(data) {
  return apiClient('/vendors/me/payouts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
export const requestPayout = requestVendorPayout;

export async function getVendorStations() {
  return apiClient('/stations');
}

export async function updateStationTariff(stationId, pricePerKwh) {
  return apiClient(`/stations/${stationId}`, {
    method: 'PATCH',
    body: JSON.stringify({ pricePerKwh })
  });
}
