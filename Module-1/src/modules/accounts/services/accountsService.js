import apiClient from '../../../api/client';

export const accountsService = {
  getAccounts: async () => {
    return apiClient.get('accounts');
  },
  getAccount: async (id) => {
    const accounts = await apiClient.get('accounts');
    return accounts.find(a => a.id === id);
  },
  createAccount: async (account) => {
    return apiClient.post('accounts', account);
  },
  updateAccount: async (id, account) => {
    return apiClient.put('accounts', id, account);
  },
  deleteAccount: async (id) => {
    return apiClient.delete('accounts', id);
  }
};

export default accountsService;
