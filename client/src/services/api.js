import axios from 'axios';

// Automatically detect hostname: Use local proxy for localhost, live Render backend for production
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API = axios.create({
  baseURL: isLocalhost 
    ? '/api' 
    : 'https://lost-found-app-1s9n.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization Bearer token from sessionStorage or localStorage
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for global error handling (e.g., token expiration)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      const tokenExists = sessionStorage.getItem('token') || localStorage.getItem('token');
      if (tokenExists) {
        sessionStorage.removeItem('token');
        localStorage.removeItem('token');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
