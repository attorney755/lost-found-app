import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { User, Mail, Phone, Lock, Camera, CheckCircle2, Save, Image, Crown, Upload, ZoomIn, ZoomOut, Sliders, Trash2, KeyRound } from 'lucide-react';

const avatarPresets = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
];

const frameStyles = [
  { id: 'sleek', name: 'Sleek Blue', class: 'ring-4 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-md' },
  { id: 'gold', name: 'VIP Gold', class: 'ring-4 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg shadow-amber-500/20' },
  { id: 'cyber', name: 'Cyber Neon', class: 'ring-4 ring-cyan-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg shadow-cyan-500/30' },
  { id: 'emerald', name: 'Emerald Shield', class: 'ring-4 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg shadow-emerald-500/30' },
  { id: 'purple', name: 'Purple Royalty', class: 'ring-4 ring-purple-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 shadow-lg shadow-purple-600/30' },
];

const UserSettings = () => {
  const { user, setUser } = useAuth();
  
  // Profile Information State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    avatarFrame: user?.avatarFrame || 'sleek',
  });

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarScale, setAvatarScale] = useState(1);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
        avatarFrame: user.avatarFrame || 'sleek',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSelectFrame = (frameId) => {
    setFormData((prev) => ({ ...prev, avatarFrame: frameId }));
  };

  const handleSelectPresetAvatar = (url) => {
    setFormData((prev) => ({ ...prev, profileImage: url }));
  };

  // Device File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, profileImage: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Remove Picture & Revert to Initials
  const handleRemovePicture = () => {
    setFormData((prev) => ({ ...prev, profileImage: '' }));
  };

  // Submit Profile Details & Avatar with Spinning Loader and Window Reload
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await API.put('/auth/updatedetails', formData);
      if (res.data.success) {
        if (setUser) setUser(res.data.user);
        setNotice('Profile updated! Syncing & reloading changes...');
        
        // Reload page after a short delay so the navbar updates everywhere
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (err) {
      alert('Error updating profile: ' + (err.response?.data?.message || err.message));
      setSavingProfile(false);
    }
  };

  // Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await API.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data.success) {
        setPasswordNotice('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordNotice(''), 4000);
      }
    } catch (err) {
      alert('Error updating password: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingPassword(false);
    }
  };

  const selectedFrameObj = frameStyles.find((f) => f.id === formData.avatarFrame) || frameStyles[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Full Page Spinning Wheel Overlay during Save */}
      {savingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <div className="text-center space-y-1">
            <p className="font-display font-extrabold text-lg">Saving & Reloading Profile...</p>
            <p className="text-xs text-slate-300">Syncing your name, picture, and frame everywhere across the platform</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            Account Profile & Security Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Update your personal details, profile picture, framed avatar, and change your password
          </p>
        </div>

        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Avatar Customizer, Frame Selector & Device Upload */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-xs">
            
            <div className="text-center space-y-4">
              <h2 className="font-display font-extrabold text-lg text-slate-900 dark:text-white flex items-center justify-center space-x-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <span>Live Avatar Frame Preview</span>
              </h2>

              {/* Framed Profile Picture Display */}
              <div className="flex justify-center pt-2 pb-2">
                <div className={`relative w-28 h-28 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 ${selectedFrameObj.class}`}>
                  {formData.profileImage ? (
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                      <img
                        src={formData.profileImage}
                        alt={formData.name}
                        style={{ transform: `scale(${avatarScale})` }}
                        className="w-full h-full object-cover transition-transform duration-150"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-blue-600 text-white font-black text-3xl flex items-center justify-center">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-base">{formData.name || 'Member'}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mt-0.5">Verified Member / Poster</p>
              </div>
            </div>

            {/* Device Upload & Remove Picture Buttons */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>Device Upload & Actions</span>
              </label>

              <div className="flex items-center space-x-2">
                <label className="flex-1 py-3 px-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-2xl cursor-pointer flex items-center justify-center space-x-2 transition-all shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onClick={(e) => { e.target.value = null; }}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="py-3 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 transition-all shadow-xs shrink-0"
                    title="Remove picture & use letter initials"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Use Initials</span>
                  </button>
                )}
              </div>
            </div>

            {/* Size / Zoom Customization Slider */}
            {formData.profileImage && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center space-x-1.5">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    <span>Customize Image Size / Scale</span>
                  </span>
                  <span className="font-mono text-blue-600">{Math.round(avatarScale * 100)}%</span>
                </div>

                <div className="flex items-center space-x-3">
                  <ZoomOut className="w-4 h-4 text-slate-400" />
                  <input
                    type="range"
                    min="0.6"
                    max="2.2"
                    step="0.05"
                    value={avatarScale}
                    onChange={(e) => setAvatarScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <ZoomIn className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}

            {/* Custom Frame Selector */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Select Profile Picture Frame</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {frameStyles.map((frame) => (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => handleSelectFrame(frame.id)}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                      formData.avatarFrame === frame.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{frame.name}</span>
                    <span className={`w-3 h-3 rounded-full ${formData.avatarFrame === frame.id ? 'bg-blue-600' : 'bg-slate-300'}`}></span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Forms for Edit Info & Change Password */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Form 1: Edit Personal Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl space-y-6 shadow-xs">
              <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Personal Information</span>
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">Personal Bio / Note</label>
                  <textarea
                    rows="2"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell finders or posters a little about yourself..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  {savingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving & Syncing Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Form 2: Change Security Password */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 rounded-3xl space-y-6 shadow-xs">
              <h2 className="font-display font-extrabold text-xl text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                <span>Security & Password</span>
              </h2>

              {passwordNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{passwordNotice}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-full shadow transition-all flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{savingPassword ? 'Updating Password...' : 'Update Security Password'}</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default UserSettings;
