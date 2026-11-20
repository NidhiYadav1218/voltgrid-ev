import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function NetworkStatsCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#b91c1c] p-8 sm:p-12 text-white shadow-2xl border border-red-500/30">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-400/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-black/20 blur-2xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Section: Title & Pill Button */}
        <div className="lg:col-span-5 space-y-5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
            Our Charging <br className="hidden sm:inline" />
            Network
          </h2>

          <div>
            <Link
              to="/hubs"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/60 hover:border-white text-white font-medium text-sm tracking-wide bg-white/5 hover:bg-white/15 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore Now</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Right Section: 3 Stats Columns with Vertical Dividers */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 items-center">
          {/* Stat 1: 500+ Locations */}
          <div className="sm:border-l sm:border-white/20 sm:pl-8 space-y-1">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white">
              500<span className="text-red-200">+</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-white/90">
              Locations
            </p>
          </div>

          {/* Stat 2: 1000+ Charge Points */}
          <div className="sm:border-l sm:border-white/20 sm:pl-8 space-y-1">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white">
              1000<span className="text-red-200">+</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-white/90">
              Charge Points
            </p>
          </div>

          {/* Stat 3: 90+ Now Building */}
          <div className="sm:border-l sm:border-white/20 sm:pl-8 space-y-1">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-white">
              90<span className="text-red-200">+</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-white/90">
              Now Building
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
