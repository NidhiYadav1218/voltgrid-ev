import apiClient from './client.js';

export async function getStations() {
  return apiClient('/stations');
}

export async function getStationById(stationId) {
  return apiClient(`/stations/${stationId}`);
}

export async function reservePort(stationId, portId, data) {
  return apiClient(`/stations/${stationId}/ports/${portId}/reserve`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function startCharging(stationId, portId, pin) {
  return apiClient(`/stations/${stationId}/ports/${portId}/start`, {
    method: 'POST',
    body: JSON.stringify({ pin })
  });
}

export async function releasePort(stationId, portId) {
  return apiClient(`/stations/${stationId}/ports/${portId}/release`, {
    method: 'POST'
  });
}

export async function updateStation(stationId, data) {
  return apiClient(`/stations/${stationId}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function createStation(data) {
  return apiClient('/stations', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deleteStation(stationId) {
  return apiClient(`/stations/${stationId}`, {
    method: 'DELETE'
  });
}
