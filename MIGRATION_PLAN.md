# VoltGrid: Migration Plan to a Real MERN Application

This plan tells an AI coding agent exactly how to convert the VoltGrid repository into a genuine MERN application (MongoDB, Express, React, Node) without changing what the product does. Export it as Markdown, save it in the repository root as `MIGRATION_PLAN.md`, and give the agent the prompt below. If the agent offers a plan before coding, approve it only when it matches the current phase.

---

## Prompt to give the agent

> Read `MIGRATION_PLAN.md` completely before changing any file. Then migrate this repository to a MERN application, one phase at a time, exactly as the plan describes. After each phase: run the checks listed for that phase, make one git commit named `'phase N: <title>'`, summarise what changed in ten lines or fewer, and stop until I approve the next phase. Port existing behaviour, do not invent features, and never delete a legacy file before the phase that lists it. If the legacy code contradicts this plan, stop and ask me before deciding.

---

## 1. Current state and goal

### Current state, verified from the files:
- **Six static pages** (`index.html`, `hub.html`, `hubs.html`, `admin.html`, `vendor.html`, `simulator.html`), each with thousands of lines of inline vanilla JavaScript and Tailwind loaded from a CDN. No React runs in any page.
- `voltgrid_db.js` is a browser localStorage database that also syncs to the API. It is the reason different browsers can show different data.
- The `api/` folder holds six Vercel serverless functions (`bookings`, `stations`, `users`, `vendors`, `telematics`, `reset`) that use the native `mongodb` driver. There is no Express and no Mongoose.
- Seven React components (`Header`, `StationSelector`, `PortCard`, `ReservationModal`, `ActiveChargingSession`, `DigitalPassModal`, `OperatorTelemetry`) exist but no page imports them. `mockData.js` is legacy.
- The deployed Atlas data is out of date (3 Delhi stations) while the pages show 34 Gujarat hubs.

### Goal:
A `client/` folder (React) and a `server/` folder (Express and Mongoose) that talk over a REST API, with MongoDB Atlas as the only source of truth, the same features and look as today, and every defect in Section 3 fixed.

### Fixed decisions (do not revisit):
- **Client**: React 18, Vite, React Router 6, Tailwind CSS installed through PostCSS (no CDN).
- **Server**: Node 20, Express 4, Mongoose 8. Both packages use ES modules (set `"type": "module"` in `package.json`).
- **Auth**: JWT bearer tokens and bcrypt password hashes. Roles: `driver`, `vendor`, `admin`.
- **Database**: A new Atlas database named `voltgrid_v2`. The old database named `voltgrid` is never modified.
- **Hosting**: Client on Vercel, server on Render. Next.js is not used, because its route handlers would replace Express.

---

## 2. Ground rules for the agent

1. **Read every legacy file in Section 4 before porting it.** Copy its rules (prices, GST, fees, timers, formulas) instead of guessing, and record each copied rule in `server/src/config/constants.js` with a comment naming the legacy file.
2. **Keep the visual design, the Tailwind classes, the rupee symbol (₹) and en-IN number and date formats.**
3. **Keep every legacy file until Phase 7.** Port one page at a time and verify it before starting the next.
4. **No secrets in git.** Only `.env.example` files are committed. Add `.env` to `.gitignore` before the first commit.
5. **No personal data.** Seed data uses invented names and numbers such as `+91 90000 00001`. Do not copy the real phone number and email that appear in `bookings.js`, the user seed data and the HTML.
6. **Use only the libraries listed in Section 5.** Keep code short, readable and commented in plain English.
7. **Never trust the client for prices, vendor, PIN, status or user identity.** The server computes them.

---

## 3. Defects the new code must not repeat

| Legacy location | Defect | Required behaviour |
| :--- | :--- | :--- |
| `api/stations.js`, migration check | Fewer than 30 stations resets the whole database to defaults | Seed only through a script when the stations collection is empty, never inside a request |
| `api/stations.js`, reserve | No check that the port is available, so double booking is possible | Atomic update that matches status `available` (Section 9.1) |
| `api/stations.js` | All stations live in one document that is read and rewritten per request | One document per station |
| `api/stations.js`, startCharging | PIN checked only when supplied | PIN is mandatory and checked on the server; five wrong attempts lock the booking |
| `api/stations.js` | Any caller can POST a full stations array | No bulk overwrite endpoint; admin-only create, update and delete per station |
| `index.html` PIN logic | PIN compared in the browser, falls back to 1234, and every PIN is sent to every browser | PIN generated and verified only on the server and never in public responses |
| `users.js` and `bookings.js` GET | Anyone can list all users and bookings | Authentication and role filtering (Section 8) |
| `bookings.js` POST | Price taken from the client, default vendor is jiobp | Price and vendor derived on the server from the station |
| `users.js` | USR-count identifiers can repeat | Use the MongoDB ObjectId |
| `reset.js` | Public endpoint wipes data | Admin-only, and disabled in production unless `ALLOW_DEMO_RESET` is true |
| `admin.html`, `vendor.html` | Passwords in client code and printed on screen | Server login with hashed passwords |
| All api files | CORS allows every origin | Allow only `CLIENT_ORIGIN` |
| `telematics.js` | One shared vehicle for every user | One document per user |
| `bookings.js` and the sync engine | Duplicate bookings from repeated POSTs | Idempotency key with a unique index |
| Atlas data | Mixed statuses (`reserved`, `CONFIRMED`, `COMPLETED`) and missing `platformFee` and `vendorPayout` | One status enum and the migration script in Section 12 |
| `api/stations.js`, release | The paid value stays on the port after release | Clear every session field when a port is released |
| `index.html` and `hub.html` | About 5,500 duplicated lines of JavaScript | One React codebase with shared components |

---

## 4. Legacy file map

| Legacy file | Phase | Action |
| :--- | :---: | :--- |
| `index.html` | 6 | Port to `client/src/pages/Home.jsx` (driver app: browse, reserve, checkout, PIN pass, invoice, savings calculator, profile). Delete in Phase 7 |
| `hubs.html` | 6 | Port to `pages/Hubs.jsx` |
| `hub.html` | 6 | Port to `pages/HubDetail.jsx` (route `/hub/:id`). Do not copy the code it duplicates from `index.html`: share components |
| `admin.html` | 6 | Port to `pages/Admin.jsx` behind admin login |
| `vendor.html` | 6 | Port to `pages/Vendor.jsx` behind vendor login. The legacy script has a syntax error around the tariff function (`updateVendorTariff` has lost its function header): implement the intended behaviour, which is changing a station price per kWh |
| `simulator.html` | 6 | Port to `pages/Simulator.jsx` |
| `voltgrid_db.js` | 7 | Delete. Replaced by API calls. localStorage may hold only the JWT |
| `api/*.js` | 1 to 4 | Rewrite as Express routes and Mongoose models, delete in Phase 7 |
| `mockData.js` | 6 | Keep only the vehicle presets as `client/src/constants/vehicles.js`, delete the rest |
| The 7 `.jsx` components | 5 | Move to `client/src/components` and wire to real props (Section 11) |
| `vercel.json`, `vite.config.js` (multi-page), `tailwind.config.js`, `postcss.config.js`, `package.json` | 5 and 7 | Replace by the `client/` and `server/` equivalents |
| `create_hub.cjs`, `resume.html`, `generate_resume_pdf.cjs` | 7 | Delete from the repository (the resume files hold personal data) |

---

## 5. Target structure and dependencies

```text
voltgrid/
  README.md, MIGRATION_PLAN.md, .gitignore
  client/
    index.html            (only a root div and the main.jsx script)
    package.json, vite.config.js, tailwind.config.js, postcss.config.js, vercel.json
    src/
      main.jsx, App.jsx, index.css
      api/        client.js, auth.js, stations.js, bookings.js, users.js, vendors.js, telematics.js, admin.js
      context/    AuthContext.jsx
      hooks/      usePolling.js
      pages/      Home.jsx, Hubs.jsx, HubDetail.jsx, Vendor.jsx, Admin.jsx, Simulator.jsx, Login.jsx, NotFound.jsx
      components/ Header, StationSelector, PortCard, ReservationModal, ActiveChargingSession,
                  DigitalPassModal, ProtectedRoute, Invoice, SavingsCalculator
      lib/        format.js (rupee and date helpers), pricing.js (preview only)
      constants/  vehicles.js
  server/
    package.json, .env.example
    src/
      server.js, app.js
      config/       db.js, constants.js
      models/       User.js, Station.js, Booking.js, Vendor.js, Telematics.js, Payout.js
      routes/       auth.js, stations.js, bookings.js, users.js, vendors.js, telematics.js, admin.js
      controllers/  one file per route file
      middleware/   auth.js, requireRole.js, validate.js, errorHandler.js
      services/     reservationService.js, pricingService.js, expiryService.js
      data/         stations.seed.json, vendors.seed.json
      scripts/      seedStations.js, seedVendors.js, createAdmin.js, migrateLegacy.js
    tests/          reservation.test.js, auth.test.js, bookings.test.js, roles.test.js
```

- **Server dependencies**: `express`, `mongoose`, `cors`, `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `jsonwebtoken`, `bcryptjs`, `zod`, `dotenv`, `morgan`.
  - **Dev dependencies**: `nodemon`, `jest`, `supertest`, `mongodb-memory-server`.
- **Client dependencies**: `react`, `react-dom`, `react-router-dom`, `lucide-react`.
  - **Dev dependencies**: `vite`, `@vitejs/plugin-react`, `tailwindcss` (version 3), `postcss`, `autoprefixer`.
- **Server scripts**: `dev`, `start`, `test`, `seed:stations`, `seed:vendors`, `admin:create`, `migrate:legacy`.
- **Client scripts**: `dev`, `build`, `preview`.

---

## 6. Environment variables

### `server/.env.example`
```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/voltgrid_v2
MONGODB_URI_LEGACY=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/voltgrid
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
HOLD_MINUTES=15
PIN_MAX_ATTEMPTS=5
ALLOW_DEMO_RESET=false
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-me
```

### `client/.env.example`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Database design (Mongoose)

All schemas use timestamps. Field names below are required; copy any extra display fields found in the legacy seed objects (for example `city` or coordinates used by the hub filters).

### Station (one document per hub, about 34 documents)
| Field | Type and rule |
| :--- | :--- |
| `stationId` | String, unique (for example `st-01`) |
| `name`, `type`, `location`, `mapsUrl` | String |
| `pricePerKwh` | Number, rupees |
| `solar` | Boolean |
| `vendorId` | String, matches `Vendor.vendorId` |
| `ports` | Array of: `portId`, `name`, `type`, `maxKw`, `status` (`available`, `reserved`, `charging`, `maintenance`), `bookingId` (ObjectId or null), `reservedBy` (User ObjectId or null), `reservedAt`, `holdExpiresAt`, `startedAt`, `soc`, `kw` |

**Indexes**: `stationId` unique; `vendorId`. A station never stores a PIN or a customer name, phone or email.

### Booking
| Field | Type and rule |
| :--- | :--- |
| `bookingCode` | String, unique, readable (for example `BK-98214`) |
| `user` | User ObjectId |
| `customerName`, `customerPhone`, `customerEmail` | Snapshot copies for invoices |
| `vehicleModel`, `stationId`, `stationName`, `vendorId`, `vendorName`, `portId` | Snapshots |
| `energyKwh`, `pricePerKwh` | Numbers |
| `invoice` | Sub-document with the same line items the legacy checkout shows (energy charge, any convenience fee, GST) and `totalAmount` |
| `platformFee`, `vendorPayout` | Numbers computed on the server |
| `status` | `CONFIRMED`, `CHARGING`, `COMPLETED`, `EXPIRED`, `CANCELLED`, `REFUNDED` |
| `paymentStatus` | String, as legacy (`ESCROW_SETTLED`) |
| `pin` | String, select false (never returned unless explicitly selected) |
| `pinAttempts` | Number, default 0 |
| `holdExpiresAt`, `startedAt`, `completedAt`, `refundedAt`, `refundReason` | Dates and string |
| `idempotencyKey` | String, with a unique compound index on user and idempotencyKey |

**Indexes**: `user` and `createdAt`; `vendorId` and `createdAt`; `stationId`, `portId` and `status`.

### User
- `name`, `email` (unique, lowercase), `phone`, `passwordHash` (select false), `role` (`driver`, `vendor`, `admin`), `vendorId` (vendors only), `car`, `sessionsCount`, `totalKwhCharged`, `totalMoneySaved`, `totalCo2Saved`.

### Vendor
- `vendorId`, `name`, `code`, `logo`, `color`, `contactEmail`, `supportPhone`, `gstin`, `commissionRate` (0.15, and 0.05 for VoltGrid Direct), `bankAccountMasked`, `payoutMethod`, `rating`. Seed from `DEFAULT_VENDORS` in `api/vendors.js` (five vendors); treat the values as sample data.

### Telematics
- `user` (ObjectId, unique) plus every field in the legacy `memoryTelematics` object (`make`, `model`, `year`, `vin`, `battery`, `odometer`, `trip`, `speed`, `gear`, `isDriving`, `esim`, `lastUpdated`).

### Payout
- `payoutId`, `vendorId`, `amount`, `status`, `method`, `referenceNo`.

---

## 8. API contract

All paths start with `/api`. JSON in and out. Errors use the shape `{ error: message }` with these codes: 400 validation, 401 missing or invalid token, 403 wrong role or not the owner, 404 not found, 409 conflict, 423 locked, 429 rate limited.

| Method and path | Access | Behaviour |
| :--- | :--- | :--- |
| `GET /health` | Public | Returns `ok: true` |
| `POST /auth/register` | Public | `name`, `email`, `phone`, `password` (minimum 8) creates a driver; duplicate email gives 409; returns token and user |
| `POST /auth/login` | Public | `email` and `password`; returns token and user |
| `GET /auth/me` | Logged in | Current user |
| `GET /stations` | Public | Sanitised list. No PIN, no customer data. A port the caller reserved carries `isMine: true` |
| `GET /stations/:stationId` | Public | One station, same rules |
| `POST /stations/:stationId/ports/:portId/reserve` | Driver | Body: `vehicleModel`, `energy target`, `idempotencyKey`. Creates the hold and the booking together (Section 9.1). 201 with booking and one-time PIN, or 409 if the port is taken |
| `POST /stations/:stationId/ports/:portId/start` | Booking owner | Body: `pin`. Section 9.3 |
| `POST /stations/:stationId/ports/:portId/release` | Owner or admin | Stops charging and completes the booking (Section 9.4) |
| `PATCH /stations/:stationId` | Vendor of that station or admin | Vendors may change only `pricePerKwh`; admin may change any field |
| `POST /stations` and `DELETE /stations/:stationId` | Admin | Create or delete a hub |
| `GET /bookings` | Logged in | Driver sees own; vendor sees own `vendorId`; admin sees all. Query: `status`, `page`, `limit` (maximum 100) |
| `GET /bookings/:id` | Owner, vendor of the booking, admin | One booking, without PIN |
| `GET /bookings/:id/pass` | Owner | Returns the PIN only while status is `CONFIRMED` |
| `POST /bookings/:id/cancel` | Owner | Cancels a `CONFIRMED` booking, frees the port, marks `REFUNDED` |
| `POST /bookings/:id/refund` | Admin | Marks `REFUNDED` with a reason |
| `GET /users/me` and `PATCH /users/me` | Logged in | Read or edit name, phone, car |
| `GET /users` | Admin | All users |
| `GET /vendors` | Admin | All vendors with revenue statistics |
| `GET /vendors/me` | Vendor | Own statistics: bookings, gross revenue, commission, net earnings, kWh delivered (MongoDB aggregation) |
| `GET` and `POST /vendors/me/payouts` | Vendor | List payouts; request a payout that does not exceed the available balance |
| `GET` and `POST /telematics` | Driver | Read or upsert the caller's own vehicle data (used by the simulator) |
| `GET /admin/stats` | Admin | Counts, revenue and port occupancy computed from the database (replaces the hard-coded metrics) |
| `POST /admin/reset-demo` | Admin | Body must be `confirm` equal to `RESET`; disabled in production unless `ALLOW_DEMO_RESET` is true; re-seeds stations and vendors |

---

## 9. Business rules (server)

### 9.1 Atomic Reservation
Run inside a MongoDB transaction (Atlas supports them):
```javascript
const station = await Station.findOneAndUpdate(
  { stationId, ports: { $elemMatch: { portId, status: 'available' } } },
  { $set: {
      'ports.$.status': 'reserved',
      'ports.$.reservedBy': userId,
      'ports.$.reservedAt': now,
      'ports.$.holdExpiresAt': holdExpiresAt } },
  { new: true, session }
);
if (!station) throw new HttpError(409, 'Port is no longer available');
```
Then create the `Booking` in the same transaction and set `ports.$.bookingId`. If anything fails, the transaction rolls back and the port stays available.

### 9.2 PIN
Generate with `crypto.randomInt(1000, 10000)`. Store it on the booking with `select: false`. It is a short-lived access code protected by attempt limits, so hashing adds little. Return it only in the reserve response and in `GET /bookings/:id/pass` for the owner while the booking is `CONFIRMED`.

### 9.3 Start Charging
Requires the booking owner, status `CONFIRMED`, the current time before `holdExpiresAt`, and a `pin`. A wrong PIN increments `pinAttempts` atomically; at `PIN_MAX_ATTEMPTS` respond `423` and refuse further tries until the hold expires. A correct PIN atomically moves the port to `charging` and the booking to `CHARGING`, matching on status `reserved` and `reservedBy`.

### 9.4 Release
Owner or admin. A charging port becomes `available`, the booking becomes `COMPLETED`, and `energyKwh` and the invoice are recalculated on the server using the legacy charging formula (copy it from `index.html`, including the limit by port `maxKw` and vehicle maximum). Clear every session field on the port: `bookingId`, `reservedBy`, `reservedAt`, `holdExpiresAt`, `startedAt`, `soc`, `kw`.

### 9.5 Hold Expiry
`expiryService` runs once at startup and then every 30 seconds from `server.js`. It finds bookings with status `CONFIRMED` and `holdExpiresAt` in the past. For each, first claim it with `findOneAndUpdate` from `CONFIRMED` to `EXPIRED` (so two runs cannot process it twice), then free the port only if `ports.$.bookingId` still matches, then set `REFUNDED` with `refundReason: "No-show: hold expired"`. The same check also runs at the start of every reserve request for that port, because a free hosting tier can sleep.

### 9.6 Pricing and Money
`pricingService.computeInvoice` takes `energyKwh` and the station `pricePerKwh` and returns the line items. Copy the legacy convenience fee and GST rules exactly. `platformFee` equals `totalAmount` times the vendor `commissionRate`, rounded; `vendorPayout` equals `totalAmount` minus `platformFee`. The client may show a preview but never sends an amount that the server uses.

### 9.7 Idempotency
The client creates one `idempotencyKey` (`crypto.randomUUID()`) each time the reservation modal opens. A repeated request with the same user and key returns the existing booking with status 200 and creates nothing.

### 9.8 Profile Statistics
Keep the legacy rules: `totalMoneySaved` is `Math.round(kWh * 18)` and `totalCo2Saved` is `Math.round(kWh * 1.8)`, incremented when the booking is created, with `sessionsCount` and `totalKwhCharged`.

### 9.9 Allowed Status Changes
- `CONFIRMED` -> `CHARGING` -> `COMPLETED`
- `CONFIRMED` -> `EXPIRED` -> `REFUNDED`
- `CONFIRMED` -> `CANCELLED` -> `REFUNDED`
- `COMPLETED` -> `REFUNDED` (admin only)
- Anything else returns `409`.

---

## 10. Security requirements

1. Use `helmet`. Allow CORS only for `CLIENT_ORIGIN`. Rate limits per IP: 300 requests per 15 minutes in general, 10 per 15 minutes on login and register, 20 per 15 minutes on the start-charging route.
2. Validate every body, query and parameter with `zod` and reject unknown fields.
3. Use `express-mongo-sanitize` and never build a query from raw input.
4. Hash passwords with `bcryptjs` (cost 10), require at least 8 characters, and never return `passwordHash` or `pin` except as stated in Section 9.2.
5. Sign JWTs with `JWT_SECRET`. The `auth` middleware loads the user and the `requireRole` middleware guards each route. A vendor is limited to their own `vendorId` in every query.
6. The error handler returns generic messages in production and never a stack trace. Logs must not contain phone numbers, emails or PINs.
7. Secrets live only in environment variables. If a real credential was ever committed, rotate it in Atlas and remove it from git history.

---

## 11. Client implementation

### 11.1 Routes
| Path | Page | Access |
| :--- | :--- | :--- |
| `/` | Home (driver app) | Public browsing; login required to reserve |
| `/hubs` | Hubs | Public |
| `/hub/:id` | HubDetail | Public |
| `/login` | Login and register | Public |
| `/simulator` | Simulator | Driver |
| `/vendor` | Vendor dashboard | Vendor |
| `/admin` | Admin dashboard | Admin |
| *anything else* | NotFound | Public |

`client/vercel.json` rewrites every path to `/index.html` so refreshing a route works.

### 11.2 Conversion rules from the legacy pages
1. Inline `onclick` attributes become `onClick` handlers.
2. `innerHTML` template strings become JSX components that receive props.
3. Global variables become `useState`, `useReducer` or context. `document.getElementById` becomes state or a ref.
4. `setInterval` becomes `useEffect` with a cleanup function.
5. The Tailwind CDN script is removed. Keep the class names unchanged and load fonts from `client/index.html`.
6. Use a small modal for messages. Use `window.confirm` only before destructive admin actions.

### 11.3 Data fetching
`src/api/client.js` is one fetch wrapper that adds the Authorization header, parses JSON and throws an Error carrying the server message when the response is not ok. On a 401 it clears the token and goes to `/login`. `usePolling(fn, 10000)` refreshes stations on Home and HubDetail, cleans up on unmount and pauses while the tab is hidden. There is no data cache in localStorage.

### 11.4 Auth
`AuthContext` holds token and user. `localStorage` may contain only the key `voltgrid_token`. `ProtectedRoute` takes an optional role and redirects to `/login` when the check fails.

### 11.5 Reusing the seven existing components
| Component | Required change |
| :--- | :--- |
| `Header` | Tabs become links to routes. Remove the hard-coded SLA, grid frequency and MESH version badges, or replace them with real counts from `GET /stations` |
| `StationSelector` | Use a button element for each card and show prices in rupees |
| `PortCard` | Show the start button only when `port.isMine`. Show a countdown from `holdExpiresAt`. Remove the ACID and mutex wording |
| `ReservationModal` | Submit calls the reserve endpoint with one `idempotencyKey` per open. Show the 409 message. Disable submit when no energy is needed. Remove the unused `arrivalWindow` state |
| `ActiveChargingSession` | Stop at the target charge. Cost stops increasing when complete. Call release, then `onComplete` |
| `DigitalPassModal` | Show the PIN from the server response. Remove the default PIN `8492`. If the QR code stays decorative, do not describe it as scannable |
| `OperatorTelemetry` | Remove from the driver app. The Admin page uses `GET /admin/stats`. Delete the technology pills that name Next.js, FastAPI, Redis and GCP Cloud Run |

### 11.6 Wording cleanup
Remove every claim about Redis, ACID, P99 latency, requests per second, uptime or an SLA. The admin database panel shows real data from the API, not a fake connection string. No page may contain a real person name, phone or email. Default checkout text names a Gujarat hub. Receipts use the logged-in user and the chosen vehicle.

### 11.7 Accessibility
Clickable cards are buttons, every input has a label, and modals close with the Escape key.

---

## 12. Seeding and migration scripts

1. `seedStations.js` reads `server/src/data/stations.seed.json`. Generate that file once from the `DEFAULT_STATIONS` array in the legacy `api/stations.js` (the 34 Gujarat hubs). It upserts by `stationId` and skips ports that are reserved or charging.
2. `seedVendors.js` loads the five vendors from `DEFAULT_VENDORS` in `api/vendors.js`.
3. `createAdmin.js` creates one admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. It must not run if that admin already exists.
4. `migrateLegacy.js` is run manually. It connects to `MONGODB_URI_LEGACY` in read-only mode and copies bookings only.
   - Status mapping: `reserved` becomes `CONFIRMED`, `CONFIRMED` stays `CONFIRMED`, `COMPLETED` stays `COMPLETED`, `CHARGING` becomes `COMPLETED`, `REFUNDED` stays `REFUNDED`.
   - Compute any missing `platformFee` and `vendorPayout` with the commission rules.
   - Drop duplicates that share `customerPhone`, `stationId`, `portId` and a `createdAt` within 2 seconds.
   - Mask phone and email on import (keep only the last two digits and the email domain).
   - Users and stations are not migrated: users register again and stations are reseeded.
5. Before running anything against Atlas, export the old collections with Compass (Export Collection) or `mongodump`.

---

## 13. Phases

| Phase | Work | Checks before the commit |
| :---: | :--- | :--- |
| **0 Preparation** | Create branch `migrate-mern`. Back up the old data. Add `.gitignore`. Remove personal data from the repository. Add this plan | `git status` is clean and a search for the real phone and email returns nothing outside the files marked for deletion |
| **1 Server foundation** | `server/` package, config, six models, `app.js` with helmet, cors, rate limits, error handler and `/api/health` | `npm run dev` starts; `GET /api/health` returns 200 |
| **2 Seed and auth** | Seed scripts, `createAdmin`, auth routes, auth and role middleware | Compass shows 34 stations; admin login works; wrong password returns 401; auth tests pass |
| **3 Reservation core** | Station and booking routes, `reservationService`, `expiryService`, `pricingService` | `reservation.test.js` and `bookings.test.js` pass (Section 14) |
| **4 Remaining APIs** | Users, vendors, payouts, telematics, admin stats and reset | `roles.test.js` passes |
| **5 Client scaffold** | Vite app, Tailwind through PostCSS, router, api client, `AuthContext`, `Login`, shared components | `npm run dev` shows the Header; login works against the local API |
| **6 Port the pages** | Order: Hubs, HubDetail, Home, Simulator, Vendor, Admin. One commit per page | The manual checklist for that page passes, compared side by side with the legacy page |
| **7 Cleanup** | Delete every file marked for deletion in Section 4 | Client build passes; no import of `voltgrid_db.js`; `localStorage` appears only for `voltgrid_token`; no personal data anywhere |
| **8 Deploy** | Section 15 | The live checks in Section 15 pass |
| **9 Finish** | Update README and the resume tech line | Section 16 is fully ticked |

---

## 14. Acceptance tests

### Automated (Jest, Supertest, mongodb-memory-server)
1. Ten simultaneous reserve requests for one port produce exactly one 201 and nine 409 responses.
2. A reserve request repeated with the same `idempotencyKey` returns the same booking and creates no second one.
3. Start without a pin returns 400. A wrong pin returns 403. After `PIN_MAX_ATTEMPTS` wrong tries the response is 423.
4. With a short `HOLD_MINUTES`, an unused hold becomes `EXPIRED` then `REFUNDED` and the port is available again.
5. Release clears every session field on the port.
6. A driver calling `GET /users` receives 403. A vendor sees only bookings with their own `vendorId`. A request without a token to `GET /bookings` receives 401.
7. `GET /stations` never contains pin, `customerPhone` or `customerEmail`.
8. The invoice for a known energy amount and price matches the figures the legacy checkout produced.

### Manual, per page:
- The page loads without console errors.
- Every button and form of the legacy page still works.
- Amounts match the legacy page.
- A second browser sees a reservation within about 10 seconds.
- A hard refresh keeps the user logged in.
- A logged-out visitor cannot see bookings or users.

---

## 15. Deployment

1. **Atlas**: Create a database user for `voltgrid_v2` with the `readWrite` role only. In Network Access allow the Render outbound addresses, or `0.0.0.0/0` for a demo.
2. **Render**: New web service from the repository with root directory `server`, build command `npm install`, start command `npm start`. Set every variable from Section 6 (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `HOLD_MINUTES`, `PIN_MAX_ATTEMPTS`, `ALLOW_DEMO_RESET` set to false).
3. Run `seed:vendors`, `seed:stations` and `admin:create` once against the production database from the local machine.
4. **Vercel**: New project with root directory `client` and the Vite preset. Set `VITE_API_URL` to the Render URL followed by `/api`.
5. Set `CLIENT_ORIGIN` on Render to the exact Vercel URL with no trailing slash, then redeploy the server.
6. **Live checks**: `GET /api/health` returns 200; `/api/stations` shows 34 stations; a new user can register, reserve, start with the PIN and release; `GET /api/bookings` without a token returns 401. A free Render service sleeps, so the first request can take about a minute.
7. Keep the old Vercel project until every live check passes.

---

## 16. Definition of done

- [ ] `client/` and `server/` exist and the legacy files from Section 4 are deleted
- [ ] Every defect in Section 3 is fixed
- [ ] All automated tests in Section 14 pass
- [ ] The seven pages work in the React app with the same features and look
- [ ] Only `voltgrid_token` is stored in localStorage
- [ ] No secret and no personal data in the repository
- [ ] Frontend and backend are deployed and the live checks pass
- [ ] README lists the real stack (React, Express, Node.js, MongoDB with Mongoose), the live URLs and how to run both packages
