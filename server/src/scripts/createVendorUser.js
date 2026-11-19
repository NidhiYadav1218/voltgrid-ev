import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { USER_ROLES } from '../config/constants.js';

export async function createVendorUser() {
  const vendors = [
    {
      email: 'vendor@example.com',
      password: 'vendorpassword123',
      name: 'Jio-bp pulse Partner',
      phone: '+91 90000 00002',
      vendorId: 'vendor-jiobp'
    },
    {
      email: 'tatapower.cpo@example.com',
      password: 'vendorpassword123',
      name: 'Tata Power EZ Operations',
      phone: '+91 90000 00003',
      vendorId: 'vendor-tata'
    }
  ];

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('vendorpassword123', salt);

  for (const v of vendors) {
    const existing = await User.findOne({ email: v.email });
    if (existing) {
      existing.role = USER_ROLES.VENDOR;
      existing.vendorId = v.vendorId;
      await existing.save();
      console.log(`[Create Vendor] Updated vendor user: ${v.email}`);
    } else {
      await User.create({
        name: v.name,
        email: v.email,
        phone: v.phone,
        passwordHash,
        role: USER_ROLES.VENDOR,
        vendorId: v.vendorId,
        car: 'Fleet Operations'
      });
      console.log(`[Create Vendor] Created demo vendor account: ${v.email} / ${v.password}`);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  connectDB()
    .then(() => createVendorUser())
    .then(() => disconnectDB())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Create Vendor] Error:', err);
      process.exit(1);
    });
}
