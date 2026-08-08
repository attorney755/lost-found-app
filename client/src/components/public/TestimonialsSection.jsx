import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Star, Quote, ShieldCheck, UserCheck, EyeOff } from 'lucide-react';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await API.get('/feedback/public');
        if (res.data.success) {
          setTestimonials(res.data.testimonials);
        }
      } catch (err) {
        console.error('Error loading testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
          Verified Community Recovery Reviews
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What Community Members Say
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Read real recovery feedback and ratings left by item posters and finders across Kigali.
        </p>
      </div>

      {/* Grid of Testimonials */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="w-9 h-9 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Loading community reviews...</p>
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
            >
              <div className="space-y-3">
                
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= t.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-blue-600/20 dark:text-blue-400/20" />
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Item Badge & Author Details */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  Recovered: {t.itemTitle}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center space-x-2">
                    {t.isAnonymous ? (
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                        <EyeOff className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                        {t.authorName ? t.authorName.charAt(0).toUpperCase() : 'C'}
                      </div>
                    )}

                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                        {t.isAnonymous ? 'Anonymous Member' : t.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {t.isAnonymous ? 'Privacy Protected' : 'Verified Member'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-xs">
          No feedback entries yet.
        </div>
      )}

    </section>
  );
};

export default TestimonialsSection;
