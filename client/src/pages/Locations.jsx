import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ReservationModal from '../components/ReservationModal';
import DigitalPassModal from '../components/DigitalPassModal';
import { getStations, getStation, startCharging } from '../api/stations';
import { createBooking, cancelBooking } from '../api/bookings';
import { formatRupee } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Zap, Navigation, Clock, CheckCircle2, X, Filter, Sparkles, Building2 } from 'lucide-react';
import L from 'leaflet';

export default function Locations() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL, FAST_DC, CCS2, AVAILABLE

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Fetch stations
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getStations();
        const list = Array.isArray(data) ? data : [];
        setStations(list);
        if (list.length > 0) {
          setSelectedStation(list[0]);
        }
      } catch (err) {
        console.error('Failed to load stations:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter stations based on search & connector
  const filteredStations = useMemo(() => {
    return stations.filter((st) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        st.name?.toLowerCase().includes(q) ||
        st.city?.toLowerCase().includes(q) ||
        st.location?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (selectedFilter === 'FAST_DC') {
        return st.ports?.some((p) => p.maxKw >= 60);
      }
      if (selectedFilter === 'AVAILABLE') {
        return st.ports?.some((p) => p.status === 'available');
      }
      return true;
    });
  }, [stations, searchQuery, selectedFilter]);

  // Initialize Leaflet Map centered on Gujarat (22.8, 71.8)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on Gujarat
    const map = L.map(mapContainerRef.current, {
      center: [22.8, 71.8],
      zoom: 7.5,
      zoomControl: false
    });

    // Add Standard OpenStreetMap tiles (100% Free, NO API Key needed, clean & sharp)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map markers when filteredStations change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Create custom Zeon red marker icon
    filteredStations.forEach((st) => {
      const lat = Number(st.lat);
      const lng = Number(st.lng);
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const stId = st.stationId || st.id || st._id;
      const isSelected = selectedStation && (selectedStation.stationId || selectedStation.id || selectedStation._id) === stId;
      const availablePorts = st.ports?.filter((p) => p.status === 'available').length || 0;

      const markerHtml = `
        <div style="
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: ${isSelected ? '#991b1b' : '#E50914'};
          border: 3px solid #ffffff;
          box-shadow: 0 4px 14px rgba(229, 9, 20, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 900;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s ease;
          transform: scale(${isSelected ? 1.25 : 1});
        ">
          ⚡
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'zeon-map-marker',
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedStation(st);
        map.flyTo([lat, lng], 13, { duration: 1.2 });
      });

      markersRef.current.push(marker);
    });

    // Auto-fit bounds if markers exist
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.12));
    }
  }, [filteredStations, selectedStation]);

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
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-100 font-sans">
      {/* Floating Pill Header */}
      <Header />

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Search & Filter Bar at Top Left (Matches Image 2) */}
      <div className="absolute top-20 sm:top-24 left-4 sm:left-8 z-30 w-full max-w-sm sm:max-w-md space-y-2 pointer-events-auto">
        <div className="relative bg-white rounded-2xl shadow-xl border border-zinc-200/90 p-2 flex items-center gap-2">
          <Search className="w-5 h-5 text-zinc-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Search station or city in Gujarat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none py-1.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 text-xs">
          {[
            { id: 'ALL', label: 'All Gujarat Stations' },
            { id: 'FAST_DC', label: '⚡ Ultra-Fast DC (60kW+)' },
            { id: 'AVAILABLE', label: '● Available Now' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setSelectedFilter(flt.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all shadow-md ${
                selectedFilter === flt.id
                  ? 'bg-[#E50914] text-white font-bold'
                  : 'bg-white/95 text-zinc-700 hover:bg-white border border-zinc-200'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Station Bottom Drawer / Side Card */}
      {selectedStation && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:w-[420px] max-h-[80vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-zinc-200/90 p-6 z-30 pointer-events-auto text-zinc-900 animate-in slide-in-from-bottom duration-300">
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
                {formatRupee(selectedStation.pricePerKwh)}/kWh
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
              Dedicated Charging Bays
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
                      className="px-3.5 py-1.5 rounded-xl bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
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

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            {selectedStation.directionsUrl && (
              <a
                href={selectedStation.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Navigation className="w-3.5 h-3.5 text-red-400" />
                <span>Get Google Maps Directions</span>
              </a>
            )}
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
