import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviewsController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Public: Anyone can read reviews
router.get('/', getReviews);

// Protected: Authenticated drivers submit review
router.post('/', auth, createReview);

export default router;
