import React from 'react';
import { Activity, ShieldCheck, Cpu, Database, Server, Zap } from 'lucide-react';

export default function OperatorTelemetry({ stats }) {
  if (!stats) return null;

  const { counts = {}, ports = {}, financials = {} } = stats;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Live Telemetry Grid
          </span>
          <h2 className="text-xl font-bold font-heading text-white mt-0.5">
            Real-Time State Infrastructure Metrics
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>ONLINE &bull; REST API</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Hubs Registered</span>
          <div className="text-2xl font-black font-mono text-white mt-1">{counts.stations || 0}</div>
          <span className="text-[10px] text-slate-500">Across Gujarat</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Registered Drivers</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{counts.users || 0}</div>
          <span className="text-[10px] text-slate-500">Active accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">CPO Operators</span>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">{counts.vendors || 0}</div>
          <span className="text-[10px] text-slate-500">Charging networks</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Occupancy Rate</span>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">{ports.occupancyRate || 0}%</div>
          <span className="text-[10px] text-slate-500">{ports.charging || 0} active charging</span>
        </div>
      </div>
    </div>
  );
}
