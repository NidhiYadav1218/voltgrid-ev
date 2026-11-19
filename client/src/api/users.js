import apiClient from './client.js';

export async function getMyProfile() {
  return apiClient('/users/me');
}

export async function updateMyProfile(data) {
  return apiClient('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function getAllUsers() {
  return apiClient('/users');
}
