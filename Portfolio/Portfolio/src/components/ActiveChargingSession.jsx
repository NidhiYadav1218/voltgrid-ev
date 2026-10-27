import React, { useState, useEffect } from 'react';
import { Zap, BatteryCharging, AlertCircle, CheckCircle2, Shield, Pause, Play } from 'lucide-react';

export default function ActiveChargingSession({ session, onComplete, onStop }) {
  const [currentSoc, setCurrentSoc] = useState(session?.currentSoc || 30);
  const [powerKw, setPowerKw] = useState(168);
  const [kwDelivered, setKwDelivered] = useState(session?.kwDelivered || 8.4);
  const [elapsedSeconds, setElapsedSeconds] = useState(120);

  // Live simulation ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      
      // Slight fluctuation in power rate
      setPowerKw(prev => {
        const delta = (Math.random() - 0.48) * 4;
        return Math.max(80, Math.min(220, Math.round(prev + delta)));
      });

      // Slowly increment delivered energy and battery %
      setKwDelivered(prev => +(prev + 0.05).toFixed(2));
      setCurrentSoc(prev => {
        if (prev >= 80) return 80;
        return +(prev + 0.1).toFixed(1);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalCost = (kwDelivered * 0.32).toFixed(2);
  const targetSoc = session?.targetSoc || 80;
  const isComplete = currentSoc >= targetSoc;

  return (
    <div className="bg-gradient-to-b from-[#0c1322] to-[#090d16] border border-cyan-500/50 rounded-2xl p-6 mb-8 shadow-xl shadow-cyan-950/40 relative overflow-hidden">
      {/* Background glow and sci-fi grid */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left: Info */}
        <div className="space-y-3 w-full lg:w-1/2">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Live Fast-Charge Session &bull; {session?.portName || 'Port 02'}
            </span>
            <span className="text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded">
              {session?.sessionId || 'VG-8812'}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white">
            {session?.vehicle || 'Tesla Model 3 Long Range'}
          </h2>
          <p className="text-xs font-mono text-slate-400">
            CCS2 800V DC Hypergrid &bull; Active Mutex Lease
          </p>

          {/* Quick Metrics Tiles */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Throughput</span>
              <span className="text-lg font-bold text-cyan-400">{powerKw} kW</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Delivered</span>
              <span className="text-lg font-bold text-emerald-400">{kwDelivered} kWh</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Running Total</span>
              <span className="text-lg font-bold text-white">${totalCost}</span>
            </div>
          </div>
        </div>

        {/* Right: Circular Gauge & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-end">
          {/* Circular Battery Progress */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800/80"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#cyanGradient)"
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * Math.min(100, currentSoc)) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <Zap className="w-5 h-5 text-cyan-400 animate-bounce" />
              <span className="text-2xl font-extrabold text-white font-mono mt-0.5">
                {Math.round(currentSoc)}%
              </span>
              <span className="text-[10px] font-mono text-slate-400">Target: {targetSoc}%</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5 w-full sm:w-auto">
            <button
              onClick={onStop}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 transition-all text-center flex items-center justify-center gap-2"
            >
              <Pause className="w-3.5 h-3.5" />
              Stop & Disconnect
            </button>
            <div className="text-[10px] font-mono text-slate-400 text-center flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              Safe Uncouple Available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
