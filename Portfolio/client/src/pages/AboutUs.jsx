import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NetworkStatsCard from '../components/NetworkStatsCard';
import PartnerLogos from '../components/PartnerLogos';
import { Zap, ShieldCheck, Heart, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-24">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold tracking-wide">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>BUILT BY EV DRIVERS FOR EV DRIVERS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight">
            Driving India's <span className="text-red-500">EV Revolution</span>.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            Zeon Charging was born out of a simple passion: to make electric road trips reliable, friction-free, and joyful. Today, we operate India's highest uptime DC fast charging network across key interstate highway corridors and premier destinations.
          </p>

          <div className="pt-2">
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl shadow-red-600/30 transition-all hover:scale-105"
            >
              <span>Explore Our Charging Network</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Network Stats Card */}
        <NetworkStatsCard />

        {/* The Zeon Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">
              OUR JOURNEY
            </span>
            <h2 className="text-3xl font-extrabold text-white font-heading">
              Eliminating Highway Range Anxiety Once and for All
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              When we bought our first electric vehicles, highway charging was unpredictable. Stations were either broken, blocked, or lacked basic amenities.
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We decided to fix it by engineering high-uptime charging stations placed exclusively at verified hospitality properties like Radisson Blu, CGH Earth, Nexus Malls, and food courts. Every Zeon station delivers 99.4% uptime and 15-minute guaranteed slot reservations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-3xl font-black text-red-500 font-mono">99.4%</span>
              <p className="text-xs font-bold text-white">Network Uptime</p>
              <p className="text-[10px] text-zinc-500">Active telemetry monitor</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-3xl font-black text-red-500 font-mono">350kW</span>
              <p className="text-xs font-bold text-white">Max DC Throughput</p>
              <p className="text-[10px] text-zinc-500">CCS-2 liquid cooled</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-3xl font-black text-red-500 font-mono">15m</span>
              <p className="text-xs font-bold text-white">Guaranteed Bay Lock</p>
              <p className="text-[10px] text-zinc-500">Zero queue departure</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-3xl font-black text-red-500 font-mono">100k+</span>
              <p className="text-xs font-bold text-white">EV Drivers</p>
              <p className="text-[10px] text-zinc-500">Powering road trips</p>
            </div>
          </div>
        </div>

        {/* Location Partners */}
        <PartnerLogos />
      </main>

      <Footer />
    </div>
  );
}
