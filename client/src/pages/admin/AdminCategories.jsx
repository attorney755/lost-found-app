import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Tags, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [notice, setNotice] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await API.post('/admin/categories', { name: newCatName.trim() });
      if (res.data.success) {
        setNotice(`Created category "${newCatName}"`);
        setNewCatName('');
        fetchCategories();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error creating category: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await API.delete(`/admin/categories/${id}`);
      if (res.data.success) {
        setNotice(`Category "${name}" deleted`);
        fetchCategories();
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error deleting category: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
          Content & Category Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Add, edit, or remove item categories used across the platform
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add New Category Card */}
      <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row gap-4 items-center shadow-xs">
        <div className="flex-grow w-full">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">New Category Name</label>
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Sports & Fitness"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 transition-all self-end flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </form>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500 text-xs col-span-3">Loading categories...</p>
        ) : categories.map((cat) => (
          <div key={cat._id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                <Tags className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{cat.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">ID: {cat._id}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(cat._id, cat.name)}
              className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-xl transition-colors"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminCategories;
