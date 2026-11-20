import React from 'react';
import { ShieldCheck, Building2, Zap, Store } from 'lucide-react';

export default function PartnerLogos() {
  const partners = [
    {
      name: 'Tata Power EZ Charge',
      role: 'Unified CPO Partner',
      icon: '⚡',
      color: 'emerald'
    },
    {
      name: 'Jio-bp pulse',
      role: 'Expressway Fuel Plazas',
      icon: '⛽',
      color: 'blue'
    },
    {
      name: 'Zeon Charging',
      role: 'Highway Fast Network',
      icon: '🔋',
      color: 'indigo'
    },
    {
      name: 'Statiq EV Hubs',
      role: 'Smart Superhubs',
      icon: '🚀',
      color: 'amber'
    },
    {
      name: 'Shell Recharge',
      role: 'Corridor Fast Plazas',
      icon: '🐚',
      color: 'red'
    },
    {
      name: 'Radisson Blu & Aerohub',
      role: 'Hospitality Venue Hosts',
      icon: '🏨',
      color: 'purple'
    },
    {
      name: 'Gujarat GSRDC (NE1)',
      role: 'Expressway Authority',
      icon: '🛣️',
      color: 'teal'
    },
    {
      name: 'Honest Highway Plazas',
      role: 'Corridor Rest Stops',
      icon: '🍽️',
      color: 'orange'
    }
  ];

  return (
    <div className="py-8 border-y border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
            OPEN MULTI-CPO ECOSYSTEM
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
            Our Network & Location Partners
          </h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto mt-0.5">
            Interconnected across leading charging point operators, highway authorities, and premier hospitality venues.
          </p>
        </div>

        {/* Partners Marquee / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 flex flex-col items-center justify-center text-center group"
            >
              <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                {p.icon}
              </span>
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                {p.name}
              </p>
              <p className="text-[9px] font-mono text-slate-400 mt-0.5 truncate w-full">
                {p.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
