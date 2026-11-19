import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app.js';
import { Station } from '../src/models/Station.js';
import { Booking } from '../src/models/Booking.js';
import { User } from '../src/models/User.js';
import { Vendor } from '../src/models/Vendor.js';
import { checkExpiredHolds } from '../src/services/expiryService.js';
import { computeInvoice } from '../src/services/pricingService.js';
import { USER_ROLES, PORT_STATUS, BOOKING_STATUS } from '../src/config/constants.js';

let mongoServer;
let app;
let driverUser;
let driverToken;

const JWT_SECRET = 'test-jwt-secret-reservation-core';

function makeToken(user) {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = JWT_SECRET;
  process.env.HOLD_MINUTES = '15';
  process.env.PIN_MAX_ATTEMPTS = '5';

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
  await Vendor.deleteMany({});

  // Seed test vendor
  await Vendor.create({
    vendorId: 'vendor-jiobp',
    name: 'Jio-bp pulse',
    code: 'JIOBP',
    commissionRate: 0.15,
    contactEmail: 'support@jiobp.example.com',
    supportPhone: '+91 1800 000 000',
    gstin: '07AABCR2311K1Z2',
    bankAccountMasked: 'HDFC Bank •••• 1234'
  });

  // Seed test driver user
  driverUser = await User.create({
    name: 'Aarav Patel',
    email: 'driver1@example.com',
    phone: '+91 90000 00001',
    passwordHash: 'dummy-hash',
    role: USER_ROLES.DRIVER,
    car: 'MG ZS EV'
  });
  driverToken = makeToken(driverUser);

  // Seed test station with 2 ports
  await Station.create({
    stationId: 'st-01',
    name: 'Jio-bp pulse SG Highway HyperHub • Ahmedabad',
    type: 'Highway Ultra-Fast Hub',
    location: 'S.G. Highway, Bodakdev',
    city: 'Ahmedabad',
    pricePerKwh: 26,
    solar: true,
    vendorId: 'vendor-jiobp',
    vendorName: 'Jio-bp pulse',
    ports: [
      {
        portId: 'p101',
        name: 'Bay 01 (4W)',
        type: '240kW Ultra-Fast DC',
        maxKw: 240,
        status: PORT_STATUS.AVAILABLE,
        connector: 'CCS2',
        vehicleType: '4W'
      },
      {
        portId: 'p102',
        name: 'Bay 02 (4W)',
        type: '120kW Fast DC',
        maxKw: 120,
        status: PORT_STATUS.AVAILABLE,
        connector: 'CCS2',
        vehicleType: '4W'
      }
    ]
  });
});

describe('Acceptance Tests: Reservation Core', () => {
  // Test 1: Ten simultaneous reserve requests for one port produce exactly one 201 and nine 409 responses
  test('1. Ten simultaneous reserve requests produce exactly one 201 and nine 409 responses', async () => {
    // Generate 10 drivers
    const drivers = [];
    for (let i = 0; i < 10; i++) {
      const u = await User.create({
        name: `Driver ${i}`,
        email: `driver_${i}_${Date.now()}@example.com`,
        phone: `+91 90000 0001${i}`,
        passwordHash: 'hash',
        role: USER_ROLES.DRIVER
      });
      drivers.push({ user: u, token: makeToken(u) });
    }

    const requests = drivers.map((d, index) =>
      request(app)
        .post('/api/stations/st-01/ports/p101/reserve')
        .set('Authorization', `Bearer ${d.token}`)
        .send({
          vehicleModel: 'MG ZS EV',
          energyKwh: 25,
          idempotencyKey: `simul-key-${index}-${Date.now()}`
        })
    );

    const responses = await Promise.all(requests);
    const statusCodes = responses.map((r) => r.status);

    const count201 = statusCodes.filter((s) => s === 201).length;
    const count409 = statusCodes.filter((s) => s === 409).length;

    expect(count201).toBe(1);
    expect(count409).toBe(9);
  });

  // Test 2: A reserve request repeated with the same idempotencyKey returns the same booking and creates no second one
  test('2. Repeated reserve with same idempotencyKey returns same booking and creates no duplicate', async () => {
    const key = `idemp-${Date.now()}`;

    const res1 = await request(app)
      .post('/api/stations/st-01/ports/p101/reserve')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({
        vehicleModel: 'MG ZS EV',
        energyKwh: 30,
        idempotencyKey: key
      });

    expect(res1.status).toBe(201);
    expect(res1.body).toHaveProperty('booking');
    const bookingCode = res1.body.booking.bookingCode;

    // Second call with same idempotencyKey
    const res2 = await request(app)
      .post('/api/stations/st-01/ports/p101/reserve')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({
        vehicleModel: 'MG ZS EV',
        energyKwh: 30,
        idempotencyKey: key
      });

    expect(res2.status).toBe(200);
    expect(res2.body.bookingCode).toBe(bookingCode);

    const totalBookings = await Booking.countDocuments({ idempotencyKey: key });
    expect(totalBookings).toBe(1);
  });

  // Test 3: Start without a pin returns 400. A wrong pin returns 403. After PIN_MAX_ATTEMPTS wrong tries the response is 423
  test('3. Start charging PIN verification: missing=400, wrong=403, 5 wrong tries=423', async () => {
    const reserveRes = await request(app)
      .post('/api/stations/st-01/ports/p101/reserve')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({
        vehicleModel: 'MG ZS EV',
        energyKwh: 25,
        idempotencyKey: `pin-test-${Date.now()}`
      });

    expect(reserveRes.status).toBe(201);
    const correctPin = reserveRes.body.pin;

    // Missing PIN -> 400
    const missingRes = await request(app)
      .post('/api/stations/st-01/ports/p101/start')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({});
    expect(missingRes.status).toBe(400);

    // Wrong PIN tries 1 to 4 -> 403
    for (let i = 1; i <= 4; i++) {
      const wrongRes = await request(app)
        .post('/api/stations/st-01/ports/p101/start')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({ pin: '0000' });
      expect(wrongRes.status).toBe(403);
    }

    // 5th wrong try -> 423 locked
    const lockRes = await request(app)
      .post('/api/stations/st-01/ports/p101/start')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ pin: '0000' });
    expect(lockRes.status).toBe(423);

    // Even with correct PIN now, it must be locked -> 423
    const blockedRes = await request(app)
      .post('/api/stations/st-01/ports/p101/start')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ pin: correctPin });
    expect(blockedRes.status).toBe(423);
  });

  // Test 4: With a short HOLD_MINUTES, an unused hold becomes EXPIRED then REFUNDED and the port is available again
  test('4. Expired hold transitions to EXPIRED -> REFUNDED and port becomes available again', async () => {
    const reserveRes = await request(app)
      .post('/api/stations/st-01/ports/p101/reserve')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({
        vehicleModel: 'MG ZS EV',
        energyKwh: 25,
        idempotencyKey: `expire-test-${Date.now()}`
      });

    expect(reserveRes.status).toBe(201);
    const bookingId = reserveRes.body.booking._id;

    // Manually backdate holdExpiresAt to 1 minute ago
    await Booking.findByIdAndUpdate(bookingId, {
      $set: { holdExpiresAt: new Date(Date.now() - 60000) }
    });

    // Run hold expiry service check
    await checkExpiredHolds();

    // Verify booking is now REFUNDED with reason
    const updatedBooking = await Booking.findById(bookingId);
    expect(updatedBooking.status).toBe(BOOKING_STATUS.REFUNDED);
    expect(updatedBooking.refundReason).toMatch(/No-show/i);

    // Verify port is available again
    const station = await Station.findOne({ stationId: 'st-01' });
    const port = station.ports.find((p) => p.portId === 'p101');
    expect(port.status).toBe(PORT_STATUS.AVAILABLE);
    expect(port.bookingId).toBeNull();
  });

  // Test 5: Release clears every session field on the port
  test('5. Release clears every session field on the port', async () => {
    const reserveRes = await request(app)
      .post('/api/stations/st-01/ports/p101/reserve')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({
        vehicleModel: 'MG ZS EV',
        energyKwh: 25,
        idempotencyKey: `release-test-${Date.now()}`
      });

    const pin = reserveRes.body.pin;

    // Start charging
    await request(app)
      .post('/api/stations/st-01/ports/p101/start')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({ pin });

    // Release port
    const releaseRes = await request(app)
      .post('/api/stations/st-01/ports/p101/release')
      .set('Authorization', `Bearer ${driverToken}`);

    expect(releaseRes.status).toBe(200);

    const station = await Station.findOne({ stationId: 'st-01' });
    const port = station.ports.find((p) => p.portId === 'p101');

    expect(port.status).toBe(PORT_STATUS.AVAILABLE);
    expect(port.bookingId).toBeNull();
    expect(port.reservedBy).toBeNull();
    expect(port.reservedAt).toBeNull();
    expect(port.holdExpiresAt).toBeNull();
    expect(port.startedAt).toBeNull();
    expect(port.soc).toBeNull();
    expect(port.kw).toBeNull();
  });

  // Test 7: GET /stations never contains pin, customerPhone or customerEmail
  test('7. GET /stations never exposes pin, customerPhone or customerEmail', async () => {
    await request(app)
      .post('/api/stations/st-01/ports/p101/reserve')
      .set('Authorization', `Bearer ${driverToken}`)
      .send({
        vehicleModel: 'MG ZS EV',
        energyKwh: 25,
        idempotencyKey: `sanitize-test-${Date.now()}`
      });

    const res = await request(app).get('/api/stations');
    expect(res.status).toBe(200);

    const jsonStr = JSON.stringify(res.body);
    expect(jsonStr).not.toContain('pin');
    expect(jsonStr).not.toContain(driverUser.phone);
    expect(jsonStr).not.toContain(driverUser.email);
  });

  // Test 8: The invoice for a known energy amount and price matches the figures the legacy checkout produced
  test('8. Invoice computation matches legacy checkout figures exactly', () => {
    // 39.2 kWh @ ₹26/kWh (from legacy booking BK-98224)
    // energyCharge = 39.2 * 26 = 1019.2
    // convenienceFee = 40.00 (4W)
    // gst = (1019.20 + 40.00) * 0.18 = 190.66
    // totalAmount = 1019.20 + 40.00 + 190.66 = 1249.86
    const inv = computeInvoice(39.2, 26, '4W');
    expect(inv.energyCharge).toBe(1019.2);
    expect(inv.convenienceFee).toBe(40.0);
    expect(inv.gst).toBe(190.66);
    expect(inv.totalAmount).toBe(1249.86);

    // 2W vehicle test (₹15 convenience fee)
    const inv2W = computeInvoice(10, 20, '2W');
    expect(inv2W.energyCharge).toBe(200.0);
    expect(inv2W.convenienceFee).toBe(15.0);
    expect(inv2W.gst).toBe(38.7);
    expect(inv2W.totalAmount).toBe(253.7);
  });
});
