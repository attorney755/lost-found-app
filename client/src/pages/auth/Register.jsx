import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';
import { User, Mail, Phone, Lock, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name.trim()) {
      setLocalError('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }
    if (!formData.phone.trim()) {
      setLocalError('Please enter your phone number');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    const res = await registerUser(formData);
    if (res.success) {
      navigate('/login?registered=true');
    } else {
      setLocalError(res.error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center h-full max-h-[660px]">
        
        {/* Left Column: Form Area */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-2 sm:px-4">
          
          <div>
            {/* Title Header with top right switch link */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                  Create Account
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Join our community lost & found network in Kigali & Rwanda
                </p>
              </div>
              <Link
                to="/login"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors pt-1 shrink-0"
              >
                Sign In
              </Link>
            </div>

            {/* Error Banner */}
            {localError && (
              <div className="mb-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start space-x-3 text-rose-800 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span>{localError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Attorney Valois"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="valois@example.com"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+250 788 847 286"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-sm font-medium"
                  />
                </div>
              </div>

              {/* Primary Continue Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative bg-slate-50 dark:bg-slate-950 px-3 text-xs font-medium text-slate-400">
                or
              </span>
            </div>

            {/* Continue with Google Button */}
            <GoogleAuthButton text="Sign up with Google" />

          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-center sm:text-left">
            By creating an account, you agree to our{' '}
            <a href="#" className="underline hover:text-slate-600">terms of service</a> &{' '}
            <a href="#" className="underline hover:text-slate-600">privacy policy</a>
          </p>

        </div>

        {/* Right Column: High Quality Platform Match Banner Card */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full max-h-[560px] relative rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/signup_banner.jpg"
            alt="Community member recovering lost item using smartphone app"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-10 text-center text-white">
            <h3 className="font-display font-medium text-2xl sm:text-3xl max-w-md mx-auto leading-relaxed text-slate-100">
              "Join thousands of verified community members in Kigali."
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-300 mt-3">
              Fast, Safe & Transparent Reconnection
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Register;
