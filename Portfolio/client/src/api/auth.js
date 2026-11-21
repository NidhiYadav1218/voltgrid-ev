import apiClient from './client.js';

export async function register(data) {
  return apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function login(credentials) {
  return apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function getMe() {
  return apiClient('/auth/me');
}
