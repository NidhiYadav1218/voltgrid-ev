import React from 'react';
import { Zap, ShieldCheck, Activity, Cpu, LayoutDashboard, Car } from 'lucide-react';

export default function Header({ activeView, setActiveView, totalPorts, availablePorts }) {
  return (
    <header className="border-b border-slate-800 bg-[#0b101b]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 glow-cyan">
              <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white">VOLT<span className="text-cyan-400">GRID</span></span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 tracking-wider">
                MESH v2.4
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 hidden sm:block">
              AUTONOMOUS EV DISPATCH &bull; MUTEX LOCK PROTOCOL
            </p>
          </div>
        </div>

        {/* Telemetry quick badges */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">AVAILABLE:</span>
            <span className="text-emerald-400 font-bold">{availablePorts}/{totalPorts} PORTS</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">SLA:</span>
            <span className="text-white font-bold">99.98%</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">GRID:</span>
            <span className="text-amber-400 font-bold">50.02 Hz</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveView('driver')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'driver'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Driver Portal</span>
          </button>
          <button
            onClick={() => setActiveView('operator')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'operator'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Telemetry Console</span>
          </button>
        </div>
      </div>
    </header>
  );
}
