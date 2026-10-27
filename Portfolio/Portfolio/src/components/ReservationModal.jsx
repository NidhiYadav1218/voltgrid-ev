import React, { useState } from 'react';
import { X, Lock, Zap, Clock, ShieldCheck, Car, Check } from 'lucide-react';
import { VEHICLE_PRESETS } from '../data/mockData';

export default function ReservationModal({ isOpen, onClose, port, station, onConfirmReservation }) {
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0]);
  const [currentSoc, setCurrentSoc] = useState(25);
  const [targetSoc, setTargetSoc] = useState(80);
  const [arrivalWindow, setArrivalWindow] = useState('immediate');
  const [isLocking, setIsLocking] = useState(false);

  if (!isOpen || !port || !station) return null;

  // Calculation
  const neededPercentage = Math.max(0, targetSoc - currentSoc);
  const kwhNeeded = ((neededPercentage / 100) * selectedVehicle.batteryKwh).toFixed(1);
  const estimatedCost = (kwhNeeded * station.pricePerKwh).toFixed(2);
  const effectiveSpeedKw = Math.min(port.maxKw, selectedVehicle.maxChargeKw);
  const estimatedMinutes = Math.round((kwhNeeded / effectiveSpeedKw) * 60);

  const handleConfirm = () => {
    setIsLocking(true);
    // Simulate ACID / Mutex Lock delay
    setTimeout(() => {
      setIsLocking(false);
      onConfirmReservation({
        portId: port.id,
        vehicle: selectedVehicle.name,
        currentSoc,
        targetSoc,
        kwhNeeded,
        estimatedCost,
        estimatedMinutes,
        lockExpiresAt: 15,
        sessionId: 'VG-' + Math.floor(1000 + Math.random() * 9000),
        pinCode: Math.floor(1000 + Math.random() * 9000).toString()
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0c121e] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-950/60 overflow-hidden">
        {/* Corner tech brackets */}
        <div className="absolute top-2 left-2 text-xs font-mono text-cyan-600">┌ LOCK_PROTOCOL</div>
        <div className="absolute top-2 right-2 text-xs font-mono text-cyan-600">┐</div>
        <div className="absolute bottom-2 left-2 text-xs font-mono text-cyan-600">└</div>
        <div className="absolute bottom-2 right-2 text-xs font-mono text-cyan-600">┘</div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                Smart Slot Mutex Hold
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              Reserve {port.name} &bull; <span className="text-cyan-400">{port.type}</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {station.name} (${station.pricePerKwh.toFixed(2)} / kWh)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="py-4 space-y-5">
          {/* Vehicle selection */}
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              Select Your EV Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VEHICLE_PRESETS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                    selectedVehicle.id === v.id
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{v.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{v.batteryKwh} kWh &bull; Max {v.maxChargeKw}kW</div>
                  </div>
                  {selectedVehicle.id === v.id && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Battery State Sliders */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Current Battery SoC:</span>
                <span className="text-cyan-400 font-bold">{currentSoc}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="75"
                value={currentSoc}
                onChange={(e) => setCurrentSoc(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Target Battery SoC (Recommended 80% for speed):</span>
                <span className="text-emerald-400 font-bold">{targetSoc}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={targetSoc}
                onChange={(e) => setTargetSoc(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Estimates preview */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">Energy</span>
              <span className="text-sm font-bold text-white">{kwhNeeded} kWh</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">Est. Time</span>
              <span className="text-sm font-bold text-cyan-400">~{estimatedMinutes} mins</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">Est. Cost</span>
              <span className="text-sm font-bold text-emerald-400">${estimatedCost}</span>
            </div>
          </div>

          {/* Anti-Steal Guarantee info banner */}
          <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-3 flex items-start gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-slate-300">
              <span className="font-semibold text-cyan-300">Atomic Mutex Lock:</span> Once confirmed, this port is locked to your session for 15 minutes. No other driver can initiate a handshake.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLocking}
            className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95 transition-all"
          >
            {isLocking ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Acquiring Mutex Lock...
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Confirm & Lock Slot
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
