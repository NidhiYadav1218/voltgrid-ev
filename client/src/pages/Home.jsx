import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import StationSelector from '../components/StationSelector';
import PortCard from '../components/PortCard';
import ReservationModal from '../components/ReservationModal';
import DigitalPassModal from '../components/DigitalPassModal';
import ActiveChargingSession from '../components/ActiveChargingSession';
import Invoice from '../components/Invoice';
import SavingsCalculator from '../components/SavingsCalculator';
import OperatorTelemetry from '../components/OperatorTelemetry';
import FeatureShowcase from '../components/FeatureShowcase';
import Testimonials from '../components/Testimonials';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';
import FeedbackModal from '../components/FeedbackModal';
import NetworkStatsCard from '../components/NetworkStatsCard';
import PartnerLogos from '../components/PartnerLogos';
import { getStations, getStation, startCharging, stopCharging } from '../api/stations';
import { createBooking, completeBooking, cancelBooking, getBookings } from '../api/bookings';
import { getTelematics } from '../api/telematics';
import { VEHICLE_PRESETS } from '../constants/vehicles';
import { formatRupee } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import { Zap, ShieldCheck, Clock, MapPin, Building, ChevronRight, CheckCircle2, Award, Sparkles } from 'lucide-react';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState('');
  const [currentStation, setCurrentStation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected vehicle preset
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0]);
  const [telematics, setTelematics] = useState(null);

  // Modals & Active Session state
  const [selectedPort, setSelectedPort] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [liveSession, setLiveSession] = useState(null);
  const [completedInvoice, setCompletedInvoice] = useState(null);
  const [feedbackPromptOpen, setFeedbackPromptOpen] = useState(false);
  const [lastCompletedStation, setLastCompletedStation] = useState('');
  const [lastBookingId, setLastBookingId] = useState(null);

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const data = await getStations();
        const list = Array.isArray(data) ? data : [];
        setStations(list);
        if (list.length > 0) {
          setSelectedStationId(list[0].id);
          const full = await getStation(list[0].id);
          setCurrentStation(full);
        }

        // Try load telematics if logged in
        if (isAuthenticated) {
          try {
            const t = await getTelematics();
            setTelematics(t);
          } catch {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleStationChange = async (stationId) => {
    setSelectedStationId(stationId);
    try {
      const full = await getStation(stationId);
      setCurrentStation(full);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPort = (port) => {
    if (port.status !== 'available') return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setSelectedPort(port);
    setIsReserveModalOpen(true);
  };

  const handleConfirmReservation = async (reservationData) => {
    try {
      const res = await createBooking({
        stationId: currentStation.id,
        portId: selectedPort.id,
        vehicleModel: selectedVehicle.model || 'MG ZS EV',
        vehicleType: selectedPort.vehicleType || '4W',
        estimatedDurationMinutes: reservationData.duration || 30
      });

      setIsReserveModalOpen(false);
      setActiveBooking(res.booking);
      setIsPassModalOpen(true);

      // Refresh station ports
      const refreshed = await getStation(currentStation.id);
      setCurrentStation(refreshed);
    } catch (err) {
      alert(`Reservation failed: ${err.message}`);
    }
  };

  const handleStartCharging = async (pin) => {
    try {
      await startCharging(currentStation.id, activeBooking.portId, pin);
      setIsPassModalOpen(false);
      setLiveSession({
        stationId: currentStation.id,
        stationName: currentStation.name,
        portId: activeBooking.portId,
        bookingId: activeBooking.id || activeBooking._id,
        vehicleModel: activeBooking.vehicleModel,
        pricePerKwh: currentStation.pricePerKwh,
        startTime: Date.now()
      });
      const refreshed = await getStation(currentStation.id);
      setCurrentStation(refreshed);
    } catch (err) {
      alert(`Could not start charging: ${err.message}`);
    }
  };

  const handleCancelHold = async () => {
    if (!activeBooking) return;
    try {
      await cancelBooking(activeBooking.id || activeBooking._id);
      setIsPassModalOpen(false);
      setActiveBooking(null);
      const refreshed = await getStation(currentStation.id);
      setCurrentStation(refreshed);
    } catch (err) {
      alert(`Could not cancel hold: ${err.message}`);
    }
  };

  const handleStopCharging = async (finalData) => {
    try {
      await stopCharging(currentStation.id, liveSession.portId);
      const invoiceData = await completeBooking(liveSession.bookingId, {
        energyKwh: finalData.energyKwh || 22.4,
        meterStop: finalData.energyKwh || 22.4
      });
      setLastCompletedStation(currentStation?.name || 'Zeon Fast Charging Hub');
      setLastBookingId(liveSession?.bookingId || null);
      setLiveSession(null);
      setCompletedInvoice(invoiceData.booking || invoiceData);
      const refreshed = await getStation(currentStation.id);
      setCurrentStation(refreshed);
    } catch (err) {
      alert(`Stop session error: ${err.message}`);
    }
  };

  // Port stats for header
  const totalPortsCount = stations.reduce((acc, st) => acc + (st.ports?.length || 0), 0);
  const availablePortsCount = stations.reduce(
    (acc, st) => acc + (st.ports?.filter((p) => p.status === 'available')?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white transition-colors duration-200">
      {/* Top Notice Banner */}
      <div className="bg-gradient-to-r from-red-950/90 via-zinc-950 to-red-950/90 text-zinc-200 font-semibold text-xs py-2 px-3 text-center border-b border-red-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span>⚡ <strong>15-Minute Guaranteed Slot Lock:</strong> Reserve your highway DC bay with zero queue & pay ₹0 upfront.</span>
          <span className="text-[10px] bg-red-900/60 text-red-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider hidden md:inline border border-red-700/50">
            Zeon Fast Corridor
          </span>
        </div>
      </div>

      <Header totalPorts={totalPortsCount} availablePorts={availablePortsCount} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Zeon Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-zinc-950 via-black to-[#1a0505] p-6 sm:p-12 text-white overflow-hidden shadow-2xl border border-red-600/30">
          {/* Ambient red radial gradient */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-600/15 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 -mb-24 w-80 h-80 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 text-red-400 font-bold text-xs border border-red-800/80 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>INDIA'S MOST RELIABLE EV CHARGING NETWORK</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-tight">
              Powering Your Long Drives with <span className="text-red-500">High-Speed</span> EV Charging.
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
              Experience zero wait times with guaranteed 15-minute slot lock, 150kW+ CCS-2 fast chargers, and strategic hubs at premium highway resorts, food courts, and shopping destinations.
            </p>

            {/* Quick Car Selector */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">My EV:</span>
              {VEHICLE_PRESETS.slice(0, 4).map((v) => (
                <button
                  key={v.model}
                  onClick={() => setSelectedVehicle(v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedVehicle.model === v.model
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/40 scale-105'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                  }`}
                >
                  {v.model}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="#chargers"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-bold text-sm text-white shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Find a Charger Nearby</span>
              </a>

              <Link
                to="/hubs"
                className="px-5 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-sm border border-zinc-700 transition-all flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Explore Network Map</span>
              </Link>

              <Link
                to="/vendor"
                className="px-5 py-3.5 rounded-2xl bg-transparent hover:bg-zinc-900 text-zinc-300 hover:text-white font-bold text-sm border border-zinc-800 transition-all flex items-center gap-2"
              >
                <Building className="w-4 h-4 text-zinc-400" />
                <span>Host a Charger</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>99.4% Uptime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-red-500" />
                <span>Up to 350kW DC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-500" />
                <span>15-Min Bay Lock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zeon Charging Network Counter Card (Red Banner) */}
        <NetworkStatsCard />

        {/* Zeon Location Partners Ecosystem (Pitch Black Row) */}
        <PartnerLogos />

        {/* Live Active Charging Session Banner */}
        {liveSession && (
          <div id="live-session">
            <ActiveChargingSession
              session={liveSession}
              onStop={handleStopCharging}
            />
          </div>
        )}

        {/* Why Zeon Fast Charging Network (4 Core Pillars) */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">
              WHY ZEON CHARGING
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Engineered for Zero Downtime Highway Road Trips
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Fast, reliable, and convenient charging stations placed along high-speed transit corridors and premier destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {/* Pillar 1 */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-red-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 font-bold">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-bold text-white text-base">Ultra-Fast High Power DC</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                50kW to 150kW and 350kW multi-gun DC fast chargers providing 20% to 80% charge in under 30 minutes.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-red-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">15-Min Guaranteed Slot Hold</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Lock your designated charging bay 15 minutes before arrival. Zero queue anxiety and instant 4-digit PIN activation.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-red-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">AutoCharge & RFID Tap</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Plug in and start charging instantly without opening an app, using configured VIN detection or Zeon RFID keycards.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-red-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/80 flex items-center justify-center text-red-400 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Premium Amenities & Safety</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Located at verified hotels (Radisson, CGH), Nexus malls, and 24x7 highway food courts with dining, cafes, and clean washrooms.
              </p>
            </div>
          </div>
        </section>

        {/* Charger Finder & Dedicated Bays Section */}
        <div id="chargers" className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Live Bay Availability</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Nearest Zeon Fast Hubs & Dedicated Bays
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Select your preferred station and lock a dedicated bay before departure with guaranteed 15-min PIN hold.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/hubs"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs border border-zinc-700 transition-all"
              >
                Directory Map &rarr;
              </Link>
            </div>
          </div>

          {/* Station Selector Pill Bar */}
          <StationSelector
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={handleStationChange}
          />

          {/* Current Station Details & Port Grid */}
          {currentStation ? (
            <div className="space-y-6 bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-800 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{currentStation.vendorLogo || '⚡'}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-900/60">
                      {currentStation.vendorName || 'Zeon Network'}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      📍 {currentStation.city}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                    {currentStation.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {currentStation.location}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-zinc-950 p-3 rounded-2xl text-center border border-zinc-800">
                    <span className="text-base font-bold font-mono text-red-400">
                      {formatRupee(currentStation.pricePerKwh)}/kWh
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Tariff Rate</span>
                  </div>
                  <Link
                    to={`/hub/${currentStation.id}`}
                    className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-md shadow-red-600/30"
                  >
                    View Hub Details &rarr;
                  </Link>
                </div>
              </div>

              {/* Port Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentStation.ports && currentStation.ports.length > 0 ? (
                  currentStation.ports.map((port) => (
                    <PortCard
                      key={port.id}
                      port={port}
                      pricePerKwh={currentStation.pricePerKwh}
                      onReserve={() => handleSelectPort(port)}
                      onStartCharge={() => handleStartCharging('1234')}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-zinc-400">
                    No ports available at this hub.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-400">Loading stations...</div>
          )}
        </div>

        {/* Savings Calculator Section */}
        <div id="customer-savings">
          <SavingsCalculator vehicle={selectedVehicle} user={user} />
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">
              SIMPLE 3-STEP PROCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              How Zeon Fast Charging Works
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Never wait in a queue again. Arrive, enter your instant 4-digit PIN, and plug in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="w-10 h-10 rounded-xl bg-red-600 text-white font-mono font-bold flex items-center justify-center text-lg">
                1
              </span>
              <h3 className="font-bold text-white">Choose Station & Port</h3>
              <p className="text-xs text-zinc-400">
                Pick your preferred power output (50kW to 150kW+ Ultra-Fast) and connector type compatible with your vehicle.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="w-10 h-10 rounded-xl bg-rose-600 text-white font-mono font-bold flex items-center justify-center text-lg">
                2
              </span>
              <h3 className="font-bold text-white">Get Guaranteed 15m PIN</h3>
              <p className="text-xs text-zinc-400">
                The bay is locked exclusively for you. Your 4-digit PIN prevents unauthorized plug-ins while you drive to the hub.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="w-10 h-10 rounded-xl bg-red-700 text-white font-mono font-bold flex items-center justify-center text-lg">
                3
              </span>
              <h3 className="font-bold text-white">Plug & Settle</h3>
              <p className="text-xs text-zinc-400">
                Punch in your PIN at the charger screen. Session starts immediately with live telemetry, and you receive an itemized GST invoice upon completion.
              </p>
            </div>
          </div>
        </div>

        {/* Host a Charger / Venue Partner Gateway */}
        <div className="relative rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#1e0808] p-8 sm:p-12 border border-red-500/30 overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Building className="w-3.5 h-3.5" />
                <span>HOTELS, RESORTS, MALLS & LANDOWNERS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Monetize Your Parking Space with Zeon Charging
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                Join our location partner ecosystem alongside Radisson Blu, CGH Earth, and Nexus Malls. Attract high-spending EV drivers, enhance guest dwell time, and earn monthly recurring revenue.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                to="/vendor"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs tracking-wider uppercase text-center shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Calculate Partner Earnings
              </Link>
              <Link
                to="/vendor/login"
                className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs tracking-wider uppercase text-center transition-all"
              >
                CPO Partner Portal
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 1. Powerful Features at Your Fingertips (Mockups Slider) */}
      <FeatureShowcase />

      {/* 2. What Our Drivers Say (Real Live Testimonials from MongoDB) */}
      <Testimonials />

      {/* 3. Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* 4. Complete Zeon Charging Footer */}
      <Footer />

      {/* Reservation Modal */}
      {isReserveModalOpen && selectedPort && currentStation && (
        <ReservationModal
          station={currentStation}
          port={selectedPort}
          onClose={() => setIsReserveModalOpen(false)}
          onConfirm={handleConfirmReservation}
        />
      )}

      {/* Digital Pass Modal */}
      {isPassModalOpen && activeBooking && currentStation && (
        <DigitalPassModal
          booking={activeBooking}
          station={currentStation}
          onStartCharging={handleStartCharging}
          onCancel={handleCancelHold}
          onClose={() => setIsPassModalOpen(false)}
        />
      )}

      {/* Invoice Modal */}
      {completedInvoice && (
        <Invoice
          invoice={completedInvoice}
          onClose={() => {
            setCompletedInvoice(null);
            setFeedbackPromptOpen(true);
          }}
        />
      )}

      {/* Post-Session Feedback & Driver Review Modal */}
      {feedbackPromptOpen && (
        <FeedbackModal
          isOpen={feedbackPromptOpen}
          stationName={lastCompletedStation}
          bookingId={lastBookingId}
          onClose={() => setFeedbackPromptOpen(false)}
        />
      )}
    </div>
  );
}
