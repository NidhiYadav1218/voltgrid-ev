import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
let cachedClient = null;

async function getClient() {
  if (cachedClient) return cachedClient;
  if (!MONGODB_URI) {
    return null; // Graceful in-memory fallback if MongoDB URI not configured
  }
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

// In-memory fallback telematics store
let memoryTelematics = {
  make: 'MG',
  model: 'ZS EV',
  year: 2024,
  vin: '1MGZS48EV20265921',
  battery: {
    percentRemaining: 22,
    rangeKm: 88,
    capacityKwh: 50.3,
    voltage: 362.4,
    temperatureC: 28.5
  },
  odometer: {
    totalKm: 14272.8
  },
  trip: {
    distanceCoveredKm: 22.8,
    energyConsumedKwh: 3.35,
    initialSoc: 100,
    currentSoc: 22
  },
  speed: 0,
  gear: 'P',
  isDriving: false,
  esim: {
    carrier: 'Airtel IoT India',
    status: 'ACTIVE_4G_VOLTE',
    signalStrengthDbm: -74,
    ip: '10.45.12.98'
  },
  lastUpdated: new Date().toISOString()
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let db = null;
  try {
    const client = await getClient();
    if (client) {
      db = client.db('voltgrid');
    }
  } catch (err) {
    console.warn('MongoDB connection note (telematics):', err.message);
  }

  if (req.method === 'GET') {
    try {
      if (db) {
        const doc = await db.collection('telematics').findOne({ id: 'active_vehicle' });
        if (doc) {
          const { _id, ...clean } = doc;
          return res.status(200).json(clean);
        }
      }
      return res.status(200).json(memoryTelematics);
    } catch (err) {
      return res.status(200).json(memoryTelematics);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const updated = {
        ...memoryTelematics,
        ...body,
        lastUpdated: new Date().toISOString()
      };
      memoryTelematics = updated;

      if (db) {
        await db.collection('telematics').updateOne(
          { id: 'active_vehicle' },
          { $set: { id: 'active_vehicle', ...updated } },
          { upsert: true }
        );
      }

      return res.status(200).json({ success: true, telematics: updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update telematics', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
