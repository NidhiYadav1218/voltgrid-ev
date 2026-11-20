import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getStations } from '../api/stations';
import { formatRupee } from '../lib/format';
import { VEHICLE_PRESETS } from '../constants/vehicles';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Navigation,
  Clock,
  Gauge,
  Coffee,
  FileText,
  Headphones,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Car,
  Download,
  PhoneCall,
  Sparkles,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function SmartFeatures() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Active Tool Tab: 'planner' | 'flux' | 'lock' | 'amenities' | 'invoice' | 'sos'
  const [activeTab, setActiveTab] = useState('planner');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Module 1: Corridor Trip Planner State
  const [startCity, setStartCity] = useState('Ahmedabad');
  const [destCity, setDestCity] = useState('Surat');
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0]);
  const [startSoc, setStartSoc] = useState(85);

  // Module 2: Flux Power Balancer State
  const [fluxStationId, setFluxStationId] = useState('');
  const [fluxMode, setFluxMode] = useState('SOLO'); // 'SOLO' (Max Boost) or 'SHARED'

  // Module 3: 15-Min Bay PIN Lock State
  const [lockStationId, setLockStationId] = useState('');
  const [lockedPort, setLockedPort] = useState(null);
  const [lockPin, setLockPin] = useState('7492');
  const [pinTimer, setPinTimer] = useState(895); // seconds
  const [keypadInput, setKeypadInput] = useState('');
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  // Module 4: Amenities Explorer State
  const [amenityStationId, setAmenityStationId] = useState('');

  // Module 5: Tax Invoice Calculator State
  const [invoiceStationId, setInvoiceStationId] = useState('');
  const [energyUnits, setEnergyUnits] = useState(28.5);

  // Module 6: SOS Roadside Dispatch State
  const [sosRequested, setSosRequested] = useState(false);

  useEffect(() => {
    async function fetchRealStations() {
      try {
        setLoading(true);
        const data = await getStations();
        const list = Array.isArray(data) ? data.slice(0, 10) : [];
        setStations(list);
        if (list.length > 0) {
          setFluxStationId(list[0].id);
          setLockStationId(list[0].id);
          setLockedPort(list[0].ports?.[0] || null);
          setAmenityStationId(list[0].id);
          setInvoiceStationId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load stations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRealStations();
  }, []);

  // Timer countdown for Module 3 (PIN Lock)
  useEffect(() => {
    if (pinTimer <= 0 || unlockedSuccess) return;
    const interval = setInterval(() => {
      setPinTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [pinTimer, unlockedSuccess]);

  // City routes coordinates and distances
  const CORRIDOR_ROUTES = {
    'Ahmedabad-Surat': { distanceKm: 268, estTime: '3h 45m', recommendedStopId: 'st-03' },
    'Ahmedabad-Vadodara': { distanceKm: 112, estTime: '1h 30m', recommendedStopId: 'st-03' },
    'Ahmedabad-Rajkot': { distanceKm: 215, estTime: '3h 15m', recommendedStopId: 'st-07' },
    'Ahmedabad-Gandhinagar': { distanceKm: 32, estTime: '45m', recommendedStopId: 'st-02' },
    'Vadodara-Surat': { distanceKm: 156, estTime: '2h 15m', recommendedStopId: 'st-06' },
    'Surat-Vapi': { distanceKm: 118, estTime: '1h 45m', recommendedStopId: 'st-08' },
    'Rajkot-Junagadh': { distanceKm: 104, estTime: '1h 50m', recommendedStopId: 'st-09' }
  };

  const routeKey = `${startCity}-${destCity}`;
  const routeData = CORRIDOR_ROUTES[routeKey] || {
    distanceKm: 240,
    estTime: '3h 20m',
    recommendedStopId: stations[2]?.id || 'st-03'
  };

  // Calculations for Route Planner
  const vehicleRange = selectedVehicle.rangeKm || 400;
  const energyConsumptionKwh = Math.round((routeData.distanceKm / vehicleRange) * (selectedVehicle.batteryKwh || 50));
  const estimatedArrivalSoc = Math.max(0, startSoc - Math.round((routeData.distanceKm / vehicleRange) * 100));
  const needsCharging = estimatedArrivalSoc < 20;

  // Selected station for Module 2 (Flux)
  const selectedFluxStation = stations.find((s) => s.id === fluxStationId) || stations[0];
  const maxBayKw = selectedFluxStation?.ports?.[0]?.maxKw || 150;
  const activeFluxKw = fluxMode === 'SOLO' ? maxBayKw : Math.round(maxBayKw * 0.6);
  const timeTo80 = Math.round(((selectedVehicle.batteryKwh || 50) * 0.7) / (activeFluxKw / 60));

  // Selected station for Module 4 (Amenities)
  const selectedAmenityStation = stations.find((s) => s.id === amenityStationId) || stations[0];

  // Selected station for Module 5 (Invoice)
  const selectedInvoiceStation = stations.find((s) => s.id === invoiceStationId) || stations[0];
  const baseTariff = selectedInvoiceStation?.pricePerKwh || 24;
  const energyCost = Math.round(energyUnits * baseTariff * 100) / 100;
  const gstAmount = Math.round(energyCost * 0.18 * 100) / 100;
  const totalInvoiceAmount = Math.round((energyCost + gstAmount) * 100) / 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
      <Header />

      {/* Hero Header */}
      <div className="relative border-b border-slate-900 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Live Gujarat Supergrid Tools</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white">
            Powerful Features at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Your Fingertips
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Experience the real interactive tools running Gujarat's EV corridors. Select real stations, test dynamic power allocation, plan expressway charging stops, and simulate 15-min bay locks.
          </p>

          {/* Interactive Tool Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: 'planner', label: 'Corridor Planner', icon: Navigation },
              { id: 'flux', label: 'Dynamic Flux (350kW)', icon: Zap },
              { id: 'lock', label: '15-Min PIN Lock', icon: Clock },
              { id: 'amenities', label: 'Food & Amenities', icon: Coffee },
              { id: 'invoice', label: 'GST Tax Invoicing', icon: FileText },
              { id: 'sos', label: '24x7 Roadside SOS', icon: Headphones }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Loading real ports from 10 Gujarat SuperHubs...
            </p>
          </div>
        ) : (
          <div>
            {/* ============================================================== */}
            {/* MODULE 1: SMART HIGHWAY CORRIDOR TRIP PLANNER                  */}
            {/* ============================================================== */}
            {activeTab === 'planner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                {/* Control Panel */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Navigation className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">Gujarat Highway Corridor Planner</h3>
                      <p className="text-xs text-slate-400">Calculate battery consumption & locate real charging stops</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Departure City</label>
                        <select
                          value={startCity}
                          onChange={(e) => setStartCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Vadodara">Vadodara</option>
                          <option value="Surat">Surat</option>
                          <option value="Rajkot">Rajkot</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Destination City</label>
                        <select
                          value={destCity}
                          onChange={(e) => setDestCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="Surat">Surat (NH48)</option>
                          <option value="Vadodara">Vadodara (NE1)</option>
                          <option value="Rajkot">Rajkot (NH47)</option>
                          <option value="Gandhinagar">Gandhinagar (GIFT)</option>
                          <option value="Vapi">Vapi (South Corridor)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 font-bold block mb-1">Electric Vehicle Model</label>
                      <select
                        value={selectedVehicle.model}
                        onChange={(e) => {
                          const found = VEHICLE_PRESETS.find((v) => v.model === e.target.value);
                          if (found) setSelectedVehicle(found);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {VEHICLE_PRESETS.map((v) => (
                          <option key={v.model} value={v.model}>
                            {v.model} ({v.rangeKm} km Range • {v.batteryKwh} kWh)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-300 font-bold">Departure Battery SoC:</span>
                        <span className="font-mono font-bold text-emerald-400">{startSoc}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={startSoc}
                        onChange={(e) => setStartSoc(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Trip Summary Card */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Corridor Distance:</span>
                      <span className="text-white font-bold">{routeData.distanceKm} km</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Driving Time:</span>
                      <span className="text-white font-bold">{routeData.estTime}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Energy Required:</span>
                      <span className="text-cyan-400 font-bold">{energyConsumptionKwh} kWh</span>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                      <span>Arrival SoC (without charge):</span>
                      <span className={`font-bold ${estimatedArrivalSoc < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {estimatedArrivalSoc}% {estimatedArrivalSoc < 20 ? '⚠️ LOW' : '✓ OK'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Route Result & Real Charging Bays */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                      OPTIMAL CHARGING STOP RECOMMENDATION
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-2">
                      {routeData.recommendedStopId
                        ? stations.find((s) => s.id === routeData.recommendedStopId)?.name || 'Highway Express Hub'
                        : 'Vadodara NE1 Express Fast Terminal'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Strategically located midway with real-time available bays and on-site expressway dining.
                    </p>
                  </div>

                  {/* Real Station Ports Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>REAL ACTIVE BAYS AT THIS HUB:</span>
                      <span className="text-emerald-400 font-bold">● Ready for 15-Min Lock</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(stations.find((s) => s.id === routeData.recommendedStopId) || stations[0])?.ports?.map((port) => (
                        <div
                          key={port.portId}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-white text-xs">{port.name}</p>
                              <span className="text-[10px] font-mono text-cyan-400 font-bold">{port.type}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {port.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                            <span className="text-slate-400 font-mono">Connector: {port.connector}</span>
                            <Link
                              to="/"
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] transition-all"
                            >
                              Lock Bay →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 2: DYNAMIC FLUX 350kW POWER BALANCER                     */}
            {/* ============================================================== */}
            {activeTab === 'flux' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Zap className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">Dynamic Flux 350kW Balancer</h3>
                      <p className="text-xs text-slate-400">Simulate intelligent grid throughput splitting</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1">Select Real Gujarat Station</label>
                    <select
                      value={fluxStationId}
                      onChange={(e) => setFluxStationId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      {stations.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.ports?.[0]?.maxKw || 150}kW Max)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mode Selector */}
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1.5">Flux Allocation Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFluxMode('SOLO')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          fluxMode === 'SOLO'
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <p className="font-bold text-xs">⚡ Solo Max Boost</p>
                        <p className="text-[10px] mt-0.5 text-slate-400">100% power to 1 bay</p>
                      </button>

                      <button
                        onClick={() => setFluxMode('SHARED')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          fluxMode === 'SHARED'
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <p className="font-bold text-xs">🔄 Dual Balanced</p>
                        <p className="text-[10px] mt-0.5 text-slate-400">Shared between 2 cars</p>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Grid Input Capacity:</span>
                      <span className="text-white font-bold">{maxBayKw} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Delivered to Vehicle:</span>
                      <span className="text-cyan-400 font-bold">{activeFluxKw} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">10% → 80% Charge Time:</span>
                      <span className="text-emerald-400 font-bold">~{timeTo80} minutes</span>
                    </div>
                  </div>
                </div>

                {/* Animated Power Gauge Visualizer */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#06b6d4"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * (activeFluxKw / maxBayKw))}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black font-mono text-white tracking-tight">{activeFluxKw}</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">kW Output</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {fluxMode === 'SOLO' ? '⚡ Peak Dynamic Flux Active' : '🔄 Smart Dynamic Load Sharing Active'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      {fluxMode === 'SOLO'
                        ? 'The adjacent bay is unoccupied. Flux directs full 100% capacity straight into your CCS-2 port.'
                        : 'Two EVs connected simultaneously. Flux splits grid capacity intelligently to prevent power drops.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 3: 15-MIN GUARANTEED SLOT LOCK SIMULATOR                 */}
            {/* ============================================================== */}
            {activeTab === 'lock' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base">Your Active 15-Min Guaranteed Pass</h3>
                      <p className="text-xs text-slate-400">Bay is physically locked with a 4-digit PIN</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1">Station Hub</label>
                    <select
                      value={lockStationId}
                      onChange={(e) => {
                        setLockStationId(e.target.value);
                        const st = stations.find((s) => s.id === e.target.value);
                        setLockedPort(st?.ports?.[0] || null);
                        setUnlockedSuccess(false);
                        setKeypadInput('');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    >
                      {stations.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PIN Display */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                    <span className="text-[10px] font-mono text-amber-400 font-bold tracking-widest uppercase">
                      4-DIGIT ACTIVATION PIN
                    </span>
                    <div className="flex justify-center gap-2.5">
                      {lockPin.split('').map((d, i) => (
                        <span
                          key={i}
                          className="w-10 h-12 rounded-xl bg-amber-500 text-slate-950 text-2xl font-black font-mono flex items-center justify-center shadow-lg shadow-amber-500/20"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      ⏱️ Time Remaining:{' '}
                      <strong className="text-amber-400">
                        {Math.floor(pinTimer / 60)}:{(pinTimer % 60).toString().padStart(2, '0')}
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    No other driver can plug in while this timer runs. Try punching this PIN into the simulated charger screen on the right!
                  </p>
                </div>

                {/* Virtual Charger Touchscreen Terminal */}
                <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center">
                  <div className="w-full max-w-xs bg-slate-950 border-4 border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-slate-800 pb-2">
                      <span className="text-emerald-400 font-bold">⚡ GUJARAT SUPERGRID TERMINAL</span>
                      <span className="text-slate-400">BAY #01</span>
                    </div>

                    {unlockedSuccess ? (
                      <div className="py-6 text-center space-y-3 animate-fade-in">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-white">PIN Verified!</h4>
                        <p className="text-[11px] text-emerald-400 font-mono">Port Lock Released • Connect Cable</p>
                        <button
                          onClick={() => {
                            setUnlockedSuccess(false);
                            setKeypadInput('');
                          }}
                          className="text-xs text-slate-400 hover:text-white underline mt-2"
                        >
                          Reset Test
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-[11px] text-slate-300 font-bold">Enter 4-Digit Bay PIN</p>
                          <div className="h-10 mt-2 bg-slate-900 rounded-xl flex items-center justify-center text-lg font-mono font-bold tracking-widest text-white border border-slate-700">
                            {keypadInput || '----'}
                          </div>
                        </div>

                        {/* Charger Screen Keypad */}
                        <div className="grid grid-cols-3 gap-2">
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((key) => (
                            <button
                              key={key}
                              onClick={() => {
                                if (key === 'C') setKeypadInput('');
                                else if (key === 'OK') {
                                  if (keypadInput === lockPin) setUnlockedSuccess(true);
                                  else alert('Invalid PIN! Try ' + lockPin);
                                } else if (keypadInput.length < 4) {
                                  setKeypadInput((prev) => prev + key);
                                }
                              }}
                              className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold text-sm border border-slate-800 transition-all cursor-pointer active:scale-95"
                            >
                              {key}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 4: CORRIDOR AMENITIES & FOOD PLAZA EXPLORER              */}
            {/* ============================================================== */}
            {activeTab === 'amenities' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white font-heading">
                      Explore Amenities Along Gujarat Corridors
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Verified highway dining, restrooms, and coffee lounges while your EV supercharges.
                    </p>
                  </div>

                  <div className="w-full md:w-80">
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">Select Station Hub:</label>
                    <select
                      value={amenityStationId}
                      onChange={(e) => setAmenityStationId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                    >
                      {stations.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amenities Grid for Selected Station */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(selectedAmenityStation.amenities || [
                    '24x7 Highway Cafe',
                    'Clean Restrooms',
                    'Free Wi-Fi',
                    'EV Lounge'
                  ]).map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 text-lg">
                          ☕
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white">{amenity}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Located on-site • &lt; 50m walking
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        OPEN
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 5: INSTANT GST TAX INVOICING & SAC 998714                */}
            {/* ============================================================== */}
            {activeTab === 'invoice' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-base">GST Tax Receipt Generator</h3>
                  <p className="text-xs text-slate-400">Calculate live tax credit breakdown for any charging session.</p>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs text-slate-300 font-bold block mb-1">Select Station</label>
                      <select
                        value={invoiceStationId}
                        onChange={(e) => setInvoiceStationId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      >
                        {stations.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} (₹{s.pricePerKwh}/kWh)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-300 font-bold">Energy Charged (kWh):</span>
                        <span className="font-mono font-bold text-emerald-400">{energyUnits} kWh</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        step="0.5"
                        value={energyUnits}
                        onChange={(e) => setEnergyUnits(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Printable GST Tax Receipt Preview */}
                <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl font-mono text-xs border border-slate-200">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="font-extrabold text-base tracking-wider text-slate-900 font-heading">
                        VOLTGRID GUJARAT STATEWIDE NETWORK
                      </h4>
                      <p className="text-[10px] text-slate-500">TAX INVOICE / CASH MEMO (RULE 46 OF CGST)</p>
                      <p className="text-[10px] text-slate-600 mt-1">GSTIN: 24AAACV9082M1Z5 • SAC CODE: 998714</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      PAID / SETTLED
                    </span>
                  </div>

                  <div className="py-4 space-y-2 border-b border-slate-200 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Station Hub:</span>
                      <strong className="text-slate-900">{selectedInvoiceStation.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Energy Dispensed:</span>
                      <strong className="text-slate-900">{energyUnits} kWh @ ₹{baseTariff}/kWh</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">15-Min Guaranteed Hold Fee:</span>
                      <strong className="text-emerald-700">₹0.00 (WAIVED)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CGST (9%):</span>
                      <span className="text-slate-900">₹{(gstAmount / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">SGST (9%):</span>
                      <span className="text-slate-900">₹{(gstAmount / 2).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-900">TOTAL PAID:</span>
                    <strong className="text-lg font-black text-emerald-700">₹{totalInvoiceAmount.toFixed(2)}</strong>
                  </div>

                  <p className="text-[9px] text-slate-500 mt-4 text-center">
                    UTR Reference: IMPS{Date.now().toString().slice(-8)} • Eligible for Input Tax Credit (ITC)
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* MODULE 6: 24X7 ROADSIDE SOS DISPATCH                            */}
            {/* ============================================================== */}
            {activeTab === 'sos' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl max-w-2xl mx-auto text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto text-2xl">
                  🚨
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white font-heading">
                    Gujarat Corridor Emergency EV Helpline
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Statewide emergency mobile charging van & technical rescue on all major expressways.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Highway Patrol Dispatch:</span>
                    <span className="text-white font-bold">1800 200 4848 (Toll Free)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nearest Mobile Rescue Van:</span>
                    <span className="text-emerald-400 font-bold">Ahmedabad-Vadodara NE1 Base (4.2 km away)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Arrival Response Time:</span>
                    <span className="text-cyan-400 font-bold">&lt; 8 minutes</span>
                  </div>
                </div>

                {sosRequested ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    ✓ Emergency request logged! Mobile rescue unit dispatched to your location coordinates.
                  </div>
                ) : (
                  <button
                    onClick={() => setSosRequested(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                  >
                    Simulate Emergency Rescue Dispatch
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
