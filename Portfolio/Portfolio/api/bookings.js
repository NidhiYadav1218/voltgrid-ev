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
      let bookings = await bookingsCol.find({}).sort({ createdAt: -1 }).toArray();
      if (!bookings || bookings.length === 0) {
        // Auto-seed default realistic bookings if MongoDB Atlas collection is empty
        const defaultBookings = [
          {
            id: 'BK-98214',
            createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
            customerName: 'Aarav Sharma',
            customerPhone: '+91 98250 12345',
            customerEmail: 'aarav.sharma@gmail.com',
            vehicleModel: 'MG ZS EV (50.3 kWh)',
            stationId: 'st-01',
            stationName: 'Jio-bp pulse SG Highway HyperHub • Ahmedabad',
            vendorId: 'vendor-jiobp',
            vendorName: 'Jio-bp pulse',
            portId: 'Bay 01 (4W)',
            energyKwh: 38.5,
            totalAmount: 1001,
            platformFee: 150,
            vendorPayout: 851,
            status: 'COMPLETED',
            pin: '7412'
          },
          {
            id: 'BK-98215',
            createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
            customerName: 'Rohan Mehra',
            customerPhone: '+91 98980 54321',
            customerEmail: 'rohan.mehra@gmail.com',
            vehicleModel: 'Hyundai Ioniq 5 (72.6 kWh)',
            stationId: 'st-02',
            stationName: 'Tata Power GIFT City FinTech SuperHub • Gandhinagar',
            vendorId: 'vendor-tata',
            vendorName: 'Tata Power EZ Charge',
            portId: 'Bay 01 (4W)',
            energyKwh: 52.0,
            totalAmount: 1248,
            platformFee: 187,
            vendorPayout: 1061,
            status: 'COMPLETED',
            pin: '3920'
          },
          {
            id: 'BK-98216',
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            customerName: 'Kiran Patel',
            customerPhone: '+91 97240 98765',
            customerEmail: 'kiran.patel@gmail.com',
            vehicleModel: 'Tata Punch EV (35 kWh)',
            stationId: 'st-12',
            stationName: 'VoltGrid VR Surat & Dumas Mega-Hub',
            vendorId: 'vendor-voltgrid',
            vendorName: 'VoltGrid Direct Flagship',
            portId: 'Bay 02 (4W)',
            energyKwh: 24.5,
            totalAmount: 588,
            platformFee: 88,
            vendorPayout: 500,
            status: 'CHARGING',
            pin: '8154'
          },
          {
            id: 'BK-98217',
            createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
            customerName: 'Priya Joshi',
            customerPhone: '+91 94260 11223',
            customerEmail: 'priya.j@gmail.com',
            vehicleModel: 'Ather 450X Gen 3 (3.7 kWh)',
            stationId: 'st-08',
            stationName: 'Zeon Alkapuri Express Gateway • Vadodara',
            vendorId: 'vendor-zeon',
            vendorName: 'Zeon Charging',
            portId: 'Bay 04 (2W)',
            energyKwh: 3.2,
            totalAmount: 96,
            platformFee: 14,
            vendorPayout: 82,
            status: 'COMPLETED',
            pin: '5012'
          },
          {
            id: 'BK-98224',
            createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
            customerName: 'Nidhi Yadav',
            customerPhone: '+91 93287 03345',
            customerEmail: 'nidhiyadav1218@gmail.com',
            vehicleModel: 'MG ZS EV (50.3 kWh)',
            stationId: 'st-01',
            stationName: 'Jio-bp pulse SG Highway HyperHub • Ahmedabad',
            vendorId: 'vendor-jiobp',
            vendorName: 'Jio-bp pulse',
            portId: 'Bay 02 (4W)',
            energyKwh: 39.2,
            totalAmount: 1019,
            platformFee: 153,
            vendorPayout: 866,
            status: 'CHARGING',
            pin: '9045'
          }
        ];
        try {
          await bookingsCol.insertMany(defaultBookings);
          bookings = await bookingsCol.find({}).sort({ createdAt: -1 }).toArray();
        } catch(e) {}
      }
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
