import React from 'react';

export default function PartnerLogos() {
  return (
    <section className="py-16 bg-black text-white w-full overflow-hidden border-y border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-normal font-sans tracking-wide text-white mb-12">
          Our Location Partners
        </h2>

        {/* Partners Logos Container */}
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-20 opacity-90 hover:opacity-100 transition-opacity">
          {/* AMPA SKYONE */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-full border border-pink-500/80 flex items-center justify-center relative">
              <div className="w-4 h-4 rounded-full border border-pink-400"></div>
            </div>
            <div className="text-left font-sans">
              <span className="block text-[10px] tracking-widest text-zinc-400 uppercase font-semibold">AMPA</span>
              <span className="block text-sm sm:text-base font-extrabold tracking-wider text-white">SKYONE</span>
            </div>
          </div>

          {/* AEROHUB */}
          <div className="flex items-center group cursor-pointer">
            <span className="text-lg sm:text-2xl font-black tracking-widest text-[#f97316] font-heading">
              AEROHUB
            </span>
          </div>

          {/* CGH Earth */}
          <div className="flex items-center gap-2 group cursor-pointer text-left">
            <div className="w-7 h-7 flex items-center justify-center text-zinc-300">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-zinc-300" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"/>
              </svg>
            </div>
            <div>
              <span className="block text-base sm:text-lg font-bold lowercase tracking-tight text-white font-serif">
                cgh<span className="font-light">earth</span>
              </span>
              <span className="block text-[8px] uppercase tracking-widest text-zinc-400">
                experience hotels
              </span>
            </div>
          </div>

          {/* Nexus */}
          <div className="flex items-center gap-1.5 group cursor-pointer">
            {/* Nexus colored star */}
            <span className="text-lg sm:text-xl text-amber-500 font-black">✱</span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white lowercase font-sans">
              nexus
            </span>
          </div>

          {/* Radisson Blu */}
          <div className="flex flex-col items-center group cursor-pointer text-left">
            <span className="text-xl sm:text-2xl font-bold italic tracking-wide text-white font-serif">
              Radisson
            </span>
            <span className="text-[10px] font-sans font-bold tracking-widest text-sky-400 uppercase -mt-1 bg-blue-950/80 px-1 rounded">
              BLU
            </span>
          </div>

          {/* Highway Food Plazas */}
          <div className="flex items-center gap-2 group cursor-pointer text-left">
            <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 font-bold text-xs">
              NH
            </div>
            <div>
              <span className="block text-xs font-bold text-white tracking-wide">
                Highway Plazas
              </span>
              <span className="block text-[9px] text-zinc-400">
                Food Courts & Rest Stops
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
