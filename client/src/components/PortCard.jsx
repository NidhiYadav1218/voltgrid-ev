import React, { useState, useEffect } from 'react';
import { Zap, Lock, BatteryCharging, CheckCircle2, Clock } from 'lucide-react';
import { formatRupees } from '../lib/format.js';

export default function PortCard({ port, pricePerKwh, onReserve, onStartCharge, onRelease }) {
  const isAvailable = port.status === 'available';
  const isCharging = port.status === 'charging';
  const isReserved = port.status === 'reserved';
  const isMaintenance = port.status === 'maintenance';

  // Countdown timer for reserved hold
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!isReserved || !port.holdExpiresAt) {
      setTimeLeft('');
      return;
    }

    function updateTimer() {
      const remainingMs = new Date(port.holdExpiresAt).getTime() - Date.now();
      if (remainingMs <= 0) {
        setTimeLeft('Hold expired');
      } else {
        const mins = Math.floor(remainingMs / 60000);
        const secs = Math.floor((remainingMs % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isReserved, port.holdExpiresAt]);

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isAvailable
          ? 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-emerald-900/40 hover:border-emerald-500 hover:shadow-lg'
          : isCharging
          ? 'bg-slate-900 border-cyan-800 text-white shadow-lg'
          : isReserved
          ? 'bg-amber-500/5 dark:bg-slate-900/80 border-amber-300 dark:border-amber-800/60'
          : 'bg-slate-100 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 opacity-60'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable
                  ? 'bg-emerald-500 animate-pulse'
                  : isCharging
                  ? 'bg-cyan-400 animate-ping'
                  : isReserved
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            ></span>
            {port.name}
          </span>

          <span
            className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isAvailable
                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : isCharging
                ? 'bg-cyan-950 text-cyan-400 border-cyan-800 animate-pulse'
                : isReserved
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}
          >
            {port.status}
          </span>
        </div>

        {/* Port Speed & Connector */}
        <div className="mt-1">
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Zap className={`w-4 h-4 ${isCharging ? 'text-cyan-400 fill-cyan-400' : 'text-amber-500'}`} />
            {port.type}
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
            <span>MAX POWER: <strong className="text-slate-800 dark:text-slate-200">{port.maxKw} kW</strong></span>
            <span>&bull;</span>
            <span>{port.connector || 'CCS2'}</span>
          </div>
        </div>

        {/* Dynamic State Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 min-h-[80px]">
          {isAvailable && (
            <div className="space-y-1.5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ready for immediate connection or advance hold reservation.
              </p>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Guaranteed Available
              </div>
            </div>
          )}

          {isReserved && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Spot Reserved
                </span>
                {timeLeft && (
                  <span className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {timeLeft}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 truncate">
                {port.isMine ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Held for your session</span>
                ) : (
                  <span>Held for incoming driver</span>
                )}
              </div>
            </div>
          )}

          {isCharging && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Live Flow
                </span>
                <span className="text-cyan-400 font-bold">{port.soc !== undefined && port.soc !== null ? `${port.soc}%` : 'Charging...'}</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                Active output: <strong className="text-cyan-400">{port.kw || port.maxKw || 60} kW</strong>
              </div>
            </div>
          )}

          {isMaintenance && (
            <p className="text-xs text-slate-500">
              Port currently offline for scheduled maintenance or firmware diagnostic.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {isAvailable && (
          <button
            type="button"
            onClick={() => onReserve(port)}
            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Reserve Spot</span>
            <span className="text-[10px] font-mono opacity-80">({formatRupees(pricePerKwh)}/kWh)</span>
          </button>
        )}

        {isReserved && port.isMine && (
          <button
            type="button"
            onClick={() => onStartCharge(port)}
            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Enter Security PIN</span>
          </button>
        )}

        {isReserved && !port.isMine && (
          <div className="w-full py-2 rounded-xl text-center text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/40">
            Bay Unavailable
          </div>
        )}

        {isCharging && (
          <button
            type="button"
            onClick={() => onRelease(port)}
            className="w-full py-2 rounded-xl font-bold text-xs bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700 hover:border-rose-500"
          >
            Stop & Complete Session
          </button>
        )}
      </div>
    </div>
  );
}
