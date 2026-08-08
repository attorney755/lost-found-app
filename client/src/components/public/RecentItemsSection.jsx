import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import ItemCard from '../items/ItemCard';
import { ArrowRight } from 'lucide-react';

const RecentItemsSection = ({ onViewItem }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const res = await API.get('/items/recent?limit=6');
        if (res.data.success) {
          setItems(res.data.items);
        }
      } catch (err) {
        console.error('Error fetching recent items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Recently Reported Items
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base mt-2 max-w-xl">
            Check the latest items lost and found in your area. Have you seen any of these?
          </p>
        </div>

        <Link
          to="/browse"
          className="inline-flex items-center space-x-2 text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          <span>View All Listed Items</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onViewDetails={onViewItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-slate-500 text-sm">No recent items reported yet. Be the first to list an item!</p>
        </div>
      )}

    </section>
  );
};

export default RecentItemsSection;
