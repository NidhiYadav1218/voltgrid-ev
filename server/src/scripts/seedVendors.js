import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import { Vendor } from '../models/Vendor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedVendors() {
  const seedPath = path.join(__dirname, '../data/vendors.seed.json');
  const vendorsData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  console.log(`[Seed Vendors] Loading ${vendorsData.length} vendors into database...`);

  let count = 0;
  for (const vendor of vendorsData) {
    await Vendor.findOneAndUpdate(
      { vendorId: vendor.vendorId },
      { $set: vendor },
      { upsert: true, new: true }
    );
    count++;
  }

  console.log(`[Seed Vendors] Completed. Upserted ${count} vendors.`);
}

// Allow direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  connectDB()
    .then(() => seedVendors())
    .then(() => disconnectDB())
    .then(() => {
      console.log('[Seed Vendors] Process finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Vendors] Error:', err);
      process.exit(1);
    });
}
