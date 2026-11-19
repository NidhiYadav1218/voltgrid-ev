import apiClient from './client.js';

export async function getBookings(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiClient(`/bookings${query ? `?${query}` : ''}`);
}

export async function getBookingById(id) {
  return apiClient(`/bookings/${id}`);
}

export async function createBooking(data) {
  return apiClient('/bookings', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function completeBooking(id, data = {}) {
  return apiClient(`/bookings/${id}/complete`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getBookingPass(id) {
  return apiClient(`/bookings/${id}/pass`);
}

export async function cancelBooking(id) {
  return apiClient(`/bookings/${id}/cancel`, {
    method: 'POST'
  });
}

export async function refundBooking(id, reason) {
  return apiClient(`/bookings/${id}/refund`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  });
}
