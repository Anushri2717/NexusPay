import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verify2FA: (token) => api.post('/auth/verify-2fa', { token }),
  setup2FA: () => api.post('/auth/setup-2fa'),
  enable2FA: (token) => api.post('/auth/enable-2fa', { token }),
  getMe: () => api.get('/auth/me'),
};