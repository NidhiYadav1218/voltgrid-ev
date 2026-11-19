import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { USER_ROLES } from '../config/constants.js';

export async function createAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'replace-me';

  if (!email || !password || password === 'replace-me') {
    throw new Error('ADMIN_EMAIL and a valid ADMIN_PASSWORD must be configured in environment variables.');
  }

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log(`[Create Admin] Admin with email ${email} already exists. Skipping.`);
    return existingAdmin;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const adminUser = await User.create({
    name: 'VoltGrid Administrator',
    email,
    phone: '+91 90000 00000',
    passwordHash,
    role: USER_ROLES.ADMIN,
    car: 'VoltGrid Fleet EV'
  });

  console.log(`[Create Admin] Admin user created successfully with email: ${email}`);
  return adminUser;
}

// Allow direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  connectDB()
    .then(() => createAdmin())
    .then(() => disconnectDB())
    .then(() => {
      console.log('[Create Admin] Process finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Create Admin] Error:', err);
      process.exit(1);
    });
}
