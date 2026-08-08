import React from 'react';
import { MapPin, Calendar, Award, Eye, Sparkles } from 'lucide-react';

const ItemCard = ({ item, onView }) => {
  const isLost = item.type === 'lost';
  const defaultImg = isLost
    ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&auto=format&fit=crop';

  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : defaultImg;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="group bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Image Container */}
        <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = defaultImg;
            }}
          />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md ${
                isLost
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {item.type}
            </span>

            {item.isFeatured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center space-x-1 shadow-md">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Reward Badge */}
          {item.rewardAmount > 0 && (
            <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 shadow-md">
              <Award className="w-3.5 h-3.5" />
              <span>${item.rewardAmount} Reward</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
            <span>{item.category}</span>
            <span className="flex items-center space-x-1 text-slate-400 font-normal">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(item.dateOccurred)}</span>
            </span>
          </div>

          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
            {item.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="truncate">{item.location?.city ? `${item.location.city}, ${item.location.state || ''}` : item.location?.address}</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="px-5 pb-5 pt-2">
        <button
          onClick={() => onView(item)}
          className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
