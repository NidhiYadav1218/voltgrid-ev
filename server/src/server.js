import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    } else {
      console.warn('[Warning] MONGODB_URI not configured. Database connection deferred.');
    }

    app.listen(PORT, () => {
      console.log(`[VoltGrid Server] Running on http://localhost:${PORT}`);
      console.log(`[VoltGrid Server] Client Origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('[VoltGrid Server] Startup error:', error.message);
    process.exit(1);
  }
}

startServer();
