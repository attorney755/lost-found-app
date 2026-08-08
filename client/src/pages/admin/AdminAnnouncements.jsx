import React, { useState } from 'react';
import { Megaphone, Plus, Bell, Trash2, Pin, CheckCircle2, AlertTriangle, Info, DollarSign, Wrench } from 'lucide-react';

const initialAnnouncements = [
  {
    id: 'anc_1',
    title: 'Scheduled Platform Maintenance & Infrastructure Upgrade',
    category: 'Maintenance',
    priority: 'high',
    content: 'We will be conducting scheduled database optimization on Sunday at 02:00 AM UTC. Expect brief intermittent downtime of under 10 minutes.',
    isPinned: true,
    createdAt: '2026-08-04',
  },
  {
    id: 'anc_2',
    title: 'Updated Pricing Plans & New VIP Promotion Boosts',
    category: 'Pricing',
    priority: 'medium',
    content: 'We have updated our Pro & VIP subscription plans with higher photo/video upload limits and top search priority rankings.',
    isPinned: true,
    createdAt: '2026-08-03',
  },
  {
    id: 'anc_3',
    title: 'New Real-Time Finder Direct Contact Messaging Feature',
    category: 'Update',
    priority: 'low',
    content: 'Finders can now send instant found item reports directly to posters with real-time notifications in their dashboard!',
    isPinned: false,
    createdAt: '2026-08-01',
  },
];

const categoryIcons = {
  Maintenance: Wrench,
  Pricing: DollarSign,
  Update: Info,
  Alert: AlertTriangle,
};

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Maintenance',
    priority: 'medium',
    content: '',
    isPinned: false,
  });
  const [notice, setNotice] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newAnc = {
      id: `anc_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAnnouncements([newAnc, ...announcements]);
    setNotice(`Announcement "${formData.title}" published!`);
    setFormData({
      title: '',
      category: 'Maintenance',
      priority: 'medium',
      content: '',
      isPinned: false,
    });

    setTimeout(() => setNotice(''), 4000);
  };

  const handleTogglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Delete announcement "${title}"?`)) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setNotice('Announcement removed');
    setTimeout(() => setNotice(''), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white flex items-center space-x-2">
            <Megaphone className="w-7 h-7 text-blue-600" />
            <span>Platform Broadcast Announcements</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Broadcast platform announcements for pricing changes, scheduled maintenance, and system alerts
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Create New Broadcast Announcement Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
        <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
          <Plus className="w-5 h-5 text-blue-600" />
          <span>Publish New Announcement</span>
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Announcement Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Scheduled Maintenance on Sunday 2:00 AM UTC"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
              >
                <option value="Maintenance">Scheduled Maintenance</option>
                <option value="Pricing">Pricing Changes</option>
                <option value="Update">Platform Update</option>
                <option value="Alert">Security Alert</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High / Urgent</option>
              </select>
            </div>

          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Announcement Details & Content</label>
            <textarea
              rows="3"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Provide complete details about the maintenance schedule, pricing adjustments, or features..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPinned"
                checked={formData.isPinned}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <span>Pin to homepage top banner</span>
              </span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
          </div>
        </form>

      </div>

      {/* Broadcast Announcements List */}
      <div className="space-y-4">
        <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">Active Announcements</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {announcements.map((item) => {
            const IconComp = categoryIcons[item.category] || Info;
            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 border p-6 rounded-3xl shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.isPinned ? 'border-amber-400 dark:border-amber-500/40 ring-1 ring-amber-400/20' : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    item.category === 'Maintenance' 
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' 
                      : item.category === 'Pricing'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30'
                  }`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</span>
                      {item.isPinned && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-extrabold flex items-center">
                          <Pin className="w-3 h-3 mr-1" /> Pinned Banner
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{item.content}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Published on {item.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleTogglePin(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      item.isPinned 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5 inline mr-1" />
                    {item.isPinned ? 'Unpin' : 'Pin'}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AdminAnnouncements;
