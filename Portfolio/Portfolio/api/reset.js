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

const DEFAULT_STATIONS = [
  {
    id: 'st-01',
    name: 'Expressway HyperHub • Delhi-Jaipur (NH 48, Km 42)',
    type: 'Highway Ultra-Hub',
    location: 'NH 48 Highway Corridor, Near Manesar Toll',
    mapsUrl: 'https://maps.google.com/?q=NH48+Manesar+Gurugram',
    pricePerKwh: 28,
    solar: true,
    ports: [
      { id: 'p101', name: 'Port 01', type: '350kW Ultra-Fast DC', maxKw: 350, status: 'available' },
      { id: 'p102', name: 'Port 02', type: '350kW Ultra-Fast DC', maxKw: 350, status: 'available' },
      { id: 'p103', name: 'Port 03', type: '150kW Fast DC', maxKw: 150, status: 'available' },
      { id: 'p104', name: 'Port 04', type: '150kW Fast DC', maxKw: 150, status: 'available' },
      { id: 'p105', name: 'Port 05', type: '100kW DC', maxKw: 100, status: 'available' },
      { id: 'p106', name: 'Port 06', type: '22kW AC Destination', maxKw: 22, status: 'available' }
    ]
  },
  {
    id: 'st-02',
    name: 'DLF Cyber Hub • Sector 24 Gurugram',
    type: 'Corporate Destination Hub',
    location: 'Cyber City, Basement Parking Bay B4, Gurugram',
    mapsUrl: 'https://maps.google.com/?q=DLF+Cyber+Hub+Gurugram',
    pricePerKwh: 26,
    solar: false,
    ports: [
      { id: 'p201', name: 'Port 01', type: '180kW Fast DC', maxKw: 180, status: 'available' },
      { id: 'p202', name: 'Port 02', type: '180kW Fast DC', maxKw: 180, status: 'available' },
      { id: 'p203', name: 'Port 03', type: '43kW Fast AC', maxKw: 43, status: 'available' },
      { id: 'p204', name: 'Port 04', type: '22kW AC', maxKw: 22, status: 'available' }
    ]
  },
  {
    id: 'st-03',
    name: 'Aerocity Gateway • IGI Airport T3',
    type: 'Airport Hypergrid',
    location: 'Hospitality District, Worldmark Aerocity, New Delhi',
    mapsUrl: 'https://maps.google.com/?q=Aerocity+New+Delhi',
    pricePerKwh: 30,
    solar: true,
    ports: [
      { id: 'p301', name: 'Port 01', type: '240kW Ultra-Fast DC', maxKw: 240, status: 'available' },
      { id: 'p302', name: 'Port 02', type: '120kW Fast DC', maxKw: 120, status: 'available' },
      { id: 'p303', name: 'Port 03', type: '120kW Fast DC', maxKw: 120, status: 'available' }
    ]
  }
];

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

    // 1. Drop/Delete all users
    const userDel = await db.collection('users').deleteMany({});

    // 2. Drop/Delete all bookings
    const bookingDel = await db.collection('bookings').deleteMany({});

    // 3. Reset stations collection in MongoDB Atlas so stations.js re-initializes fresh
    await db.collection('stations').deleteOne({ _id: 'global_stations' });

    return res.status(200).json({
      success: true,
      message: 'MongoDB Atlas collections (users, bookings) successfully wiped and stations reset to default clean state.',
      usersDeleted: userDel.deletedCount,
      bookingsDeleted: bookingDel.deletedCount
    });
  } catch (error) {
    console.error('MongoDB Atlas Reset Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
