import api from './api';

export const walletService = {
  getWallet: () => api.get('/wallet'),
  deposit: (amount) => api.post('/wallet/deposit', { amount }),
  sendMoney: (data) => api.post('/wallet/send', data),
  freeze: () => api.post('/wallet/freeze'),
  unfreeze: () => api.post('/wallet/unfreeze'),
  getFraudAlerts: () => api.get('/wallet/fraud-alerts'),
};