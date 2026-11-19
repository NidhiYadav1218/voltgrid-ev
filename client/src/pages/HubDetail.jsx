import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

export default function HubDetail() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">Hub Details</h1>
        <p className="text-slate-400">Viewing station: {id}</p>
      </main>
    </div>
  );
}
