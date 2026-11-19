import React from 'react';
import Header from '../components/Header';

export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">VoltGrid Infrastructure Admin</h1>
        <p className="text-slate-400">Network monitoring and operations.</p>
      </main>
    </div>
  );
}
