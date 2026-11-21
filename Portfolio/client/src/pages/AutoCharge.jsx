import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Zap, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Smartphone, Cpu } from 'lucide-react';

export default function AutoCharge() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-24">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEAMLESS PLUG & POWER UP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight">
            Charge Your EV <br />
            <span className="text-red-500">Without Touching Your Phone</span>.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            AutoCharge automatically identifies your electric vehicle the moment you plug in. No QR scanning, no app navigation, no waiting. Just plug in and walk away.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/locations"
              className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-105"
            >
              <span>Find AutoCharge Stations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/how_to_charge"
              className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs transition-all"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* 3 Step Flow */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              How AutoCharge Works in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Smart vehicle-to-cloud handshake over CCS-2 hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-left">
              <span className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center font-mono">
                1
              </span>
              <h3 className="font-bold text-white text-lg">One-Time Activation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect your vehicle once via the Zeon App. Our cloud registers your EV's unique digital identifier and links it securely to your Zeon account.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-left">
              <span className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-xl flex items-center justify-center font-mono">
                2
              </span>
              <h3 className="font-bold text-white text-lg">Plug In at Any Zeon Hub</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drive up to any Zeon DC fast charging bay across Gujarat. Insert the CCS-2 gun into your vehicle's charging socket.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 text-left">
              <span className="w-12 h-12 rounded-2xl bg-red-700 text-white font-black text-xl flex items-center justify-center font-mono">
                3
              </span>
              <h3 className="font-bold text-white text-lg">Power Flows Automatically</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Within seconds, the station authenticates your car, locks the connector, and starts pumping up to 350kW power. Seamless, secure, and instant.
              </p>
            </div>
          </div>
        </div>

        {/* Compatible Vehicles */}
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 text-center">
          <h2 className="text-2xl font-bold font-heading text-white">
            Supported AutoCharge Vehicles
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Compatible with all modern CCS-2 enabled electric passenger and fleet vehicles operating across India.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs font-semibold">
            {[
              'Tata Nexon EV (Max / Prime / Dark)',
              'Tata Punch EV',
              'Tata Curvv EV',
              'MG ZS EV',
              'Mahindra XUV400',
              'Hyundai Ioniq 5',
              'Kia EV6',
              'BYD Atto 3 & Seal',
              'BMW iX / i4',
              'Mercedes-Benz EQB / EQC'
            ].map((v) => (
              <span
                key={v}
                className="px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                <span>{v}</span>
              </span>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
