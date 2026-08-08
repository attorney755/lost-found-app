import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import ItemCard from '../../components/items/ItemCard';
import ItemDetailModal from '../../components/items/ItemDetailModal';
import AddressAutocompleteInput from '../../components/common/AddressAutocompleteInput';
import { 
  Search, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Award,
  Eye,
  X
} from 'lucide-react';

const categories = [
  'All',
  'Electronics',
  'Wallets & Purses',
  'Pets',
  'Documents & IDs',
  'Jewelry & Watches',
  'Accessories',
  'Vehicles & Keys',
  'Bags & Backpacks',
  'Clothing',
  'Other',
];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  // Selected item modal
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (selectedType !== 'all') params.set('type', selectedType);
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      if (selectedCity.trim()) params.set('city', selectedCity.trim());
      params.set('sortBy', sortBy);
      params.set('page', page);
      params.set('limit', 12);

      const res = await API.get(`/items?${params.toString()}`);
      if (res.data.success) {
        setItems(res.data.items);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedType, selectedCategory, sortBy, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchItems();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedCategory('All');
    setSelectedCity('');
    setSortBy('createdAt');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 transition-colors duration-300">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Browse & Search Items
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          Search lost and found items in Kigali & Rwanda. Filter by category, location, or report status to find what you are looking for.
        </p>
      </div>

      {/* Main Search & Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          
          {/* Keyword Search */}
          <div className="lg:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keyword..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Address Autocomplete City Search */}
          <div className="lg:col-span-4 relative">
            <AddressAutocompleteInput
              name="city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              placeholder="Your Location / Address"
            />
          </div>

          {/* Type Toggle */}
          <div className="lg:col-span-2 flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => { setSelectedType('all'); setPage(1); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedType === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => { setSelectedType('lost'); setPage(1); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedType === 'lost' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lost
            </button>
            <button
              type="button"
              onClick={() => { setSelectedType('found'); setPage(1); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedType === 'found' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Found
            </button>
          </div>

          {/* Submit Search Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all"
            >
              Apply Filter
            </button>
          </div>

        </form>

        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Results Header with View Mode Toggles */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Showing <span className="font-extrabold text-slate-900 dark:text-white">{items.length}</span> of{' '}
          <span className="font-extrabold text-slate-900 dark:text-white">{total}</span> items found
        </p>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl border transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl border transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items Results Grid/List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-9 h-9 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Fetching listed items...</p>
        </div>
      ) : items.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              viewMode={viewMode}
              onViewDetails={(i) => setSelectedItem(i)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <p className="text-slate-500 text-sm">No items match your search filters.</p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-full shadow"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold px-4">
            Page {page} of {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

    </div>
  );
};

export default Browse;
