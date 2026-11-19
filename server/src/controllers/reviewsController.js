import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { HttpError } from '../middleware/errorHandler.js';

export async function getReviews(req, res, next) {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(limit);
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const { rating, comment, userCity, stationId, stationName, bookingId, vehicleModel } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      throw new HttpError(400, 'Rating must be an integer between 1 and 5');
    }
    if (!comment || !comment.trim()) {
      throw new HttpError(400, 'Review comment cannot be empty');
    }

    const userName = req.user?.name || req.body.userName || 'Gujarat EV Driver';
    const vehicle = vehicleModel || req.user?.car || 'Tata Nexon EV Max';

    const review = await Review.create({
      userId: req.user?._id,
      userName,
      userCity: userCity?.trim() || 'Ahmedabad',
      vehicleModel: vehicle,
      stationId: stationId || 'st-ahmedabad-sg',
      stationName: stationName || 'Ahmedabad SG Highway Superhub',
      bookingId: bookingId || null,
      rating: Number(rating),
      comment: comment.trim(),
      verifiedDriver: true
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
}
