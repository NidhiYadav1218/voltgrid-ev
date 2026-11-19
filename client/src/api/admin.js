import apiClient from './client.js';

export async function getAdminStats() {
  return apiClient('/admin/stats');
}

export async function resetDemo() {
  return apiClient('/admin/reset-demo', {
    method: 'POST',
    body: JSON.stringify({ confirm: 'RESET' })
  });
}
export const resetDemoData = resetDemo;
