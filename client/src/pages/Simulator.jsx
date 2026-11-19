import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { getTelematics, updateTelematics } from '../api/telematics';
import { VEHICLE_PRESETS } from '../constants/vehicles';
import { useAuth } from '../context/AuthContext';

export default function Simulator() {
  const { isAuthenticated } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [soc, setSoc] = useState(100);
  const [driveMode, setDriveMode] = useState('NORMAL');
  const [odometer, setOdometer] = useState(14250.0);
  const [tripDistance, setTripDistance] = useState(0.0);
  const [powerKw, setPowerKw] = useState(0.0);
  const [simSyncing, setSimSyncing] = useState(false);

  // Animation frame ref
  const animRef = useRef(null);
  const syncTimeoutRef = useRef(null);

  // Load initial telematics from server if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    async function init() {
      try {
        const data = await getTelematics();
        if (data) {
          const rawSoc =
            typeof data.batterySoC === 'number'
              ? data.batterySoC
              : typeof data.battery?.percentRemaining === 'number'
              ? data.battery.percentRemaining
              : 100;
          setSoc(Math.max(0, Math.min(100, rawSoc)));

          const rawSpeed = typeof data.speed === 'number' ? data.speed : 0;
          setSpeed(rawSpeed);

          const rawOdo =
            typeof data.odometer === 'number'
              ? data.odometer
              : typeof data.odometer?.totalKm === 'number'
              ? data.odometer.totalKm
              : 14250.0;
          setOdometer(rawOdo);

          if (data.driveMode) setDriveMode(data.driveMode);
          if (data.vehicleModel) {
            const found = VEHICLE_PRESETS.find((v) => v.model === data.vehicleModel);
            if (found) setSelectedVehicle(found);
          }
        }
      } catch (err) {
        // Silently continue with local defaults
      }
    }
    init();
  }, []);

  // Sync to API with debounce
  const syncToServer = (newSoc, newSpeed, newOdo, newMode) => {
    if (!isAuthenticated) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        setSimSyncing(true);
        await updateTelematics({
          batterySoC: Math.max(0, Math.min(100, Math.round(newSoc))),
          speed: Math.round(newSpeed),
          odometer: Math.round(newOdo * 10) / 10,
          rangeRemaining: Math.round((newSoc / 100) * (selectedVehicle.rangeKm || 450)),
          driveMode: newMode,
          vehicleModel: selectedVehicle.model
        });
      } catch (e) {
        // quiet error
      } finally {
        setSimSyncing(false);
      }
    }, 1000);
  };

  // Driving physics tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSpeed((prevSpeed) => {
        if (prevSpeed <= 0) return 0;

        // Drain battery based on speed and drive mode
        const multiplier = driveMode === 'SPORT' ? 1.4 : driveMode === 'ECO' ? 0.7 : 1.0;
        const drain = (prevSpeed / 3600) * 0.15 * multiplier;

        setSoc((prevSoc) => {
          const nextSoc = Math.max(0, prevSoc - drain);
          if (nextSoc <= 0) {
            setIsRunning(false);
            return 0;
          }
          return nextSoc;
        });

        // Advance odometer
        const distKm = (prevSpeed / 3600);
        setOdometer((prev) => {
          const nextOdo = prev + distKm;
          syncToServer(soc - drain, prevSpeed, nextOdo, driveMode);
          return nextOdo;
        });

        setTripDistance((prev) => prev + distKm);

        // Power draw in kW
        setPowerKw(Math.round((prevSpeed * 0.45 * multiplier) * 10) / 10);

        return prevSpeed;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning, driveMode, soc, selectedVehicle]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setSpeed(0);
      setPowerKw(0);
      syncToServer(soc, 0, odometer, driveMode);
    } else {
      if (soc <= 0) {
        alert('Battery fully depleted. Please recharge before driving!');
        return;
      }
      setIsRunning(true);
      setSpeed(45);
      setPowerKw(18.2);
    }
  };

  const handleAccelerate = () => {
    if (!isRunning) setIsRunning(true);
    setSpeed((s) => {
      const next = Math.min(160, s + 15);
      syncToServer(soc, next, odometer, driveMode);
      return next;
    });
  };

  const handleBrake = () => {
    setSpeed((s) => {
      const next = Math.max(0, s - 20);
      // regenerative brake adds back a tiny fraction
      setSoc((b) => Math.min(100, b + 0.1));
      syncToServer(soc + 0.1, next, odometer, driveMode);
      return next;
    });
  };

  const handleCruise = () => {
    if (!isRunning) setIsRunning(true);
    setSpeed(80);
    syncToServer(soc, 80, odometer, driveMode);
  };

  const handleRefill100 = async () => {
    setSoc(100);
    setSpeed(0);
    setIsRunning(false);
    setPowerKw(0);
    try {
      await updateTelematics({
        batterySoC: 100,
        speed: 0,
        odometer: Math.round(odometer * 10) / 10,
        rangeRemaining: selectedVehicle.rangeKm || 450,
        driveMode,
        vehicleModel: selectedVehicle.model
      });
      alert('⚡ Battery fully recharged to 100% via simulated charging port!');
    } catch (e) {
      alert('Error updating battery: ' + e.message);
    }
  };

  const estimatedRange = Math.round((soc / 100) * (selectedVehicle.rangeKm || 450));

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Cockpit Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0d1322] border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                4G eSIM Telematics Bus Online
              </span>
              {simSyncing && (
                <span className="text-[10px] font-mono text-amber-400">Syncing...</span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-white font-heading mt-1">
              EV Cockpit & Telematics Simulator
            </h1>
            <p className="text-xs text-slate-400">
              Simulate driving battery depletion, speed physics, and real-time synchronization with VoltGrid corridor network.
            </p>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2">
            <span className="text-xs text-slate-400 font-bold">Model:</span>
            <select
              value={selectedVehicle.model}
              onChange={(e) => {
                const found = VEHICLE_PRESETS.find((v) => v.model === e.target.value);
                if (found) setSelectedVehicle(found);
              }}
              className="bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer"
            >
              {VEHICLE_PRESETS.map((v) => (
                <option key={v.model} value={v.model} className="bg-slate-900 text-white">
                  {v.model} ({v.batteryKwh} kWh • {v.rangeKm} km)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Grid: Cockpit Animated View & BMS Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Animated Road & Speedometer Panel */}
          <div className="lg:col-span-2 rounded-3xl bg-[#0d1322] border border-slate-800 p-6 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚗</span>
                <span className="font-bold text-white text-sm">{selectedVehicle.model}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedVehicle.connector}
                </span>
              </div>

              {/* Drive Mode Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                {['ECO', 'NORMAL', 'SPORT'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setDriveMode(m)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      driveMode === m
                        ? m === 'SPORT'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : m === 'ECO'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Virtual Road Display */}
            <div className="relative h-48 w-full rounded-2xl bg-[#0b1120] border-2 border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Yellow road center divider */}
              <div
                className={`absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-yellow-400 ${
                  isRunning && speed > 0 ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, #facc15 0px, #facc15 24px, transparent 24px, transparent 48px)'
                }}
              ></div>

              {/* Vehicle icon in center */}
              <div className="relative z-10 text-center">
                <div
                  className={`text-6xl transition-transform duration-200 ${
                    isRunning && speed > 0 ? 'scale-110 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]' : 'opacity-70'
                  }`}
                >
                  🚗
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold mt-2 block">
                  {isRunning ? `${speed} km/h • ${driveMode} MODE` : 'ENGINE IDLE'}
                </span>
              </div>
            </div>

            {/* Driving Controls Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                onClick={handleStartStop}
                className={`py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  isRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                }`}
              >
                <span>{isRunning ? '🛑 Stop Engine' : '⚡ Start Engine'}</span>
              </button>

              <button
                onClick={handleAccelerate}
                className="py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>🚀 Accelerate (+15)</span>
              </button>

              <button
                onClick={handleBrake}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>🛑 Regenerative Brake</span>
              </button>

              <button
                onClick={handleCruise}
                className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <span>🧭 Cruise (80 km/h)</span>
              </button>
            </div>
          </div>

          {/* Battery State of Charge (BMS) Panel */}
          <div className="rounded-3xl bg-[#0d1322] border border-slate-800 p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  BMS Live Pack Telematics
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    soc > 20
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                  }`}
                >
                  {soc > 20 ? 'NORMAL SOC' : 'LOW BATTERY'}
                </span>
              </div>

              {/* Circular Gauge */}
              <div className="flex flex-col items-center justify-center py-6">
                <div
                  className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center bg-slate-900/90 shadow-inner ${
                    soc > 40
                      ? 'border-emerald-500/40 text-emerald-400'
                      : soc > 20
                      ? 'border-amber-500/40 text-amber-400'
                      : 'border-rose-500/60 text-rose-400'
                  }`}
                >
                  <span className="font-heading font-black text-4xl tracking-tight">
                    {Math.round(soc)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase mt-0.5">
                    State of Charge
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-4">
                  <div
                    className={`h-full transition-all duration-300 ${
                      soc > 40
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                        : soc > 20
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${soc}%` }}
                  ></div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xs text-slate-400">Estimated Range: </span>
                  <strong className="text-white font-mono text-base">{estimatedRange} km</strong>
                </div>
              </div>
            </div>

            {/* Pack Telemetry Matrix */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Pack Voltage</span>
                <strong className="text-slate-200">398.5 V</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Pack Temp</span>
                <strong className="text-slate-200">28.4 °C</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Battery Size</span>
                <strong className="text-cyan-400">{selectedVehicle.batteryKwh} kWh</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Power Draw</span>
                <strong className="text-emerald-400">{powerKw} kW</strong>
              </div>
            </div>

            {/* Fast Charge Refill */}
            <button
              onClick={handleRefill100}
              className="w-full py-2.5 rounded-xl font-mono font-bold text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 transition-all flex items-center justify-center gap-1.5"
            >
              <span>🔌</span> Plug Simulated Charger (Refill 100%)
            </button>
          </div>
        </div>

        {/* Odometer & Trip Computer */}
        <div className="p-6 rounded-3xl bg-[#0d1322] border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="font-heading font-extrabold text-sm text-white">
                4G eSIM Onboard Trip Computer
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              VIN: <strong className="text-white">1MGZS48EV20265921</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-mono font-bold block">
                Total Lifetime Odometer
              </span>
              <div className="text-2xl font-mono font-black text-white mt-1">
                {(Number(odometer) || 14250.0).toFixed(1)} <span className="text-xs text-slate-400">km</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-mono font-bold block">
                Trip Distance Driven
              </span>
              <div className="text-2xl font-mono font-black text-cyan-400 mt-1">
                {(Number(tripDistance) || 0.0).toFixed(2)} <span className="text-xs text-slate-400">km</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-mono font-bold block">
                Average Speed
              </span>
              <div className="text-2xl font-mono font-black text-emerald-400 mt-1">
                {isRunning ? speed : 0} <span className="text-xs text-slate-400">km/h</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] uppercase font-mono font-bold block">
                CO2 Emissions Avoided
              </span>
              <div className="text-2xl font-mono font-black text-purple-400 mt-1">
                {((tripDistance * 140) / 1000).toFixed(2)}{' '}
                <span className="text-xs text-slate-400">kg</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
