import api from './api';

const authService = {
  login: async (email, password) => {
    return api.post('/api/v1/auth/login', { email, password });
  },
  
  register: async (name, email, password, role = 'user') => {
    return api.post('/api/v1/auth/register', { name, email, password, role });
  },
  
  logout: async () => {
    return api.post('/api/v1/auth/logout');
  },
  
  getProfile: async () => {
    return api.get('/api/v1/auth/profile');
  },
  
  updateProfile: async (name, email) => {
    return api.patch('/api/v1/auth/profile', { name, email });
  },
  
  changePassword: async (oldPassword, newPassword) => {
    return api.post('/api/v1/auth/change-password', { oldPassword, newPassword });
  }
};

export default authService;
