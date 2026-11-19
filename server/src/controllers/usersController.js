import { User } from '../models/User.js';
import { HttpError } from '../middleware/errorHandler.js';

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { name, phone, car } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (car !== undefined) updates.car = car.trim();

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
