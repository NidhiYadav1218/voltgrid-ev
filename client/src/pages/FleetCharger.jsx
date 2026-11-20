import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Truck, ShieldCheck, Zap, BarChart3, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function FleetCharger() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-24">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold tracking-wide">
            <Truck className="w-3.5 h-3.5" />
            <span>COMMERCIAL EV FLEET INFRASTRUCTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight">
            Accelerate Your Fleet Electrification with <span className="text-red-500">Zeon</span>.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            Turnkey charging infrastructure built for commercial fleets, delivery vans, electric buses, and corporate fleets across Gujarat’s high-traffic logistics corridors.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/locations"
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-105"
            >
              <span>Explore Fleet Corridors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:fleet@zeoncharging.com"
              className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs transition-all"
            >
              Contact Fleet Solutions
            </a>
          </div>
        </div>

        {/* 3 Pillars for Fleets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-bold text-white text-lg">Depot + En-Route Fast Charging</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Combine private overnight depot slow chargers with access to Zeon’s 150kW+ public highway corridors for zero vehicle downtime.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg">Central Corporate Billing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No out-of-pocket reimbursements for drivers. Issue Zeon RFID fleet tags with pre-set charging allowances and consolidated monthly GST invoices.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg">Live Telematics Dashboard</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time energy consumption, driver session logs, cost per kilometer tracking, and CO2 reduction reporting.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
