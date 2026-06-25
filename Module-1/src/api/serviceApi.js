import api from './axiosConfig';

export const serviceApi = {
  getServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },
};

export default serviceApi;
