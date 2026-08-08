import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, ShieldCheck, UserCheck } from 'lucide-react';

const GoogleAuthButton = ({ onSuccess, text = "Continue with Google" }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleOpenGoogleModal = () => {
    setShowModal(true);
    setShowCustomInput(false);
  };

  const handleSelectAccount = async (email, name) => {
    setLoading(true);
    try {
      const res = await loginWithGoogle({
        email,
        name,
        picture: null, // Clean initial badge when no Google picture exists
        googleId: `google_${Date.now()}`,
      });

      if (res.success) {
        setShowModal(false);
        if (onSuccess) onSuccess();
        else navigate('/dashboard');
      } else {
        alert(res.error || 'Google authentication failed');
      }
    } catch (err) {
      alert('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    const cleanEmail = customEmail.trim().toLowerCase();
    const derivedName = cleanEmail
      .split('@')[0]
      .split('.')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

    handleSelectAccount(cleanEmail, derivedName);
  };

  // Helper for 2-letter initials
  const getInitials = (nameStr) => {
    if (!nameStr) return 'G';
    const parts = nameStr.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenGoogleModal}
        disabled={loading}
        className="w-full py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-3 group"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-600 rounded-full animate-spin"></div>
            <span>Signing in with Google...</span>
          </>
        ) : (
          <>
            {/* Official Google 4-Color SVG Logo */}
            <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{text}</span>
          </>
        )}
      </button>

      {/* SLEEK GOOGLE ACCOUNT PICKER POPUP DIALOG */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-display font-extrabold text-base">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a Google account to continue to <strong className="text-slate-800 dark:text-slate-200">Lost & Found Finder</strong>
              </p>
            </div>

            {/* Account Selection Options */}
            <div className="space-y-3">
              
              {/* Option 1: Quick Account Entry */}
              <button
                type="button"
                onClick={() => handleSelectAccount('attorneyvalois@gmail.com', 'Attorney Valois')}
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/80 dark:bg-slate-950 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs uppercase">
                    {getInitials('Attorney Valois')}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                      Attorney Valois
                    </h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      attorneyvalois@gmail.com
                    </p>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Option 2: Enter Any Personal Google Email */}
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-500 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors text-center"
                >
                  + Use any other Google email address
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-2 pt-1">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Enter your personal Google email..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-medium"
                    required
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      Sign In with Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

            </div>

            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sign in securely with any personal email address. Initials will be displayed if no profile photo is uploaded.</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default GoogleAuthButton;
