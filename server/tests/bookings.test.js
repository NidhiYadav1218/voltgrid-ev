import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app.js';
import { Station } from '../src/models/Station.js';
import { Booking } from '../src/models/Booking.js';
import { User } from '../src/models/User.js';
import { USER_ROLES, PORT_STATUS, BOOKING_STATUS } from '../src/config/constants.js';

let mongoServer;
let app;
let driverUser;
let driverToken;
let otherDriverToken;
let vendorUser;
let vendorToken;
let adminUser;
let adminToken;

const JWT_SECRET = 'test-jwt-secret-bookings';

function makeToken(user) {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = JWT_SECRET;

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Station.deleteMany({});
  await Booking.deleteMany({});
  await User.deleteMany({});

  driverUser = await User.create({
    name: 'Aarav Patel',
    email: 'driver1@example.com',
    phone: '+91 90000 00001',
    passwordHash: 'hash',
    role: USER_ROLES.DRIVER
  });
  driverToken = makeToken(driverUser);

  const otherDriver = await User.create({
    name: 'Rohan Mehra',
    email: 'rohan@example.com',
    phone: '+91 90000 00002',
    passwordHash: 'hash',
    role: USER_ROLES.DRIVER
  });
  otherDriverToken = makeToken(otherDriver);

  vendorUser = await User.create({
    name: 'Jio-bp Manager',
    email: 'manager@jiobp.example.com',
    phone: '+91 90000 00003',
    passwordHash: 'hash',
    role: USER_ROLES.VENDOR,
    vendorId: 'vendor-jiobp'
  });
  vendorToken = makeToken(vendorUser);

  adminUser = await User.create({
    name: 'VoltGrid Admin',
    email: 'admin@voltgrid.in',
    phone: '+91 90000 00000',
    passwordHash: 'hash',
    role: USER_ROLES.ADMIN
  });
  adminToken = makeToken(adminUser);

  // Create 2 test bookings: one for vendor-jiobp, one for vendor-tata
  await Booking.create({
    bookingCode: 'BK-10001',
    user: driverUser._id,
    customerName: driverUser.name,
    customerPhone: driverUser.phone,
    customerEmail: driverUser.email,
    vehicleModel: 'MG ZS EV',
    stationId: 'st-01',
    stationName: 'Jio-bp SG Highway',
    vendorId: 'vendor-jiobp',
    vendorName: 'Jio-bp pulse',
    portId: 'p101',
    energyKwh: 30,
    pricePerKwh: 26,
    invoice: { energyCharge: 780, convenienceFee: 40, gst: 147.6, totalAmount: 967.6 },
    platformFee: 145,
    vendorPayout: 822.6,
    status: BOOKING_STATUS.CONFIRMED,
    pin: '1234',
    holdExpiresAt: new Date(Date.now() + 15 * 60000),
    idempotencyKey: 'idemp-bk-1'
  });

  await Booking.create({
    bookingCode: 'BK-10002',
    user: otherDriver._id,
    customerName: otherDriver.name,
    customerPhone: otherDriver.phone,
    customerEmail: otherDriver.email,
    vehicleModel: 'Hyundai Ioniq 5',
    stationId: 'st-02',
    stationName: 'Tata Power GIFT City',
    vendorId: 'vendor-tata',
    vendorName: 'Tata Power EZ Charge',
    portId: 'p201',
    energyKwh: 40,
    pricePerKwh: 24,
    invoice: { energyCharge: 960, convenienceFee: 40, gst: 180, totalAmount: 1180 },
    platformFee: 177,
    vendorPayout: 1003,
    status: BOOKING_STATUS.COMPLETED,
    pin: '5678',
    holdExpiresAt: new Date(Date.now() + 15 * 60000),
    idempotencyKey: 'idemp-bk-2'
  });
});

describe('Bookings API (/api/bookings)', () => {
  test('GET /api/bookings returns 401 when token is missing', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.status).toBe(401);
  });

  test('Role filtering: Driver sees only own bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${driverToken}`);

    expect(res.status).toBe(200);
    expect(res.body.bookings.length).toBe(1);
    expect(res.body.bookings[0].bookingCode).toBe('BK-10001');
  });

  test('Role filtering: Vendor sees only bookings for their own vendorId', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${vendorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.bookings.length).toBe(1);
    expect(res.body.bookings[0].vendorId).toBe('vendor-jiobp');
  });

  test('Role filtering: Admin sees all bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.bookings.length).toBe(2);
  });

  test('GET /api/bookings/:id/pass returns PIN only while status is CONFIRMED', async () => {
    // BK-10001 is CONFIRMED and owned by driverUser
    const res = await request(app)
      .get('/api/bookings/BK-10001/pass')
      .set('Authorization', `Bearer ${driverToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pin', '1234');
    expect(res.body.status).toBe(BOOKING_STATUS.CONFIRMED);

    // Another driver cannot access BK-10001 pass -> 403
    const forbiddenRes = await request(app)
      .get('/api/bookings/BK-10001/pass')
      .set('Authorization', `Bearer ${otherDriverToken}`);
    expect(forbiddenRes.status).toBe(403);

    // BK-10002 is COMPLETED -> 409
    const completedRes = await request(app)
      .get('/api/bookings/BK-10002/pass')
      .set('Authorization', `Bearer ${otherDriverToken}`);
    expect(completedRes.status).toBe(409);
  });

  test('POST /api/bookings/:id/cancel cancels CONFIRMED booking and marks REFUNDED', async () => {
    const res = await request(app)
      .post('/api/bookings/BK-10001/cancel')
      .set('Authorization', `Bearer ${driverToken}`);

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe(BOOKING_STATUS.REFUNDED);
    expect(res.body.booking.refundReason).toBe('Customer cancellation');
  });

  test('POST /api/bookings/:id/refund allows Admin to refund booking with reason', async () => {
    const res = await request(app)
      .post('/api/bookings/BK-10002/refund')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Hardware failure on charger' });

    expect(res.status).toBe(200);
    expect(res.body.booking.status).toBe(BOOKING_STATUS.REFUNDED);
    expect(res.body.booking.refundReason).toBe('Hardware failure on charger');

    // Non-admin driver cannot refund -> 403
    const forbiddenRes = await request(app)
      .post('/api/bookings/BK-10002/refund')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ reason: 'Attempt' });
    expect(forbiddenRes.status).toBe(403);
  });
});
