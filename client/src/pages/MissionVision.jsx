import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Target, Compass, Leaf, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MissionVision() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-24">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold tracking-wide">
            <Target className="w-3.5 h-3.5" />
            <span>OUR CORE PURPOSE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight">
            Our Mission & <span className="text-red-500">Vision</span>.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            Accelerating India's transition to electric mobility by deploying the most dependable, highest-speed, and customer-obsessed charging infrastructure.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">Our Mission</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              To eliminate range anxiety for every Indian electric vehicle driver by establishing zero-downtime, high-power DC charging corridors equipped with guaranteed bay reservations and seamless AutoCharge technology.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">Our Vision</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              An India where 100% of intercity passenger and commercial transit is powered by clean, renewable electric energy, with charging stations as ubiquitous, rapid, and effortless as stopping for a cup of chai.
            </p>
          </div>
        </div>

        {/* Sustainability Goals */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#1e0808] border border-red-500/30 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Our Sustainability Commitment
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Every kilowatt-hour dispensed at our Gujarat hubs directly displaces imported fossil fuels and reduces greenhouse carbon emissions.
          </p>

          <div className="pt-2">
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl shadow-red-600/30 transition-all hover:scale-105"
            >
              <span>Explore Network Stations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
