import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { QrCode, Smartphone, Zap, MapPin, CreditCard, ShieldCheck, ArrowRight, Download, CheckCircle2 } from 'lucide-react';

export default function MobileApp() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-24">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold tracking-wide">
              <span>⚡</span>
              <span>ZEON MOBILE APP • IOS & ANDROID</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight">
              Find Chargers, Charge & Pay with <span className="text-red-500">Zeon App</span>.
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
              Engineered for seamless EV road trips. Locate high-speed DC chargers, check live bay availability, track your real-time charging curve, and pay securely with Zeon Wallet.
            </p>

            {/* App Store / Google Play Buttons & QR Card */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs flex items-center gap-3 transition-all hover:scale-105 shadow-lg"
              >
                <div className="w-5 h-5 flex items-center justify-center text-lg font-bold">🍎</div>
                <div className="text-left">
                  <span className="block text-[9px] text-zinc-400 uppercase font-mono leading-none">Download on</span>
                  <span className="block text-sm font-extrabold leading-tight">App Store</span>
                </div>
              </a>

              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs flex items-center gap-3 transition-all hover:scale-105 shadow-lg"
              >
                <div className="w-5 h-5 flex items-center justify-center text-lg font-bold">▶️</div>
                <div className="text-left">
                  <span className="block text-[9px] text-zinc-400 uppercase font-mono leading-none">Get it on</span>
                  <span className="block text-sm font-extrabold leading-tight">Google Play</span>
                </div>
              </a>

              <Link
                to="/locations"
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-red-600/30"
              >
                <span>Find Chargers Online</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro QR scanner card */}
            <div className="inline-flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center">
                <QrCode className="w-12 h-12 text-black" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">SCAN TO DOWNLOAD</span>
                <span className="text-[11px] text-zinc-400">Scan with your smartphone camera to install.</span>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-72 sm:w-80 h-[560px] rounded-[48px] border-[6px] border-zinc-800 bg-zinc-950 p-4 shadow-2xl relative overflow-hidden shadow-red-600/20">
              {/* Notch */}
              <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
              </div>

              {/* App UI Screen Mockup */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>Ahmedabad SG Highway</span>
                  <span className="text-red-500 font-bold">● LIVE</span>
                </div>

                {/* Live Session Radar */}
                <div className="p-4 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 text-center space-y-2">
                  <span className="text-[10px] text-zinc-400 font-mono">CHARGING SESSION</span>
                  <div className="text-4xl font-black text-red-500 font-mono">68%</div>
                  <p className="text-xs text-zinc-300 font-bold">120 kW Ultra-Fast DC</p>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full w-[68%]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1">
                    <span>18.4 kWh Delivered</span>
                    <span>14 mins left</span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                    <CreditCard className="w-4 h-4 text-red-500 mx-auto mb-1" />
                    <span className="block text-[10px] text-zinc-400">WALLET</span>
                    <span className="font-bold text-white">₹1,450</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <span className="block text-[10px] text-zinc-400">AUTOPAY</span>
                    <span className="font-bold text-white">Active</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-red-600 text-white font-bold text-xs text-center cursor-pointer shadow-lg shadow-red-600/30">
                  Stop Session & Get Invoice
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="space-y-8 pt-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold font-heading text-white">
              Everything You Need on the Road
            </h2>
            <p className="text-zinc-400 text-sm">
              Purpose-built features designed by EV drivers for EV drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">Real-Time Station Radar</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Check live charger status before you drive. See exactly which CCS-2 or Type-2 bays are free right now across Gujarat.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-bold text-white text-lg">Live BMS Telemetry</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Watch your EV charging curve in real time. Track battery SoC %, current kW output, and time remaining without standing next to the car.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg">Instant Invoicing & Tax Receipts</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Automatic GST-compliant tax invoices with SAC Code 998714 generated upon unplugging, ready for business expense claims.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
