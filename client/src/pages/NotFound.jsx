import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100 text-center">
      <div className="max-w-md p-8 rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
          <Zap className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white font-heading mb-2">404</h1>
        <p className="text-lg font-bold text-slate-200 mb-1">Route Not Found</p>
        <p className="text-xs text-slate-400 mb-6">
          The requested charging page or hub resource is not mapped in the VoltGrid supergrid routing table.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Driver Hub</span>
        </Link>
      </div>
    </div>
  );
}
