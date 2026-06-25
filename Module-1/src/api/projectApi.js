import api from './axiosConfig';

export const projectApi = {
  getFilteredProjects: async (filters = {}) => {
    const params = {
      search: filters.search || '',
      projectCodes: filters.projectCodes || filters.multiSearch || '',
      accountId: filters.accountId || filters.client || '',
      service: filters.service || '',
      status: filters.status || '',
      manager: filters.manager || '',
      revenueMin: filters.minRevenue ? Number(filters.minRevenue) : null,
      revenueMax: filters.maxRevenue ? Number(filters.maxRevenue) : null,
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      page: filters.page || 1,
      pageSize: filters.pageSize || 1000,
      sortColumn: filters.sortColumn || 'ProjectCode',
      sortDirection: filters.sortDirection || 'asc',
    };
    
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const payload = {
      projectCode: projectData.projectCode,
      projectName: projectData.projectName,
      clientId: projectData.clientId || projectData.accountId,
      manager: projectData.manager,
      service: projectData.service,
      status: projectData.status,
      revenue: Number(projectData.revenue),
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      remarks: projectData.remarks || '',
    };
    const response = await api.post('/projects', payload);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const payload = {
      projectCode: projectData.projectCode,
      projectName: projectData.projectName,
      clientId: projectData.clientId || projectData.accountId,
      manager: projectData.manager,
      service: projectData.service,
      status: projectData.status,
      revenue: Number(projectData.revenue),
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      remarks: projectData.remarks || '',
    };
    const response = await api.put(`/projects/${id}`, payload);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export default projectApi;
