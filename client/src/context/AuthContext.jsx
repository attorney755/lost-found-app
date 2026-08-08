import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const MAX_INACTIVITY_MS = 15 * 60 * 1000; // 15 Minutes Inactivity Limit

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inactivityNotice, setInactivityNotice] = useState('');

  const lastUpdateRef = useRef(Date.now());

  // Helper: Retrieve active token from storage
  const getStoredToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Logout Helper Function
  const logout = (reason = '') => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivityTime');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('lastActivityTime');

    setUser(null);
    setToken(null);
    delete API.defaults.headers.common['Authorization'];

    if (reason === 'inactivity') {
      setInactivityNotice(
        '🔒 You have been automatically logged out due to inactivity in the system for security.'
      );
      setTimeout(() => {
        setInactivityNotice('');
      }, 5000);
    }
  };

  // Initial Load & Token Validation
  useEffect(() => {
    const loadUser = async () => {
      const currentToken = getStoredToken();

      if (!currentToken) {
        setLoading(false);
        return;
      }

      // Read stored activity time BEFORE user interactions touch the page
      const storedLastActivity = sessionStorage.getItem('lastActivityTime') || localStorage.getItem('lastActivityTime');
      const now = Date.now();

      if (storedLastActivity) {
        const lastTime = parseInt(storedLastActivity, 10);
        const timeDiff = now - lastTime;

        // If inactive for > 15 minutes, log out immediately
        if (timeDiff > MAX_INACTIVITY_MS) {
          console.warn(`Session expired due to inactivity. Idle time: ${Math.round(timeDiff / 1000)}s`);
          logout('inactivity');
          setLoading(false);
          return;
        }
      }

      try {
        // Set Authorization header for API requests
        API.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
        const res = await API.get('/auth/me');

        if (res.data.success) {
          setUser(res.data.user);
          setToken(currentToken);
          
          // Refresh last activity time on successful authentication
          const nowStr = now.toString();
          if (localStorage.getItem('token')) {
            localStorage.setItem('lastActivityTime', nowStr);
          } else {
            sessionStorage.setItem('lastActivityTime', nowStr);
          }
        } else {
          logout('inactivity');
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        logout('inactivity');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Activity Tracker & Active Idle Checker (Only runs when user is logged in)
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      const now = Date.now();
      // Throttle updates to at most once every 5 seconds
      if (now - lastUpdateRef.current < 5000) return;
      lastUpdateRef.current = now;

      const nowStr = now.toString();
      if (localStorage.getItem('token')) {
        localStorage.setItem('lastActivityTime', nowStr);
      }
      if (sessionStorage.getItem('token')) {
        sessionStorage.setItem('lastActivityTime', nowStr);
      }
    };

    // Events to track active user presence
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((evt) => window.addEventListener(evt, updateActivity));

    // Standing Interval: Check for background idle expiration every 15 seconds
    const interval = setInterval(() => {
      const storedLastActivity = sessionStorage.getItem('lastActivityTime') || localStorage.getItem('lastActivityTime');
      if (storedLastActivity) {
        const timeDiff = Date.now() - parseInt(storedLastActivity, 10);
        if (timeDiff > MAX_INACTIVITY_MS) {
          console.warn('Inactivity timer fired while page was open.');
          logout('inactivity');
        }
      }
    }, 15000);

    return () => {
      activityEvents.forEach((evt) => window.removeEventListener(evt, updateActivity));
      clearInterval(interval);
    };
  }, [user]);

  // Register User
  const registerUser = async (formData, rememberMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/register', formData);
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        const nowStr = Date.now().toString();
        
        if (rememberMe) {
          localStorage.setItem('token', newToken);
          localStorage.setItem('lastActivityTime', nowStr);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('lastActivityTime');
        } else {
          sessionStorage.setItem('token', newToken);
          sessionStorage.setItem('lastActivityTime', nowStr);
          localStorage.removeItem('token');
          localStorage.removeItem('lastActivityTime');
        }

        setToken(newToken);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Registration failed. Please check your details.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const loginUser = async (credentials, rememberMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/login', credentials);
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        const nowStr = Date.now().toString();

        if (rememberMe) {
          localStorage.setItem('token', newToken);
          localStorage.setItem('lastActivityTime', nowStr);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('lastActivityTime');
        } else {
          sessionStorage.setItem('token', newToken);
          sessionStorage.setItem('lastActivityTime', nowStr);
          localStorage.removeItem('token');
          localStorage.removeItem('lastActivityTime');
        }

        setToken(newToken);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Login or Register via Google OAuth
  const loginWithGoogle = async (googlePayload, rememberMe = true) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/google', googlePayload);
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        const nowStr = Date.now().toString();

        if (rememberMe) {
          localStorage.setItem('token', newToken);
          localStorage.setItem('lastActivityTime', nowStr);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('lastActivityTime');
        } else {
          sessionStorage.setItem('token', newToken);
          sessionStorage.setItem('lastActivityTime', nowStr);
          localStorage.removeItem('token');
          localStorage.removeItem('lastActivityTime');
        }

        setToken(newToken);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Google authentication failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile Details
  const updateProfile = async (userData) => {
    try {
      const res = await API.put('/auth/updatedetails', userData);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to update profile',
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    inactivityNotice,
    setInactivityNotice,
    registerUser,
    loginUser,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
