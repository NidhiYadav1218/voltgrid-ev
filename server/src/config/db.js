import mongoose from 'mongoose';

let memoryServer = null;

export async function connectDB(uri) {
  const dbUri = uri || process.env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[MongoDB] Could not connect to ${dbUri} (${error.message}).`);
      console.log(`[MongoDB] Starting in-memory MongoDB database for local development...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[MongoDB] In-memory database running at: ${memUri}`);

        // Auto-seed default stations, vendors, admin & demo driver
        const { seedStations } = await import('../scripts/seedStations.js');
        const { seedVendors } = await import('../scripts/seedVendors.js');
        const { createAdmin } = await import('../scripts/createAdmin.js');
        const { User } = await import('../models/User.js');
        const bcrypt = (await import('bcryptjs')).default;

        await seedStations();
        await seedVendors();
        await createAdmin();

        // Ensure demo driver exists
        const driverExists = await User.findOne({ email: 'driver1@example.com' });
        if (!driverExists) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash('Password123!', salt);
          await User.create({
            name: 'Aarav Patel',
            email: 'driver1@example.com',
            phone: '+91 90000 00001',
            passwordHash: hash,
            role: 'driver',
            car: 'MG ZS EV'
          });
          console.log('[MongoDB] Seeded demo driver account: driver1@example.com / Password123!');
        }

        return conn;
      } catch (memErr) {
        console.error(`[MongoDB] Failed to start in-memory database:`, memErr);
        throw memErr;
      }
    }
    throw error;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
