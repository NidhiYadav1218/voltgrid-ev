import apiClient from './client.js';

export async function getReviews(limit = 12) {
  return apiClient(`/reviews?limit=${limit}`);
}

export async function submitReview(reviewData) {
  return apiClient('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
}
