import React from 'react';
import { X, CheckCircle2, Copy } from 'lucide-react';
import { formatRupees } from '../lib/format.js';

export default function DigitalPassModal({ isOpen, onClose, passData, pin }) {
  if (!isOpen || !passData) return null;

  const displayPin = pin || passData.pin || '----';

  const copyPin = () => {
    if (displayPin && displayPin !== '----') {
      navigator.clipboard.writeText(displayPin);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl text-center text-white">
        {/* Glow halo */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-950 border border-emerald-500 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
        </div>

        <h3 className="text-xl font-bold font-heading text-white">
          Charging Spot Confirmed!
        </h3>
        <p className="text-xs font-mono text-emerald-400 mt-0.5">
          15-MINUTE ARRIVAL HOLD ACTIVE
        </p>

        {/* Digital Pass Ticket Card */}
        <div className="mt-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Hub Location</span>
              <div className="text-xs font-bold text-white truncate max-w-[170px]">
                {passData.stationName || 'VoltGrid Hub'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Port Bay</span>
              <div className="text-xs font-mono font-bold text-emerald-400">
                {passData.portId}
              </div>
            </div>
          </div>

          {/* Visual QR Card and PIN display */}
          <div className="py-4 flex flex-col items-center justify-center">
            {/* Visual ticket glyph pattern */}
            <div className="p-2.5 bg-white rounded-xl shadow-md">
              <svg className="w-24 h-24" viewBox="0 0 29 29" fill="black">
                <rect x="0" y="0" width="7" height="7" fill="black" />
                <rect x="1" y="1" width="5" height="5" fill="white" />
                <rect x="2" y="2" width="3" height="3" fill="black" />
                <rect x="22" y="0" width="7" height="7" fill="black" />
                <rect x="23" y="1" width="5" height="5" fill="white" />
                <rect x="24" y="2" width="3" height="3" fill="black" />
                <rect x="0" y="22" width="7" height="7" fill="black" />
                <rect x="1" y="23" width="5" height="5" fill="white" />
                <rect x="2" y="24" width="3" height="3" fill="black" />
                <rect x="9" y="2" width="2" height="2" />
                <rect x="13" y="2" width="2" height="4" />
                <rect x="9" y="8" width="4" height="2" />
                <rect x="12" y="12" width="5" height="5" />
                <rect x="20" y="22" width="5" height="2" />
              </svg>
            </div>

            <div className="mt-4 text-center w-full">
              <span className="text-[10px] font-mono text-slate-400 block uppercase mb-1">
                Security Unlock PIN
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-black tracking-widest text-emerald-400 bg-slate-900 px-4 py-1.5 rounded-xl border border-slate-700">
                  {displayPin}
                </span>
                <button
                  type="button"
                  onClick={copyPin}
                  title="Copy PIN"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Code: {passData.bookingCode}</span>
            <span className="text-emerald-400 font-semibold">Ready at Charger</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer border border-slate-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}
