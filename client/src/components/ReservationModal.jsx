import React, { useState, useEffect } from 'react';
import { X, Zap, Car, Check, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { VEHICLES, DEFAULT_VEHICLE } from '../constants/vehicles.js';
import { computePreviewInvoice } from '../lib/pricing.js';
import { formatRupees } from '../lib/format.js';
import { reservePort } from '../api/stations.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function ReservationModal({ isOpen, onClose, port, station, onReservationSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedVehicleName, setSelectedVehicleName] = useState(DEFAULT_VEHICLE);
  const [currentSoc, setCurrentSoc] = useState(25);
  const [targetSoc, setTargetSoc] = useState(100);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Re-initialize idempotency key each time modal opens (Section 9.7)
  useEffect(() => {
    if (isOpen) {
      setIdempotencyKey(crypto.randomUUID());
      setError('');
      if (user?.car && VEHICLES[user.car]) {
        setSelectedVehicleName(user.car);
      }
    }
  }, [isOpen, user]);

  if (!isOpen || !port || !station) return null;

  const vehicleSpec = VEHICLES[selectedVehicleName] || VEHICLES[DEFAULT_VEHICLE];
  const batteryCap = vehicleSpec.battery || 50.3;

  // Energy needed calculations
  const isFull = currentSoc >= 100;
  const percentNeeded = isFull ? 0 : Math.max(1, targetSoc - currentSoc);
  const kwhNeeded = isFull ? 0 : +((percentNeeded / 100) * batteryCap).toFixed(1);

  // Charging time estimate
  const chargerKw = port.maxKw || 60;
  const isAcPort = chargerKw <= 22;
  const effectiveSpeedKw = isAcPort
    ? Math.min(chargerKw, vehicleSpec.speed || 3.3)
    : Math.min(chargerKw, vehicleSpec.speed || 80);
  const estimatedMinutes = isFull ? 0 : Math.max(5, Math.round((kwhNeeded / Math.max(0.5, effectiveSpeedKw)) * 60));

  // Preview invoice
  const preview = computePreviewInvoice(kwhNeeded, station.pricePerKwh, vehicleSpec.type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onClose();
      navigate('/login');
      return;
    }

    if (isFull) {
      setError('Vehicle battery is already 100% full. Reservation disabled.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const stationId = station.stationId || station.id;
      const portId = port.portId || port.id;

      const res = await reservePort(stationId, portId, {
        vehicleModel: selectedVehicleName,
        energyKwh: kwhNeeded,
        idempotencyKey
      });

      // Pass booking and one-time PIN to parent handler
      onReservationSuccess(res.booking || res, res.pin);
      onClose();
    } catch (err) {
      setError(err.message || 'Port is no longer available');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                15-Min Guaranteed Hold
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading mt-0.5">
              Reserve {port.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {station.name} &bull; {formatRupees(station.pricePerKwh)}/kWh
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="py-4 space-y-5">
          {/* Vehicle selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-emerald-500" />
              <span>Select Your Electric Vehicle</span>
            </label>
            <select
              value={selectedVehicleName}
              onChange={(e) => setSelectedVehicleName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all"
            >
              {Object.keys(VEHICLES).map((v) => (
                <option key={v} value={v}>
                  {v} &bull; {VEHICLES[v].battery} kWh ({VEHICLES[v].type})
                </option>
              ))}
            </select>
          </div>

          {/* Current battery slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">Current Battery State</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{currentSoc}% SoC</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={currentSoc}
              onChange={(e) => setCurrentSoc(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>Low (5%)</span>
              <span>Half (50%)</span>
              <span>Full (100%)</span>
            </div>
          </div>

          {/* Target energy preview card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Energy to Deliver:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{kwhNeeded} kWh</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated Duration:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">~{estimatedMinutes} mins</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Energy Cost ({formatRupees(station.pricePerKwh)}/kWh):</span>
              <span className="font-mono">{formatRupees(preview.energyCharge)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Convenience Grid Fee:</span>
              <span className="font-mono">{formatRupees(preview.convenienceFee)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>GST (18%):</span>
              <span className="font-mono">{formatRupees(preview.gst)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
              <span>Total Estimated Hold:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {formatRupees(preview.totalAmount)}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || isFull}
              className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Locking Bay Hold...</span>
              ) : isFull ? (
                <span>🚫 Battery Already 100% Full</span>
              ) : (
                <span>Confirm & Lock Charging Spot ⚡</span>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Instant 4-digit PIN generated &bull; 15-minute arrival hold window
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
