import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Zap, Server, CheckCircle2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function AddYourCharger() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-24">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold tracking-wide">
            <Server className="w-3.5 h-3.5" />
            <span>OCPP 1.6J & 2.0.1 INTEGRATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight">
            List Your Existing Charger on the <span className="text-red-500">Zeon Network</span>.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            Already have EV charging equipment installed? Connect your chargers to Zeon’s high-traffic CMS platform. Gain instant visibility to 100,000+ verified EV drivers and boost station utilization.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#onboard-form"
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-105"
            >
              <span>Connect Your Charger</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/vendor/login"
              className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs transition-all"
            >
              CPO Operator Login
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h3 className="font-bold text-white text-lg">Instant Driver Traffic</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your station appears on the Zeon app and highway route planner, driving EV travelers directly to your venue.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg">Turnkey Cloud CMS</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Full remote diagnostics, real-time telemetry, automated tariffs, and dynamic load balancing with 99.4% uptime.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-lg">Automated Payouts</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Zero manual billing. Drivers pay via UPI or Zeon Wallet, and your revenue share is disbursed straight to your bank account with GST invoices.
            </p>
          </div>
        </div>

        {/* Onboarding Form */}
        <div id="onboard-form" className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-bold font-heading text-white text-center">
            Register Your Charger Details
          </h2>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2 text-emerald-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-base">Registration Submitted!</h4>
              <p className="text-xs text-emerald-200/80">
                Our OCPP integration engineer will reach out to configure your charger endpoints and initiate test charging.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">CPO / Owner Name</label>
                <input required type="text" placeholder="e.g. Anand Infra Ltd" className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Phone Number</label>
                <input required type="tel" placeholder="+91 98765 43210" className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Charger Make / Model</label>
                  <input required type="text" placeholder="e.g. ABB Terra 60kW" className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">Connector Protocol</label>
                  <select className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500">
                    <option>OCPP 1.6-JSON (Standard)</option>
                    <option>OCPP 2.0.1</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95">
                Submit Charger for Review
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
