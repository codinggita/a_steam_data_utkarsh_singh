import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://a-steam-data-utkarsh-singh-2.onrender.com' 
    : '', // Empty in dev because we rely on Vite's proxy `/api/v1`
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format success / error responses
api.interceptors.response.use(
  (response) => {
    // Return the custom backend data payload
    // Response structure from backend: { success: true, message: "...", data: ... }
    return response.data;
  },
  (error) => {
    // Check if unauthorized (token expired / invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatching logout or redirecting to /login is handled in store/authSlice
    }
    
    // Normalize error message
    let message = 'Something went wrong';
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data.error === 'string') {
        message = data.error;
      } else if (typeof data.message === 'string') {
        message = data.message;
      } else if (data.error && typeof data.error === 'object') {
        message = Object.values(data.error).filter(v => typeof v === 'string').join(', ') || JSON.stringify(data.error);
      } else if (data.message && typeof data.message === 'object') {
        message = Object.values(data.message).filter(v => typeof v === 'string').join(', ') || JSON.stringify(data.message);
      }
    } else {
      message = error.message || message;
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
