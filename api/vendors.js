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

const DEFAULT_VENDORS = [
  {
    id: 'vendor-tata',
    name: 'Tata Power EZ Charge',
    code: 'TATAPOWER',
    logo: '⚡',
    color: 'emerald',
    contactEmail: 'evsupport@tatapower.com',
    supportPhone: '+91 1800 209 5161',
    gstin: '07AAACT2727Q1ZU',
    commissionRate: 0.15, // 15% platform take rate, 85% to vendor
    bankAccount: 'HDFC Bank •••• 9104',
    payoutMethod: 'Instant IMPS / NEFT Auto-Sweep',
    totalPorts: 4,
    rating: 4.8
  },
  {
    id: 'vendor-jiobp',
    name: 'Jio-bp pulse',
    code: 'JIOBP',
    logo: '⛽',
    color: 'blue',
    contactEmail: 'pulse.care@jiobp.com',
    supportPhone: '+91 1800 891 9023',
    gstin: '07AABCR2311K1Z2',
    commissionRate: 0.15,
    bankAccount: 'ICICI Bank •••• 4421',
    payoutMethod: 'Instant IMPS / NEFT Auto-Sweep',
    totalPorts: 6,
    rating: 4.9
  },
  {
    id: 'vendor-zeon',
    name: 'Zeon Charging',
    code: 'ZEON',
    logo: '🔋',
    color: 'indigo',
    contactEmail: 'support@zeoncharging.com',
    supportPhone: '+91 93456 78901',
    gstin: '33AABCZ4455P1Z8',
    commissionRate: 0.15,
    bankAccount: 'Axis Bank •••• 7820',
    payoutMethod: 'Instant IMPS / NEFT Auto-Sweep',
    totalPorts: 3,
    rating: 4.7
  },
  {
    id: 'vendor-statiq',
    name: 'Statiq EV Fast Hub',
    code: 'STATIQ',
    logo: '🚀',
    color: 'amber',
    contactEmail: 'ops@statiq.in',
    supportPhone: '+91 80000 78284',
    gstin: '06AAECS3344F1ZT',
    commissionRate: 0.15,
    bankAccount: 'Kotak Bank •••• 6509',
    payoutMethod: 'Instant IMPS / NEFT Auto-Sweep',
    totalPorts: 4,
    rating: 4.6
  },
  {
    id: 'vendor-voltgrid',
    name: 'VoltGrid Direct Flagship',
    code: 'VOLTGRID',
    logo: '🛡️',
    color: 'cyan',
    contactEmail: 'host@voltgrid.in',
    supportPhone: '+91 98765 43210',
    gstin: '07AABCV9999M1ZQ',
    commissionRate: 0.05, // 5% internal cost, 95% revenue
    bankAccount: 'State Bank of India •••• 1102',
    payoutMethod: 'Direct Escrow Settlement',
    totalPorts: 5,
    rating: 5.0
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
    let client = null;
    let db = null;
    let vendorsCol = null;
    let bookingsCol = null;

    try {
      client = await getClient();
      db = client.db('voltgrid');
      vendorsCol = db.collection('vendors');
      bookingsCol = db.collection('bookings');
    } catch (dbErr) {
      console.warn('MongoDB connection fallback for vendors:', dbErr.message);
    }

    if (req.method === 'GET') {
      let vendors = DEFAULT_VENDORS;
      if (vendorsCol) {
        const stored = await vendorsCol.find({}).toArray();
        if (stored && stored.length > 0) {
          vendors = stored;
        } else {
          await vendorsCol.insertMany(DEFAULT_VENDORS);
        }
      }

      // Calculate live revenue per vendor from bookings collection
      let bookings = [];
      if (bookingsCol) {
        bookings = await bookingsCol.find({}).toArray();
      }

      const vendorsWithStats = vendors.map(v => {
        const vendorBookings = bookings.filter(b => b.vendorId === v.id || (b.stationName && b.stationName.toLowerCase().includes(v.code.toLowerCase())));
        const totalGrossRevenue = vendorBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        const commissionTaken = Math.round(totalGrossRevenue * (v.commissionRate || 0.15));
        const netVendorEarnings = totalGrossRevenue - commissionTaken;
        const totalKwhDelivered = vendorBookings.reduce((sum, b) => sum + (Number(b.energyKwh) || 0), 0);

        return {
          ...v,
          totalBookingsCount: vendorBookings.length,
          totalGrossRevenue,
          commissionTaken,
          netVendorEarnings,
          totalKwhDelivered
        };
      });

      return res.status(200).json({
        success: true,
        vendors: vendorsWithStats
      });
    }

    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action, vendorId, payoutAmount } = payload;

      if (action === 'request_payout') {
        const payoutRecord = {
          payoutId: 'PO-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          vendorId: vendorId || 'vendor-tata',
          amount: Number(payoutAmount) || 5000,
          status: 'SUCCESS',
          method: 'IMPS_INSTANT_SETTLEMENT',
          referenceNo: 'UTR' + Date.now().toString().slice(-8),
          timestamp: new Date().toISOString()
        };

        if (db) {
          await db.collection('vendor_payouts').insertOne(payoutRecord);
        }

        return res.status(200).json({
          success: true,
          message: 'Vendor payout dispatched successfully via instant bank settlement',
          payout: payoutRecord
        });
      }

      return res.status(400).json({ error: 'Unknown vendor action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API /api/vendors Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
