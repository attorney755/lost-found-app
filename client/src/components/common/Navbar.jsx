import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { 
  LogOut, 
  Menu, 
  X, 
  Compass,
  User,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Bell,
  Trash2,
  ExternalLink,
  Package,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const frameBorderClasses = {
  sleek: 'ring-2 ring-blue-600 ring-offset-1',
  gold: 'ring-2 ring-amber-400 ring-offset-1 shadow-xs',
  cyber: 'ring-2 ring-cyan-500 ring-offset-1 shadow-xs',
  emerald: 'ring-2 ring-emerald-500 ring-offset-1 shadow-xs',
  purple: 'ring-2 ring-purple-600 ring-offset-1 shadow-xs',
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Real-time notifications list and count
  const [notificationsList, setNotificationsList] = useState([]);
  const [notifCount, setNotifCount] = useState(0);

  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    setIsUserDropdownOpen(false);
    setIsNotifDropdownOpen(false);
    navigate('/login');
  };

  // Real-time Notification Count Sync from Database
  const fetchNotifData = async () => {
    if (!isAuthenticated) {
      setNotificationsList([]);
      setNotifCount(0);
      return;
    }

    try {
      const res = await API.get('/claims/my-notifications');
      if (res.data.success) {
        setNotificationsList(res.data.notifications);
        setNotifCount(res.data.notifications.length);
      }
    } catch (err) {
      // Silent catch
    }
  };

  useEffect(() => {
    fetchNotifData();
    const interval = setInterval(fetchNotifData, 8000); // Auto-sync count every 8s

    const handleFocus = () => fetchNotifData();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Delete notification directly from popover
  const handleDeletePopoverNotif = async (e, id) => {
    e.stopPropagation();
    try {
      await API.delete(`/claims/${id}`);
      setNotificationsList((prev) => prev.filter((n) => n._id !== id));
      setNotifCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // ScrollSpy Listener: Detect active section when scrolling homepage
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const sections = [
        { id: 'hero', name: 'home' },
        { id: 'categories', name: 'browse' },
        { id: 'recent', name: 'browse' },
        { id: 'how-it-works', name: 'how-it-works' },
        { id: 'pricing', name: 'pricing' },
        { id: 'contact', name: 'contact' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].name);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Determine active link styling
  const isLinkActive = (path, sectionName) => {
    if (location.pathname === '/' && activeSection) {
      return activeSection === sectionName;
    }
    return location.pathname === path;
  };

  // Smart Dashboard & Settings Destinations
  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  const settingsPath = user?.role === 'admin' ? '/admin/profile' : '/settings';
  const activeFrameClass = frameBorderClasses[user?.avatarFrame || 'sleek'] || frameBorderClasses.sleek;

  // Format relative time preview
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center text-white">
                <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Lost & Found
                </span>
                <span className="text-[10px] font-medium tracking-wider text-blue-600 dark:text-blue-400 uppercase -mt-1">
                  Finder Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLinkActive('/', 'home') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-600/20 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Home
              </Link>

              <Link
                to="/browse"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLinkActive('/browse', 'browse') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-600/20 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Browse Items
              </Link>

              <Link
                to="/how-it-works"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLinkActive('/how-it-works', 'how-it-works') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-600/20 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                How It Works
              </Link>

              <Link
                to="/pricing"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLinkActive('/pricing', 'pricing') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-600/20 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Pricing
              </Link>

              <a
                href={location.pathname === '/' ? '#contact' : '/contact'}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLinkActive('/contact', 'contact') 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-600/20 dark:text-white font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Contact
              </a>

              {isAuthenticated && (
                <Link
                  to={dashboardPath}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === dashboardPath || location.pathname.startsWith('/admin')
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-600/20 dark:text-white font-bold shadow-xs' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Desktop Right Auth Actions & Interactive Bell Popover */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  
                  {/* Desktop Bell Icon Button with Floating Popover Dropdown */}
                  <div className="relative" ref={notifDropdownRef}>
                    <button
                      onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                      className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200/80"
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5 text-amber-500" />
                      {notifCount > 0 && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-amber-500 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-xs animate-pulse">
                          {notifCount}
                        </span>
                      )}
                    </button>

                    {/* FLOATING NOTIFICATIONS DROPDOWN POPOVER */}
                    {isNotifDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                        
                        {/* Popover Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                              Notifications
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                              {notifCount} New
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-xs">
                            <button
                              onClick={() => {
                                fetchNotifData();
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                            >
                              Refresh
                            </button>
                          </div>
                        </div>

                        {/* Popover Scrollable List */}
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                          {notificationsList.length > 0 ? (
                            notificationsList.map((notif) => (
                              <div
                                key={notif._id}
                                className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 transition-all space-y-2 relative group"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                                      <Package className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                                        Item Found Report Submitted
                                      </h4>
                                      <span className="text-[10px] text-slate-400 font-medium">
                                        {formatTimeAgo(notif.createdAt)}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={(e) => handleDeletePopoverNotif(e, notif._id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-9">
                                  <span className="font-bold text-slate-900 dark:text-white">{notif.finderName}</span> submitted a report for <span className="font-semibold text-blue-600 dark:text-blue-400">"{notif.itemTitle || notif.item?.title}"</span>.
                                </p>

                                <div className="pl-9 flex items-center justify-between pt-1 text-[11px]">
                                  <button
                                    onClick={() => {
                                      setIsNotifDropdownOpen(false);
                                      navigate('/dashboard?tab=notifications');
                                    }}
                                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                                  >
                                    <span>View details</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 space-y-2">
                              <Bell className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
                              <p className="text-xs text-slate-500">No new notifications right now.</p>
                            </div>
                          )}
                        </div>

                        {/* Popover Footer Link */}
                        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                          <button
                            onClick={() => {
                              setIsNotifDropdownOpen(false);
                              navigate('/dashboard?tab=notifications');
                            }}
                            className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center space-x-1 w-full py-1"
                          >
                            <span>View All Found Notifications</span>
                            <span>→</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* User Profile Avatar Button */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2.5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200/80"
                    >
                      <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 transition-all ${activeFrameClass}`}>
                        {user?.profileImage ? (
                          <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>

                      <div className="text-left hidden lg:block">
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                          {user?.role === 'admin' ? 'Super Admin' : 'Item Poster / Member'}
                        </p>
                      </div>

                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {/* Interactive User Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        
                        {/* User Summary Header */}
                        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 space-y-0.5">
                          <p className="font-extrabold text-sm text-slate-900 dark:text-white">{user?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                        </div>

                        {/* Dropdown Nav Links */}
                        <div className="py-1.5 space-y-1">
                          <Link
                            to={dashboardPath}
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-600" />
                            <span>My Dashboard</span>
                          </Link>

                          <Link
                            to="/dashboard?tab=notifications"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 transition-colors"
                          >
                            <div className="flex items-center space-x-2.5">
                              <Bell className="w-4 h-4 text-amber-500" />
                              <span>Found Notifications</span>
                            </div>
                            {notifCount > 0 && (
                              <span className="px-1.5 py-0.5 bg-amber-500 text-white font-black text-[10px] rounded-full">
                                {notifCount}
                              </span>
                            )}
                          </Link>

                          <Link
                            to={settingsPath}
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-purple-600" />
                            <span>Profile & Account Settings</span>
                          </Link>
                        </div>

                        {/* Sign Out Action */}
                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              setShowLogoutModal(true);
                            }}
                            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-rose-600" />
                            <span>Sign Out</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md shadow-blue-600/20 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions Right Side (Bell Icon + Hamburger Menu) */}
            <div className="md:hidden flex items-center space-x-1.5">
              {isAuthenticated && (
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                    className="relative p-2 rounded-xl text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5 text-amber-500" />
                    {notifCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-xs animate-pulse">
                        {notifCount}
                      </span>
                    )}
                  </button>

                  {/* MOBILE NOTIFICATIONS POPOVER DROPDOWN */}
                  {isNotifDropdownOpen && (
                    <div className="fixed top-16 right-4 left-4 sm:left-auto sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                      
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-5 h-5 text-blue-600" />
                          <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                            Notifications
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                            {notifCount} New
                          </span>
                        </div>
                        <button onClick={() => setIsNotifDropdownOpen(false)} className="text-slate-400 p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {notificationsList.length > 0 ? (
                          notificationsList.map((notif) => (
                            <div
                              key={notif._id}
                              className="p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-900 dark:text-white">Item Found Report</span>
                                <span className="text-[10px] text-slate-400">{formatTimeAgo(notif.createdAt)}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300">
                                <span className="font-bold">{notif.finderName}</span> reported for <span className="font-semibold text-blue-600">"{notif.itemTitle || notif.item?.title}"</span>.
                              </p>
                              <button
                                onClick={() => {
                                  setIsNotifDropdownOpen(false);
                                  navigate('/dashboard?tab=notifications');
                                }}
                                className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1 pt-1"
                              >
                                <span>View details</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 text-center py-6">No new notifications right now.</p>
                        )}
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button
                          onClick={() => {
                            setIsNotifDropdownOpen(false);
                            navigate('/dashboard?tab=notifications');
                          }}
                          className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center space-x-1 w-full"
                        >
                          <span>View All Found Notifications</span>
                          <span>→</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              to="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Browse Items
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              How It Works
            </Link>
            <Link
              to="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Pricing
            </Link>
            <a
              href={location.pathname === '/' ? '#contact' : '/contact'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact Us
            </a>

            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>

                <Link
                  to="/dashboard?tab=notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <span>Found Notifications</span>
                  </div>
                  {notifCount > 0 && (
                    <span className="px-2 py-0.5 bg-amber-500 text-white font-extrabold text-xs rounded-full">
                      {notifCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={settingsPath}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Profile & Settings
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-blue-600">
                <LogOut className="w-5 h-5" />
                <span className="font-display font-extrabold text-base">Sign Out of Account?</span>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to sign out of your account? You will need to enter your credentials to log back in.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Yes, Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
