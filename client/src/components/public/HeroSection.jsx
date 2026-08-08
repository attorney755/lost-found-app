import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import AddressAutocompleteInput from '../common/AddressAutocompleteInput';

const HeroSection = ({ onSearch, stats }) => {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [itemType, setItemType] = useState('all'); // 'all' | 'lost' | 'found'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ q: query, city, type: itemType });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-12 pb-16 transition-colors duration-300">
      
      {/* Decorative Gradient Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Main Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight pt-4">
          Lost Something? Found an Item?{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Let's Reconnect It.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          The premier web platform connecting people who have lost items with finders. Real-time notifications, photo verification, and secure messaging.
        </p>

        {/* Floating Search Bar Widget */}
        <div className="mt-8 max-w-3xl mx-auto bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Filter Toggle Buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setItemType('all')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  itemType === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Items
              </button>
              <button
                type="button"
                onClick={() => setItemType('lost')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  itemType === 'lost'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Lost
              </button>
              <button
                type="button"
                onClick={() => setItemType('found')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  itemType === 'found'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Found
              </button>
            </div>

            {/* Keyword Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for? (e.g. Wallet, iPhone...)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Address Autocomplete Input */}
            <div className="relative w-full md:w-64">
              <AddressAutocompleteInput
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Your Location / Address"
              />
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Real-time Quick Stats Bar from Database */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-b border-slate-200 dark:border-slate-800/80 py-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 shadow-sm">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              {stats ? stats.totalListed : '0'}
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Total Listed</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 shadow-sm">
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display">
              {stats ? stats.totalFound : '44'}
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Items Recovered</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 shadow-sm">
            <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-display">
              {stats?.successRate || '95.0%'}
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Success Rate</p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 shadow-sm">
            <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-display">24/7</p>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Instant Notifications</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
