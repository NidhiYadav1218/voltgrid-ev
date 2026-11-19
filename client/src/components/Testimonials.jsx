import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, Car, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { getReviews } from '../api/reviews';
import FeedbackModal from './FeedbackModal';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const loadReviews = async () => {
    try {
      const data = await getReviews(15);
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (err) {
      console.warn('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReviewSubmitted = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <section className="py-16 bg-slate-950/60 border-t border-b border-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
              <span>★ 4.9/5 RATED CORRIDOR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading">
              What Gujarat EV Drivers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Say
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Real stories. Real journeys. Verified charging experiences on Gujarat expressways.
            </p>
          </div>

          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer w-fit"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div
                key={rev._id || rev.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-all duration-300 group"
              >
                <div>
                  {/* Driver Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-md">
                        <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-white text-xs">
                          {rev.userName?.charAt(0) || 'D'}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {rev.userName}
                          </h4>
                          {rev.verifiedDriver && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Verified Driver" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {rev.userCity || 'Ahmedabad'} • {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent'}
                        </p>
                      </div>
                    </div>

                    {/* Vehicle pill */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800 shrink-0">
                      🚗 {rev.vehicleModel?.split(' ')[0] || 'EV'}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-4">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Rating Stars & Station */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[170px]" title={rev.stationName}>
                    📍 {rev.stationName || 'Gujarat Hub'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500">
              <p>No verified driver reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>

      {/* Driver Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </section>
  );
}
