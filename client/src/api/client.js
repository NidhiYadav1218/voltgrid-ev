const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const token = localStorage.getItem('voltgrid_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem('voltgrid_token');
    // Only redirect if not already on login page
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    const errorMessage = data && data.error ? data.error : `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default apiClient;
