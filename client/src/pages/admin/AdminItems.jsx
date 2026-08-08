import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Search, Sparkles, Trash2, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await API.get(`/admin/items?${params.toString()}`);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('Error fetching admin items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [typeFilter, statusFilter]);

  const handleToggleFeature = async (itemId) => {
    try {
      const res = await API.put(`/admin/items/${itemId}/feature`);
      if (res.data.success) {
        setNotice(res.data.message);
        fetchItems();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error toggling feature: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const res = await API.put(`/admin/items/${itemId}/status`, { status: newStatus });
      if (res.data.success) {
        setNotice(res.data.message);
        fetchItems();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (itemId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete item "${title}"?`)) return;
    try {
      const res = await API.delete(`/admin/items/${itemId}`);
      if (res.data.success) {
        setNotice('Item deleted successfully');
        fetchItems();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error deleting item: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            Item Moderation Desk
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Review, feature, resolve, or delete items posted across the platform
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        
        <form onSubmit={(e) => { e.preventDefault(); fetchItems(); }} className="relative flex-grow w-full md:w-auto max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search item title, category, description..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                typeFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('lost')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                typeFilter === 'lost' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setTypeFilter('found')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                typeFilter === 'found' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Found
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved Only</option>
          </select>
        </div>

      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-extrabold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Item Details</th>
                <th className="px-6 py-4">Type / Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Poster</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading items...</td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => {
                  const isLost = item.type === 'lost';
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=200&auto=format&fit=crop'}
                            alt={item.title}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-800"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{item.title}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider block w-fit ${
                          isLost 
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40' 
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block">{item.category}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                            item.status === 'resolved' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                          }`}>
                            {item.status}
                          </span>
                          {item.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {item.user?.name || item.contactName || 'Anonymous'}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleFeature(item._id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            item.isFeatured 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 hover:bg-amber-200' 
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                          title="Toggle Featured Status"
                        >
                          <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                          {item.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>

                        <button
                          onClick={() => handleStatusChange(item._id, item.status === 'resolved' ? 'active' : 'resolved')}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all"
                        >
                          {item.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}
                        </button>

                        <button
                          onClick={() => handleDeleteItem(item._id, item.title)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No items found matching query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminItems;
