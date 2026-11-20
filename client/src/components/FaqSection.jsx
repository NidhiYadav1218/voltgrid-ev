import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, HelpCircle, PhoneCall } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Which is the most reliable EV charging network for highway travel in India?',
      a: 'Zeon Charging operates India’s highest uptime EV charging network (99.4% uptime) connecting major interstate highways, expressways, luxury resorts, and high-density corridors. With high-speed DC fast chargers ranging from 50kW to 150kW and 350kW, Zeon ensures long-distance highway road trips with zero range anxiety.'
    },
    {
      q: 'How does the 15-Minute Guaranteed Slot Lock work?',
      a: 'When you select an available charger on approach, Zeon locks the physical charging bay exclusively for your EV for 15 minutes at ₹0 upfront charge. A unique 4-digit security PIN is issued on your digital pass, preventing unauthorized vehicles from plugging in until you arrive.'
    },
    {
      q: 'Do I need a mobile app to charge with Zeon Charging?',
      a: 'You can charge seamlessly using our Web Portal, the Zeon Mobile App (available on iOS and Android), or through AutoCharge and RFID tap-and-charge. You can reserve bays, start charging sessions, track live battery SoC, and download tax invoices with full flexibility.'
    },
    {
      q: 'What EV models and connector standards are supported by Zeon?',
      a: 'Zeon fast-charging stations are compatible with all modern Indian and global electric vehicles including Tata Nexon EV, Punch EV, Curvv EV, MG ZS EV, Mahindra XUV400, Hyundai Ioniq 5, Kia EV6, BYD Atto 3 / Seal, and luxury EVs. We deploy industry-standard CCS-2 DC guns and Type-2 AC chargers.'
    },
    {
      q: 'How can commercial properties or landowners host a Zeon Charger?',
      a: 'Hotels, resorts (like Radisson Blu and CGH Earth), shopping malls (like Nexus), highway restaurants, and landowners can monetize parking spaces by partnering with Zeon. We offer turnkey hardware installation, 24x7 customer support, and automatic revenue sharing accessible directly via the Host a Charger / CPO portal.'
    },
    {
      q: 'What payment methods and invoicing options are available?',
      a: 'Zeon supports UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and the in-app Zeon Wallet. Upon completion of each session, a digital GST invoice with SAC Code and CGST/SGST tax breakdown is automatically generated and archived in your profile.'
    }
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-16 sm:py-20 bg-black text-zinc-100 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
              Got questions about{' '}
              <span className="text-red-500">
                Zeon Charging?
              </span>
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
              Everything you need to know about ultra-fast highway charging, 15-minute slot holds, partner opportunities, and network billing.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="tel:18002031500"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call 24x7 Support: 1800 203 1500</span>
              </a>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-zinc-900 border-red-500/50 shadow-md shadow-red-950/30'
                      : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
                  }`}
                >
                  <button
                    onClick={() => toggle(idx)}
                    type="button"
                    className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-red-400">
                        0{idx + 1}
                      </span>
                      <span className="font-bold text-sm sm:text-base text-zinc-100">
                        {faq.q}
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-red-600 text-white rotate-180'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80">
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
