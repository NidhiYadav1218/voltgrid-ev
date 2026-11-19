# VoltGrid // Smart EV Fast Charging & Slot Reservation Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN%20(React%20%2B%20Express%20%2B%20Node%20%2B%20MongoDB)-10b981.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Tests Passing](https://img.shields.io/badge/Tests-31%20Passed-emerald.svg)](server/tests)

VoltGrid is a production-grade MERN (MongoDB, Express, React, Node) application providing seamless EV fast charging station discovery, dedicated bay reservations with guaranteed 15-minute slot holds, instant 4-digit PIN charger activation, and connected vehicle 4G eSIM telematics across Gujarat's highway corridors and major cities.

---

## 🏛️ Architecture Overview

```
                      +---------------------------------------+
                      |       Client (React 18 + Vite)        |
                      |   Hosted on Vercel (SPA Rewrites)     |
                      |   Tailwind CSS (PostCSS), Router 6    |
                      +---------------------------------------+
                                          |
                                          | HTTPS / REST API
                                          | (JWT Bearer Token)
                                          v
                      +---------------------------------------+
                      |       Server (Express 4 + Node)       |
                      |   Hosted on Render (ES Modules)       |
                      |   Rate Limiter, Helmet, Zod Validator |
                      +---------------------------------------+
                                          |
                                          | Mongoose 8
                                          v
                      +---------------------------------------+
                      |         MongoDB Atlas Database        |
                      |               voltgrid_v2             |
                      |  Stations, Bookings, Users, Vendors   |
                      +---------------------------------------+
```

---

## 🚀 Key Features

1. **Statewide Gujarat Hub Directory:** 34 verified charging superhubs covering Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar, Jamnagar, Junagadh, Gandhinagar, Kutch, Anand, Bharuch, Vapi, and Mehsana.
2. **Atomic Bay Reservation:** Atomic slot hold (`findOneAndUpdate` matching `status: 'available'`) prevents race conditions and double booking.
3. **Guaranteed 15-Minute Hold & PIN:** Generates a cryptographically random 4-digit PIN with QR digital pass.
4. **Server-Side PIN Authentication:** Mandatory 5-attempt limit locks the booking after 5 failures to protect hardware.
5. **Driver Cockpit & 4G eSIM Simulator:** Real-time physics engine simulating battery SoC depletion, regenerative braking, drive modes (ECO/NORMAL/SPORT), speed, and distance synchronization via `/api/telematics`.
6. **Charge Point Operator (CPO) Portal:** Role-based vendor dashboard with gross revenue tracking, 15% platform fee split, instant IMPS bank payout requests, and real-time station tariff editor.
7. **Infrastructure Admin HQ:** Real-time corridor telemetry stats, user management, booking audit logs, and demo environment reset.
8. **Indian Localization:** Formatted with Indian Rupee (`₹`) and `en-IN` numbering (`Intl.NumberFormat`).

---

## 📁 Repository Structure

```
Portfolio/
├── README.md               # Documentation & setup guide
├── MIGRATION_PLAN.md       # Full 9-phase migration specification
├── package.json            # Root workspace scripts
├── .gitignore              # Ignores node_modules, .env, build output
├── client/                 # React 18 frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json         # SPA routing rewrites
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/            # REST API client services
│       ├── components/     # Header, PortCard, ReservationModal, etc.
│       ├── context/        # AuthContext (JWT bearer management)
│       ├── constants/      # Vehicle presets (battery kWh, range)
│       ├── lib/            # Indian Rupee & date formatting utilities
│       └── pages/          # Home, Hubs, HubDetail, Simulator, Vendor, Admin, Login
└── server/                 # Express backend API
    ├── package.json
    ├── render.yaml         # Render deployment blueprint
    ├── src/
    │   ├── server.js       # HTTP server entry point & port listener
    │   ├── app.js          # Express middleware pipeline & routes
    │   ├── config/         # MongoDB Atlas connection & pricing constants
    │   ├── controllers/    # auth, stations, bookings, users, vendors, telematics, admin
    │   ├── middleware/     # JWT auth, role authorization, Zod validation, error handler
    │   ├── models/         # User, Station, Booking, Vendor, Telematics, Payout
    │   ├── services/       # reservationService, pricingService, expiryService
    │   ├── data/           # Seed fixtures (34 stations, 5 vendors)
    │   └── scripts/        # seedStations, seedVendors, createAdmin, migrateLegacy
    └── tests/              # Jest test suites (auth, reservation, bookings, roles)
```

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v20 or higher
- **MongoDB**: MongoDB Atlas connection string (or local MongoDB 6+)
- **npm** package manager

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/voltgrid.git
cd voltgrid

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Configure Environment Variables

Create `.env` inside `server/`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/voltgrid_v2?retryWrites=true&w=majority
JWT_SECRET=super-secret-voltgrid-jwt-key-2026-production
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
HOLD_MINUTES=15
PIN_MAX_ATTEMPTS=5
ALLOW_DEMO_RESET=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminSecurePassword2026!
```

Create `.env` inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database & Create Master Admin
```bash
# Seed 34 Gujarat stations
npm --prefix server run seed:stations

# Seed CPO vendor networks
npm --prefix server run seed:vendors

# Create master admin user
npm --prefix server run admin:create
```

### 5. Start Development Servers
From the repository root:
```bash
# Terminal 1: Run Express Server (http://localhost:5000)
npm run dev:server

# Terminal 2: Run React Client (http://localhost:5173)
npm run dev:client
```

---

## 🧪 Running Automated Tests

All tests run using Jest in Node ES module mode with in-memory MongoDB:
```bash
npm run test:server
```
**Test Suites:**
- `auth.test.js` (9 tests): Registration, login, validation, JWT token issuance, password hashing.
- `reservation.test.js` (8 tests): Atomic port holds, double-booking prevention, 15m hold expiration, PIN authentication.
- `bookings.test.js` (6 tests): Booking queries, digital pass generation, cancellation, invoice completion.
- `roles.test.js` (8 tests): Role-based access control for drivers, vendors, and admin routes.

---

## 📡 API Reference Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System health status (`{ ok: true }`) |
| `POST` | `/api/auth/register` | Public | Register new driver account |
| `POST` | `/api/auth/login` | Public | Login with email & password (returns JWT) |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `GET` | `/api/stations` | Public | List all 34 Gujarat EV charging hubs |
| `GET` | `/api/stations/:id` | Public | Station details with dedicated live bays |
| `POST` | `/api/stations/:id/ports/:portId/reserve` | Driver | Hold port for 15 mins with atomic lock |
| `POST` | `/api/stations/:id/ports/:portId/start` | Driver | Activate charger with 4-digit PIN |
| `POST` | `/api/stations/:id/ports/:portId/release` | Driver/Admin | Stop charging session & free bay |
| `POST` | `/api/bookings` | Driver | Create new booking reservation |
| `GET` | `/api/bookings` | Authenticated | List bookings (filtered by user/vendor/admin) |
| `GET` | `/api/bookings/:id/pass` | Driver | View 4-digit PIN pass (CONFIRMED status only) |
| `POST` | `/api/bookings/:id/complete` | Driver/Admin | Finalize session & compute GST tax invoice |
| `GET` | `/api/telematics` | Driver | Retrieve connected car BMS telematics |
| `PUT` | `/api/telematics` | Driver | Update driving physics (battery SoC, speed, odo) |
| `GET` | `/api/vendors/me` | Vendor | Vendor earnings, take-rate, payout balance |
| `POST` | `/api/vendors/me/payouts` | Vendor | Request instant IMPS bank payout |
| `GET` | `/api/admin/stats` | Admin | Real-time statewide network infrastructure KPI |
| `GET` | `/api/users` | Admin | List all registered driver & vendor accounts |
| `POST` | `/api/admin/reset-demo` | Admin | Reset environment back to seed state |

---

## 🔒 Security & Robustness Highlights

- **JWT Authentication**: Passwords hashed with `bcryptjs` (salt rounds: 10). Bearer tokens verified via Express middleware.
- **Role-Based Access Control**: Strict segregation between `driver`, `vendor`, and `admin` roles.
- **Race Condition Prevention**: Port booking uses MongoDB's atomic `findOneAndUpdate` with query `{ "ports.id": portId, "ports.status": "available" }`.
- **Server Derived Pricing**: Platform fee (₹40 4W / ₹15 2W), vendor rates, and 18% GST are calculated exclusively on the server.
- **PIN Security**: PIN is never returned in public APIs; only accessible to the reserving driver on `/api/bookings/:id/pass` during `CONFIRMED` status.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.
