import React from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, MapPin, Zap, Clock, Copy, Download } from 'lucide-react';

export default function DigitalPassModal({ isOpen, onClose, passData, station }) {
  if (!isOpen || !passData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0c1322] border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl shadow-emerald-950/60 overflow-hidden text-center">
        {/* Glow halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mb-3 glow-green">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>

        <h3 className="text-xl font-extrabold text-white">
          Slot Reserved & Mutex Locked
        </h3>
        <p className="text-xs font-mono text-emerald-400 mt-1">
          ANTI-STEAL HOLD: ACTIVE (15 MINUTES)
        </p>

        {/* Digital Pass Ticket Card */}
        <div className="mt-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 text-left relative overflow-hidden">
          {/* Ticket punch holes decoration */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#0c1322] border-r border-slate-800"></div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#0c1322] border-l border-slate-800"></div>

          <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Station Hub</span>
              <div className="text-xs font-bold text-white truncate max-w-[180px]">{station?.name}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Port ID</span>
              <div className="text-xs font-mono font-bold text-cyan-400">{passData.portId}</div>
            </div>
          </div>

          {/* QR Code and PIN display */}
          <div className="py-4 flex flex-col items-center justify-center">
            {/* SVG Simulated QR code */}
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <svg className="w-28 h-28" viewBox="0 0 29 29" fill="black">
                {/* Standard QR finder patterns */}
                <rect x="0" y="0" width="7" height="7" fill="black" />
                <rect x="1" y="1" width="5" height="5" fill="white" />
                <rect x="2" y="2" width="3" height="3" fill="black" />

                <rect x="22" y="0" width="7" height="7" fill="black" />
                <rect x="23" y="1" width="5" height="5" fill="white" />
                <rect x="24" y="2" width="3" height="3" fill="black" />

                <rect x="0" y="22" width="7" height="7" fill="black" />
                <rect x="1" y="23" width="5" height="5" fill="white" />
                <rect x="2" y="24" width="3" height="3" fill="black" />

                {/* Randomized high-tech matrix modules */}
                <rect x="9" y="2" width="2" height="2" />
                <rect x="13" y="2" width="2" height="4" />
                <rect x="17" y="1" width="3" height="2" />
                <rect x="9" y="8" width="4" height="2" />
                <rect x="15" y="8" width="2" height="2" />
                <rect x="19" y="9" width="3" height="3" />
                <rect x="2" y="9" width="3" height="2" />
                <rect x="2" y="14" width="4" height="2" />
                <rect x="8" y="13" width="2" height="5" />
                <rect x="12" y="12" width="5" height="5" />
                <rect x="19" y="14" width="2" height="4" />
                <rect x="23" y="11" width="4" height="2" />
                <rect x="23" y="16" width="3" height="3" />
                <rect x="10" y="20" width="4" height="2" />
                <rect x="16" y="20" width="2" height="4" />
                <rect x="20" y="22" width="5" height="2" />
                <rect x="9" y="24" width="3" height="3" />
                <rect x="14" y="25" width="4" height="2" />
              </svg>
            </div>

            <div className="mt-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Charger Unlock PIN</span>
              <span className="text-xl font-mono font-extrabold tracking-widest text-cyan-400 bg-slate-900 px-4 py-1 rounded-lg border border-slate-800 inline-block mt-0.5">
                {passData.pinCode || '8492'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Pass ID: {passData.sessionId}</span>
            <span className="text-emerald-400 font-semibold">15m Mutex Safe</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-lg shadow-emerald-500/25 transition-all"
          >
            Done &bull; Return to Map
          </button>
        </div>
      </div>
    </div>
  );
}
