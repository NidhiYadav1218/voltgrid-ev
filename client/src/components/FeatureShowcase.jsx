import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Zap,
  Clock,
  Gauge,
  Coffee,
  FileText,
  Navigation,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function FeatureShowcase() {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const features = [
    {
      id: 'nearby',
      tag: 'REAL-TIME RADAR',
      title: 'Find Nearby EV Chargers Instantly',
      desc: 'Locate active Gujarat highway fast charging stations with real-time port status & distance updates.',
      icon: MapPin,
      accent: 'emerald',
      mockup: (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-3.5 text-white font-sans">
          {/* Top Notch Status */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto"></div>
            <span>5G ⚡</span>
          </div>

          {/* Search bar mockup */}
          <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 mb-3">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-300 truncate">Ahmedabad SG Highway</span>
          </div>

          {/* Mini Radar Map Graphic */}
          <div className="flex-1 bg-slate-950/90 rounded-2xl p-3 border border-slate-800/80 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>

            <div className="relative z-10 flex justify-between items-start">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                ● 34 HUBS LIVE
              </span>
              <span className="text-[9px] font-mono text-slate-400">2.4 km away</span>
            </div>

            {/* Simulated map station pins */}
            <div className="relative z-10 my-auto flex flex-col items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 animate-ping absolute inset-0"></div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/40 relative z-10">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
              </div>
              <p className="text-[11px] font-bold mt-2 text-white">SG Highway Superhub</p>
              <p className="text-[9px] text-emerald-400 font-mono">4 of 6 Bays Available</p>
            </div>

            {/* Quick action card */}
            <div className="relative z-10 p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-white">CCS-2 DC Fast</p>
                <p className="text-[9px] font-mono text-slate-400">Up to 150 kW • ₹24/kWh</p>
              </div>
              <span className="px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[9px]">
                Lock Bay
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'flux',
      tag: 'DYNAMIC POWER',
      title: 'Charge Faster with Dynamic Flux',
      desc: 'When other connectors are free, Flux routes maximum grid throughput up to 350kW for a faster charge.',
      icon: Zap,
      accent: 'cyan',
      mockup: (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-3.5 text-white font-sans">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto"></div>
            <span>120 kW</span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-cyan-400 font-bold">FLUX ACTIVE</span>
              <span className="text-[9px] font-mono text-slate-400">Bay #02 • CCS-2</span>
            </div>

            {/* Animated power graphic */}
            <div className="flex flex-col items-center my-auto">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#06b6d4"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="60"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black font-mono text-white">76%</span>
                  <span className="text-[9px] text-cyan-400 font-bold">120 kW</span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-white mt-1">+24.8 kWh added</p>
              <p className="text-[9px] text-slate-400 font-mono">14 mins to 80%</p>
            </div>

            <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-center">
              <p className="text-[10px] text-cyan-300 font-bold">⚡ Max Flux Boost Engaged</p>
              <p className="text-[8px] text-slate-400">Peak thermal management running</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'lock',
      tag: 'ZERO QUEUE',
      title: '15-Min Guaranteed Instant Hold',
      desc: 'Simply reserve on approach. Your charger bay is locked exclusively with a 4-digit PIN before you arrive.',
      icon: Clock,
      accent: 'amber',
      mockup: (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-3.5 text-white font-sans">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto"></div>
            <span>Locked</span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                🔒 BAY SECURED
              </span>
              <h4 className="text-xs font-bold text-white mt-2">Vadodara Express Terminal</h4>
              <p className="text-[9px] text-slate-400">Bay 01 • 150 kW Ultra-Fast</p>
            </div>

            {/* Digital PIN Display */}
            <div className="my-auto text-center p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                Activation PIN
              </p>
              <div className="flex gap-2 justify-center my-2">
                {['7', '4', '9', '2'].map((digit, idx) => (
                  <span
                    key={idx}
                    className="w-8 h-10 rounded-lg bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center font-mono shadow-md shadow-amber-500/30"
                  >
                    {digit}
                  </span>
                ))}
              </div>
              <p className="text-[9px] text-amber-400 font-mono">⏱️ 14:28 remaining</p>
            </div>

            <p className="text-[9px] text-center text-slate-400">
              Enter this PIN at the charger screen upon arrival to start.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'telematics',
      tag: 'CONNECTED CAR',
      title: 'Live Vehicle BMS Telematics',
      desc: 'Monitor real-time state-of-charge, speed, remaining range, and battery health on your live dashboard.',
      icon: Gauge,
      accent: 'emerald',
      mockup: (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-3.5 text-white font-sans">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto"></div>
            <span>MG ZS EV</span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">MG ZS EV Excite</p>
                <p className="text-[9px] font-mono text-emerald-400">● Telemetry Connected</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">50.3 kWh</span>
            </div>

            {/* Battery graphic */}
            <div className="my-auto p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 text-[10px]">Battery SoC</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">82%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="h-full bg-emerald-500 rounded-full w-[82%]"></div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1">
                <span>Range: 345 km</span>
                <span>Temp: 31°C</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400 text-[8px]">ODOMETER</p>
                <p className="font-bold text-white">14,272 km</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-400 text-[8px]">HEALTH</p>
                <p className="font-bold text-emerald-400">98.4% SOH</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'amenities',
      tag: 'CORRIDOR LIFESTYLE',
      title: 'Explore Nearby Places While You Charge',
      desc: 'Discover verified cafes, highway food plazas, clean restrooms, and lounges while your EV supercharges.',
      icon: Coffee,
      accent: 'purple',
      mockup: (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-3.5 text-white font-sans">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto"></div>
            <span>Amenities</span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-mono text-purple-400 font-bold">NEARBY AMENITIES</span>
              <p className="text-[10px] text-slate-400">At Surat Highway Superhub</p>
            </div>

            <div className="space-y-2 my-auto">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">☕</span>
                  <div>
                    <p className="text-[10px] font-bold text-white">Express Cafe & Tea</p>
                    <p className="text-[8px] text-slate-400">Food Court • 30m walk</p>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold">Open</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🍽️</span>
                  <div>
                    <p className="text-[10px] font-bold text-white">Honest Highway Plaza</p>
                    <p className="text-[8px] text-slate-400">Family Dining • 50m</p>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold">Open</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🚻</span>
                  <div>
                    <p className="text-[10px] font-bold text-white">Clean Restrooms</p>
                    <p className="text-[8px] text-slate-400">Wheelchair friendly</p>
                  </div>
                </div>
                <span className="text-[9px] text-purple-400 font-bold">Free</span>
              </div>
            </div>

            <div className="text-center text-[9px] text-slate-400 font-mono">
              Unwind while your EV charges to 100%
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'invoice',
      tag: 'GST READY',
      title: 'Secure Instant Tax Invoices',
      desc: 'Receive automated GST tax invoices with SAC code, CGST/SGST breakdown, and instant UTR payment receipts.',
      icon: FileText,
      accent: 'emerald',
      mockup: (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-3.5 text-white font-sans">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto"></div>
            <span>Invoice</span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-col justify-between font-mono text-[9px]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-white">VOLTGRID TAX INVOICE</span>
              <span className="text-emerald-400">PAID</span>
            </div>

            <div className="space-y-1.5 my-auto bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Energy (28.4 kWh):</span>
                <span className="text-white">₹681.60</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bay Hold (15 min):</span>
                <span className="text-emerald-400">₹0.00 FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GST (18% SAC 9987):</span>
                <span className="text-white">₹122.68</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-sm text-white">
                <span>TOTAL:</span>
                <span className="text-emerald-400 font-bold">₹804.28</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-emerald-400 font-bold text-[10px]">✓ GST Credit Eligible</span>
              <p className="text-slate-400 text-[8px] mt-0.5">Downloaded to your Profile</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'route',
      tag: 'EXPRESSWAY READY',
      title: 'Smart Highway Corridor Planner',
      desc: 'Plan seamless journeys across Gujarat expressways with automated charging stop recommendations.',
      icon: Navigation,
      accent: 'blue',
      mockup: (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-3.5 text-white font-sans">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto"></div>
            <span>Route</span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-blue-400 font-bold">NE1 EXPRESSWAY</span>
              <span className="text-[9px] text-slate-400">268 km Trip</span>
            </div>

            {/* Stepper route */}
            <div className="space-y-3 my-auto pl-2 border-l-2 border-blue-500/40 relative">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[13px] top-0.5"></div>
                <p className="text-[10px] font-bold text-white">Ahmedabad (Start)</p>
                <p className="text-[8px] text-slate-400">Battery: 92% SoC</p>
              </div>

              <div className="relative bg-slate-900 p-2 rounded-xl border border-blue-500/30">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[13px] top-3"></div>
                <p className="text-[10px] font-bold text-white">⚡ Vadodara Stop (18m)</p>
                <p className="text-[8px] text-blue-400">Charge 32% → 80%</p>
              </div>

              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[13px] top-0.5"></div>
                <p className="text-[10px] font-bold text-white">Surat City (Arrival)</p>
                <p className="text-[8px] text-slate-400">Arrive with 54% SoC</p>
              </div>
            </div>

            <div className="text-center text-[9px] text-blue-300 font-mono bg-blue-950/40 p-1.5 rounded-lg border border-blue-800/40">
              Zero Queue • Guarantees 0 Delay
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'support',
      tag: 'ALWAYS ON',
      title: '24x7 Corridor Helpline & Roadside',
      desc: 'Gujarat statewide dispatch and EV technical engineers on standby to keep your journey uninterrupted.',
      icon: Headphones,
      accent: 'rose',
      mockup: (
        <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-3.5 text-white font-sans">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1">
            <span>09:41</span>
            <div className="w-16 h-3 bg-slate-950 rounded-full mx-auto"></div>
            <span>Helpdesk</span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-2xl p-3.5 border border-slate-800 flex flex-col justify-between text-center">
            <span className="text-[9px] font-mono text-rose-400 font-bold">STATE DISPATCH</span>

            <div className="my-auto space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 text-xl">
                📞
              </div>
              <p className="text-xs font-bold text-white">Toll-Free EV Helpline</p>
              <p className="text-[11px] font-mono font-bold text-rose-400">1800 200 4848</p>
              <p className="text-[9px] text-slate-400 max-w-[170px] mx-auto">
                Corridor technicians stationed across Ahmedabad, Vadodara, Surat & Rajkot.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[9px] text-emerald-400 font-bold">
              ✓ Average response time: &lt; 8 mins
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <span>⚡</span>
              <span>Next-Gen EV Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-heading">
              Powerful Features at{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Your Fingertips
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Advanced technology engineered for effortless EV road trips across Gujarat's fast-charging corridors.
            </p>
          </div>

          {/* Action & Carousel Navigation Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/features"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Try Live Interactive Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => scroll('left')}
              title="Scroll Left"
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              title="Scroll Right"
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Phone Cards Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="w-[280px] sm:w-[300px] shrink-0 snap-start flex flex-col group"
              >
                {/* Phone Mockup Frame */}
                <div className="w-full h-[480px] rounded-[38px] border-[5px] border-slate-800/90 bg-slate-950 p-2.5 shadow-2xl relative overflow-hidden transition-all duration-300 group-hover:border-slate-700 group-hover:shadow-emerald-500/10">
                  {feat.mockup}
                </div>

                {/* Feature Description below phone */}
                <div className="mt-4 px-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
