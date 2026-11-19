import React from 'react';
import { Leaf, IndianRupee, Zap, BatteryCharging } from 'lucide-react';
import { formatRupees, formatNumber } from '../lib/format.js';

export default function SavingsCalculator({ user, liveKwh = 0 }) {
  const totalKwh = (user?.totalKwhCharged || 0) + liveKwh;
  const moneySaved = user?.totalMoneySaved !== undefined ? user.totalMoneySaved : Math.round(totalKwh * 18);
  const co2Saved = user?.totalCo2Saved !== undefined ? user.totalCo2Saved : Math.round(totalKwh * 1.8);
  const sessions = user?.sessionsCount || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400">
          <IndianRupee className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            Money Saved
          </span>
        </div>
        <div className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          {formatRupees(moneySaved)}
        </div>
        <span className="text-[10px] text-slate-400">vs Petrol fuel costs</span>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5 text-teal-600 dark:text-teal-400">
          <Leaf className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            CO2 Prevented
          </span>
        </div>
        <div className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          {formatNumber(co2Saved)} kg
        </div>
        <span className="text-[10px] text-slate-400">Direct tailpipe emission</span>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5 text-cyan-600 dark:text-cyan-400">
          <Zap className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            Clean Energy
          </span>
        </div>
        <div className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          {totalKwh.toFixed(1)} kWh
        </div>
        <span className="text-[10px] text-slate-400">Delivered across grid</span>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5 text-indigo-600 dark:text-indigo-400">
          <BatteryCharging className="w-4 h-4" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            Total Sessions
          </span>
        </div>
        <div className="text-xl font-bold font-heading text-slate-900 dark:text-white">
          {sessions}
        </div>
        <span className="text-[10px] text-slate-400">Successful charges</span>
      </div>
    </div>
  );
}
