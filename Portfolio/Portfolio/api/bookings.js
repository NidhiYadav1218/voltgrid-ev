import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nidhiyadav1218_db_user:XGf1HxV2xA60BGeC@cluster0.jg04gws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
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
      if (!bookingData) return res.status(400).json({ error: 'Booking payload required' });

      bookingData.createdAt = new Date().toISOString();
      const insertResult = await bookingsCol.insertOne(bookingData);

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

      return res.status(200).json({ success: true, bookingId: insertResult.insertedId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB Atlas Error (/api/bookings):', error);
    return res.status(500).json({ error: error.message });
  }
}
