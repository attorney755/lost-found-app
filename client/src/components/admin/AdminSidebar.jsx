import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  MessageSquare,
  Tags, 
  Settings, 
  FileText, 
  User,
  Megaphone,
  LogOut, 
  Compass,
  Shield,
  ExternalLink,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'User Management', path: '/admin/users', icon: Users },
  { name: 'Item Moderation', path: '/admin/items', icon: Package },
  { name: 'User Feedback', path: '/admin/feedback', icon: MessageSquare },
  { name: 'Categories', path: '/admin/categories', icon: Tags },
  { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  { name: 'System Settings', path: '/admin/settings', icon: Settings },
  { name: 'Audit Logs', path: '/admin/logs', icon: FileText },
  { name: 'Profile & Account', path: '/admin/profile', icon: User },
];

const frameBorderClasses = {
  sleek: 'ring-2 ring-blue-600 ring-offset-1',
  gold: 'ring-2 ring-amber-400 ring-offset-1 shadow-xs',
  cyber: 'ring-2 ring-cyan-500 ring-offset-1 shadow-xs',
  emerald: 'ring-2 ring-emerald-500 ring-offset-1 shadow-xs',
  purple: 'ring-2 ring-purple-600 ring-offset-1 shadow-xs',
};

const AdminSidebar = ({ darkMode, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    if (setIsMobileOpen) setIsMobileOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const activeFrameClass = frameBorderClasses[user?.avatarFrame || 'sleek'] || frameBorderClasses.sleek;

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Admin Brand Bar */}
        <div className={`h-16 px-6 border-b flex items-center justify-between transition-colors ${
          darkMode ? 'border-slate-800' : 'border-slate-200/80'
        }`}>
          <Link
            to="/admin/dashboard"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-bold text-base tracking-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Control Panel
              </span>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest -mt-0.5">
                Admin Workspace
              </span>
            </div>
          </Link>

          {/* Close button for Mobile Drawer */}
          {setIsMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Admin Navigation List */}
        <div className="px-3 py-6 space-y-1.5">
          <p className="px-3 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Main Management
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : darkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Profile & Footer Actions */}
      <div className={`p-4 border-t space-y-3 transition-colors ${
        darkMode ? 'border-slate-800' : 'border-slate-200/80'
      }`}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
            darkMode ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Public Platform</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <div className="flex items-center justify-between pl-1 pt-1">
          <Link
            to="/admin/profile"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="flex items-center space-x-2 group"
          >
            <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 transition-all ${activeFrameClass}`}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
            </div>

            <div className="text-left">
              <p className={`text-xs font-bold leading-tight truncate max-w-[95px] group-hover:text-blue-600 transition-colors ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Super Admin</p>
            </div>
          </Link>

          <button
            onClick={() => setShowLogoutModal(true)}
            title="Sign Out of Admin"
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100'
            }`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex w-64 border-r flex-col justify-between shrink-0 h-screen sticky top-0 z-30 transition-colors duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <SidebarContent />
      </aside>

      {/* Mobile Slide-Over Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          ></div>

          <aside className={`relative w-72 max-w-[80vw] border-r flex flex-col justify-between z-50 h-full shadow-2xl transition-colors duration-300 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-blue-600">
                <LogOut className="w-5 h-5" />
                <span className="font-display font-extrabold text-base">Sign Out of Control Panel?</span>
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
                Are you sure you want to end your Super Admin session? You will be signed out and redirected to the login page.
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

export default AdminSidebar;
