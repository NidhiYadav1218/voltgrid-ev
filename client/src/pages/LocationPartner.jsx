import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building2, IndianRupee, Zap, ShieldCheck, CheckCircle2, ArrowRight, PhoneCall } from 'lucide-react';
import { formatRupees } from '../lib/format';

export default function LocationPartner() {
  const [bays, setBays] = useState(2);
  const [chargesPerDay, setChargesPerDay] = useState(8);
  const [kwhPerCharge, setKwhPerCharge] = useState(28);

  // Host Revenue Calculation
  // Host commission: ~₹3.50 per kWh dispensed
  const dailyKwh = bays * chargesPerDay * kwhPerCharge;
  const hostCommissionPerKwh = 3.5;
  const monthlyEarnings = Math.round(dailyKwh * hostCommissionPerKwh * 30);
  const annualEarnings = monthlyEarnings * 12;

  // Form submission state
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Ahmedabad',
    propertyType: 'Hotel / Resort',
    parkingCapacity: '20+'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white pt-24">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-mono font-bold tracking-wide">
              <span>🏢</span>
              <span>ZEON LOCATION PARTNER ECOSYSTEM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight leading-tight">
              Host an EV Charging Station on <span className="text-red-500">Your Property</span>.
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
              Turn your unused parking bays into high-yield revenue streams. Join Radisson Blu, CGH Earth, and Nexus Malls in hosting India’s premier fast-charging infrastructure with zero technical hassle.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#host-calculator"
                className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all hover:scale-105"
              >
                <span>Calculate Your Revenue</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/vendor/login"
                className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-xs transition-all"
              >
                CPO Partner Portal
              </Link>
            </div>
          </div>

          {/* Partner Application Form Card */}
          <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold font-heading text-white">
              Apply to Become a Location Partner
            </h3>
            <p className="text-xs text-zinc-400">
              Our site infrastructure engineers will evaluate your property feasibility within 48 hours.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2 text-emerald-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base">Application Received!</h4>
                <p className="text-xs text-emerald-200/80">
                  Thank you! Our Gujarat site development team will contact you shortly to schedule an on-site power assessment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                    Your Name / Representative
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                      City in Gujarat
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500"
                    >
                      <option>Ahmedabad</option>
                      <option>Surat</option>
                      <option>Vadodara</option>
                      <option>Rajkot</option>
                      <option>Gandhinagar</option>
                      <option>Bhavnagar</option>
                      <option>Jamnagar</option>
                      <option>Anand</option>
                      <option>Vapi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-mono text-[10px] uppercase mb-1">
                      Property Type
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-500"
                    >
                      <option>Hotel / Resort</option>
                      <option>Shopping Mall</option>
                      <option>Highway Restaurant</option>
                      <option>Commercial Complex</option>
                      <option>Open Land / Parking</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  Submit Partner Application
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Revenue Calculator */}
        <div id="host-calculator" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
              VENUE REVENUE CALCULATOR
            </span>
            <h2 className="text-3xl font-extrabold text-white font-heading">
              Estimate Your Monthly Host Earnings
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Hosts receive recurring monthly payouts per kWh dispensed plus increased guest dwell time & retail footfall.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Charging Bays Hosted:</span>
                <span className="text-white font-bold text-sm">{bays} Bays</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={bays}
                onChange={(e) => setBays(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Avg Sessions per Bay / Day:</span>
                <span className="text-white font-bold text-sm">{chargesPerDay} Sessions</span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                value={chargesPerDay}
                onChange={(e) => setChargesPerDay(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Avg kWh per Session:</span>
                <span className="text-white font-bold text-sm">{kwhPerCharge} kWh</span>
              </div>
              <input
                type="range"
                min="15"
                max="50"
                value={kwhPerCharge}
                onChange={(e) => setKwhPerCharge(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>
          </div>

          {/* Result Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-6 rounded-2xl bg-black border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                Estimated Monthly Host Payout
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {formatRupees(monthlyEarnings)}
              </div>
              <span className="text-[10px] text-zinc-500">Direct recurring bank transfer</span>
            </div>

            <div className="p-6 rounded-2xl bg-black border border-red-500/40 space-y-1 shadow-lg shadow-red-950/20">
              <span className="text-[10px] font-mono text-red-400 uppercase">
                Estimated Annual Revenue
              </span>
              <div className="text-3xl sm:text-4xl font-black text-red-500 font-mono">
                {formatRupees(annualEarnings)}
              </div>
              <span className="text-[10px] text-zinc-400">Passive parking monetization</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
