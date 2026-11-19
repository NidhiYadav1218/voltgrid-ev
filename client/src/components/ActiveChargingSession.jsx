import React, { useState, useEffect } from 'react';
import { Zap, BatteryCharging, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatRupees } from '../lib/format.js';
import { releasePort } from '../api/stations.js';

export default function ActiveChargingSession({ session, onComplete }) {
  const targetSoc = session?.targetSoc || 100;
  const pricePerKwh = session?.pricePerKwh || 26;

  const [currentSoc, setCurrentSoc] = useState(session?.currentSoc || 35);
  const [powerKw, setPowerKw] = useState(session?.kw || 120);
  const [kwDelivered, setKwDelivered] = useState(session?.energyKwh ? Math.round(session.energyKwh * 0.4) : 10);
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState('');

  const isComplete = currentSoc >= targetSoc;

  // Live simulation ticker: stops increasing when target charge reached
  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setPowerKw((prev) => {
        const delta = (Math.random() - 0.48) * 3;
        return Math.max(40, Math.min(180, Math.round(prev + delta)));
      });

      setKwDelivered((prev) => +(prev + 0.1).toFixed(2));

      setCurrentSoc((prev) => {
        const next = +(prev + 0.5).toFixed(1);
        if (next >= targetSoc) {
          return targetSoc;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, targetSoc]);

  // Cost calculation based on delivered kWh + convenience fee (₹40) + 18% GST
  const baseCost = +(kwDelivered * pricePerKwh).toFixed(2);
  const fee = 40.0;
  const gst = +((baseCost + fee) * 0.18).toFixed(2);
  const runningTotal = +(baseCost + fee + gst).toFixed(2);

  const handleStop = async () => {
    setStopping(true);
    setError('');

    try {
      const stationId = session?.stationId || 'st-01';
      const portId = session?.portId || 'p101';

      const res = await releasePort(stationId, portId);
      if (onComplete) {
        onComplete(res.booking || session);
      }
    } catch (err) {
      setError(err.message || 'Failed to release charging port');
      setStopping(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden text-white">
      {/* Background glow */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Session Info */}
        <div className="space-y-3 w-full lg:w-1/2">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Live Charging Session &bull; {session?.portName || session?.portId || 'Bay 01'}
            </span>
            <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded">
              {session?.bookingCode || 'BK-ACTIVE'}
            </span>
          </div>

          <h2 className="text-2xl font-black font-heading text-white">
            {session?.vehicleModel || session?.vehicle || 'MG ZS EV'}
          </h2>
          <p className="text-xs font-mono text-slate-400">
            {session?.stationName || 'VoltGrid SuperHub'} &bull; CCS2 DC Fast Flow
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Rate</span>
              <span className="text-lg font-bold text-cyan-400">{isComplete ? 0 : powerKw} kW</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Delivered</span>
              <span className="text-lg font-bold text-emerald-400">{kwDelivered} kWh</span>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Total Bill</span>
              <span className="text-lg font-bold text-white">{formatRupees(runningTotal)}</span>
            </div>
          </div>
        </div>

        {/* Right: Circular Battery Dial & Release Action */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-end">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * currentSoc) / 100}
                className="text-emerald-500 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono text-white">{Math.round(currentSoc)}%</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {isComplete ? 'Target Reached' : 'SoC'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {isComplete && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Battery Charged to Target!</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleStop}
              disabled={stopping}
              className="px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {stopping ? (
                <span>Finalizing Settlement...</span>
              ) : (
                <span>Stop & Unplug Session</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
