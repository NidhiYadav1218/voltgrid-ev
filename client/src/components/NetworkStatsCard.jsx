import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function NetworkStatsCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 p-6 sm:p-10 text-white shadow-2xl border border-emerald-400/20">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading and CTA */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/40 border border-white/20 text-emerald-200 text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-300" />
            <span>Gujarat Statewide Supergrid</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight leading-tight">
            Our Charging Network
          </h2>

          <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed max-w-md">
            Connecting Ahmedabad, Vadodara, Surat, Rajkot, and key expressway corridors with high-power, zero-queue DC fast charging infrastructure.
          </p>

          <div className="pt-2">
            <Link
              to="/hubs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-emerald-50 shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore Network Hubs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Key Metrics / Stats Counters */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 lg:border-l lg:border-white/20 lg:pl-8">
          {/* Stat 1 */}
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white">
              34<span className="text-emerald-300">+</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-100">SuperHub Locations</p>
            <p className="text-[10px] text-emerald-200/80 font-mono">Major Highways & Cities</p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white">
              136<span className="text-emerald-300">+</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-100">Dedicated DC Bays</p>
            <p className="text-[10px] text-emerald-200/80 font-mono">Up to 350kW CCS-2 Guns</p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white">
              15<span className="text-emerald-300 font-sans text-2xl sm:text-3xl"> min</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-100">Guaranteed Bay Lock</p>
            <p className="text-[10px] text-emerald-200/80 font-mono">Zero-Wait PIN Activation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
