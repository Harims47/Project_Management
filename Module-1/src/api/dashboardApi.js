import api from './axiosConfig';

const buildParams = (filters = {}) => {
  return {
    accountId: filters.client || filters.accountId || '',
    service: filters.service || '',
    status: filters.status || '',
    manager: filters.manager || '',
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
    revenueMin: filters.minRevenue || null,
    revenueMax: filters.maxRevenue || null,
  };
};

export const dashboardApi = {
  getSummary: async (filters = {}) => {
    const response = await api.get('/dashboard/summary', { params: buildParams(filters) });
    return response.data;
  },

  getServices: async (filters = {}) => {
    const response = await api.get('/dashboard/services', { params: buildParams(filters) });
    return response.data;
  },

  getStatus: async (filters = {}) => {
    const response = await api.get('/dashboard/status', { params: buildParams(filters) });
    return response.data;
  },

  getMonthlyTrend: async (filters = {}) => {
    const response = await api.get('/dashboard/monthly-trend', { params: buildParams(filters) });
    return response.data;
  },

  getRevenue: async (filters = {}) => {
    const response = await api.get('/dashboard/revenue', { params: buildParams(filters) });
    return response.data;
  },

  getManagers: async (filters = {}) => {
    const response = await api.get('/dashboard/managers', { params: buildParams(filters) });
    return response.data;
  },

  getTopAccounts: async (filters = {}) => {
    const response = await api.get('/dashboard/top-accounts', { params: buildParams(filters) });
    return response.data;
  },
};

export default dashboardApi;
