import axios from 'axios';

const api = axios.create({
  baseURL: '', // Empty because we rely on Vite's proxy `/api/v1`
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
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
