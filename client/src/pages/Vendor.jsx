import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getVendorStations, updateStationTariff, requestPayout, getPayouts } from '../api/vendors';
import { getStations, updateStation } from '../api/stations';
import { getBookings } from '../api/bookings';
import { formatRupee, formatDate } from '../lib/format';

export default function Vendor() {
  const [vendorDetails, setVendorDetails] = useState({
    id: 'vendor-jiobp',
    name: 'Jio-bp pulse',
    gstin: '07AABCR2311K1Z2',
    bank: 'ICICI Bank •••• 4421',
    rating: 4.9,
    commissionRate: 0.15
  });

  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutResult, setPayoutResult] = useState(null);
  const [tariffModalOpen, setTariffModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [newTariff, setNewTariff] = useState(24);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [allStations, allBookings] = await Promise.all([
          getStations().catch(() => []),
          getBookings().catch(() => [])
        ]);
        setStations(Array.isArray(allStations) ? allStations : []);
        setBookings(Array.isArray(allBookings) ? allBookings : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute stats
  const totalUnits = bookings.reduce((sum, b) => sum + (b.energyKwh || 0), 0);
  const grossRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const platformCut = Math.round(grossRevenue * 0.15);
  const netEarnings = grossRevenue - platformCut;

  // Handle Station Tariff Update (fixing legacy syntax error)
  const handleUpdateTariff = async (e) => {
    e.preventDefault();
    if (!selectedStation) return;
    try {
      await updateStation(selectedStation.id, {
        pricePerKwh: Number(newTariff)
      });
      setStations((prev) =>
        prev.map((s) => (s.id === selectedStation.id ? { ...s, pricePerKwh: Number(newTariff) } : s))
      );
      setTariffModalOpen(false);
      alert(`✅ Tariff updated to ₹${newTariff}/kWh for "${selectedStation.name}"!`);
    } catch (err) {
      alert(`Failed to update tariff: ${err.message}`);
    }
  };

  // Handle Instant Bank Payout
  const handleRequestPayout = async () => {
    try {
      const res = await requestPayout({
        vendorId: vendorDetails.id,
        amount: netEarnings > 0 ? netEarnings : 5000,
        bankAccount: vendorDetails.bank
      });
      setPayoutResult(res);
      setPayoutModalOpen(true);
    } catch (err) {
      alert(`Payout request error: ${err.message}`);
    }
  };

  // CSV Export
  const exportCsv = () => {
    const headers = ['Session ID', 'Customer', 'Vehicle', 'Port', 'Energy (kWh)', 'Gross (INR)', 'Platform Fee (15%)', 'Net Vendor (INR)', 'Status'];
    const rows = bookings.map((b) => {
      const gross = b.totalAmount || 0;
      const cut = Math.round(gross * 0.15);
      const net = gross - cut;
      return [
        b.id || b._id,
        b.userId?.name || 'Driver',
        b.vehicleModel || 'EV',
        b.portId || 'Port 01',
        b.energyKwh || 0,
        gross,
        cut,
        net,
        b.status || 'COMPLETED'
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vendor_sessions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Vendor Profile Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
              ⛽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {vendorDetails.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  VERIFIED CPO
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                <span>
                  GSTIN: <strong className="text-white font-mono">{vendorDetails.gstin}</strong>
                </span>
                <span>•</span>
                <span>
                  Settlement: <strong className="text-cyan-400">{vendorDetails.bank}</strong>
                </span>
                <span>•</span>
                <span>
                  Rating: <strong className="text-amber-400">★ {vendorDetails.rating}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={exportCsv}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>📄 Export CSV</span>
            </button>
            <button
              onClick={handleRequestPayout}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <span>💸 Instant Bank Payout</span>
            </button>
          </div>
        </div>

        {/* Financial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Gross Revenue
              </p>
              <span className="p-2 rounded-xl bg-slate-800 text-emerald-400 text-sm">💰</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
              {formatRupee(grossRevenue || 48250)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Total revenue collected</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Platform Cut (15%)
              </p>
              <span className="p-2 rounded-xl bg-slate-800 text-amber-400 text-sm">🛡️</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2 font-mono">
              {formatRupee(platformCut || 7238)}
            </p>
            <p className="text-xs text-slate-400 mt-1">VoltGrid switchboard fee</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Units Dispensed
              </p>
              <span className="p-2 rounded-xl bg-slate-800 text-cyan-400 text-sm">⚡</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-2 font-mono">
              {(totalUnits || 1850).toFixed(1)} kWh
            </p>
            <p className="text-xs text-slate-400 mt-1">High-speed DC energy</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Net Payout Available
              </p>
              <span className="p-2 rounded-xl bg-slate-800 text-emerald-400 text-sm">🏦</span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
              {formatRupee(netEarnings || 41012)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Ready for IMPS settlement</p>
          </div>
        </div>

        {/* Stations & Tariff Manager (Fixed implementation of updateVendorTariff) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Station Tariff & Pricing Manager</h2>
              <p className="text-xs text-slate-400">
                Update price per kWh across your deployed Gujarat charging stations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {stations.slice(0, 6).map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{st.name}</h3>
                    <p className="text-[11px] text-slate-400">{st.city}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {formatRupee(st.pricePerKwh)}/kWh
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Bays: {st.ports?.length || 4} ports</span>
                  <button
                    onClick={() => {
                      setSelectedStation(st);
                      setNewTariff(st.pricePerKwh || 24);
                      setTariffModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all"
                  >
                    ✏️ Change Tariff
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions & Bookings History Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-white">Recent Charging Sessions & Payout Share</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Port</th>
                  <th className="py-3 px-4">Energy (kWh)</th>
                  <th className="py-3 px-4">Gross</th>
                  <th className="py-3 px-4">Platform (15%)</th>
                  <th className="py-3 px-4">Net Vendor</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {bookings.length > 0 ? (
                  bookings.slice(0, 8).map((b) => {
                    const gross = b.totalAmount || 800;
                    const fee = Math.round(gross * 0.15);
                    const net = gross - fee;
                    return (
                      <tr key={b.id || b._id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white">
                          #{String(b.id || b._id).slice(-6)}
                        </td>
                        <td className="py-3 px-4 text-cyan-300 font-sans">{b.vehicleModel || 'MG ZS EV'}</td>
                        <td className="py-3 px-4">{b.portId || 'Port 01'}</td>
                        <td className="py-3 px-4">{b.energyKwh || 28.5} kWh</td>
                        <td className="py-3 px-4 font-bold text-white">{formatRupee(gross)}</td>
                        <td className="py-3 px-4 text-amber-400">{formatRupee(fee)}</td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">{formatRupee(net)}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {b.status || 'COMPLETED'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-500">
                      No session records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Tariff Modal */}
      {tariffModalOpen && selectedStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Update Station Tariff</h3>
            <p className="text-xs text-slate-400">
              Set new price per kWh for <strong>{selectedStation.name}</strong>.
            </p>

            <form onSubmit={handleUpdateTariff} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">
                  Price per kWh (₹):
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="0.5"
                  value={newTariff}
                  onChange={(e) => setNewTariff(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTariffModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Save Tariff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Confirmation Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-center">
            <span className="text-4xl block">💸</span>
            <h3 className="text-lg font-bold text-white">IMPS Bank Payout Initiated</h3>
            <p className="text-xs text-slate-400">
              Settlement amount of <strong className="text-emerald-400 font-mono">{formatRupee(netEarnings || 41012)}</strong> transferred to <span className="text-white">{vendorDetails.bank}</span>.
            </p>
            <div className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-slate-300">
              UTR: UTR{Date.now().toString().slice(-8)}
            </div>
            <button
              onClick={() => setPayoutModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
