import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { 
  ShieldCheck, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Package, 
  Trash2, 
  Menu,
  UserPlus,
  ExternalLink 
} from 'lucide-react';

const initialNotifications = [
  {
    id: 'n1',
    title: 'Item Found Report Submitted',
    message: 'Sarah Jenkins submitted a founder contact report for "Lost iPhone 15 Pro Max".',
    time: '2 mins ago',
    type: 'found',
    unread: true,
    link: '/admin/items',
  },
  {
    id: 'n2',
    title: 'New Ownership Claim Pending',
    message: 'David Miller submitted proof of purchase for "Found Seiko Watch".',
    time: '15 mins ago',
    type: 'claim',
    unread: true,
    link: '/admin/claims',
  },
  {
    id: 'n3',
    title: 'New User Account Registered',
    message: 'User account "Sarah Jenkins" (sarah.j@example.com) joined the platform.',
    time: '1 hour ago',
    type: 'user',
    unread: true,
    link: '/admin/users',
  },
  {
    id: 'n4',
    title: 'Broadcast Announcement Active',
    message: 'Scheduled platform maintenance set for Sunday 02:00 AM UTC.',
    time: '3 hours ago',
    type: 'system',
    unread: false,
    link: '/admin/announcements',
  },
];

const AdminLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const dropdownRef = useRef(null);

  const toggleAdminTheme = () => {
    setDarkMode(!darkMode);
  };

  // Click Outside Handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markSingleAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Dedicated Admin Sidebar (Responsive) */}
      <AdminSidebar
        darkMode={darkMode}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Workspace Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Admin Top Header Bar */}
        <header className={`h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 border-b transition-colors duration-300 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-xs'
        }`}>
          <div className="flex items-center space-x-3 text-xs font-semibold">
            
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Open Admin Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>System Live</span>
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400 truncate max-w-[150px] sm:max-w-none">
              Admin Command Center
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Global Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Global admin search..."
                className={`pl-9 pr-3 py-1.5 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 w-40 lg:w-48 border transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                }`}
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Light / Dark Mode Switcher */}
            <button
              onClick={toggleAdminTheme}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Admin Theme (Light/Dark)"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span className="hidden md:inline">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Interactive Notification Bell with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-xl relative border transition-colors ${
                  darkMode ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="View Admin Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifications && (
                <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border shadow-2xl p-4 space-y-4 z-50 transition-colors ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="font-display font-extrabold text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold">
                          {unreadCount} New
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-semibold">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={clearAllNotifications}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Clear all notifications"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notification Items List */}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => markSingleAsRead(item.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                            item.unread
                              ? darkMode 
                                ? 'bg-slate-850 border-blue-500/40' 
                                : 'bg-blue-50/50 border-blue-200/80 shadow-xs'
                              : darkMode 
                                ? 'bg-slate-950/40 border-slate-800 opacity-70' 
                                : 'bg-slate-50/60 border-slate-100 opacity-80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              {item.type === 'found' && <Package className="w-4 h-4 text-blue-600 shrink-0" />}
                              {item.type === 'claim' && <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />}
                              {item.type === 'user' && <UserPlus className="w-4 h-4 text-purple-600 shrink-0" />}
                              {item.type === 'system' && <Bell className="w-4 h-4 text-emerald-600 shrink-0" />}
                              <span className="font-bold text-xs line-clamp-1">{item.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.time}</span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.message}</p>

                          <div className="flex items-center justify-between pt-1">
                            <Link
                              to={item.link}
                              onClick={() => setShowNotifications(false)}
                              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                            >
                              <span>View details</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>

                            {item.unread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No active notifications.
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      View All System Activity →
                    </Link>
                  </div>

                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Admin View Workspace */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
