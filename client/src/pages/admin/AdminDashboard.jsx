import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { 
  Users, 
  Package, 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  BarChart3,
  Layers
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error loading admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Category Vertical Dual-Bar Chart Data (Lost vs Found per Category)
  const categoryChartData = [
    { category: 'Electronics', lost: 10, found: 15 },
    { category: 'Wallets', lost: 12, found: 6 },
    { category: 'Pets', lost: 15, found: 9 },
    { category: 'Accessories', lost: 8, found: 12 },
    { category: 'Documents', lost: 5, found: 7 },
    { category: 'Keys & Vehicles', lost: 9, found: 4 },
  ];

  const maxVal = 16; // Top Y-Axis mark

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            System Overview Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time analytics, user growth metrics, and operational performance
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/items"
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition-all"
          >
            Moderate Items
          </Link>
        </div>
      </div>

      {/* 6 Key Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: Total Users */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            {loading ? <span className="text-slate-300 dark:text-slate-700 animate-pulse">...</span> : (stats?.totalUsers ?? 0)}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% this month
          </p>
        </div>

        {/* Card 2: Total Items */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Items</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            {loading ? <span className="text-slate-300 dark:text-slate-700 animate-pulse">...</span> : (stats?.totalItems ?? 0)}
          </p>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
            {loading ? 'Loading breakdown...' : `${stats?.totalLost ?? 0} Lost | ${stats?.totalFound ?? 0} Found`}
          </p>
        </div>

        {/* Card 3: Recovered Items */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Recovered Items</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-display text-emerald-600 dark:text-emerald-400">
            {loading ? <span className="text-slate-300 dark:text-slate-700 animate-pulse">...</span> : (stats?.totalResolved ?? 0)}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">95.0% Success Rate</p>
        </div>

        {/* Card 4: Active Listings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Active Listings</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-display text-cyan-600 dark:text-cyan-400">
            {loading ? <span className="text-slate-300 dark:text-slate-700 animate-pulse">...</span> : (stats?.totalActive ?? 0)}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
            {loading ? '...' : `${stats?.totalFeatured ?? 0} Featured`}
          </p>
        </div>

        {/* Card 5: Claims Center */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Claims Center</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-display text-amber-600 dark:text-amber-400">
            {loading ? <span className="text-slate-300 dark:text-slate-700 animate-pulse">...</span> : (stats?.totalClaims ?? 0)}
          </p>
          <p className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold">Real-time Claims</p>
        </div>

        {/* Card 6: MRR Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">MRR Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold font-display text-emerald-600 dark:text-emerald-400">
            ${loading ? '...' : (stats?.estimatedRevenue ?? '0.00')}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+18.5% MRR</p>
        </div>

      </div>

      {/* Main Content Split: Popular Item Categories Statistics & Quick Operations Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Popular Item Categories Statistics Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  Popular Item Categories Statistics
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Comparative distribution of Lost vs Found items per category
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="text-slate-700 dark:text-slate-300">Planned (Lost)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-slate-700 dark:text-slate-300">Actual (Found)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Graphics Container */}
          <div className="relative pt-6 pb-2">
            
            {/* Y-Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 dark:text-slate-600 font-mono">
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-1">18</div>
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-1">14</div>
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-1">12</div>
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-1">10</div>
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-1">8</div>
              <div className="border-b border-slate-100 dark:border-slate-800/80 pb-1">4</div>
              <div>0</div>
            </div>

            {/* Bars */}
            <div className="relative h-64 flex items-end justify-between px-6 pt-4">
              {categoryChartData.map((item, idx) => {
                const lostHeight = (item.lost / maxVal) * 100;
                const foundHeight = (item.found / maxVal) * 100;

                return (
                  <div key={idx} className="flex flex-col items-center space-y-2 group z-10">
                    <div className="flex items-end space-x-1.5 h-48">
                      {/* Lost Bar */}
                      <div
                        style={{ height: `${lostHeight}%` }}
                        className="w-4 sm:w-5 bg-blue-600 rounded-t-lg transition-all group-hover:brightness-110 shadow-xs"
                        title={`Lost: ${item.lost}`}
                      ></div>
                      {/* Found Bar */}
                      <div
                        style={{ height: `${foundHeight}%` }}
                        className="w-4 sm:w-5 bg-rose-500 rounded-t-lg transition-all group-hover:brightness-110 shadow-xs"
                        title={`Found: ${item.found}`}
                      ></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-[70px]">
                      {item.category}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Quick Operations Desk */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-xs">
          
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
              Quick Operations Desk
            </h2>
          </div>

          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-950 dark:hover:bg-blue-900/20 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600">
                    User Accounts & Roles
                  </h4>
                  <p className="text-[11px] text-slate-500">Search users, activate, promote</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/items"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50 dark:bg-slate-950 dark:hover:bg-purple-900/20 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600">
                    Item Moderation Desk
                  </h4>
                  <p className="text-[11px] text-slate-500">Feature listings, approve or delete</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/settings"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-950 dark:hover:bg-emerald-900/20 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
                    Feature Toggles & Settings
                  </h4>
                  <p className="text-[11px] text-slate-500">Enable/disable posting & claims</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
