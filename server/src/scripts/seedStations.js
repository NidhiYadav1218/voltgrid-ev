import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import { Station } from '../models/Station.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedStations() {
  const seedPath = path.join(__dirname, '../data/stations.seed.json');
  const stationsData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

  console.log(`[Seed Stations] Loading ${stationsData.length} stations into database...`);

  let insertedCount = 0;
  let updatedCount = 0;

  for (const stationItem of stationsData) {
    const existing = await Station.findOne({ stationId: stationItem.stationId });

    if (!existing) {
      // New station: insert directly
      await Station.create(stationItem);
      insertedCount++;
    } else {
      // Existing station: update fields but preserve ports that are currently reserved or charging
      const preservedPorts = stationItem.ports.map((seedPort) => {
        const existingPort = existing.ports.find((p) => p.portId === seedPort.portId);
        if (existingPort && (existingPort.status === 'reserved' || existingPort.status === 'charging')) {
          // Keep active charging/reservation state
          return existingPort;
        }
        return seedPort;
      });

      await Station.updateOne(
        { stationId: stationItem.stationId },
        {
          $set: {
            ...stationItem,
            ports: preservedPorts
          }
        }
      );
      updatedCount++;
    }
  }

  console.log(`[Seed Stations] Completed. Inserted: ${insertedCount}, Updated: ${updatedCount}`);
}

// Allow direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  connectDB()
    .then(() => seedStations())
    .then(() => disconnectDB())
    .then(() => {
      console.log('[Seed Stations] Process finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Stations] Error:', err);
      process.exit(1);
    });
}
