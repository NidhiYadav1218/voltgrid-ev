import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Booking } from '../src/models/Booking.js';
import { Vendor } from '../src/models/Vendor.js';
import { Station } from '../src/models/Station.js';
import { USER_ROLES } from '../src/config/constants.js';

let mongoServer;
let app;
let driverToken;
let vendorToken;
let adminToken;

const JWT_SECRET = 'test-jwt-secret-roles';

function makeToken(user) {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = JWT_SECRET;
  process.env.ALLOW_DEMO_RESET = 'true';

  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = createApp();

  const driver = await User.create({
    name: 'Driver One',
    email: 'driver1@example.com',
    phone: '+91 90000 00001',
    passwordHash: 'hash',
    role: USER_ROLES.DRIVER
  });
  driverToken = makeToken(driver);

  const vendor = await User.create({
    name: 'Vendor One',
    email: 'vendor1@example.com',
    phone: '+91 90000 00002',
    passwordHash: 'hash',
    role: USER_ROLES.VENDOR,
    vendorId: 'vendor-jiobp'
  });
  vendorToken = makeToken(vendor);

  const admin = await User.create({
    name: 'Admin One',
    email: 'admin1@example.com',
    phone: '+91 90000 00003',
    passwordHash: 'hash',
    role: USER_ROLES.ADMIN
  });
  adminToken = makeToken(admin);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Role-Based Access Control (/api roles.test.js)', () => {
  test('A driver calling GET /api/users receives 403', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${driverToken}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  test('An admin calling GET /api/users receives 200 with all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  test('A request without a token to GET /api/bookings receives 401', async () => {
    const res = await request(app).get('/api/bookings');
    expect(res.status).toBe(401);
  });

  test('A driver calling GET /api/admin/stats receives 403', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${driverToken}`);
    expect(res.status).toBe(403);
  });

  test('An admin calling GET /api/admin/stats receives 200 with computed system metrics', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('counts');
    expect(res.body).toHaveProperty('ports');
    expect(res.body).toHaveProperty('financials');
  });

  test('Driver can read and upsert own telematics (/api/telematics)', async () => {
    const getRes = await request(app)
      .get('/api/telematics')
      .set('Authorization', `Bearer ${driverToken}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty('battery');

    const postRes = await request(app)
      .post('/api/telematics')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ speed: 45, gear: 'D' });
    expect(postRes.status).toBe(200);
    expect(postRes.body.speed).toBe(45);
    expect(postRes.body.gear).toBe('D');
  });

  test('Vendor can view own earnings and balance (/api/vendors/me)', async () => {
    // Seed vendor record
    await Vendor.create({
      vendorId: 'vendor-jiobp',
      name: 'Jio-bp pulse',
      code: 'JIOBP',
      contactEmail: 'pulse@jiobp.example.com',
      supportPhone: '+91 1800 000 000',
      gstin: '07AABCR2311K1Z2',
      bankAccountMasked: 'ICICI •••• 1234'
    });

    const res = await request(app)
      .get('/api/vendors/me')
      .set('Authorization', `Bearer ${vendorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('vendor');
    expect(res.body).toHaveProperty('stats');
    expect(res.body).toHaveProperty('payoutSummary');
  });

  test('Driver calling /api/vendors/me receives 403', async () => {
    const res = await request(app)
      .get('/api/vendors/me')
      .set('Authorization', `Bearer ${driverToken}`);
    expect(res.status).toBe(403);
  });
});
