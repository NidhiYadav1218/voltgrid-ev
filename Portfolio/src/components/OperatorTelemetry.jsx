import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Zap, RefreshCw, Cpu, CheckCircle2, AlertOctagon, Activity } from 'lucide-react';

export default function OperatorTelemetry({ stations, onTogglePortStatus }) {
  const [logs, setLogs] = useState([
    { id: 1, time: '00:12:04', type: 'LOCK', text: 'POST /v2/slots/acquire-mutex 201 CREATED (19ms) -> Port #P-103 reserved [ACID Safe]' },
    { id: 2, time: '00:12:18', type: 'SCALE', text: 'GCP Cloud Run autoscale: 4 pods active • 310 req/sec sustained throughput' },
    { id: 3, time: '00:12:45', type: 'TELEMETRY', text: 'Hypergrid Node 01: 800V DC bus stable @ 50.02 Hz (Solar Microgrid 92%)' },
    { id: 4, time: '00:13:12', type: 'CHARGE', text: 'Session #VG-8812 Handshake confirmed: Porsche Taycan drawing 265kW peak' }
  ]);

  // Periodic simulated live stream log
  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['LOCK', 'TELEMETRY', 'AUTH', 'CHARGE'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const ms = Math.floor(Math.random() * 25 + 12);

      let msg = '';
      if (chosenType === 'LOCK') {
        msg = `POST /v2/slots/acquire-mutex 201 CREATED (${ms}ms) -> Redis mutex lock acquired [0 collisions]`;
      } else if (chosenType === 'TELEMETRY') {
        msg = `Grid telemetry packet sync: Port bus impedance 0.04Ω • P99 API Latency < ${ms}ms`;
      } else if (chosenType === 'AUTH') {
        msg = `OAuth2 mTLS handshake verified for telemetry node #${Math.floor(Math.random() * 8 + 1)}`;
      } else {
        msg = `Vehicle SoC telemetry beacon received • Cloud Run replica count stable`;
      }

      setLogs(prev => [
        { id: Date.now(), time: timeStr, type: chosenType, text: msg },
        ...prev.slice(0, 7)
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const totalPorts = stations.reduce((acc, s) => acc + s.ports.length, 0);
  const activeCharging = stations.reduce((acc, s) => acc + s.ports.filter(p => p.status === 'charging').length, 0);
  const activeReserved = stations.reduce((acc, s) => acc + s.ports.filter(p => p.status === 'reserved').length, 0);
  const occupancyRate = Math.round(((activeCharging + activeReserved) / totalPorts) * 100);

  return (
    <div className="space-y-6">
      {/* High-Tech Project Reference Card (Mirrors the reference image aesthetic) */}
      <div className="bg-[#0b0f17] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
        {/* Subtle corner brackets */}
        <div className="absolute top-3 left-3 text-xs font-mono text-cyan-600">┌</div>
        <div className="absolute top-3 right-3 text-xs font-mono text-cyan-600">┐</div>
        <div className="absolute bottom-3 left-3 text-xs font-mono text-cyan-600">└</div>
        <div className="absolute bottom-3 right-3 text-xs font-mono text-cyan-600">┘</div>

        {/* Top Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
              NODE_02 // EV CHARGE MESH SAAS
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              GCP CLUSTER // LIVE
            </span>
            <span className="px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-700/80 text-emerald-400 font-bold">
              99.98% SLA
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            VoltGrid Autonomous Smart-Slot SaaS
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            High-concurrency EV charging slot orchestration platform. Engineered automated reservation lifecycles, real-time hardware port allocation, distributed Redis mutex locks to prevent slot theft, and serverless auto-scaling on Google Cloud Run.
          </p>
        </div>

        {/* Interactive Mock Terminal Box */}
        <div className="bg-[#05080f] border border-slate-800 rounded-2xl p-4 font-mono text-xs mb-6 overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-900 text-slate-500">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Zap className="w-3.5 h-3.5 fill-cyan-400" />
              <span>POST /v2/slots/acquire-mutex</span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
              201 CREATED (21ms)
            </span>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <p className="flex items-center gap-2">
              <span className="text-cyan-500">01 &rarr;</span> Driver session <span className="text-amber-300">#VG-9182</span> allocated <span className="text-white font-bold">Port #P-103</span> with mutual ACID lock
            </p>
            <p className="flex items-center gap-2 text-slate-400">
              <span className="text-cyan-500">02 &rarr;</span> Cloud Run autoscaled to 4 pods &bull; 310 req/sec sustained throughput
            </p>
          </div>
        </div>

        {/* 3 Metric Highlight Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              SLOT ISOLATION
            </span>
            <span className="text-lg font-mono font-bold text-white">
              Redis Mutex
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              CONCURRENCY SAFETY
            </span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              ACID Safe
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              P99 API LATENCY
            </span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              &lt; 28ms
            </span>
          </div>
        </div>

        {/* Architecture points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 pb-6 border-b border-slate-800 text-xs">
          <div>
            <span className="font-mono font-bold text-white flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-sm"></span>
              MUTEX QUEUING
            </span>
            <p className="text-slate-400 leading-relaxed">
              Atomic distributed locks prevent race conditions and double-booking during peak rush hours.
            </p>
          </div>
          <div>
            <span className="font-mono font-bold text-white flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-sm"></span>
              AUTONOMOUS AUTOSCALE
            </span>
            <p className="text-slate-400 leading-relaxed">
              Cloud Run containers scale dynamically from 0 to dozens of pods to minimize cloud compute cost.
            </p>
          </div>
          <div>
            <span className="font-mono font-bold text-white flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-sm"></span>
              HARDWARE OCPP 2.0.1
            </span>
            <p className="text-slate-400 leading-relaxed">
              Real-time bi-directional telemetry handshake with CCS2 chargers for instant power adjustment.
            </p>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['Next.js', 'React', 'TailwindCSS', 'Python / FastAPI', 'Redis', 'GCP Cloud Run'].map((tech) => (
              <span key={tech} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                {tech}
              </span>
            ))}
          </div>

          <div className="text-xs font-mono text-cyan-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Live Stream Terminal Logs */}
      <div className="bg-[#070b12] border border-slate-800 rounded-2xl p-5 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">LIVE DISTRIBUTED TELEMETRY STREAM</span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            STREAMING (4.5s POLL)
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 py-1 border-b border-slate-900/60 last:border-0">
              <span className="text-slate-500 flex-shrink-0">[{log.time}]</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                log.type === 'LOCK' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                log.type === 'SCALE' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                log.type === 'CHARGE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                'bg-slate-900 text-slate-400 border border-slate-800'
              }`}>
                {log.type}
              </span>
              <span className="text-slate-300 truncate">{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
