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
          ? 'bg-zinc-900/90 border-zinc-800 hover:border-red-500/60 hover:shadow-xl hover:shadow-red-950/20 text-white'
          : isCharging
          ? 'bg-zinc-950 border-red-700 text-white shadow-lg'
          : isReserved
          ? 'bg-zinc-900/90 border-amber-800/60 text-white'
          : 'bg-zinc-950 border-zinc-900 opacity-60 text-zinc-400'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-bold text-zinc-200 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable
                  ? 'bg-emerald-500 animate-pulse'
                  : isCharging
                  ? 'bg-red-500 animate-ping'
                  : isReserved
                  ? 'bg-amber-500'
                  : 'bg-zinc-600'
              }`}
            ></span>
            {port.name}
          </span>

          <span
            className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isAvailable
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
                : isCharging
                ? 'bg-red-950/80 text-red-400 border-red-800 animate-pulse'
                : isReserved
                ? 'bg-amber-950/60 text-amber-400 border-amber-800'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            {port.status}
          </span>
        </div>

        {/* Port Speed & Connector */}
        <div className="mt-1">
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <Zap className={`w-4 h-4 ${isCharging ? 'text-red-500 fill-red-500' : 'text-red-500'}`} />
            {port.type}
          </div>
          <div className="text-xs font-mono text-zinc-400 mt-0.5 flex items-center gap-2">
            <span>DISPENSER: <strong className="text-white">{port.maxKw} kW DC</strong></span>
            <span>&bull;</span>
            <span>{port.connector || 'CCS-2'}</span>
          </div>
        </div>

        {/* Dynamic State Info */}
        <div className="mt-4 pt-3 border-t border-zinc-800 min-h-[80px]">
          {isAvailable && (
            <div className="space-y-1.5">
              <p className="text-xs text-zinc-400">
                Ready for high-speed charging or 15-minute guaranteed hold reservation.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Guaranteed Available
              </div>
            </div>
          )}

          {isReserved && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Bay Reserved
                </span>
                {timeLeft && (
                  <span className="text-zinc-200 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {timeLeft}
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-zinc-300 bg-zinc-950 p-2 rounded-lg border border-zinc-800 truncate">
                {port.isMine ? (
                  <span className="text-emerald-400 font-bold">✓ Held for your session</span>
                ) : (
                  <span>Held for incoming driver</span>
                )}
              </div>
            </div>
          )}

          {isCharging && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  Active Power Flow
                </span>
                <span className="text-red-400 font-bold">{port.soc !== undefined && port.soc !== null ? `${port.soc}%` : 'Charging...'}</span>
              </div>
              <div className="text-[11px] font-mono text-zinc-300">
                Dispensing: <strong className="text-red-400">{port.kw || port.maxKw || 60} kW</strong>
              </div>
            </div>
          )}

          {isMaintenance && (
            <p className="text-xs text-zinc-500">
              Port currently offline for scheduled maintenance or firmware diagnostic.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-zinc-800">
        {isAvailable && (
          <button
            type="button"
            onClick={() => onReserve(port)}
            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95"
          >
            <span>Reserve Bay</span>
            <span className="text-[10px] font-mono opacity-80">({formatRupees(pricePerKwh)}/kWh)</span>
          </button>
        )}

        {isReserved && port.isMine && (
          <button
            type="button"
            onClick={() => onStartCharge(port)}
            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Enter Security PIN</span>
          </button>
        )}

        {isReserved && !port.isMine && (
          <div className="w-full py-2 rounded-xl text-center text-xs font-mono text-zinc-400 bg-zinc-950/80 border border-zinc-800">
            Bay Unavailable
          </div>
        )}

        {isCharging && (
          <button
            type="button"
            onClick={() => onRelease(port)}
            className="w-full py-2 rounded-xl font-bold text-xs bg-zinc-800 hover:bg-red-700 text-zinc-300 hover:text-white transition-all cursor-pointer border border-zinc-700 hover:border-red-600"
          >
            Stop & Complete Session
          </button>
        )}
      </div>
    </div>
  );
}
