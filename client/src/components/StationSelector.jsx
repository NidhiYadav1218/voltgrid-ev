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
                ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-500/50 text-white'
                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {st.type || 'Highway Ultra-Fast Hub'}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {st.name}
                </h3>
              </div>

              {(st.solar || st.solarPowered) && (
                <div
                  className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full shrink-0"
                  title="Solar Microgrid Operating"
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>Solar</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{st.location}</span>
            </p>

            {/* Metrics footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {availableCount} Free
                </span>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">{inUseCount} In Use</span>
              </div>
              <div className="text-slate-900 dark:text-white font-bold">
                {formatRupees(st.pricePerKwh)}
                <span className="text-slate-400 font-normal text-[10px]">/kWh</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
