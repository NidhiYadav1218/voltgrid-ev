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
    vendorId: 'vendor-jiobp',
    vendorName: 'Jio-bp pulse',
    vendorLogo: '⛽',
    vendorColor: 'blue',
    name: 'Jio-bp pulse Expressway HyperHub (NH-48)',
    type: 'Highway Ultra-Fast Hub',
    location: 'NH 48 Highway Corridor, Near Manesar Toll, Gurugram',
    lat: 28.3587,
    lng: 76.9388,
    mapsUrl: 'https://maps.google.com/?q=28.3587,76.9388',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.3587,76.9388',
    pricePerKwh: 28,
    solar: true,
    rating: 4.9,
    amenities: ['24x7 Cafe', 'Restrooms', 'Free Wi-Fi', 'EV Lounge'],
    ports: [
      { id: 'p101', name: 'Port 01', type: '350kW Ultra-Fast DC', maxKw: 350, status: 'available', connector: 'CCS2' },
      { id: 'p102', name: 'Port 02', type: '350kW Ultra-Fast DC', maxKw: 350, status: 'available', connector: 'CCS2' },
      { id: 'p103', name: 'Port 03', type: '150kW Fast DC', maxKw: 150, status: 'available', connector: 'CCS2' },
      { id: 'p104', name: 'Port 04', type: '150kW Fast DC', maxKw: 150, status: 'available', connector: 'CCS2' },
      { id: 'p105', name: 'Port 05', type: '100kW DC', maxKw: 100, status: 'available', connector: 'CHAdeMO' },
      { id: 'p106', name: 'Port 06', type: '22kW AC Destination', maxKw: 22, status: 'available', connector: 'Type 2' }
    ]
  },
  {
    id: 'st-02',
    vendorId: 'vendor-tata',
    vendorName: 'Tata Power EZ Charge',
    vendorLogo: '⚡',
    vendorColor: 'emerald',
    name: 'Tata Power Cyber Hub Destination Hub',
    type: 'Corporate Ultra-Hub',
    location: 'DLF Cyber City, Basement Bay B4, Sector 24, Gurugram',
    lat: 28.4952,
    lng: 77.0891,
    mapsUrl: 'https://maps.google.com/?q=28.4952,77.0891',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.4952,77.0891',
    pricePerKwh: 26,
    solar: false,
    rating: 4.8,
    amenities: ['Mall Access', 'Dining', 'Valet Parking', 'Security'],
    ports: [
      { id: 'p201', name: 'Port 01', type: '180kW Fast DC', maxKw: 180, status: 'available', connector: 'CCS2' },
      { id: 'p202', name: 'Port 02', type: '180kW Fast DC', maxKw: 180, status: 'available', connector: 'CCS2' },
      { id: 'p203', name: 'Port 03', type: '43kW Fast AC', maxKw: 43, status: 'available', connector: 'Type 2' },
      { id: 'p204', name: 'Port 04', type: '22kW AC', maxKw: 22, status: 'available', connector: 'Type 2' }
    ]
  },
  {
    id: 'st-03',
    vendorId: 'vendor-zeon',
    vendorName: 'Zeon Charging',
    vendorLogo: '🔋',
    vendorColor: 'indigo',
    name: 'Zeon Aerocity Airport Gateway',
    type: 'Airport Hypergrid',
    location: 'Worldmark Hospitality District, Aerocity, New Delhi',
    lat: 28.5504,
    lng: 77.1215,
    mapsUrl: 'https://maps.google.com/?q=28.5504,77.1215',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.5504,77.1215',
    pricePerKwh: 30,
    solar: true,
    rating: 4.7,
    amenities: ['Airport Shuttle', 'Coffee Lounge', '24x7 Security'],
    ports: [
      { id: 'p301', name: 'Port 01', type: '240kW Ultra-Fast DC', maxKw: 240, status: 'available', connector: 'CCS2' },
      { id: 'p302', name: 'Port 02', type: '120kW Fast DC', maxKw: 120, status: 'available', connector: 'CCS2' },
      { id: 'p303', name: 'Port 03', type: '120kW Fast DC', maxKw: 120, status: 'available', connector: 'Type 2' }
    ]
  },
  {
    id: 'st-04',
    vendorId: 'vendor-statiq',
    vendorName: 'Statiq EV Fast Hub',
    vendorLogo: '🚀',
    vendorColor: 'amber',
    name: 'Statiq Horizon Fast Hub • Golf Course Road',
    type: 'Luxury Commercial Hub',
    location: 'One Horizon Centre, Golf Course Rd, DLF Phase 5, Gurugram',
    lat: 28.4728,
    lng: 77.0982,
    mapsUrl: 'https://maps.google.com/?q=28.4728,77.0982',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.4728,77.0982',
    pricePerKwh: 27,
    solar: true,
    rating: 4.6,
    amenities: ['Fine Dining', 'Car Wash', 'EV Lounge'],
    ports: [
      { id: 'p401', name: 'Port 01', type: '150kW Fast DC', maxKw: 150, status: 'available', connector: 'CCS2' },
      { id: 'p402', name: 'Port 02', type: '150kW Fast DC', maxKw: 150, status: 'available', connector: 'CCS2' },
      { id: 'p403', name: 'Port 03', type: '60kW DC', maxKw: 60, status: 'available', connector: 'CCS2' },
      { id: 'p404', name: 'Port 04', type: '22kW AC Destination', maxKw: 22, status: 'available', connector: 'Type 2' }
    ]
  },
  {
    id: 'st-05',
    vendorId: 'vendor-voltgrid',
    vendorName: 'VoltGrid Direct Flagship',
    vendorLogo: '🛡️',
    vendorColor: 'cyan',
    name: 'VoltGrid CP SuperHub • Connaught Place',
    type: 'Central Metro Hub',
    location: 'Outer Circle, Near Shivaji Stadium Metro, New Delhi',
    lat: 28.6328,
    lng: 77.2197,
    mapsUrl: 'https://maps.google.com/?q=28.6328,77.2197',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.6328,77.2197',
    pricePerKwh: 25,
    solar: true,
    rating: 5.0,
    amenities: ['Solar Canopy', 'Metro Link', '100% Green Energy'],
    ports: [
      { id: 'p501', name: 'Port 01', type: '360kW Hyper-DC', maxKw: 360, status: 'available', connector: 'CCS2' },
      { id: 'p502', name: 'Port 02', type: '200kW Fast DC', maxKw: 200, status: 'available', connector: 'CCS2' },
      { id: 'p503', name: 'Port 03', type: '120kW Fast DC', maxKw: 120, status: 'available', connector: 'CCS2' },
      { id: 'p504', name: 'Port 04', type: '22kW AC', maxKw: 22, status: 'available', connector: 'Type 2' }
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

    // Initialize in MongoDB Atlas if first time or if missing vendor attributes
    const needsMigration = !doc || !doc.stations || !Array.isArray(doc.stations) || !doc.stations.some(s => s.vendorId);
    if (needsMigration) {
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
            p.userId = null;
            p.sessionId = null;
            p.secondsLeft = 0;
            p.reservedAt = null;
            docChanged = true;
          } else {
            p.secondsLeft = Math.max(0, Math.floor((900000 - ageMs) / 1000));
          }
        } else if (p.status === 'charging' && p.chargingStartedAt) {
          const totalSec = p.chargingDurationSeconds || 1080;
          const elapsedSec = Math.floor((now - p.chargingStartedAt) / 1000);
          if (elapsedSec >= totalSec) {
            p.soc = 100;
            p.kw = 0;
            p.secondsLeft = 0;
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

      const { action, stationId, portId } = body;

      // Handle Vendor/Admin adding a port to a station
      if (action === 'add_port') {
        const targetStation = doc.stations.find(s => s.id === stationId);
        if (!targetStation) {
          return res.status(404).json({ error: 'Station not found' });
        }

        const newPort = {
          id: 'p' + Math.floor(100 + Math.random() * 900),
          name: body.portName || `Port 0${targetStation.ports.length + 1}`,
          type: body.portType || '150kW Fast DC',
          maxKw: Number(body.maxKw) || 150,
          connector: body.connector || 'CCS2',
          status: 'available'
        };

        targetStation.ports.push(newPort);
        await stationsCol.updateOne(
          { _id: 'global_stations' },
          { $set: { stations: doc.stations, updatedAt: new Date().toISOString() } }
        );
        return res.status(200).json({ success: true, message: 'Port added successfully', port: newPort, stations: doc.stations });
      }

      // Handle Vendor toggling maintenance mode
      if (action === 'toggle_maintenance') {
        const targetStation = doc.stations.find(s => s.id === stationId);
        const targetPort = targetStation ? targetStation.ports.find(p => p.id === portId) : null;
        if (!targetPort) {
          return res.status(404).json({ error: 'Port not found' });
        }

        targetPort.status = targetPort.status === 'maintenance' ? 'available' : 'maintenance';
        await stationsCol.updateOne(
          { _id: 'global_stations' },
          { $set: { stations: doc.stations, updatedAt: new Date().toISOString() } }
        );
        return res.status(200).json({ success: true, port: targetPort, stations: doc.stations });
      }

      // Handle Reset to Default Multi-Vendor Fleet
      if (action === 'reset_to_default') {
        doc.stations = DEFAULT_STATIONS;
        await stationsCol.updateOne(
          { _id: 'global_stations' },
          { $set: { stations: DEFAULT_STATIONS, updatedAt: new Date().toISOString() } }
        );
        return res.status(200).json({ success: true, stations: DEFAULT_STATIONS });
      }

      // Otherwise handle specific booking actions (reserve, release, startCharging, updateTelemetry)
      const st = doc.stations.find(s => s.id === stationId);
      const port = st ? st.ports.find(p => p.id === portId) : null;

      if (!port) {
        return res.status(404).json({ error: 'Port not found' });
      }

      function getEstMinutes(p, soc) {
        const portKw = p.maxKw || 60;
        const isAc = portKw <= 22;
        const effKw = isAc ? Math.min(portKw, 22) : Math.min(portKw, 80);
        const needed = Math.max(5, ((100 - (Number(soc) || 22)) / 100) * 50.3);
        return Math.max(10, Math.round((needed / Math.max(5, effKw)) * 60));
      }

      if (action === 'reserve') {
        const reqSoc = Number(body.currentSoc);
        if (!isNaN(reqSoc) && reqSoc >= 100) {
          return res.status(400).json({ error: 'Vehicle battery is already 100% full. Charging reservation not permitted.' });
        }
        port.status = 'reserved';
        port.userId = body.userId || null;
        port.customer = body.customer;
        port.phone = body.phone;
        port.vehicle = body.vehicle;
        port.pin = body.pin;
        port.paid = body.paid;
        port.sessionId = body.sessionId || null;
        port.secondsLeft = 900;
        port.reservedAt = Date.now();
        port.initialSoc = Number(body.currentSoc) || 22;
        port.soc = port.initialSoc;
        port.chargingDurationMinutes = Number(body.chargingDurationMinutes) || getEstMinutes(port, port.initialSoc);
      } else if (action === 'release') {
        port.status = 'available';
        port.userId = null;
        port.customer = null;
        port.phone = null;
        port.vehicle = null;
        port.pin = null;
        port.sessionId = null;
        port.soc = null;
        port.kw = null;
        port.secondsLeft = 0;
        port.reservedAt = null;
        port.chargingStartedAt = null;
        port.chargingDurationSeconds = null;
        port.chargingDurationMinutes = null;
        port.initialSoc = null;
      } else if (action === 'startCharging') {
        if (body.pin && String(body.pin).trim() !== String(port.pin).trim()) {
          return res.status(403).json({ error: 'Security PIN mismatch' });
        }
        port.status = 'charging';
        port.initialSoc = Number(body.soc) || port.initialSoc || 22;
        port.soc = port.initialSoc;
        port.targetSoc = 100;
        port.kw = body.kw || (port.maxKw ? Math.round(port.maxKw * 0.75) : 120);
        const durationMinutes = Number(body.chargingDurationMinutes) || port.chargingDurationMinutes || getEstMinutes(port, port.initialSoc);
        port.chargingDurationMinutes = durationMinutes;
        port.chargingDurationSeconds = durationMinutes * 60;
        port.secondsLeft = durationMinutes * 60;
        port.chargingStartedAt = Date.now();
      } else if (action === 'updateTelemetry') {
        if (port.status === 'charging') {
          if (body.soc !== undefined) {
            port.soc = Number(body.soc);
            if (port.soc >= 100) {
              port.kw = 0;
              port.secondsLeft = 0;
            }
          }
          if (body.secondsLeft !== undefined && (port.soc === undefined || port.soc < 100)) port.secondsLeft = Number(body.secondsLeft);
          if (body.kw !== undefined && (port.soc === undefined || port.soc < 100)) port.kw = Number(body.kw);
        }
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
