import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Which is the best EV charging network in Gujarat?',
      a: "VoltGrid provides Gujarat's premier state-integrated EV charging supergrid connecting 34 fast DC hubs across the Ahmedabad-Vadodara-Surat expressway, NH48, and Saurashtra corridors. With zero queues, dynamic power splitting up to 350kW, and 15-minute guaranteed bay holds, it eliminates highway range anxiety completely."
    },
    {
      q: 'How does the 15-Minute Guaranteed Hold work?',
      a: 'When you select an available port on approach, VoltGrid locks the physical charging bay exclusively for your EV for 15 minutes at ₹0 upfront cost. A unique 4-digit activation PIN is generated on your live digital pass, preventing other drivers from plugging in until you arrive.'
    },
    {
      q: 'Do I need an app or can I book directly on this web portal?',
      a: 'No app download required! VoltGrid runs seamlessly as a high-speed progressive web app on your mobile or desktop browser. You can view real-time port statuses, lock bays, monitor live battery BMS telemetry, and download tax receipts without installing anything.'
    },
    {
      q: 'Which EV models and connector types are supported?',
      a: 'VoltGrid hubs support all major Indian and international passenger EVs (Tata Nexon EV Max/Punch EV, MG ZS EV, Mahindra XUV400, Hyundai Ioniq 5, Kia EV6, BYD Atto 3) as well as commercial fleets. Standard CCS-2 DC Fast (30kW–350kW) and Type-2 AC connectors are deployed statewide.'
    },
    {
      q: "What happens if I don't reach the charger within 15 minutes?",
      a: 'If you do not enter your 4-digit PIN at the charger screen within 15 minutes, the reservation expires automatically and the port returns to the public pool for other drivers. You can also cancel your hold with one tap inside your profile at ₹0 penalty.'
    },
    {
      q: 'How does automated GST invoicing and tax receipt generation work?',
      a: 'Tariffs are fully transparent per kWh with zero hidden fees. Upon charging completion, an automated itemized GST invoice with SAC Code 998714, CGST/SGST breakdowns, and an official UTR transaction reference is generated and saved directly to your account for tax deduction claims.'
    }
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-slate-100 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
              FAQS & KNOWLEDGE BASE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-heading">
              Got questions about the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                VoltGrid Supergrid?
              </span>
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Everything you need to know about reserving fast chargers, 15-minute PIN holds, Gujarat express corridors, and billing.
            </p>

            <div className="pt-2">
              <a
                href="tel:18002004848"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Call 24x7 Corridor Helpline (1800 200 4848)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 divide-y divide-slate-800/80 border-t border-b border-slate-800/80">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const numStr = (idx + 1).toString().padStart(2, '0');
              return (
                <div key={idx} className="py-5 transition-colors">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-start justify-between gap-4 text-left group cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="text-xs font-mono font-bold text-emerald-500 pt-0.5">
                        {numStr}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {faq.q}
                      </h3>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-white shrink-0 mt-0.5">
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pl-8 sm:pl-9 pr-4 text-xs sm:text-sm text-slate-400 leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
