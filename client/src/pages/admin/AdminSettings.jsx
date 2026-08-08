import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Settings, Shield, ToggleLeft, ToggleRight, CheckCircle2, Save } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Lost & Found Finder Platform',
    contactEmail: 'support@lostfoundapp.com',
    maintenanceMode: false,
    featureToggles: {
      userRegistration: true,
      itemPosting: true,
      itemClaiming: true,
      messaging: true,
      payments: true,
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/admin/settings');
        if (res.data.success && res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      featureToggles: {
        ...prev.featureToggles,
        [key]: !prev.featureToggles[key],
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/admin/settings', settings);
      if (res.data.success) {
        setNotice('System settings updated successfully!');
        setTimeout(() => setNotice(''), 4000);
      }
    } catch (err) {
      alert('Error updating settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
          System Settings & Feature Toggles
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure site name, support email, maintenance mode, and feature switches
        </p>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Site Config */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
          <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            General Site Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Site Name</label>
              <input
                type="text"
                value={settings.siteName || ''}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Support Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                required
              />
            </div>
          </div>
        </div>

        {/* System Feature Toggles */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
          <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Platform Feature Switches
          </h2>

          <div className="space-y-3">
            {Object.keys(settings.featureToggles || {}).map((key) => {
              const enabled = settings.featureToggles[key];
              return (
                <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-[11px] text-slate-500">Allow users to use {key.toLowerCase()} features</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggle(key)}
                    className={`px-4 py-1.5 text-xs font-extrabold rounded-full transition-all ${
                      enabled 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40' 
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40'
                    }`}
                  >
                    {enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>

      </form>

    </div>
  );
};

export default AdminSettings;
