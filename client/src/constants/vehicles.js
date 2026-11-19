export const VEHICLES = {
  // 4-Wheelers (Cars & SUVs)
  'Tata Nexon EV Max': { battery: 40.5, speed: 60, efficiency: 7.2, type: '4W', connector: 'CCS2' },
  'Tata Punch EV': { battery: 35.0, speed: 50, efficiency: 7.8, type: '4W', connector: 'CCS2' },
  'MG ZS EV': { battery: 50.3, speed: 80, efficiency: 6.8, type: '4W', connector: 'CCS2' },
  'Mahindra XUV400': { battery: 39.4, speed: 50, efficiency: 6.9, type: '4W', connector: 'CCS2' },
  'Hyundai Ioniq 5': { battery: 77.4, speed: 350, efficiency: 6.2, type: '4W', connector: 'CCS2' },
  'BYD Atto 3': { battery: 60.5, speed: 80, efficiency: 6.5, type: '4W', connector: 'CCS2' },
  'Tesla Model 3 Long Range': { battery: 82.0, speed: 250, efficiency: 6.5, type: '4W', connector: 'CCS2' },
  'Porsche Taycan 4S': { battery: 93.4, speed: 270, efficiency: 5.5, type: '4W', connector: 'CCS2' },

  // 2-Wheelers (E-Scooters & E-Motorcycles)
  'Ather 450X Gen 3': { battery: 3.7, speed: 3.3, efficiency: 30.0, type: '2W', connector: 'Ather Type 6' },
  'Ola S1 Pro Gen 2': { battery: 4.0, speed: 3.0, efficiency: 35.0, type: '2W', connector: '16A Smart Socket' },
  'TVS iQube ST': { battery: 3.4, speed: 1.5, efficiency: 30.0, type: '2W', connector: '16A Smart Socket' },
  'Bajaj Chetak EV': { battery: 3.2, speed: 1.5, efficiency: 28.0, type: '2W', connector: '16A Smart Socket' },
  'Ultraviolette F77': { battery: 10.3, speed: 3.3, efficiency: 20.0, type: '2W', connector: 'Type 2' }
};

export const DEFAULT_VEHICLE = 'MG ZS EV';

export const VEHICLE_PRESETS = Object.entries(VEHICLES).map(([model, data]) => ({
  model,
  batteryKwh: data.battery,
  rangeKm: Math.round(data.battery * data.efficiency),
  ...data
}));
