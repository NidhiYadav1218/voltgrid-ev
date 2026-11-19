import { Telematics } from '../models/Telematics.js';

export async function getTelematics(req, res, next) {
  try {
    let doc = await Telematics.findOne({ user: req.user._id });
    if (!doc) {
      // Initialize default telematics for this driver user
      doc = await Telematics.create({ user: req.user._id });
    }
    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
}

export async function upsertTelematics(req, res, next) {
  try {
    const updateData = {
      ...req.body,
      lastUpdated: new Date()
    };

    const doc = await Telematics.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
}
