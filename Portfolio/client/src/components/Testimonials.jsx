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
    <section className="py-16 bg-black border-t border-b border-zinc-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
              <span>★ 4.9/5 VERIFIED DRIVER SATISFACTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              What Our Drivers{' '}
              <span className="text-red-500">
                Say
              </span>
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Real stories. Real journeys. Real Zeon Charging experiences across India's highways.
            </p>
          </div>

          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer w-fit hover:scale-105 active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Share Your Experience</span>
          </button>
        </div>

        {/* Reviews Horizontal Scrollable Grid */}
        {loading ? (
          <div className="py-12 text-center text-zinc-500">Loading verified driver reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            No driver reviews yet. Be the first to share your charging experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((rev) => (
              <div
                key={rev._id || rev.id}
                className="bg-zinc-900/90 rounded-2xl p-6 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-red-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? 'fill-red-500 text-red-500' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Driver'}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-red-950/80 border border-red-800/80 flex items-center justify-center font-bold text-red-400 text-xs">
                      {rev.authorName ? rev.authorName[0].toUpperCase() : 'E'}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">
                        {rev.authorName || 'EV Driver'}
                      </p>
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Car className="w-3 h-3 text-red-400" />
                        <span>{rev.carModel || 'Electric Vehicle'}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 truncate max-w-[120px]">
                    {rev.stationName || 'Zeon Hub'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for adding feedback */}
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          onSuccess={handleReviewSubmitted}
        />
      </div>
    </section>
  );
}
