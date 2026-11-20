import React, { useState } from 'react';
import { Leaf, IndianRupee, Zap, Gauge, ArrowRight } from 'lucide-react';
import { formatRupees } from '../lib/format.js';

export default function SavingsCalculator({ user, vehicle, liveKwh = 0 }) {
  const [kmPerMonth, setKmPerMonth] = useState(1500);

  // Vehicle stats
  const carName = vehicle?.name || vehicle?.model || user?.car || 'Electric Vehicle';
  const batteryKwh = vehicle?.batteryKwh || vehicle?.batteryCapacity || 40.5;
  const rangeKm = vehicle?.rangeKm || 325;

  // Calculation: EV vs Petrol
  // EV cost: ~15 kWh / 100km at ₹22/kWh = ₹3.3 / km
  // Petrol cost: ~15 km/l at ₹98/l = ₹6.5 / km
  // Savings: ~₹3.2 / km
  const evCostPerKm = 3.3;
  const petrolCostPerKm = 6.8;

  const monthlyPetrolCost = Math.round(kmPerMonth * petrolCostPerKm);
  const monthlyEvCost = Math.round(kmPerMonth * evCostPerKm);
  const monthlySavings = monthlyPetrolCost - monthlyEvCost;
  const yearlySavings = monthlySavings * 12;
  const co2PreventedKg = Math.round(kmPerMonth * 0.14 * 12);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-white space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-red-500" />
            <span>FUEL VS EV SAVINGS CALCULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            How Much You Save Charging with <span className="text-red-500">Zeon</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Calculate your monthly & annual fuel cost savings driving an EV vs traditional ICE petrol.
          </p>
        </div>

        <div className="bg-black/60 border border-zinc-800 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
            EV
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block font-mono">SELECTED MODEL</span>
            <span className="text-xs font-bold text-white">{carName}</span>
          </div>
        </div>
      </div>

      {/* Slider controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">Monthly Driving Distance:</span>
          <span className="font-bold text-white text-base">
            {kmPerMonth.toLocaleString()} km / month
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={kmPerMonth}
          onChange={(e) => setKmPerMonth(Number(e.target.value))}
          className="w-full accent-red-600 h-2 bg-zinc-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>500 km</span>
          <span>1,500 km (Avg)</span>
          <span>3,000 km</span>
          <span>5,000 km</span>
        </div>
      </div>

      {/* Metrics breakdown grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Monthly Fuel Savings</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {formatRupees(monthlySavings)}
          </div>
          <p className="text-[10px] text-zinc-500">
            vs ₹{monthlyPetrolCost.toLocaleString()} petrol fuel expense
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-red-500/30 space-y-1 shadow-lg shadow-red-950/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono">
            <Zap className="w-3.5 h-3.5" />
            <span>Annual Net Savings</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-red-500 font-mono">
            {formatRupees(yearlySavings)}
          </div>
          <p className="text-[10px] text-zinc-400 font-medium">
            12 months saved in your wallet
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
            <Leaf className="w-3.5 h-3.5" />
            <span>CO₂ Prevented</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {co2PreventedKg.toLocaleString()} kg
          </div>
          <p className="text-[10px] text-zinc-500">
            Clean tailpipe highway emission
          </p>
        </div>
      </div>
    </div>
  );
}
