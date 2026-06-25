import api from './axiosConfig';

export const accountApi = {
  getAllAccounts: async (search = '', sortColumn = '', sortDirection = '') => {
    const response = await api.get('/accounts', {
      params: { search, sortColumn, sortDirection },
    });
    return response.data;
  },

  getAccountById: async (id) => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  createAccount: async (accountData) => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  updateAccount: async (id, accountData) => {
    const response = await api.put(`/accounts/${id}`, accountData);
    return response.data;
  },

  deleteAccount: async (id) => {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
  },
};

export default accountApi;
