import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, QrCode, Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-zinc-400 border-t border-zinc-900 pt-16 pb-12 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand & Zeon App Download */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 shadow-lg shadow-red-600/30">
                <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-red-500 fill-current" />
                </div>
              </div>
              <div>
                <span className="font-black text-xl tracking-wider text-white font-heading">
                  ZEON<span className="text-red-500 ml-1">CHARGING</span>
                </span>
                <p className="text-[10px] text-zinc-400 font-medium">
                  Driving India's EV Revolution
                </p>
              </div>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              India's highest uptime EV fast charging network. Connecting major national highways, expressways, luxury resorts, and city centers with ultra-fast DC dispensers and zero queue reservations.
            </p>

            <div className="flex items-center gap-2 text-zinc-300 font-mono text-[11px]">
              <span>CHARGED WITH</span>
              <span className="text-red-500">❤️</span>
              <span>IN INDIA 🇮🇳</span>
            </div>

            {/* Zeon Mobile App QR Card */}
            <div className="p-3 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex items-center gap-3.5 max-w-xs shadow-inner">
              <div className="w-14 h-14 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-black" />
              </div>
              <div>
                <p className="font-bold text-white text-[11px] font-mono tracking-wider">ZEON MOBILE APP</p>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                  Scan to download for iOS & Android. Fast plug, live SoC tracking, and AutoCharge.
                </p>
              </div>
            </div>
          </div>

          {/* Column: Charging Solutions */}
          <div className="space-y-3">
            <h4 className="font-bold font-mono text-white text-xs tracking-wider uppercase text-red-400">
              Charging
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/hubs" className="hover:text-red-400 transition-colors">
                  Locations & Map
                </Link>
              </li>
              <li>
                <Link to="/simulator" className="hover:text-red-400 transition-colors">
                  EV Range & Time Simulator
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-red-400 transition-colors">
                  How To Charge
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-red-400 transition-colors">
                  AutoCharge & RFID
                </a>
              </li>
              <li>
                <a href="#chargers" className="hover:text-red-400 transition-colors">
                  15-Min Bay Reservation
                </a>
              </li>
            </ul>
          </div>

          {/* Column: Business & Host */}
          <div className="space-y-3">
            <h4 className="font-bold font-mono text-white text-xs tracking-wider uppercase text-red-400">
              Business & Partners
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vendor/login" className="hover:text-white transition-colors text-zinc-300 font-semibold">
                  Host a Charger (CPO)
                </Link>
              </li>
              <li>
                <Link to="/vendor" className="hover:text-red-400 transition-colors">
                  Venue Revenue Calculator
                </Link>
              </li>
              <li>
                <span className="text-zinc-500">
                  Fleet Charging Solutions
                </span>
              </li>
              <li>
                <span className="text-zinc-500">
                  Commercial & Mall Hubs
                </span>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-red-400 transition-colors">
                  Zeon Network Ops (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Support & Help */}
          <div className="space-y-3">
            <h4 className="font-bold font-mono text-white text-xs tracking-wider uppercase text-red-400">
              24x7 Assistance
            </h4>
            <ul className="space-y-2">
              <li className="pt-1">
                <span className="block text-[10px] text-zinc-500 uppercase font-mono">
                  Toll-Free Helpline
                </span>
                <a href="tel:18002031500" className="font-mono font-bold text-white text-sm hover:text-red-400">
                  1800 203 1500
                </a>
              </li>
              <li>
                <span className="block text-[10px] text-zinc-500 uppercase font-mono">
                  Email Support
                </span>
                <a href="mailto:support@zeoncharging.com" className="text-zinc-300 hover:text-red-400">
                  support@zeoncharging.com
                </a>
              </li>
              <li className="pt-2 text-zinc-400 text-[11px]">
                Operated across 500+ highway locations, luxury resorts, and high-density metro corridors.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 Zeon Electric Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms & Conditions</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Refund Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">GST Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
