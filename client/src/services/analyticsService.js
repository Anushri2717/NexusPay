import api from './api';

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  getSpendingTrend: (period = 30) => api.get('/analytics/spending-trend', { params: { period } }),
  getCategoryBreakdown: () => api.get('/analytics/category-breakdown'),
  getMonthlyComparison: () => api.get('/analytics/monthly-comparison'),
};