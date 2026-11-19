import React from 'react';
import { CheckCircle2, Zap, Download } from 'lucide-react';
import { formatRupees, formatDateTime } from '../lib/format.js';

export default function Invoice({ booking, onClose }) {
  if (!booking) return null;

  const inv = booking.invoice || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
            Charging Session Invoice
          </h3>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
            Ref: {booking.bookingCode}
          </p>
        </div>

        <div className="space-y-3 text-xs border-y border-slate-100 dark:border-slate-800 py-4 mb-5">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Date & Time:</span>
            <span className="font-medium text-slate-900 dark:text-slate-200">{formatDateTime(booking.createdAt)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Customer Name:</span>
            <span className="font-medium text-slate-900 dark:text-slate-200">{booking.customerName}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Electric Vehicle:</span>
            <span className="font-medium text-slate-900 dark:text-slate-200">{booking.vehicleModel}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Charging Hub:</span>
            <span className="font-medium text-slate-900 dark:text-slate-200 truncate max-w-[200px]">{booking.stationName}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Energy Delivered:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{booking.energyKwh} kWh</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Base Tariff Rate:</span>
            <span className="font-mono text-slate-900 dark:text-slate-200">{formatRupees(booking.pricePerKwh)}/kWh</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Energy Cost:</span>
            <span className="font-mono text-slate-900 dark:text-slate-200">{formatRupees(inv.energyCharge)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Convenience Grid Fee:</span>
            <span className="font-mono text-slate-900 dark:text-slate-200">{formatRupees(inv.convenienceFee)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>GST (18%):</span>
            <span className="font-mono text-slate-900 dark:text-slate-200">{formatRupees(inv.gst)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
            <span>Total Paid (Escrow):</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              {formatRupees(inv.totalAmount)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer"
        >
          Close Receipt
        </button>
      </div>
    </div>
  );
}
