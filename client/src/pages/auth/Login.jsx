import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { Mail, Lock, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState('');
  const [notice, setNotice] = useState('');

  const { loginUser, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Automatically clear existing session when visiting Login page
  useEffect(() => {
    logout();

    const params = new URLSearchParams(location.search);
    if (params.get('registered') === 'true') {
      setNotice('Account created successfully! Please sign in.');
    } else if (params.get('reset') === 'true') {
      setNotice('Password reset successfully! Please sign in with your new password.');
    } else if (params.get('expired') === 'true') {
      setLocalError('Your session has expired. Please sign in again.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.identifier.trim()) {
      setLocalError('Please enter your email address or phone number');
      return;
    }
    if (!formData.password) {
      setLocalError('Please enter your password');
      return;
    }

    const res = await loginUser(formData, rememberMe);
    if (res.success) {
      // Smart Auto-Detection & Redirection based on user role after login
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setLocalError(res.error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center h-full max-h-[620px]">
        
        {/* Left Column: Form Area */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-2 sm:px-4">
          
          <div>
            {/* Title Header with top right switch link */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                  Account login
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                  Sign in to manage your lost items, claims, and messages
                </p>
              </div>
              <Link
                to="/register"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors pt-1 shrink-0"
              >
                Register
              </Link>
            </div>

            {/* Notice Banner */}
            {notice && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-3 text-emerald-800 dark:text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                <span>{notice}</span>
              </div>
            )}

            {/* Error Banner */}
            {localError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start space-x-3 text-rose-800 dark:text-rose-300 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                <span>{localError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Your email address or phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter email address or phone"
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
                  />
                  <span>Remember me on this device</span>
                </label>

                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure SSL</span>
                </span>
              </div>

              {/* Primary Continue Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative bg-slate-50 dark:bg-slate-950 px-4 text-xs font-medium text-slate-400">
                or
              </span>
            </div>

            {/* Continue with Google Button */}
            <GoogleAuthButton text="Continue with Google" />

          </div>

          <p className="text-xs text-slate-400 mt-4 text-center sm:text-left">
            By continuing, you agree to our{' '}
            <a href="#" className="underline hover:text-slate-600">terms & privacy policies</a>
          </p>

        </div>

        {/* Right Column: Banner Card */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full max-h-[520px] relative rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=1200&auto=format&fit=crop"
            alt="Lost belongings (phone, wallet, keys)"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-10 text-center text-white">
            <h3 className="font-display font-medium text-2xl sm:text-3xl max-w-md mx-auto leading-relaxed text-slate-100">
              "Reconnecting lost belongings with their rightful owners every single day."
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mt-3">
              Lost & Found Community Platform
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Login;
