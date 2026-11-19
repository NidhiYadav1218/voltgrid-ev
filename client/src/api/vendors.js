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

export async function requestVendorPayout(data) {
  return apiClient('/vendors/me/payouts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
