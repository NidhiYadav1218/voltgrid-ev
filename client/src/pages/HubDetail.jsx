import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import PortCard from '../components/PortCard';
import ReservationModal from '../components/ReservationModal';
import DigitalPassModal from '../components/DigitalPassModal';
import ActiveChargingSession from '../components/ActiveChargingSession';
import Invoice from '../components/Invoice';
import { getStation, startCharging, stopCharging } from '../api/stations';
import { createBooking, completeBooking, cancelBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import { formatRupee } from '../lib/format';

export default function HubDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');

  // Modal / Session states
  const [selectedPort, setSelectedPort] = useState(null);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [liveSession, setLiveSession] = useState(null);
  const [completedInvoice, setCompletedInvoice] = useState(null);

  const loadStation = useCallback(async () => {
    try {
      const data = await getStation(id);
      setStation(data);
    } catch (err) {
      setError(err.message || 'Failed to load station');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStation();
    const interval = setInterval(loadStation, 10000);
    return () => clearInterval(interval);
  }, [loadStation]);

  const handleSelectPort = (port) => {
    if (port.status !== 'available') return;
    setSelectedPort(port);
    setIsReserveModalOpen(true);
  };

  const handleConfirmReservation = async (reservationData) => {
    try {
      const res = await createBooking({
        stationId: station.id,
        portId: selectedPort.id,
        vehicleModel: reservationData.vehicleModel || 'MG ZS EV',
        vehicleType: selectedPort.vehicleType || '4W',
        estimatedDurationMinutes: reservationData.duration || 30
      });

      setIsReserveModalOpen(false);
      setActiveBooking(res.booking);
      setIsPassModalOpen(true);
      loadStation();
    } catch (err) {
      alert(`Reservation failed: ${err.message}`);
    }
  };

  const handleStartCharging = async (pin) => {
    try {
      await startCharging(station.id, activeBooking.portId, pin);
      setIsPassModalOpen(false);
      setLiveSession({
        stationId: station.id,
        stationName: station.name,
        portId: activeBooking.portId,
        bookingId: activeBooking.id || activeBooking._id,
        vehicleModel: activeBooking.vehicleModel,
        pricePerKwh: station.pricePerKwh,
        startTime: Date.now()
      });
      loadStation();
    } catch (err) {
      alert(`Failed to start charging: ${err.message}`);
    }
  };

  const handleCancelHold = async () => {
    if (!activeBooking) return;
    try {
      await cancelBooking(activeBooking.id || activeBooking._id);
      setIsPassModalOpen(false);
      setActiveBooking(null);
      loadStation();
    } catch (err) {
      alert(`Could not cancel hold: ${err.message}`);
    }
  };

  const handleStopCharging = async (finalData) => {
    try {
      await stopCharging(station.id, liveSession.portId);
      const invoiceData = await completeBooking(liveSession.bookingId, {
        energyKwh: finalData.energyKwh || 18.5,
        meterStop: finalData.energyKwh || 18.5
      });
      setLiveSession(null);
      setCompletedInvoice(invoiceData.booking || invoiceData);
      loadStation();
    } catch (err) {
      alert(`Session end error: ${err.message}`);
    }
  };

  const filteredPorts = station?.ports?.filter((p) => {
    if (vehicleFilter === 'ALL') return true;
    return p.vehicleType === vehicleFilter || p.vehicleType === 'BOTH';
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !station) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-100 flex flex-col">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
          <span className="text-4xl block">⚠️</span>
          <h2 className="text-xl font-bold text-white">Hub Not Found</h2>
          <p className="text-sm text-slate-400">{error || 'This station could not be loaded.'}</p>
          <Link to="/hubs" className="inline-block px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">
            Back to Hubs Directory
          </Link>
        </div>
      </div>
    );
  }

  const freeCount = station.ports?.filter((p) => p.status === 'available').length || 0;
  const directionsUrl =
    station.directionsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${station.lat || 23.0416},${station.lng || 72.5074}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/hubs" className="hover:text-purple-500">
            Hubs Directory
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{station.name}</span>
        </div>

        {/* Live Active Charging Banner (if current driver session is running) */}
        {liveSession && (
          <ActiveChargingSession
            session={liveSession}
            onStop={handleStopCharging}
          />
        )}

        {/* Hub Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-purple-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">{station.vendorLogo || '⚡'}</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                {station.vendorName || 'VoltGrid'}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200">
                📍 {station.city || 'Gujarat'}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                {freeCount} of {station.ports?.length || 0} Bays Available
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              {station.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {station.location}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono block">
                {formatRupee(station.pricePerKwh)}/kWh
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Tariff Rate</span>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>🗺️</span>
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>

        {/* Ports Matrix Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                Dedicated Charging Bays ({filteredPorts.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick a high-speed charging port to lock with a 15-minute guaranteed hold & 4-digit PIN.
              </p>
            </div>

            {/* Vehicle Compatibility Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              <button
                onClick={() => setVehicleFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  vehicleFilter === 'ALL'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                All Ports
              </button>
              <button
                onClick={() => setVehicleFilter('4W')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  vehicleFilter === '4W'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                🚗 4-Wheelers
              </button>
              <button
                onClick={() => setVehicleFilter('2W')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  vehicleFilter === '2W'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                🛵 2-Wheelers
              </button>
            </div>
          </div>

          {/* Port Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPorts.map((port) => (
              <PortCard
                key={port.id}
                port={port}
                pricePerKwh={station.pricePerKwh}
                onSelect={() => handleSelectPort(port)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Reservation Modal */}
      {isReserveModalOpen && selectedPort && (
        <ReservationModal
          station={station}
          port={selectedPort}
          onClose={() => setIsReserveModalOpen(false)}
          onConfirm={handleConfirmReservation}
        />
      )}

      {/* Digital Pass Modal */}
      {isPassModalOpen && activeBooking && (
        <DigitalPassModal
          booking={activeBooking}
          station={station}
          onStartCharging={handleStartCharging}
          onCancel={handleCancelHold}
          onClose={() => setIsPassModalOpen(false)}
        />
      )}

      {/* Invoice Modal */}
      {completedInvoice && (
        <Invoice
          invoice={completedInvoice}
          onClose={() => setCompletedInvoice(null)}
        />
      )}
    </div>
  );
}
