import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { getStations } from '../api/stations';
import { formatRupee } from '../lib/format';

const GUJARAT_CITIES = [
  { id: 'ALL', name: 'All Gujarat Hubs', lat: 23.0416, lng: 72.5074 },
  { id: 'ahmedabad', name: 'Ahmedabad (SG Highway & Ring Rd)', lat: 23.0225, lng: 72.5714 },
  { id: 'surat', name: 'Surat (Diamond Bourse & Dumas)', lat: 21.1702, lng: 72.8311 },
  { id: 'vadodara', name: 'Vadodara (Alkapuri & Express)', lat: 22.3072, lng: 73.1812 },
  { id: 'rajkot', name: 'Rajkot (Kalawad & 150ft Ring Rd)', lat: 22.3039, lng: 70.8022 },
  { id: 'bhavnagar', name: 'Bhavnagar (Waghawadi Corridor)', lat: 21.7645, lng: 72.1519 },
  { id: 'jamnagar', name: 'Jamnagar (Reliance Greens Rd)', lat: 22.4707, lng: 70.0577 },
  { id: 'junagadh', name: 'Junagadh (Gir Corridor)', lat: 21.5222, lng: 70.4579 },
  { id: 'gandhinagar', name: 'Gandhinagar (GIFT City & Infocity)', lat: 23.2156, lng: 72.6369 },
  { id: 'kutch', name: 'Kutch / Bhuj (White Desert Express)', lat: 23.2420, lng: 69.6669 },
  { id: 'anand', name: 'Anand & Nadiad (Amul Dairy Hub)', lat: 22.5645, lng: 72.9289 },
  { id: 'bharuch', name: 'Bharuch & Ankleshwar (Golden Bridge)', lat: 21.7051, lng: 72.9959 },
  { id: 'vapi', name: 'Vapi & Valsad (NH48 Highway)', lat: 20.3893, lng: 72.9106 },
  { id: 'mehsana', name: 'Mehsana & Morbi (Highway Plazas)', lat: 23.5880, lng: 72.3693 }
];

const VENDORS = ['ALL', 'Jio-bp', 'Tata Power', 'Statiq', 'ChargeZone', 'Shell Recharge'];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function Hubs() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCity, setActiveCity] = useState('ALL');
  const [activeVendor, setActiveVendor] = useState('ALL');
  const [activeVehicle, setActiveVehicle] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState({
    lat: 23.0416,
    lng: 72.5074,
    name: 'Ahmedabad (SG Highway)'
  });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getStations();
        setStations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load stations');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCityChange = (cityId) => {
    setActiveCity(cityId);
    const found = GUJARAT_CITIES.find((c) => c.id === cityId);
    if (found && cityId !== 'ALL') {
      setUserLocation({ lat: found.lat, lng: found.lng, name: found.name.split(' (')[0] });
    }
  };

  const handleLiveGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: `Live GPS (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`
          });
        },
        () => alert('Could not get GPS. Using current location selection.')
      );
    }
  };

  const totalBays = useMemo(() => {
    return stations.reduce((acc, s) => acc + (s.ports ? s.ports.length : 0), 0);
  }, [stations]);

  const filteredStations = useMemo(() => {
    let list = [...stations];

    // City Filter
    if (activeCity !== 'ALL') {
      const q = activeCity.toLowerCase();
      list = list.filter((s) => {
        const c = (s.city || '').toLowerCase();
        const loc = (s.location || '').toLowerCase();
        const name = (s.name || '').toLowerCase();
        if (q === 'kutch') return c.includes('kutch') || c.includes('bhuj') || c.includes('dhordo');
        if (q === 'anand') return c.includes('anand') || c.includes('nadiad');
        if (q === 'bharuch') return c.includes('bharuch') || c.includes('ankleshwar');
        if (q === 'vapi') return c.includes('vapi') || c.includes('valsad');
        if (q === 'mehsana') return c.includes('mehsana') || c.includes('morbi');
        return c.includes(q) || loc.includes(q) || name.includes(q);
      });
    }

    // Vendor Filter
    if (activeVendor !== 'ALL') {
      const v = activeVendor.toLowerCase();
      list = list.filter(
        (s) =>
          (s.vendorName && s.vendorName.toLowerCase().includes(v)) ||
          (s.vendorId && s.vendorId.toLowerCase().includes(v))
      );
    }

    // Vehicle Type Filter
    if (activeVehicle !== 'ALL') {
      list = list.filter((s) => {
        if (!s.ports || s.ports.length === 0) return true;
        return s.ports.some(
          (p) => p.vehicleType === activeVehicle || p.vehicleType === 'BOTH'
        );
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(query)) ||
          (s.city && s.city.toLowerCase().includes(query)) ||
          (s.location && s.location.toLowerCase().includes(query)) ||
          (s.vendorName && s.vendorName.toLowerCase().includes(query))
      );
    }

    // Proximity calculation and sorting
    list = list.map((st) => ({
      ...st,
      calculatedDist: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        st.lat || 23.0416,
        st.lng || 72.5074
      )
    }));

    list.sort((a, b) => a.calculatedDist - b.calculatedDist);
    return list;
  }, [stations, activeCity, activeVendor, activeVehicle, searchQuery, userLocation]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-100/90 via-sky-50/80 to-pink-50/70 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 border border-purple-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-200/70 dark:bg-purple-950 text-purple-900 dark:text-purple-300 font-bold text-xs border border-purple-300/60">
                <span>🏛️</span>
                <span>All Gujarat EV Charging SuperHubs</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                Gujarat EV Charging Network Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Explore verified fast-charging stations across Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar, Jamnagar, Junagadh, Gandhinagar, and highway corridors. Click any hub to view live bays & reserve your slot.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-white/80 dark:bg-slate-950/70 backdrop-blur-sm p-3.5 rounded-2xl border border-purple-100 dark:border-slate-800 text-center">
                <span className="text-xl font-extrabold text-purple-700 dark:text-purple-400 font-mono">
                  {stations.length || 34}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mt-0.5">Gujarat Hubs</span>
              </div>
              <div className="bg-white/80 dark:bg-slate-950/70 backdrop-blur-sm p-3.5 rounded-2xl border border-purple-100 dark:border-slate-800 text-center">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {totalBays || '150+'}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mt-0.5">Active Bays</span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white/80 dark:bg-slate-950/70 backdrop-blur-sm p-3.5 rounded-2xl border border-purple-100 dark:border-slate-800 text-center">
                <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400 font-mono">100%</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mt-0.5">Clean Energy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-purple-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* City Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
                <span>📍</span> <span>Choose Gujarat Location:</span>
              </label>
              <div className="relative flex-1 max-w-md">
                <select
                  value={activeCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {GUJARAT_CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* GPS & Search */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLiveGps}
                className="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border border-purple-300/60 text-xs font-bold transition-all flex items-center gap-1.5"
                title="Use Live GPS Coordinates"
              >
                <span>🎯</span>
                <span className="hidden sm:inline">Use Current GPS</span>
              </button>
              <input
                type="text"
                placeholder="Search hub name or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 w-44 sm:w-60"
              />
            </div>
          </div>

          {/* Vendors & Vehicle Filter Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {/* CPO Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 mr-1">CPO Network:</span>
              {VENDORS.map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveVendor(v)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    activeVendor === v
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {v === 'ALL' ? '⚡ All Networks' : v}
                </button>
              ))}
            </div>

            {/* Vehicle Chips */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Vehicle:</span>
              {['ALL', '4W', '2W'].map((veh) => (
                <button
                  key={veh}
                  onClick={() => setActiveVehicle(veh)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    activeVehicle === veh
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {veh === 'ALL' ? 'All Types' : veh === '4W' ? '🚗 4-Wheelers' : '🛵 2-Wheelers'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="font-bold">
            {filteredStations.length} Hubs Found ({stations.length} Total in Gujarat)
          </span>
          <span>📍 Distance calculated from {userLocation.name}</span>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            <p className="mt-3 text-xs text-slate-400">Loading Gujarat EV SuperHubs...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-bold">
            {error}
          </div>
        )}

        {/* Grid of Stations */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                <span className="text-4xl mb-2 block">🔍</span>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  No hubs found for selected filters
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try resetting city or network filters to see all 34 Gujarat stations.
                </p>
                <button
                  onClick={() => {
                    setActiveCity('ALL');
                    setActiveVendor('ALL');
                    setActiveVehicle('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredStations.map((st) => {
                const total = st.ports ? st.ports.length : 0;
                const avail = st.ports
                  ? st.ports.filter((p) => p.status === 'available').length
                  : 0;
                const dist = st.calculatedDist || 0;
                const estDriveMins = Math.max(2, Math.round(dist * 2.2));
                const directionsLink =
                  st.directionsUrl ||
                  `https://www.google.com/maps/dir/?api=1&destination=${st.lat || 23.0416},${st.lng || 72.5074}`;

                return (
                  <div
                    key={st.id || st._id}
                    className="group rounded-3xl p-5 border border-purple-100/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-slate-900 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between h-full min-h-[220px]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                            <span className="text-xs">{st.vendorLogo || '⚡'}</span>
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                              {st.vendorName || 'VoltGrid'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200">
                              📍 {st.city || 'Gujarat'}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              • {st.type || 'Fast Hub'}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-heading mt-1 min-h-[44px] flex items-center leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {st.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {st.location}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                            avail > 0
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                          }`}
                        >
                          {avail}/{total} Free
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-purple-900 dark:text-purple-300 font-medium mt-3 bg-purple-50/70 dark:bg-purple-950/40 px-2.5 py-1 rounded-xl border border-purple-100/80">
                        <span>🛡️</span> Guaranteed 15m Hold • 24x7 Assistance
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-100/70 dark:border-slate-800/80 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">
                          {formatRupee(st.pricePerKwh || 24)}/kWh
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100/90 text-orange-900 dark:bg-slate-800 dark:text-orange-300 text-[11px] font-semibold flex items-center gap-1 border border-orange-200/60">
                          🚗 {dist} km ({estDriveMins}m)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={directionsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold flex items-center gap-1 transition-all border border-purple-200/60"
                          title="Open Google Maps Real Navigation"
                        >
                          <span>🗺️ Nav ↗</span>
                        </a>
                        <Link
                          to={`/hub/${st.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1 hover:scale-105 active:scale-95"
                          title="View all charging ports for this hub"
                        >
                          <span>⚡ View Ports &rarr;</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
