import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5090/api/v1';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStore = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  return JSON.parse(data);
};

const setStore = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const initialEscalations = [
  { id: 'esc-1', title: 'Pfizer Submission Delay', accountId: '9fca8cf5-75e1-4560-aa25-1e30a597a7bb', severity: 'Critical', loggedDate: 'June 14, 2026', owner: 'Sarah Jenkins', status: 'Active' },
  { id: 'esc-2', title: 'J&J Analytics Integration Block', accountId: '5efca8cf-11e1-4560-aa25-1e30a597a7bc', severity: 'Major', loggedDate: 'June 15, 2026', owner: 'Emma Stone', status: 'Pending' },
  { id: 'esc-3', title: 'Novartis Brand Feedback Review', accountId: '160d5bfa-22f3-42e1-a0a1-4ee6246473bb', severity: 'Minor', loggedDate: 'June 12, 2026', owner: 'Alex Mercer', status: 'In Progress' }
];

const initialEvents = [
  { id: 'ev-1', title: 'QBR with Pfizer Team', accountId: '9fca8cf5-75e1-4560-aa25-1e30a597a7bb', date: 'Tomorrow at 10:00 AM', type: 'meeting' },
  { id: 'ev-2', title: 'AstraZeneca Milestone Review', accountId: '2dca9af5-11e2-4110-aa55-1f30c597b7bb', date: 'June 18, 2026 at 2:00 PM', type: 'demo' },
  { id: 'ev-3', title: 'Merck Alignment Steering Committee', accountId: '4dfc5bfa-11e3-41e1-a0a2-4ee6246473ab', date: 'June 22, 2026 at 11:30 AM', type: 'meeting' }
];

const initialAchievements = [
  { id: 'ach-1', title: 'Pfizer Submission Completed 2 weeks early', accountId: '9fca8cf5-75e1-4560-aa25-1e30a597a7bb', desc: 'Accelerated submission velocity.' },
  { id: 'ach-2', title: 'AstraZeneca Portal Renewal approved for Q3', accountId: '2dca9af5-11e2-4110-aa55-1f30c597b7bb', desc: 'Extended operational contract.' },
  { id: 'ach-3', title: 'Novartis Client Score hit record 9.5 CSAT', accountId: '160d5bfa-22f3-42e1-a0a1-4ee6246473bb', desc: 'Excellent feedback on delivery.' }
];

export const apiClient = {
  get: async (resource) => {
    if (resource === 'accounts') {
      const response = await axios.get(`${apiBaseUrl}/accounts`);
      return response.data.data;
    }
    if (resource === 'projects') {
      const response = await axios.get(`${apiBaseUrl}/projects`, {
        params: { pageSize: 1000 }
      });
      return response.data.data.map(p => {
        // Map service name to serviceId string for dashboard compatibility
        let serviceId = '';
        if (p.service === 'Creative') serviceId = 'commercialization';
        else if (p.service === 'Digital') serviceId = 'regulatory';
        else if (p.service === 'Research') serviceId = 'clinical';
        else if (p.service === 'Video') serviceId = 'analytics';

        // Health Score
        let healthScore = 90;
        if (p.status === 'Completed') healthScore = 100;
        else if (p.status === 'Ongoing') healthScore = 90;
        else if (p.status === 'Pipeline') healthScore = 80;
        else if (p.status === 'Cancelled') healthScore = 40;

        // Progress
        let progress = 50;
        if (p.status === 'Completed') progress = 100;
        else if (p.status === 'Ongoing') progress = 65;
        else if (p.status === 'Pipeline') progress = 15;
        else if (p.status === 'Cancelled') progress = 0;

        // Spread total revenue across 6 months in revenues array
        const monthlyRevenue = Math.round(p.revenue / 6000); // spread in thousands
        const revenues = [monthlyRevenue, monthlyRevenue, monthlyRevenue, monthlyRevenue, monthlyRevenue, monthlyRevenue];

        return {
          ...p,
          accountId: p.clientId,
          title: p.projectName,
          serviceId,
          healthScore,
          progress,
          revenues
        };
      });
    }
    
    // Fallbacks for non-DB collections
    await delay(100);
    if (resource === 'escalations') return getStore('db_escalations', initialEscalations);
    if (resource === 'events') return getStore('db_events', initialEvents);
    if (resource === 'achievements') return getStore('db_achievements', initialAchievements);
    
    throw new Error(`Resource ${resource} not found.`);
  },

  post: async (resource, payload) => {
    if (resource === 'accounts') {
      const response = await axios.post(`${apiBaseUrl}/accounts`, payload);
      return response.data.data;
    }
    if (resource === 'projects') {
      const backendPayload = {
        projectCode: payload.projectCode,
        projectName: payload.projectName || payload.title,
        clientId: payload.clientId || payload.accountId,
        manager: payload.manager,
        service: payload.service,
        status: payload.status,
        revenue: Number(payload.revenue),
        startDate: payload.startDate,
        endDate: payload.endDate,
        remarks: payload.remarks || '',
      };
      const response = await axios.post(`${apiBaseUrl}/projects`, backendPayload);
      return response.data.data;
    }

    await delay(100);
    const dbKey = `db_${resource}`;
    const initialData = 
      resource === 'escalations' ? initialEscalations : 
      resource === 'events' ? initialEvents : 
      resource === 'achievements' ? initialAchievements : [];
    const list = getStore(dbKey, initialData);
    const newItem = { id: Math.random().toString(36).substring(7), ...payload };
    list.push(newItem);
    setStore(dbKey, list);
    return newItem;
  },

  put: async (resource, id, payload) => {
    if (resource === 'accounts') {
      const response = await axios.put(`${apiBaseUrl}/accounts/${id}`, payload);
      return response.data.data;
    }
    if (resource === 'projects') {
      const backendPayload = {
        projectCode: payload.projectCode,
        projectName: payload.projectName || payload.title,
        clientId: payload.clientId || payload.accountId,
        manager: payload.manager,
        service: payload.service,
        status: payload.status,
        revenue: Number(payload.revenue),
        startDate: payload.startDate,
        endDate: payload.endDate,
        remarks: payload.remarks || '',
      };
      const response = await axios.put(`${apiBaseUrl}/projects/${id}`, backendPayload);
      return response.data.data;
    }

    await delay(100);
    const dbKey = `db_${resource}`;
    const initialData = 
      resource === 'escalations' ? initialEscalations : 
      resource === 'events' ? initialEvents : 
      resource === 'achievements' ? initialAchievements : [];
    let list = getStore(dbKey, initialData);
    list = list.map(item => item.id === id ? { ...item, ...payload } : item);
    setStore(dbKey, list);
    return { id, ...payload };
  },

  delete: async (resource, id) => {
    if (resource === 'accounts') {
      const response = await axios.delete(`${apiBaseUrl}/accounts/${id}`);
      return response.data.data;
    }
    if (resource === 'projects') {
      const response = await axios.delete(`${apiBaseUrl}/projects/${id}`);
      return response.data.data;
    }

    await delay(100);
    const dbKey = `db_${resource}`;
    const initialData = 
      resource === 'escalations' ? initialEscalations : 
      resource === 'events' ? initialEvents : 
      resource === 'achievements' ? initialAchievements : [];
    let list = getStore(dbKey, initialData);
    list = list.filter(item => item.id !== id);
    setStore(dbKey, list);
    return { id };
  }
};

export default apiClient;
