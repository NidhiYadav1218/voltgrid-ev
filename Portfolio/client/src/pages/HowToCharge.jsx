import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Zap, ShieldCheck, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HowToCharge() {
  const steps = [
    {
      num: '01',
      title: 'Find Station & Reserve Bay',
      desc: 'Open the Zeon Locations map or mobile app. Select your preferred station and lock your charging bay 15 minutes before arrival to guarantee zero waiting time.'
    },
    {
      num: '02',
      title: 'Park & Plug In The Connector',
      desc: 'Align your car with the dedicated charging bay. Grab the heavy-duty CCS-2 DC fast charging gun and firmly plug it into your vehicle’s charging inlet until you hear the click.'
    },
    {
      num: '03',
      title: 'Start Charging Session',
      desc: 'If using AutoCharge, charging starts automatically in seconds. Otherwise, scan the QR code on the charger screen using your Zeon app, tap your Zeon RFID keycard, or enter your 4-digit PIN.'
    },
    {
      num: '04',
      title: 'Relax & Track Live Telemetry',
      desc: 'Enjoy coffee, dining, or amenities at our partner venues (Radisson, Nexus, Highway Plazas). Monitor real-time battery SoC %, charging speed in kW, and time remaining from your phone.'
    },
    {
      num: '05',
      title: 'Stop & Unplug',
      desc: 'Once your battery reaches your target percentage (we recommend 80% for fastest highway speed), tap Stop on the charger or app, return the plug to its holster, and receive your instant GST invoice.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-24">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold tracking-wide">
            <span>🔌</span>
            <span>BEGINNER'S GUIDE TO EV FAST CHARGING</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight">
            How to Charge Your Electric Car with <span className="text-red-500">Zeon</span>.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            High-speed DC charging is as simple as plugging in a smartphone. Follow our 5-step visual walkthrough to experience effortless highway road trips across Gujarat.
          </p>

          <div className="pt-2">
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xl shadow-red-600/30 transition-all hover:scale-105"
            >
              <span>Explore Stations & Start Charging</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 5 Steps Timeline */}
        <div className="space-y-6">
          {steps.map((st, idx) => (
            <div
              key={st.num}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-red-500/50 transition-all duration-300"
            >
              <div className="flex items-start sm:items-center gap-6">
                <span className="text-3xl sm:text-4xl font-black font-mono text-red-500 shrink-0">
                  {st.num}
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <span className="w-9 h-9 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pro EV Charging Tips */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-[#1e0808] border border-red-500/30 space-y-6">
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>PRO HIGHWAY CHARGING TIPS</span>
          </div>

          <h3 className="text-2xl font-bold font-heading text-white">
            Maximize Your Road Trip Speed
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs text-zinc-300">
            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">The 20% to 80% Rule</h4>
              <p className="text-zinc-400 leading-relaxed">
                EV batteries charge fastest between 20% and 80%. After 80%, the BMS reduces charging speed to protect cell chemistry. Unplugging at 80% saves you time on the road.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">Lock Bay 15 Mins Ahead</h4>
              <p className="text-zinc-400 leading-relaxed">
                Always use Zeon’s 15-minute guaranteed hold before pulling into a highway station so you never wait behind another EV.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-sm">Enjoy Partner Amenities</h4>
              <p className="text-zinc-400 leading-relaxed">
                Our hubs are situated at verified luxury hotels, cafes, and highway plazas with clean restrooms, dining, and coffee.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
