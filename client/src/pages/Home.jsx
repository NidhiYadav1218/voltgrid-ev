import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">VoltGrid Smart EV Charging</h1>
        <p className="text-slate-400 mb-6">Seamless, high-reliability EV fast charging network across Gujarat corridor.</p>
        <div className="flex gap-4">
          <Link to="/hubs" className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
            Find Charging Hubs
          </Link>
          <Link to="/simulator" className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-5 py-2.5 rounded-lg transition-colors">
            Vehicle Simulator
          </Link>
        </div>
      </main>
    </div>
  );
}
