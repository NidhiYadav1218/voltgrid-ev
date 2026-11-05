import { MongoClient } from 'mongodb';

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
    const usersCol = db.collection('users');

    if (req.method === 'GET') {
      const users = await usersCol.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const userData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!userData || !userData.name || !userData.phone || !userData.email) {
        return res.status(400).json({ error: 'Name, phone, and email are all strictly required.' });
      }

      const cleanPhone = String(userData.phone).trim();
      const cleanEmail = String(userData.email).trim().toLowerCase();
      const cleanName = String(userData.name).trim();

      // Check for duplicate email under a different phone
      const existingEmailUser = await usersCol.findOne({
        email: cleanEmail,
        phone: { $ne: cleanPhone }
      });
      if (existingEmailUser) {
        return res.status(409).json({ error: 'This email is already registered under another account.' });
      }

      // Check if user already exists with this phone
      const existingPhoneUser = await usersCol.findOne({ phone: cleanPhone });
      let assignedUserId = existingPhoneUser && existingPhoneUser.userId ? existingPhoneUser.userId : null;
      if (!assignedUserId) {
        const count = await usersCol.countDocuments();
        assignedUserId = `USR-${count + 1}`;
      }

      const filter = { phone: cleanPhone };
      const update = {
        $set: {
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          car: userData.car || 'Tata Nexon EV Max',
          userId: assignedUserId,
          updatedAt: new Date().toISOString()
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
          sessionsCount: 0,
          totalKwhCharged: 0,
          totalMoneySaved: 0,
          totalCo2Saved: 0,
          history: []
        }
      };

      await usersCol.updateOne(filter, update, { upsert: true });
      const savedUser = await usersCol.findOne(filter);
      return res.status(200).json(savedUser);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB Atlas Error (/api/users):', error);
    return res.status(500).json({ error: error.message });
  }
}
