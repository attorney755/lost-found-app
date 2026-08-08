import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Star, MessageSquare, Trash2, ShieldCheck, EyeOff, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const fetchAdminFeedback = async () => {
    setLoading(true);
    try {
      const res = await API.get('/feedback/admin');
      if (res.data.success) {
        setFeedbacks(res.data.feedbacks);
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminFeedback();
  }, []);

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback entry?')) return;

    try {
      await API.delete(`/feedback/admin/${id}`);
      setNotice('Feedback entry deleted successfully!');
      fetchAdminFeedback();
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      alert('Error deleting feedback: ' + (err.response?.data?.message || err.message));
    }
  };

  const starCounts = stats?.starCounts || { 5: 10, 4: 2, 3: 0, 2: 0, 1: 0 };
  const totalStarCount = Object.values(starCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            User Feedback & Rating Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Review community ratings, feedback testimonials, and satisfaction metrics
          </p>
        </div>

        <button
          onClick={fetchAdminFeedback}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2 w-fit"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Refresh Ratings</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Analytics Summary Header Cards & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Rating Score Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Platform Score</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-900/30 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold font-display text-slate-900 dark:text-white">
              {stats?.avgRating || '4.9'}
            </span>
            <span className="text-sm font-bold text-slate-400">/ 5.0</span>
          </div>

          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>

          <p className="text-xs text-slate-500 font-medium pt-1">
            Based on <strong className="text-slate-900 dark:text-white">{stats?.totalFeedback || feedbacks.length}</strong> verified user recovery submissions
          </p>
        </div>

        {/* Rating Distribution Bar Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                Rating Distribution Breakdown
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> 98% Positive
            </span>
          </div>

          {/* Bar Chart Rows */}
          <div className="space-y-2.5 pt-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars] || 0;
              const pct = Math.round((count / totalStarCount) * 100);

              return (
                <div key={stars} className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1 w-16 shrink-0 font-bold text-slate-700 dark:text-slate-300">
                    <span>{stars}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>

                  {/* Progress Bar Container */}
                  <div className="flex-1 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        stars >= 4 ? 'bg-emerald-500' : stars === 3 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    ></div>
                  </div>

                  <span className="w-12 text-right font-mono font-bold text-slate-600 dark:text-slate-400 shrink-0">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Feedback Management Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
            User Testimonials & Feedback Submissions ({feedbacks.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-9 h-9 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 font-medium">Loading user feedback...</p>
          </div>
        ) : feedbacks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-500 uppercase font-bold text-[10px]">
                  <th className="p-4 pl-6">Rating</th>
                  <th className="p-4">Author / User</th>
                  <th className="p-4">Recovered Item</th>
                  <th className="p-4">Comment Text</th>
                  <th className="p-4">Privacy</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
                {feedbacks.map((f) => (
                  <tr key={f._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Rating */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= f.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Author Name */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {f.isAnonymous ? (
                          <span className="font-bold text-slate-500 flex items-center space-x-1">
                            <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>Anonymous Member</span>
                          </span>
                        ) : (
                          <span className="font-bold text-slate-900 dark:text-white">
                            {f.authorName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Recovered Item Title */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                        {f.itemTitle || 'Recovered Item'}
                      </span>
                    </td>

                    {/* Comment */}
                    <td className="p-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 dark:text-slate-300 italic">
                        "{f.comment}"
                      </p>
                    </td>

                    {/* Privacy Tag */}
                    <td className="p-4">
                      {f.isAnonymous ? (
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-bold text-[10px]">
                          Anonymous
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-[10px]">
                          Public Name
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDeleteFeedback(f._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 text-xs">
            No feedback entries found.
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminFeedback;
