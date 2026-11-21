import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, Car, Shield, Calendar, Clock, Download, XCircle, CheckCircle2, Zap, ArrowLeft, Edit3, Save, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Invoice from '../components/Invoice';
import DigitalPassModal from '../components/DigitalPassModal';
import FeedbackModal from '../components/FeedbackModal';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../api/users';
import { getBookings, cancelBooking } from '../api/bookings';
import { getStation } from '../api/stations';
import { VEHICLE_PRESETS } from '../constants/vehicles';
import { formatRupee, formatDate, formatDateTime } from '../lib/format';

export default function Profile() {
  const { user, setUser } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Edit profile form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [car, setCar] = useState(user?.car || user?.vehicleModel || 'MG ZS EV');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Modals for receipts and passes
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activePassBooking, setActivePassBooking] = useState(null);
  const [passStation, setPassStation] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCar(user.car || user.vehicleModel || 'MG ZS EV');
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await getBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const updated = await updateMyProfile({ name, phone, car });
      setUser(updated);
      setIsEditing(false);
      setProfileMsg('✅ Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 4000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this 15-minute slot hold?')) return;
    try {
      await cancelBooking(bookingId);
      alert('Booking hold cancelled successfully.');
      loadBookings();
    } catch (err) {
      alert(`Could not cancel: ${err.message}`);
    }
  };

  const handleOpenPass = async (booking) => {
    try {
      const st = await getStation(booking.stationId);
      setPassStation(st);
      setActivePassBooking(booking);
    } catch (err) {
      alert('Could not load station pass details: ' + err.message);
    }
  };

  // Check if booking is within 15 min hold window
  const isWithin15MinHold = (createdAt) => {
    const elapsedMs = Date.now() - new Date(createdAt).getTime();
    return elapsedMs < 15 * 60 * 1000;
  };

  const completedSessions = bookings.filter((b) => b.status === 'COMPLETED');
  const totalKwh = completedSessions.reduce((sum, b) => sum + (b.energyKwh || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-emerald-500 flex items-center gap-1 font-bold">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Charging
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">Driver Profile & Bookings</span>
          </div>
        </div>

        {profileMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center">
            {profileMsg}
          </div>
        )}

        {/* Profile Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/20">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                    {user?.name || 'Driver'}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {user?.role || 'DRIVER'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  VoltGrid Verified Highway Corridor Member
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Details / Edit Form */}
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Registered Vehicle</label>
                <select
                  value={car}
                  onChange={(e) => setCar(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {VEHICLE_PRESETS.map((v) => (
                    <option key={v.model} value={v.model}>
                      {v.model} ({v.batteryKwh} kWh)
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-full pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile Details'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Mail className="w-3 h-3" /> Email Address
                </span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono text-[11px] block truncate">
                  {user?.email || '—'}
                </strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono text-[11px] block">
                  {user?.phone || '—'}
                </strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Car className="w-3 h-3" /> EV Model
                </span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-bold block truncate">
                  {user?.car || user?.vehicleModel || 'MG ZS EV'}
                </strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3" /> Energy Dispensed
                </span>
                <strong className="text-cyan-600 dark:text-cyan-400 font-bold font-mono block">
                  {totalKwh.toFixed(1)} kWh Total
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Bookings & Reservations Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                My Charging Bookings & Slot Holds ({bookings.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage your active 15-minute slot holds, view 4-digit PINs, and download official GST tax receipts.
              </p>
            </div>
            <button
              onClick={loadBookings}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline self-start sm:self-auto"
            >
              🔄 Refresh List
            </button>
          </div>

          {loadingBookings ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading reservations...</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6 space-y-2">
              <span className="text-3xl block">🔌</span>
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No bookings yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore the Gujarat corridor to reserve a dedicated charging bay with a 15-minute guaranteed hold.
              </p>
              <Link
                to="/"
                className="inline-block mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Find & Reserve Charger
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-950 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Station / Hub</th>
                    <th className="py-3 px-4">Bay</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {bookings.map((b) => {
                    const isConfirmed = b.status === 'CONFIRMED';
                    const isCompleted = b.status === 'COMPLETED';
                    const canCancel = isConfirmed && isWithin15MinHold(b.createdAt);

                    return (
                      <tr key={b.id || b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          #{String(b.id || b._id).slice(-6)}
                        </td>
                        <td className="py-3.5 px-4 font-sans font-semibold text-slate-800 dark:text-slate-200">
                          {b.stationId || 'Gujarat SuperHub'}
                        </td>
                        <td className="py-3.5 px-4">{b.portId || 'Bay 01'}</td>
                        <td className="py-3.5 px-4 font-sans text-cyan-600 dark:text-cyan-400">
                          {b.vehicleModel || 'EV'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {formatDateTime(b.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          {formatRupee(b.totalAmount || 0)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isConfirmed
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                                : isCompleted
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                : b.status === 'CHARGING'
                                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 animate-pulse'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Cancel Button within 15 mins */}
                            {canCancel && (
                              <button
                                onClick={() => handleCancelBooking(b.id || b._id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                                title="Cancel reservation within 15m hold"
                              >
                                <XCircle className="w-3 h-3" />
                                <span>Cancel Hold</span>
                              </button>
                            )}

                            {/* View PIN Pass for active confirmed holds */}
                            {isConfirmed && (
                              <button
                                onClick={() => handleOpenPass(b)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                              >
                                <Zap className="w-3 h-3" />
                                <span>PIN Pass</span>
                              </button>
                            )}

                            {/* Download / View Receipt for completed sessions */}
                            {isCompleted && (
                              <>
                                <button
                                  onClick={() => setSelectedInvoice(b)}
                                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                                  title="View official GST Tax Receipt"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Receipt</span>
                                </button>
                                <button
                                  onClick={() => setReviewingBooking(b)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                                  title="Write a Driver Review for this session"
                                >
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>Review</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <Invoice
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Digital Pass Modal */}
      {activePassBooking && passStation && (
        <DigitalPassModal
          booking={activePassBooking}
          station={passStation}
          onStartCharging={() => {
            setActivePassBooking(null);
            alert('Please start session from the charger page.');
          }}
          onCancel={() => {
            handleCancelBooking(activePassBooking.id || activePassBooking._id);
            setActivePassBooking(null);
          }}
          onClose={() => setActivePassBooking(null)}
        />
      )}
      {/* Feedback & Review Modal */}
      {reviewingBooking && (
        <FeedbackModal
          isOpen={Boolean(reviewingBooking)}
          stationName={reviewingBooking.stationName || reviewingBooking.station?.name || 'Gujarat Supergrid Hub'}
          bookingId={reviewingBooking.id || reviewingBooking._id}
          onClose={() => setReviewingBooking(null)}
          onReviewSubmitted={() => {
            alert('🎉 Thank you! Your review is now published live on the homepage.');
            setReviewingBooking(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
