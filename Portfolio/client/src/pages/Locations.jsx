import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ReservationModal from '../components/ReservationModal';
import DigitalPassModal from '../components/DigitalPassModal';
import { getStations, getStation, startCharging } from '../api/stations';
import { createBooking } from '../api/bookings';
import { formatRupee } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import { GUJARAT_STATIONS } from '../data/gujaratStations.js';
import {
  Search,
  MapPin,
  Zap,
  Navigation,
  Clock,
  CheckCircle2,
  X,
  Filter,
  Sparkles,
  Building2,
  List,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Locations() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Initialize immediately with the 34 real Gujarat stations so 0 empty frames exist
  const [stations, setStations] = useState(GUJARAT_STATIONS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(GUJARAT_STATIONS[0]);
  const [selectedPort, setSelectedPort] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [showListView, setShowListView] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Fetch live station status from backend and merge
  useEffect(() => {
    async function fetchLive() {
      try {
        const liveData = await getStations();
        if (Array.isArray(liveData) && liveData.length > 0) {
          setStations(liveData);
        }
      } catch (err) {
        console.warn('Using embedded Gujarat network stations:', err.message);
      }
    }
    fetchLive();
  }, []);

  // Filter stations by search & city
  const filteredStations = useMemo(() => {
    return stations.filter((st) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        st.name?.toLowerCase().includes(q) ||
        st.city?.toLowerCase().includes(q) ||
        st.location?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedCity !== 'ALL' && st.city?.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [stations, searchQuery, selectedCity]);

  // Unique cities list for quick jump
  const cityTabs = useMemo(() => {
    const set = new Set();
    stations.forEach((st) => {
      if (st.city) set.add(st.city);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [stations]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Gujarat
    const map = L.map(mapContainerRef.current, {
      center: [22.8, 71.8],
      zoom: 8,
      zoomControl: false,
      attributionControl: false
    });

    // Clean OpenStreetMap tiles (100% free, 0 API key required, sharp road network)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Force Leaflet to recalculate container bounds on next ticks to prevent gray tile box
    setTimeout(() => map.invalidateSize(), 100);
    setTimeout(() => map.invalidateSize(), 400);
    setTimeout(() => map.invalidateSize(), 1000);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    mapInstanceRef.current = map;

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render station markers on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Invalidate size in case layout shifted
    map.invalidateSize();

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filteredStations.forEach((st) => {
      const lat = Number(st.lat);
      const lng = Number(st.lng);
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const stId = st.stationId || st.id || st._id;
      const isSelected = selectedStation && (selectedStation.stationId || selectedStation.id || selectedStation._id) === stId;
      const availablePorts = st.ports?.filter((p) => p.status === 'available').length || 0;
      const totalPorts = st.ports?.length || 0;

      // Custom Zeon red pin with electric bolt & pulsing radar wave
      const markerHtml = `
        <div class="zeon-pin-wrapper" style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; inset: -4px; border-radius: 50%; background: ${isSelected ? 'rgba(229, 9, 20, 0.45)' : 'rgba(229, 9, 20, 0.25)'}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 38px; height: 38px; border-radius: 50%; background: ${isSelected ? '#991b1b' : '#E50914'}; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 16px; transform: scale(${isSelected ? 1.25 : 1}); transition: all 0.2s;">
            ⚡
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'zeon-custom-div-icon',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Tooltip on hover
      marker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
          <strong style="color: #111;">${st.name}</strong><br/>
          <span style="color: #E50914; font-weight: 700;">${availablePorts} of ${totalPorts} Bays Available</span><br/>
          <span style="color: #666; font-size: 11px;">📍 ${st.city} • ₹${st.pricePerKwh}/kWh</span>
        </div>
      `, { direction: 'top', offset: [0, -20], opacity: 0.95 });

      marker.on('click', () => {
        setSelectedStation(st);
        map.flyTo([lat, lng], 13, { duration: 1 });
      });

      markersRef.current.push(marker);
    });

    // Auto-fit bounds if multiple markers exist and not searching specifically
    if (markersRef.current.length > 0 && selectedCity === 'ALL' && !searchQuery) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.08));
    }
  }, [filteredStations, selectedStation]);

  const handleSelectStationFromList = (st) => {
    setSelectedStation(st);
    setShowListView(false);
    const map = mapInstanceRef.current;
    if (map && st.lat && st.lng) {
      map.flyTo([st.lat, st.lng], 14, { duration: 1.2 });
    }
  };

  const handleSelectPort = (port) => {
    if (port.status !== 'available') return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedPort(port);
    setIsReserveModalOpen(true);
  };

  const handleConfirmReservation = async (reservationData) => {
    try {
      const stId = selectedStation.stationId || selectedStation.id || selectedStation._id;
      const pId = selectedPort.portId || selectedPort.id;
      const res = await createBooking({
        stationId: stId,
        portId: pId,
        vehicleModel: user?.car || 'Tata Nexon EV',
        vehicleType: selectedPort.vehicleType || '4W',
        estimatedDurationMinutes: reservationData.duration || 30
      });

      setIsReserveModalOpen(false);
      setActiveBooking(res.booking);
      setIsPassModalOpen(true);

      const refreshed = await getStation(stId);
      setSelectedStation(refreshed);
    } catch (err) {
      alert(`Reservation failed: ${err.message}`);
    }
  };

  const handleStartCharging = async (pin) => {
    try {
      const stId = selectedStation.stationId || selectedStation.id || selectedStation._id;
      await startCharging(stId, activeBooking.portId, pin);
      setIsPassModalOpen(false);
      navigate('/');
    } catch (err) {
      alert(`Could not start charging: ${err.message}`);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-200 font-sans">
      {/* Floating Pill Header */}
      <Header />

      {/* Map Container: full bleed */}
      <div
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0 z-0 bg-zinc-200"
        style={{ minHeight: '100vh', width: '100vw' }}
      />

      {/* Floating Controls at Top Left (Matches Image 2) */}
      <div className="absolute top-20 sm:top-24 left-4 sm:left-8 z-30 w-full max-w-sm sm:max-w-md space-y-2 pointer-events-auto">
        {/* Search Input Bar */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-zinc-200 p-2 flex items-center gap-2">
          <Search className="w-5 h-5 text-zinc-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Search station or city in Gujarat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none py-1"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Toggle List View Button */}
          <button
            onClick={() => setShowListView(!showListView)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              showListView ? 'bg-red-600 text-white' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
            title="Toggle Station Directory"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List ({filteredStations.length})</span>
          </button>
        </div>

        {/* Quick City Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 text-xs no-scrollbar">
          {cityTabs.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all shadow-md ${
                selectedCity === city
                  ? 'bg-[#E50914] text-white font-bold'
                  : 'bg-white/95 text-zinc-700 hover:bg-white border border-zinc-200'
              }`}
            >
              {city === 'ALL' ? 'All Gujarat (34)' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Directory List Drawer when user clicks "List" */}
      {showListView && (
        <div className="absolute top-44 left-4 sm:left-8 z-30 w-full max-w-sm sm:max-w-md max-h-[60vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-zinc-200 p-4 space-y-2 pointer-events-auto text-zinc-900 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="font-bold text-xs font-mono uppercase tracking-wider text-zinc-500">
              Gujarat Charging Hubs ({filteredStations.length})
            </span>
            <button onClick={() => setShowListView(false)} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {filteredStations.map((st) => (
              <button
                key={st.stationId || st.id || st._id}
                onClick={() => handleSelectStationFromList(st)}
                className="w-full text-left p-3 rounded-2xl hover:bg-zinc-50 border border-zinc-100 hover:border-red-500 transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <h4 className="font-bold text-xs text-zinc-900 group-hover:text-red-600 transition-colors">
                    {st.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate max-w-[260px]">
                    📍 {st.city} &bull; {st.location}
                  </p>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    {st.ports?.filter((p) => p.status === 'available').length || 0} / {st.ports?.length || 0} Bays Free &bull; ₹{st.pricePerKwh}/kWh
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Station Bottom Drawer / Card */}
      {selectedStation && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-[440px] max-h-[82vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 z-30 pointer-events-auto text-zinc-900 animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  ZEON FAST HUB
                </span>
                <span className="text-xs font-bold text-zinc-500">
                  📍 {selectedStation.city}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                {selectedStation.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{selectedStation.location}</span>
              </p>
            </div>

            <button
              onClick={() => setSelectedStation(null)}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-2 my-3 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-[10px] text-zinc-400 block font-mono">TARIFF RATE</span>
              <span className="font-bold text-red-600 text-sm">
                ₹{selectedStation.pricePerKwh}/kWh
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-[10px] text-zinc-400 block font-mono">BAY AVAILABILITY</span>
              <span className="font-bold text-emerald-600 text-sm">
                {selectedStation.ports?.filter((p) => p.status === 'available').length || 0} /{' '}
                {selectedStation.ports?.length || 0} Available
              </span>
            </div>
          </div>

          {/* Real Ports List */}
          <div className="space-y-2.5 my-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block">
              Dedicated Charging Bays ({selectedStation.ports?.length || 0})
            </span>
            {selectedStation.ports?.map((port) => (
              <div
                key={port.id || port.portId}
                className="p-3 rounded-2xl border border-zinc-200 flex items-center justify-between gap-3 hover:border-red-500 transition-colors bg-zinc-50/50"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-800">
                    <Zap className="w-3.5 h-3.5 text-red-500 fill-current" />
                    <span>{port.name}</span>
                    <span className="text-[10px] font-normal text-zinc-500">
                      ({port.connector || 'CCS-2'})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {port.maxKw} kW Ultra-Fast DC
                  </span>
                </div>

                <div>
                  {port.status === 'available' ? (
                    <button
                      onClick={() => handleSelectPort(port)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Reserve Bay
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono uppercase px-2 py-1 rounded-md bg-zinc-200 text-zinc-600 font-bold">
                      {port.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Google Maps Actions */}
          <div className="pt-2 flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedStation.lat},${selectedStation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Navigation className="w-3.5 h-3.5 text-red-400" />
              <span>Google Maps Directions</span>
              <ExternalLink className="w-3 h-3 text-zinc-400 ml-0.5" />
            </a>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isReserveModalOpen && selectedPort && selectedStation && (
        <ReservationModal
          station={selectedStation}
          port={selectedPort}
          onClose={() => setIsReserveModalOpen(false)}
          onConfirm={handleConfirmReservation}
        />
      )}

      {/* Digital Pass Modal */}
      {isPassModalOpen && activeBooking && selectedStation && (
        <DigitalPassModal
          booking={activeBooking}
          station={selectedStation}
          onStartCharging={handleStartCharging}
          onCancel={() => {
            setIsPassModalOpen(false);
            setActiveBooking(null);
          }}
          onClose={() => setIsPassModalOpen(false)}
        />
      )}
    </div>
  );
}
