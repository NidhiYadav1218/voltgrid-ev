import apiClient from './client.js';

export async function getTelematics() {
  return apiClient('/telematics');
}

export async function updateTelematics(data) {
  return apiClient('/telematics', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
