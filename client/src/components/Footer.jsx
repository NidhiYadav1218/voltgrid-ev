import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, QrCode, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand & QR column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white font-heading">
                  VOLT<span className="text-emerald-500">GRID</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-800">
                  GUJARAT
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Statewide High-Power EV Supergrid & Charging Network. Guaranteeing 15-minute queue-free charging locks across Gujarat's highway corridors and city superhubs.
            </p>

            <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
              <span>CHARGED WITH</span>
              <span className="text-rose-500 animate-pulse">❤️</span>
              <span>IN GUJARAT, INDIA 🇮🇳</span>
            </div>

            {/* Simulated QR App Card */}
            <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center gap-3.5 max-w-xs shadow-inner">
              <div className="w-14 h-14 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-950" />
              </div>
              <div>
                <p className="font-bold text-white text-[11px] font-mono">SCAN FOR WEB APP</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Add VoltGrid to your mobile home screen for 1-tap bay reservations.
                </p>
              </div>
            </div>
          </div>

          {/* Column: Solutions */}
          <div className="space-y-3">
            <h4 className="font-bold font-mono text-white text-xs tracking-wider uppercase">
              Supergrid Tech
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Live Port Explorer
                </Link>
              </li>
              <li>
                <Link to="/simulator" className="hover:text-emerald-400 transition-colors">
                  EV BMS Simulator
                </Link>
              </li>
              <li>
                <Link to="/hubs" className="hover:text-emerald-400 transition-colors">
                  Statewide Superhubs
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  15-Min Instant Bay Lock
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Dynamic Flux 350kW
                </span>
              </li>
            </ul>
          </div>

          {/* Column: Corridors */}
          <div className="space-y-3">
            <h4 className="font-bold font-mono text-white text-xs tracking-wider uppercase">
              Gujarat Corridors
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-slate-300 transition-colors">
                Ahmedabad-Vadodara NE1
              </li>
              <li className="hover:text-slate-300 transition-colors">
                Surat-Mumbai NH48 Corridor
              </li>
              <li className="hover:text-slate-300 transition-colors">
                Ahmedabad-Rajkot NH47
              </li>
              <li className="hover:text-slate-300 transition-colors">
                Somnath Coastal Highway
              </li>
              <li className="hover:text-slate-300 transition-colors">
                GIFT City & Gandhinagar
              </li>
            </ul>
          </div>

          {/* Column: Partner & Support */}
          <div className="space-y-3">
            <h4 className="font-bold font-mono text-white text-xs tracking-wider uppercase">
              CPO & Operations
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/vendor/login" className="hover:text-amber-400 transition-colors">
                  CPO Partner Portal
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-indigo-400 transition-colors">
                  Supergrid Admin Console
                </Link>
              </li>
              <li className="pt-2 text-slate-300">
                <span className="block text-[10px] text-slate-500 uppercase font-mono">
                  24x7 Helpline
                </span>
                <a href="tel:18002004848" className="font-mono font-bold text-emerald-400 hover:underline">
                  1800 200 4848
                </a>
              </li>
              <li className="text-[11px] text-slate-400">
                support@voltgrid.gujarat.gov.in
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 VoltGrid Gujarat Statewide EV Network. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">GST Compliance (SAC 998714)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
