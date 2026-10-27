import React from 'react';
import { Zap, Lock, BatteryCharging, AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export default function PortCard({ port, pricePerKwh, onReserve, onStartCharge, onRelease }) {
  const isAvailable = port.status === 'available';
  const isCharging = port.status === 'charging';
  const isReserved = port.status === 'reserved';
  const isMaintenance = port.status === 'maintenance';

  return (
    <div className={`relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
      isAvailable
        ? 'bg-slate-900/60 border-emerald-900/40 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-950/40'
        : isCharging
        ? 'bg-slate-900/90 border-cyan-800/60 shadow-lg shadow-cyan-950/40'
        : isReserved
        ? 'bg-slate-900/70 border-amber-800/50'
        : 'bg-slate-950/80 border-slate-800 opacity-60'
    }`}>
      {/* Corner brackets */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-700">┌</div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-700">┐</div>

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              isAvailable ? 'bg-emerald-400 animate-pulse' :
              isCharging ? 'bg-cyan-400 animate-ping' :
              isReserved ? 'bg-amber-400' : 'bg-red-400'
            }`}></span>
            {port.name}
          </span>

          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            isAvailable ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' :
            isCharging ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800 animate-pulse' :
            isReserved ? 'bg-amber-950/80 text-amber-400 border-amber-800' :
            'bg-slate-900 text-slate-500 border-slate-800'
          }`}>
            {port.status}
          </span>
        </div>

        {/* Port Speed & Connector */}
        <div className="mt-1">
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <Zap className={`w-4 h-4 ${isCharging ? 'text-cyan-400 fill-cyan-400' : 'text-amber-400'}`} />
            {port.type}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-0.5">
            MAX THROUGHPUT: <span className="text-slate-200 font-bold">{port.maxKw} kW</span>
          </div>
        </div>

        {/* Dynamic State Info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 min-h-[90px]">
          {isAvailable && (
            <div className="space-y-1.5">
              <p className="text-xs text-slate-400">
                Ready for immediate connection or reservation with zero lock contention.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ACID Mutex Available
              </div>
            </div>
          )}

          {isReserved && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Anti-Steal Hold
                </span>
                <span className="text-slate-300 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {port.lockExpiresAt || 10}m left
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 truncate">
                Locked for: <span className="text-amber-300">{port.reservedBy || 'Driver Session'}</span>
              </div>
            </div>
          )}

          {isCharging && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{port.currentVehicle || 'Active EV'}</span>
                <span className="text-cyan-400 font-bold">{port.chargePercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${port.chargePercent}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>{port.powerKw || 120} kW active</span>
                <span>~{port.timeRemainingMin || 15}m to 80%</span>
              </div>
            </div>
          )}

          {isMaintenance && (
            <div className="flex items-center gap-2 text-xs text-amber-500/80 pt-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Connector calibration in progress. Scheduled back online soon.</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        {isAvailable && (
          <button
            onClick={() => onReserve(port)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock & Reserve Slot
          </button>
        )}

        {isReserved && (
          <button
            onClick={() => onStartCharge(port)}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 active:scale-[0.98]"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            Plug In & Start Charging
          </button>
        )}

        {isCharging && (
          <button
            onClick={() => onRelease(port)}
            className="w-full py-2 px-4 rounded-xl text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-950/80 hover:text-red-300 border border-slate-700 hover:border-red-800 text-slate-300"
          >
            Stop / Disconnect
          </button>
        )}

        {isMaintenance && (
          <button
            disabled
            className="w-full py-2 px-4 rounded-xl text-xs font-mono tracking-wider bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed text-center"
          >
            Offline
          </button>
        )}
      </div>
    </div>
  );
}
