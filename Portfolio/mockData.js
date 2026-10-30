export const INITIAL_STATIONS = [
  {
    id: 'st-01',
    name: 'HyperCharge Hub - Expressway Exit 14',
    location: 'North Corridor Hwy, Mile 42',
    type: 'Highway Ultra-Hub',
    gridPower: '800V DC Hypergrid',
    solarPowered: true,
    pricePerKwh: 0.34,
    ports: [
      { id: 'P-101', name: 'Port 01', type: 'CCS2 Ultra-Fast', maxKw: 350, status: 'available', currentVehicle: null, chargePercent: 0, reservedBy: null, lockExpiresAt: null },
      { id: 'P-102', name: 'Port 02', type: 'CCS2 Ultra-Fast', maxKw: 350, status: 'charging', currentVehicle: 'Porsche Taycan', chargePercent: 68, powerKw: 265, kwDelivered: 42.1, timeRemainingMin: 9, reservedBy: null, lockExpiresAt: null },
      { id: 'P-103', name: 'Port 03', type: 'CCS2 Fast', maxKw: 150, status: 'reserved', currentVehicle: 'Tesla Model Y', chargePercent: 32, reservedBy: 'Tenant #VG-9182', lockExpiresAt: 12 },
      { id: 'P-104', name: 'Port 04', type: 'CCS2 Fast', maxKw: 150, status: 'available', currentVehicle: null, chargePercent: 0, reservedBy: null, lockExpiresAt: null },
      { id: 'P-105', name: 'Port 05', type: 'CHAdeMO / CCS2', maxKw: 100, status: 'charging', currentVehicle: 'Nissan Leaf', chargePercent: 88, powerKw: 48, kwDelivered: 31.4, timeRemainingMin: 6, reservedBy: null, lockExpiresAt: null },
      { id: 'P-106', name: 'Port 06', type: 'Type 2 AC', maxKw: 22, status: 'maintenance', currentVehicle: null, chargePercent: 0, reservedBy: null, lockExpiresAt: null },
    ]
  },
  {
    id: 'st-02',
    name: 'Nexus City Mall - Sub-Level 2 Grid',
    location: 'Downtown Commercial Sector, Bay 4',
    type: 'Urban Destination',
    gridPower: '400V 3-Phase Commercial',
    solarPowered: false,
    pricePerKwh: 0.28,
    ports: [
      { id: 'P-201', name: 'Port 01', type: 'CCS2 Ultra-Fast', maxKw: 180, status: 'charging', currentVehicle: 'Hyundai Ioniq 5', chargePercent: 44, powerKw: 172, kwDelivered: 28.6, timeRemainingMin: 14, reservedBy: null, lockExpiresAt: null },
      { id: 'P-202', name: 'Port 02', type: 'CCS2 Ultra-Fast', maxKw: 180, status: 'available', currentVehicle: null, chargePercent: 0, reservedBy: null, lockExpiresAt: null },
      { id: 'P-203', name: 'Port 03', type: 'Type 2 Fast AC', maxKw: 43, status: 'available', currentVehicle: null, chargePercent: 0, reservedBy: null, lockExpiresAt: null },
      { id: 'P-204', name: 'Port 04', type: 'Type 2 AC', maxKw: 22, status: 'reserved', currentVehicle: 'BMW i4', chargePercent: 20, reservedBy: 'Tenant #VG-7411', lockExpiresAt: 8 },
    ]
  },
  {
    id: 'st-03',
    name: 'CyberPark Tech Corridor Hub',
    location: 'Innovation Blvd, Building Delta',
    type: 'Corporate Campus',
    gridPower: '100% Renewable Microgrid',
    solarPowered: true,
    pricePerKwh: 0.25,
    ports: [
      { id: 'P-301', name: 'Port 01', type: 'CCS2 Ultra-Fast', maxKw: 240, status: 'available', currentVehicle: null, chargePercent: 0, reservedBy: null, lockExpiresAt: null },
      { id: 'P-302', name: 'Port 02', type: 'CCS2 Fast', maxKw: 120, status: 'charging', currentVehicle: 'Tata Nexon EV', chargePercent: 79, powerKw: 60, kwDelivered: 22.4, timeRemainingMin: 11, reservedBy: null, lockExpiresAt: null },
      { id: 'P-303', name: 'Port 03', type: 'CCS2 Fast', maxKw: 120, status: 'available', currentVehicle: null, chargePercent: 0, reservedBy: null, lockExpiresAt: null },
    ]
  }
];

export const VEHICLE_PRESETS = [
  // 4-Wheelers
  { id: 'v1', name: 'Tata Nexon EV Max', batteryKwh: 40.5, maxChargeKw: 60, connector: 'CCS2', type: '4W' },
  { id: 'v2', name: 'Tata Punch EV', batteryKwh: 35.0, maxChargeKw: 50, connector: 'CCS2', type: '4W' },
  { id: 'v3', name: 'MG ZS EV', batteryKwh: 50.3, maxChargeKw: 80, connector: 'CCS2', type: '4W' },
  { id: 'v4', name: 'Hyundai Ioniq 5', batteryKwh: 77.4, maxChargeKw: 350, connector: 'CCS2', type: '4W' },
  { id: 'v5', name: 'Mahindra XUV400', batteryKwh: 39.4, maxChargeKw: 50, connector: 'CCS2', type: '4W' },
  { id: 'v6', name: 'Tesla Model 3 Long Range', batteryKwh: 82, maxChargeKw: 250, connector: 'CCS2', type: '4W' },
  // 2-Wheelers
  { id: 'v7', name: 'Ather 450X Gen 3', batteryKwh: 3.7, maxChargeKw: 3.3, connector: 'Ather Type 6', type: '2W' },
  { id: 'v8', name: 'Ola S1 Pro Gen 2', batteryKwh: 4.0, maxChargeKw: 3.0, connector: '16A Smart Socket', type: '2W' },
  { id: 'v9', name: 'TVS iQube ST', batteryKwh: 3.4, maxChargeKw: 1.5, connector: '16A Smart Socket', type: '2W' },
  { id: 'v10', name: 'Bajaj Chetak EV', batteryKwh: 3.2, maxChargeKw: 1.5, connector: '16A Smart Socket', type: '2W' }
];
