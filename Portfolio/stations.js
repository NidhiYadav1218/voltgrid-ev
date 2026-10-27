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
    const stationsCol = db.collection('stations');

    let doc = await stationsCol.findOne({ _id: 'global_stations' });

    // Initialize in MongoDB Atlas if first time
    if (!doc || !doc.stations || !Array.isArray(doc.stations)) {
      doc = { _id: 'global_stations', stations: DEFAULT_STATIONS, updatedAt: new Date().toISOString() };
      await stationsCol.updateOne(
        { _id: 'global_stations' },
        { $set: doc },
        { upsert: true }
      );
    }

    // Auto-clean any expired reservations older than 15 minutes (900,000 ms) in Atlas
    const now = Date.now();
    let docChanged = false;
    doc.stations.forEach(st => {
      st.ports.forEach(p => {
        if (p.status === 'reserved' && p.reservedAt) {
          const ageMs = now - p.reservedAt;
          if (ageMs > 900000) {
            p.status = 'available';
            p.customer = null;
            p.phone = null;
            p.vehicle = null;
            p.pin = null;
            p.secondsLeft = 0;
            p.reservedAt = null;
            docChanged = true;
          } else {
            p.secondsLeft = Math.max(0, Math.floor((900000 - ageMs) / 1000));
          }
        }
      });
    });

    if (docChanged) {
      await stationsCol.updateOne(
        { _id: 'global_stations' },
        { $set: { stations: doc.stations, updatedAt: new Date().toISOString() } }
      );
    }

    if (req.method === 'GET') {
      return res.status(200).json(doc.stations);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body) {
        return res.status(400).json({ error: 'Payload required' });
      }

      // If client provides the full updated stations array:
      if (body.stations && Array.isArray(body.stations)) {
        await stationsCol.updateOne(
          { _id: 'global_stations' },
          { $set: { stations: body.stations, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
        return res.status(200).json({ success: true, stations: body.stations });
      }

      // Otherwise handle specific actions (reserve, release, startCharging)
      const { action, stationId, portId } = body;
      const st = doc.stations.find(s => s.id === stationId);
      const port = st ? st.ports.find(p => p.id === portId) : null;

      if (!port) {
        return res.status(404).json({ error: 'Port not found' });
      }

      if (action === 'reserve') {
        port.status = 'reserved';
        port.customer = body.customer;
        port.phone = body.phone;
        port.vehicle = body.vehicle;
        port.pin = body.pin;
        port.paid = body.paid;
        port.secondsLeft = 900;
        port.reservedAt = Date.now();
      } else if (action === 'release') {
        port.status = 'available';
        port.customer = null;
        port.phone = null;
        port.vehicle = null;
        port.pin = null;
        port.soc = null;
        port.kw = null;
        port.secondsLeft = 0;
        port.reservedAt = null;
      } else if (action === 'startCharging') {
        if (body.pin && String(body.pin).trim() !== String(port.pin).trim()) {
          return res.status(403).json({ error: 'Security PIN mismatch' });
        }
        port.status = 'charging';
        port.soc = 42;
        port.kw = port.maxKw ? Math.round(port.maxKw * 0.75) : 120;
      }

      await stationsCol.updateOne(
        { _id: 'global_stations' },
        { $set: { stations: doc.stations, updatedAt: new Date().toISOString() } }
      );

      return res.status(200).json({ success: true, stations: doc.stations });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB Atlas Error (/api/stations):', error);
    return res.status(500).json({ error: error.message });
  }
}
