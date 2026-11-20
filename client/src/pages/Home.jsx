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
      setLastCompletedStation(currentStation?.name || 'Gujarat Supergrid Hub');
      setLastBookingId(liveSession?.bookingId || null);
      setLiveSession(null);
      setCompletedInvoice(invoiceData.booking || invoiceData);
      const refreshed = await getStation(currentStation.id);
      setCurrentStation(refreshed);
    } catch (err) {
      alert(`Stop session error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 via-slate-50 to-purple-50/20 dark:from-[#090d16] dark:via-[#090d16] dark:to-[#090d16] text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Notice Banner */}
      <div className="bg-gradient-to-r from-rose-100 via-purple-100 to-sky-100 dark:from-purple-950/70 dark:via-indigo-950/70 dark:to-sky-950/70 text-purple-950 dark:text-purple-200 font-semibold text-xs py-2 px-3 text-center border-b border-purple-200/50 dark:border-purple-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span>✨ <strong>15-Minute Guaranteed Hold:</strong> Reserve your charger with zero queue & pay ₹0 upfront.</span>
          <span className="text-[10px] bg-white/70 dark:bg-purple-900/60 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider hidden md:inline">
            Gujarat Corridor Sandbox
          </span>
        </div>
      </div>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-purple-900/90 via-slate-900 to-indigo-950 p-6 sm:p-10 text-white overflow-hidden shadow-2xl border border-purple-500/20">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gujarat Statewide Fast EV Highway Network</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
              Arrive with zero queue. Guarantee your plug with 15-min instant lock.
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Reserve high-power DC fast chargers across Gujarat's highway corridors and city superhubs. Transparent pricing, instant 4-digit PIN activation, and live BMS telematics.
            </p>

            {/* Quick Car Selector */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">My EV:</span>
              {VEHICLE_PRESETS.slice(0, 4).map((v) => (
                <button
                  key={v.model}
                  onClick={() => setSelectedVehicle(v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedVehicle.model === v.model
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {v.model}
                </button>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="#chargers"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold text-sm text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
              >
                ⚡ Find Charger Nearby
              </a>
              <Link
                to="/hubs"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-sm transition-all"
              >
                🏛️ View All 34 Gujarat Hubs
              </Link>
            </div>
          </div>
        </div>

        {/* Zeon-Inspired Bold Network Stats Card */}
        <NetworkStatsCard />

        {/* Zeon-Inspired Multi-CPO & Location Partners Row */}
        <PartnerLogos />

        {/* Live Active Charging Banner */}
        {liveSession && (
          <div id="live-session">
            <ActiveChargingSession
              session={liveSession}
              onStop={handleStopCharging}
            />
          </div>
        )}

        {/* Charger Finder & Dedicated Bays Section */}
        <div id="chargers" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <span>⚡</span> Live Bay Availability
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                Nearest SuperHubs & Ports
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Select your preferred station and lock a dedicated bay before departure.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/hubs"
                className="px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-bold text-xs border border-purple-200 transition-all"
              >
                Directory Map (34) &rarr;
              </Link>
            </div>
          </div>

          {/* Station Selector Pill Bar */}
          <StationSelector
            stations={stations}
            selectedId={selectedStationId}
            onSelect={handleStationChange}
          />

          {/* Current Station Details & Port Grid */}
          {currentStation ? (
            <div className="space-y-6 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-100 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{currentStation.vendorLogo || '⚡'}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300">
                      {currentStation.vendorName}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                      📍 {currentStation.city}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                    {currentStation.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentStation.location}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl text-center">
                    <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {formatRupee(currentStation.pricePerKwh)}/kWh
                    </span>
                    <span className="text-[10px] text-slate-500 block">Tariff Rate</span>
                  </div>
                  <Link
                    to={`/hub/${currentStation.id}`}
                    className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20"
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
                      onSelect={() => handleSelectPort(port)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-slate-400">
                    No ports available at this hub.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">Loading stations...</div>
          )}
        </div>

        {/* Savings Calculator Section */}
        <div id="customer-savings">
          <SavingsCalculator vehicle={selectedVehicle} />
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-purple-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider font-mono">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              How VoltGrid Slot Hold Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Never wait in a queue again. Arrive, enter your instant 4-digit PIN, and plug in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-slate-800/50 border border-purple-100 dark:border-slate-800 space-y-3">
              <span className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-bold flex items-center justify-center text-lg">
                1
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white">Choose Station & Port</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick your preferred power output (from 30kW to 350kW Ultra-Fast) and connector type compatible with your vehicle.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/50 border border-emerald-100 dark:border-slate-800 space-y-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-lg">
                2
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white">Get Guaranteed 15m PIN</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The bay is locked exclusively for you. Your 4-digit PIN prevents unauthorized plug-ins while you drive to the hub.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50/50 dark:bg-slate-800/50 border border-sky-100 dark:border-slate-800 space-y-3">
              <span className="w-10 h-10 rounded-xl bg-sky-600 text-white font-mono font-bold flex items-center justify-center text-lg">
                3
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white">Plug & Settle</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Punch in your PIN at the charger screen. Session starts immediately with live telemetry, and you receive an itemized GST invoice upon completion.
              </p>
            </div>
          </div>
        </div>

        {/* Operator Telemetry Banner */}
        <OperatorTelemetry />
      </main>

      {/* 1. Powerful Features at Your Fingertips (Mockups Slider) */}
      <FeatureShowcase />

      {/* 2. What Gujarat EV Drivers Say (Real Live Testimonials from Feedback Form) */}
      <Testimonials />

      {/* 3. Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* 4. Complete Statewide Supergrid Footer */}
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
