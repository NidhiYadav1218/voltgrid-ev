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
    name: 'Jio-bp pulse SG Highway HyperHub • Ahmedabad',
    type: 'Highway Ultra-Fast Hub (2W & 4W)',
    location: 'Sindhu Bhavan Marg, Off S.G. Highway, Bodakdev, Ahmedabad, Gujarat 380054',
    lat: 23.0416,
    lng: 72.5074,
    mapsUrl: 'https://maps.google.com/?q=23.0416,72.5074',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=23.0416,72.5074',
    pricePerKwh: 26,
    solar: true,
    rating: 4.9,
    amenities: ['24x7 Wild Bean Cafe', 'Restrooms', 'Free Wi-Fi', 'EV Lounge', '2W Dedicated Bay'],
    ports: [
      { id: 'p101', name: 'Bay 01 (4W)', type: '240kW Ultra-Fast DC', maxKw: 240, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p102', name: 'Bay 02 (4W)', type: '120kW Fast DC', maxKw: 120, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p103', name: 'Bay 03 (4W)', type: '60kW Fast DC', maxKw: 60, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p104', name: 'Bay 04 (Dual)', type: '22kW Type 2 AC', maxKw: 22, status: 'available', connector: 'Type 2', vehicleType: 'BOTH' },
      { id: 'p105', name: 'Bay 05 (2W)', type: 'Ather Grid Fast Point', maxKw: 3.3, status: 'available', connector: 'Ather Type 6', vehicleType: '2W' },
      { id: 'p106', name: 'Bay 06 (2W)', type: '3.3kW 16A Universal Socket', maxKw: 3.3, status: 'available', connector: '16A Smart Socket', vehicleType: '2W' }
    ]
  },
  {
    id: 'st-02',
    vendorId: 'vendor-tata',
    vendorName: 'Tata Power EZ Charge',
    vendorLogo: '⚡',
    vendorColor: 'emerald',
    name: 'Tata Power GIFT City FinTech SuperHub • Gandhinagar',
    type: 'FinTech Corridor Smart Grid (2W & 4W)',
    location: 'Block 12, Road 1D, GIFT SEZ Tower 1, GIFT City, Gandhinagar, Gujarat 382355',
    lat: 23.1610,
    lng: 72.6841,
    mapsUrl: 'https://maps.google.com/?q=23.1610,72.6841',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=23.1610,72.6841',
    pricePerKwh: 24,
    solar: true,
    rating: 4.9,
    amenities: ['GIFT Club Access', 'Coffee Lounge', 'Automated Multi-Level Parking', 'Security'],
    ports: [
      { id: 'p201', name: 'Bay 01 (4W)', type: '180kW Fast DC', maxKw: 180, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p202', name: 'Bay 02 (4W)', type: '120kW Fast DC', maxKw: 120, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p203', name: 'Bay 03 (Dual)', type: '22kW Type 2 AC', maxKw: 22, status: 'available', connector: 'Type 2', vehicleType: 'BOTH' },
      { id: 'p204', name: 'Bay 04 (2W)', type: '3.3kW 16A Smart Socket', maxKw: 3.3, status: 'available', connector: '16A Smart Socket', vehicleType: '2W' },
      { id: 'p205', name: 'Bay 05 (2W)', type: 'Ather Grid Fast Point', maxKw: 3.3, status: 'available', connector: 'Ather Type 6', vehicleType: '2W' }
    ]
  },
  {
    id: 'st-03',
    vendorId: 'vendor-zeon',
    vendorName: 'Zeon Charging',
    vendorLogo: '🔋',
    vendorColor: 'indigo',
    name: 'Zeon Ahmedabad Airport T2 Gateway Hub',
    type: 'International Airport Hypergrid',
    location: 'Terminal 2 Commercial Forecourt, SVPI Airport, Hansol, Ahmedabad, Gujarat 380003',
    lat: 23.0734,
    lng: 72.6266,
    mapsUrl: 'https://maps.google.com/?q=23.0734,72.6266',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=23.0734,72.6266',
    pricePerKwh: 28,
    solar: true,
    rating: 4.8,
    amenities: ['Airport Shuttle', '24x7 Airport Security', 'Luggage Assistance', 'Costa Coffee'],
    ports: [
      { id: 'p301', name: 'Bay 01 (4W)', type: '240kW Ultra-Fast DC', maxKw: 240, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p302', name: 'Bay 02 (4W)', type: '120kW Fast DC', maxKw: 120, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p303', name: 'Bay 03 (Dual)', type: '22kW Type 2 AC', maxKw: 22, status: 'available', connector: 'Type 2', vehicleType: 'BOTH' },
      { id: 'p304', name: 'Bay 04 (2W)', type: '3.3kW 16A Universal 2W Point', maxKw: 3.3, status: 'available', connector: '16A Smart Socket', vehicleType: '2W' }
    ]
  },
  {
    id: 'st-04',
    vendorId: 'vendor-statiq',
    vendorName: 'Statiq EV Fast Hub',
    vendorLogo: '🚀',
    vendorColor: 'amber',
    name: 'Statiq NE-1 Expressway Gateway • Vadodara',
    type: 'Intercity Expressway Gateway (NE-1)',
    location: 'National Expressway 1 Entry Plaza, Golden Chokdi, Vadodara, Gujarat 390022',
    lat: 22.3615,
    lng: 73.2104,
    mapsUrl: 'https://maps.google.com/?q=22.3615,73.2104',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=22.3615,73.2104',
    pricePerKwh: 25,
    solar: true,
    rating: 4.7,
    amenities: ['Expressway Food Court', 'EV Lounge', 'Clean Restrooms', 'Tyre Pressure Check'],
    ports: [
      { id: 'p401', name: 'Bay 01 (4W)', type: '150kW Fast DC', maxKw: 150, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p402', name: 'Bay 02 (4W)', type: '60kW Fast DC', maxKw: 60, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p403', name: 'Bay 03 (Dual)', type: '22kW AC Destination', maxKw: 22, status: 'available', connector: 'Type 2', vehicleType: 'BOTH' },
      { id: 'p404', name: 'Bay 04 (2W)', type: 'Ather Grid 3.3kW Point', maxKw: 3.3, status: 'available', connector: 'Ather Type 6', vehicleType: '2W' },
      { id: 'p405', name: 'Bay 05 (2W)', type: '3.3kW 16A Smart Socket', maxKw: 3.3, status: 'available', connector: '16A Smart Socket', vehicleType: '2W' }
    ]
  },
  {
    id: 'st-05',
    vendorId: 'vendor-voltgrid',
    vendorName: 'VoltGrid Direct Flagship',
    vendorLogo: '🛡️',
    vendorColor: 'cyan',
    name: 'VoltGrid VR Surat & Dumas Mega-Hub',
    type: 'Diamond City Central Metro Hub',
    location: 'VR Surat Mall, Dumas Road, Near Magdalla Port Junction, Surat, Gujarat 395007',
    lat: 21.1442,
    lng: 72.7562,
    mapsUrl: 'https://maps.google.com/?q=21.1442,72.7562',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=21.1442,72.7562',
    pricePerKwh: 24,
    solar: true,
    rating: 5.0,
    amenities: ['Mall Access', 'Solar Canopy Power', 'Food Court', 'Dedicated 2W Fleet Bay'],
    ports: [
      { id: 'p501', name: 'Bay 01 (4W)', type: '360kW Hyper-DC', maxKw: 360, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p502', name: 'Bay 02 (4W)', type: '180kW Fast DC', maxKw: 180, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p503', name: 'Bay 03 (4W)', type: '60kW DC', maxKw: 60, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p504', name: 'Bay 04 (Dual)', type: '22kW Type 2 AC', maxKw: 22, status: 'available', connector: 'Type 2', vehicleType: 'BOTH' },
      { id: 'p505', name: 'Bay 05 (2W)', type: 'Ather Grid Fast Point', maxKw: 3.3, status: 'available', connector: 'Ather Type 6', vehicleType: '2W' },
      { id: 'p506', name: 'Bay 06 (2W)', type: '3.3kW 16A Smart Socket', maxKw: 3.3, status: 'available', connector: '16A Smart Socket', vehicleType: '2W' }
    ]
  },
  {
    id: 'st-06',
    vendorId: 'vendor-tata',
    vendorName: 'Tata Power EZ Charge',
    vendorLogo: '⚡',
    vendorColor: 'emerald',
    name: 'Tata Power 150ft Ring Road Hub • Rajkot',
    type: 'Saurashtra Highway & City Ultra-Hub',
    location: 'KKV Hall Circle, 150 Feet Ring Road, Kalawad Road, Rajkot, Gujarat 360005',
    lat: 22.2837,
    lng: 70.7686,
    mapsUrl: 'https://maps.google.com/?q=22.2837,70.7686',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=22.2837,70.7686',
    pricePerKwh: 25,
    solar: true,
    rating: 4.8,
    amenities: ['Dining', 'Restrooms', '24x7 Security', 'Convenience Store'],
    ports: [
      { id: 'p601', name: 'Bay 01 (4W)', type: '120kW Fast DC', maxKw: 120, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p602', name: 'Bay 02 (4W)', type: '60kW Fast DC', maxKw: 60, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p603', name: 'Bay 03 (Dual)', type: '22kW Type 2 AC', maxKw: 22, status: 'available', connector: 'Type 2', vehicleType: 'BOTH' },
      { id: 'p604', name: 'Bay 04 (2W)', type: '3.3kW 16A Universal Socket', maxKw: 3.3, status: 'available', connector: '16A Smart Socket', vehicleType: '2W' },
      { id: 'p605', name: 'Bay 05 (2W)', type: 'Ather Grid Fast Charger', maxKw: 3.3, status: 'available', connector: 'Ather Type 6', vehicleType: '2W' }
    ]
  },
  {
    id: 'st-07',
    vendorId: 'vendor-jiobp',
    vendorName: 'Jio-bp pulse',
    vendorLogo: '⛽',
    vendorColor: 'blue',
    name: 'Jio-bp Statue of Unity Green Zone • Kevadia',
    type: '100% Green E-Mobility Tourism Hub',
    location: 'Ekta Mall & Shrestha Bharat Bhavan, Ekta Nagar, Kevadia, Gujarat 393151',
    lat: 21.8380,
    lng: 73.7191,
    mapsUrl: 'https://maps.google.com/?q=21.8380,73.7191',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=21.8380,73.7191',
    pricePerKwh: 23,
    solar: true,
    rating: 5.0,
    amenities: ['Tourist Information', 'Solar Canopy', 'EV Buggy Transfer', 'Restrooms'],
    ports: [
      { id: 'p701', name: 'Bay 01 (4W)', type: '180kW Fast DC', maxKw: 180, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p702', name: 'Bay 02 (4W)', type: '60kW Fast DC', maxKw: 60, status: 'available', connector: 'CCS2', vehicleType: '4W' },
      { id: 'p703', name: 'Bay 03 (Dual)', type: '22kW Type 2 AC', maxKw: 22, status: 'available', connector: 'Type 2', vehicleType: 'BOTH' },
      { id: 'p704', name: 'Bay 04 (2W)', type: '3.3kW 16A E-Scooter Socket', maxKw: 3.3, status: 'available', connector: '16A Smart Socket', vehicleType: '2W' },
      { id: 'p705', name: 'Bay 05 (2W)', type: 'Ather Grid Fast Point', maxKw: 3.3, status: 'available', connector: 'Ather Type 6', vehicleType: '2W' }
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

    // Initialize in MongoDB Atlas if first time or if migrating to Gujarat regional network
    const needsMigration = !doc || !doc.stations || !Array.isArray(doc.stations) || !doc.stations.some(s => s.location && s.location.includes('Gujarat'));
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
          const totalSec = p.chargingDurationSeconds || (p.chargingDurationMinutes ? p.chargingDurationMinutes * 60 : 1080);
          const elapsedSec = Math.floor((now - p.chargingStartedAt) / 1000);
          if (elapsedSec >= totalSec) {
            p.soc = 100;
            p.kw = 0;
            p.secondsLeft = 0;
            // If completed over 30 minutes ago, auto-release port back to available
            if (elapsedSec - totalSec > 1800) {
              p.status = 'available';
              p.customer = null;
              p.phone = null;
              p.vehicle = null;
              p.pin = null;
              p.userId = null;
              p.sessionId = null;
              p.chargingStartedAt = null;
              p.chargingDurationSeconds = null;
              docChanged = true;
            }
          } else {
            const initial = (p.initialSoc !== undefined && p.initialSoc !== null) ? p.initialSoc : 25;
            const progressFraction = Math.min(1, elapsedSec / totalSec);
            p.soc = Math.min(100, Math.round(initial + (100 - initial) * progressFraction));
            p.secondsLeft = Math.max(0, totalSec - elapsedSec);
            docChanged = true;
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
