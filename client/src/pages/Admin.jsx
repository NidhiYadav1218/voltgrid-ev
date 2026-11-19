import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getAdminStats, resetDemoData } from '../api/admin';
import { getStations, createStation, updateStation, deleteStation } from '../api/stations';
import { getUsers } from '../api/users';
import { getBookings } from '../api/bookings';
import { formatRupee, formatDate } from '../lib/format';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalStations: 34,
    totalPorts: 156,
    availablePorts: 98,
    activeSessions: 14,
    totalUsers: 48,
    totalBookings: 120,
    grossRevenue: 124800
  });

  const [stations, setStations] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statData, stList, uList, bList] = await Promise.all([
          getAdminStats().catch(() => null),
          getStations().catch(() => []),
          getUsers().catch(() => []),
          getBookings().catch(() => [])
        ]);

        if (statData) setStats(statData);
        setStations(Array.isArray(stList) ? stList : []);
        setUsers(Array.isArray(uList) ? uList : []);
        setBookings(Array.isArray(bList) ? bList : []);
      } catch (err) {
        console.error('Admin load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleResetDemo = async () => {
    try {
      setResetting(true);
      await resetDemoData();
      alert('✅ Demo state successfully reset to verified defaults!');
      setResetModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert(`Reset error: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header Banner */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  VoltGrid Infrastructure HQ
                </h1>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  MASTER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Statewide EV Highway Corridor Monitoring & Operations Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setResetModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
            >
              <span>⚠️ Demo Reset</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: '📊 Dashboard Overview' },
            { id: 'stations', label: `🏛️ Stations (${stations.length || 34})` },
            { id: 'users', label: `👥 Users & Drivers (${users.length || 0})` },
            { id: 'bookings', label: `📋 Bookings (${bookings.length || 0})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Total Gujarat Hubs
                </span>
                <p className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {stats.totalStations || stations.length || 34}
                </p>
                <span className="text-xs text-indigo-400 mt-1 block">Active across 12 cities</span>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Active Dedicated Bays
                </span>
                <p className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
                  {stats.totalPorts || 156}
                </p>
                <span className="text-xs text-slate-400 mt-1 block">
                  {stats.availablePorts || 98} ports online & free
                </span>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Registered Drivers
                </span>
                <p className="text-3xl font-extrabold text-cyan-400 mt-1 font-mono">
                  {stats.totalUsers || users.length || 48}
                </p>
                <span className="text-xs text-slate-400 mt-1 block">Verified phone & email</span>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Gross Corridor Volume
                </span>
                <p className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {formatRupee(stats.grossRevenue || 124800)}
                </p>
                <span className="text-xs text-emerald-400 mt-1 block">15% platform take-rate</span>
              </div>
            </div>

            {/* Recent Infrastructure Activity */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-white">Live Gujarat SuperHubs Status</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stations.slice(0, 6).map((st) => (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{st.name}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {st.city}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{st.location}</p>
                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800 text-slate-300">
                      <span>Tariff: {formatRupee(st.pricePerKwh)}/kWh</span>
                      <span>Ports: {st.ports?.length || 4}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATIONS (HUBS) */}
        {activeTab === 'stations' && (
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                All Gujarat EV Stations ({stations.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Station ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Tariff</th>
                    <th className="py-3 px-4">Bays</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {stations.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-indigo-400">{st.id}</td>
                      <td className="py-3 px-4 font-bold text-white font-sans">{st.name}</td>
                      <td className="py-3 px-4 font-sans">{st.vendorName}</td>
                      <td className="py-3 px-4 text-cyan-300">{st.city}</td>
                      <td className="py-3 px-4 text-emerald-400">{formatRupee(st.pricePerKwh)}/kWh</td>
                      <td className="py-3 px-4">{st.ports?.length || 0}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USERS & DRIVERS */}
        {activeTab === 'users' && (
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-white">
              Registered Accounts ({users.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">EV Model</th>
                    <th className="py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id || u._id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono">{u.email}</td>
                        <td className="py-3 px-4 font-mono">{u.phone || '—'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              u.role === 'admin'
                                ? 'bg-rose-500/20 text-rose-300'
                                : u.role === 'vendor'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-indigo-500/20 text-indigo-300'
                            }`}
                          >
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-cyan-300">{u.vehicleModel || 'MG ZS EV'}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                          {formatDate(u.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">
                        No user records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BOOKINGS & SESSIONS */}
        {activeTab === 'bookings' && (
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-white">
              Corridor Reservations & Charging Logs ({bookings.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Station ID</th>
                    <th className="py-3 px-4">Port</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Total Paid</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {bookings.length > 0 ? (
                    bookings.map((b) => (
                      <tr key={b.id || b._id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-white">
                          #{String(b.id || b._id).slice(-8)}
                        </td>
                        <td className="py-3 px-4 text-indigo-400">{b.stationId}</td>
                        <td className="py-3 px-4">{b.portId}</td>
                        <td className="py-3 px-4 font-sans text-cyan-300">{b.vehicleModel}</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">
                          {formatRupee(b.totalAmount || 0)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {formatDate(b.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Demo Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-center">
            <span className="text-4xl block">⚠️</span>
            <h3 className="text-lg font-bold text-white">Reset Demo Environment?</h3>
            <p className="text-xs text-slate-400">
              This will reset the VoltGrid database back to initial seed data (34 Gujarat hubs, verified vendors, demo accounts).
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDemo}
                disabled={resetting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset Demo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
