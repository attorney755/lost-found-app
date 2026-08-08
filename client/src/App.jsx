import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Clock, X } from 'lucide-react';

// Public Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ThemeToggle from './components/common/ThemeToggle';
import Home from './pages/Home';
import Browse from './pages/public/Browse';
import Contact from './pages/public/Contact';
import HowItWorksPage from './pages/public/HowItWorksPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/Dashboard';
import UserSettings from './pages/UserSettings';
import PricingSection from './components/public/PricingSection';

// Admin Dedicated Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminItems from './pages/admin/AdminItems';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminProfile from './pages/admin/AdminProfile';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';

// Protected Regular User Route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Protected Admin Route (Requires role: "admin")
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-400">Authenticating Admin Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

// Main App Container with Route-Aware Layout Rendering
const MainAppContent = () => {
  const location = useLocation();
  const { inactivityNotice, setInactivityNotice } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative">
      
      {/* 5-Second Inactivity Auto-Logout Toast Notification Banner */}
      {inactivityNotice && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="bg-amber-500 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between space-x-3 border border-amber-400">
            <div className="flex items-center space-x-3 text-xs font-extrabold">
              <Clock className="w-5 h-5 shrink-0 text-white" />
              <span>{inactivityNotice}</span>
            </div>
            <button
              onClick={() => setInactivityNotice('')}
              className="p-1 hover:bg-amber-600 rounded-lg transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Public Navbar - HIDDEN on /admin routes */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Unified Login & Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<div className="py-12"><PricingSection /></div>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* User Protected Dashboard & Settings */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Admin Panel Routes (NO Public Navbar/Footer) */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedAdminRoute>
                <AdminUsers />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/items"
            element={
              <ProtectedAdminRoute>
                <AdminItems />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/claims"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/feedback"
            element={
              <ProtectedAdminRoute>
                <AdminFeedback />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedAdminRoute>
                <AdminCategories />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedAdminRoute>
                <AdminAnnouncements />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedAdminRoute>
                <AdminSettings />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedAdminRoute>
                <AdminAuditLogs />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedAdminRoute>
                <AdminProfile />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating Dark/Light Mode Toggle */}
      {!isAdminRoute && <ThemeToggle />}

      {/* Public Footer - HIDDEN on /admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainAppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
