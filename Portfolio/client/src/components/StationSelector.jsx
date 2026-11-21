import React from 'react';
import { MapPin, Sun, Zap } from 'lucide-react';
import { formatRupees } from '../lib/format.js';

export default function StationSelector({ stations = [], selectedStationId, onSelectStation }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stations.map((st) => {
        const stationId = st.stationId || st.id;
        const isSelected = stationId === selectedStationId;
        const availableCount = (st.ports || []).filter((p) => p.status === 'available').length;
        const inUseCount = (st.ports || []).filter((p) => p.status === 'charging' || p.status === 'reserved').length;

        return (
          <button
            key={stationId}
            type="button"
            onClick={() => onSelectStation(stationId)}
            className={`w-full text-left rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
              isSelected
                ? 'bg-zinc-900 border-red-500 shadow-xl shadow-red-950/40 ring-2 ring-red-500/50 text-white'
                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/90 text-zinc-300 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  {st.type || 'Zeon Fast Hub'}
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-red-400 transition-colors">
                  {st.name}
                </h3>
              </div>

              {(st.solar || st.solarPowered) && (
                <div
                  className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded-full shrink-0"
                  title="Solar Microgrid Operating"
                >
                  <Sun className="w-3 h-3 text-amber-400" />
                  <span>Solar</span>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-400 flex items-center gap-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="truncate">{st.location}</span>
            </p>

            {/* Metrics footer */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {availableCount} Free
                </span>
                <span className="text-zinc-600">&bull;</span>
                <span className="text-amber-400 font-medium">{inUseCount} In Use</span>
              </div>
              <span className="font-bold text-white">
                {formatRupees(st.pricePerKwh)}/kWh
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
