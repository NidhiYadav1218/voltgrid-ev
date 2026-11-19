import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { User } from '../src/models/User.js';
import { createAdmin } from '../src/scripts/createAdmin.js';
import { USER_ROLES } from '../src/config/constants.js';

let mongoServer;
let app;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-12345';
  process.env.ADMIN_EMAIL = 'admin@example.com';
  process.env.ADMIN_PASSWORD = 'AdminSecurePassword2026!';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = createApp();
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 60000);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API (/api/auth)', () => {
  const testDriver = {
    name: 'Aarav Patel',
    email: 'driver1@example.com',
    phone: '+91 90000 00001',
    password: 'Password123!',
    car: 'MG ZS EV'
  };

  test('POST /api/auth/register creates a driver and returns token + user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testDriver);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(testDriver.email);
    expect(res.body.user.role).toBe(USER_ROLES.DRIVER);
    expect(res.body.user).not.toHaveProperty('passwordHash');

    const inDb = await User.findOne({ email: testDriver.email });
    expect(inDb).not.toBeNull();
    expect(inDb.name).toBe(testDriver.name);
  });

  test('POST /api/auth/register fails with 409 for duplicate email', async () => {
    await request(app).post('/api/auth/register').send(testDriver);

    const res = await request(app).post('/api/auth/register').send(testDriver);
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/already exists/i);
  });

  test('POST /api/auth/register fails with 400 for password less than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testDriver, password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/8 characters/i);
  });

  test('POST /api/auth/login authenticates registered user and returns token', async () => {
    await request(app).post('/api/auth/register').send(testDriver);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testDriver.email, password: testDriver.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testDriver.email);
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  test('POST /api/auth/login fails with 401 for wrong password', async () => {
    await request(app).post('/api/auth/register').send(testDriver);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testDriver.email, password: 'WrongPassword123!' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/auth/login fails with 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password: 'Password123!' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('GET /api/auth/me returns current user profile with valid Bearer token', async () => {
    const regRes = await request(app).post('/api/auth/register').send(testDriver);
    const token = regRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(testDriver.email);
    expect(res.body.role).toBe(USER_ROLES.DRIVER);
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  test('GET /api/auth/me returns 401 when token is missing', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  test('Admin user created via createAdmin can log in and has admin role', async () => {
    await createAdmin();

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe(USER_ROLES.ADMIN);
  });
});
