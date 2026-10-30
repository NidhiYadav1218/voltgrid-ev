import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing on Vercel.');
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const client = await getClient();
    const db = client.db('voltgrid');
    const bookingsCol = db.collection('bookings');
    const usersCol = db.collection('users');

    if (req.method === 'GET') {
      const bookings = await bookingsCol.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(bookings);
    }

    if (req.method === 'POST') {
      const bookingData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!bookingData) {
        return res.status(400).json({ error: 'Booking payload required' });
      }

      // Handle Admin Refund action
      if (bookingData.action === 'refund') {
        const { bookingId } = bookingData;
        let query = {};
        try {
          query = { _id: new ObjectId(bookingId) };
        } catch {
          query = { $or: [{ id: bookingId }, { bookingId: bookingId }] };
        }

        await bookingsCol.updateOne(query, {
          $set: {
            status: 'REFUNDED',
            refundedAt: new Date().toISOString(),
            refundReason: 'Admin Manual Settlement'
          }
        });

        return res.status(200).json({ success: true, message: 'Booking refunded successfully' });
      }

      // Standard New Booking Creation with Money Flow Split (85% Vendor, 15% Platform Margin)
      const totalAmount = Number(bookingData.totalAmount) || 180;
      const platformFee = Math.round(totalAmount * 0.15); // 15% VoltGrid commission
      const vendorPayout = totalAmount - platformFee;     // 85% Vendor share

      bookingData.createdAt = new Date().toISOString();
      bookingData.platformFee = platformFee;
      bookingData.vendorPayout = vendorPayout;
      bookingData.vendorId = bookingData.vendorId || 'vendor-jiobp';
      bookingData.vendorName = bookingData.vendorName || 'Jio-bp pulse';
      bookingData.status = bookingData.status || 'CONFIRMED';
      bookingData.paymentStatus = 'ESCROW_SETTLED';

      const insertResult = await bookingsCol.insertOne(bookingData);

      // Increment sessions and fuel savings in user document
      if (bookingData.customerPhone) {
        const kwh = +(bookingData.energyKwh || 0);
        await usersCol.updateOne(
          { phone: bookingData.customerPhone },
          {
            $inc: {
              sessionsCount: 1,
              totalKwhCharged: kwh,
              totalMoneySaved: Math.round(kwh * 18),
              totalCo2Saved: Math.round(kwh * 1.8)
            }
          }
        );
      }

      return res.status(200).json({
        success: true,
        bookingId: insertResult.insertedId,
        moneyFlow: {
          totalAmount,
          vendorPayout,
          platformFee
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB Atlas Error (/api/bookings):', error);
    return res.status(500).json({ error: error.message });
  }
}
