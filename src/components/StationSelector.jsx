import React from 'react';
import { MapPin, Zap, Sun, Shield } from 'lucide-react';

export default function StationSelector({ stations, selectedStationId, onSelectStation }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stations.map((st) => {
        const isSelected = st.id === selectedStationId;
        const availableCount = st.ports.filter(p => p.status === 'available').length;
        const chargingCount = st.ports.filter(p => p.status === 'charging').length;

        return (
          <div
            key={st.id}
            onClick={() => onSelectStation(st.id)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden group ${
              isSelected
                ? 'bg-slate-900/90 border-cyan-500/80 shadow-lg shadow-cyan-950/50 glow-cyan ring-1 ring-cyan-500/50'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
            }`}
          >
            {/* Corner tech accents */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-600">┌</div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-600">┐</div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-600">└</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-600">┘</div>

            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  {st.type}
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                  {st.name}
                </h3>
              </div>

              {st.solarPowered && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full" title="Powered by Solar Microgrid">
                  <Sun className="w-3 h-3 text-emerald-400" />
                  <span>Solar</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{st.location}</span>
            </p>

            {/* Metrics footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {availableCount} Free
                </span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-amber-400">{chargingCount} In Use</span>
              </div>
              <div className="text-cyan-400 font-bold">
                ${st.pricePerKwh.toFixed(2)}<span className="text-slate-500 font-normal">/kWh</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
