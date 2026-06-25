// HTTP Client Simulator wrapping localStorage queries
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

// Initial database mocks
const initialAccounts = [
  { id: 'pfizer', name: 'Pfizer Inc.', tier: 'Strategic Platinum', lead: 'Sarah Jenkins', region: 'Global / NA', satisf: 4.8 },
  { id: 'novartis', name: 'Novartis AG', tier: 'Enterprise Gold', lead: 'Alex Mercer', region: 'Europe', satisf: 4.5 },
  { id: 'astrazeneca', name: 'AstraZeneca', tier: 'Strategic Platinum', lead: 'David Vance', region: 'Global / UK', satisf: 4.9 },
  { id: 'roche', name: 'Roche Holding', tier: 'Enterprise Gold', lead: 'Elena Rostova', region: 'Europe / Swiss', satisf: 4.2 },
  { id: 'merck', name: 'Merck & Co.', tier: 'Growth Silver', lead: 'Marcus Brody', region: 'North America', satisf: 4.0 },
  { id: 'jnj', name: 'Johnson & Johnson', tier: 'Growth Silver', lead: 'Emma Stone', region: 'Global', satisf: 3.8 }
];

const initialProjects = [
  { id: 'patient-portal', title: 'Omnichannel Patient Portal', accountId: 'astrazeneca', serviceId: 'commercialization', progress: 85, status: 'On Track', healthScore: 92, revenues: [30, 28, 32, 29, 31, 30] }, // revenues represent Jan to Jun
  { id: 'reg-auto', title: 'Regulatory Submission Automation', accountId: 'pfizer', serviceId: 'regulatory', progress: 62, status: 'At Risk', healthScore: 74, revenues: [20, 22, 25, 23, 26, 24] },
  { id: 'patient-outreach', title: 'Patient Outreach Platform', accountId: 'novartis', serviceId: 'commercialization', progress: 92, status: 'On Track', healthScore: 95, revenues: [18, 20, 21, 19, 21, 21] },
  { id: 'clinical-site', title: 'Clinical Site Engagement Portal', accountId: 'roche', serviceId: 'clinical', progress: 40, status: 'On Track', healthScore: 89, revenues: [22, 20, 24, 21, 21, 22] },
  { id: 'efficacy-dash', title: 'Efficacy Dashboard Integration', accountId: 'jnj', serviceId: 'analytics', progress: 25, status: 'Blocked', healthScore: 45, revenues: [12, 11, 15, 14, 14, 14] },
  { id: 'surveillance', title: 'Post-Market Surveillance Engine', accountId: 'merck', serviceId: 'analytics', progress: 10, status: 'On Track', healthScore: 90, revenues: [15, 16, 16, 15, 17, 16] },
  { id: 'reg-dossier', title: 'Regulatory Dossier Compiler', accountId: 'pfizer', serviceId: 'regulatory', progress: 100, status: 'Completed', healthScore: 100, revenues: [35, 33, 34, 32, 33, 33] },
  { id: 'decentralized-trials', title: 'Decentralized Trials App', accountId: 'astrazeneca', serviceId: 'clinical', progress: 70, status: 'On Track', healthScore: 91, revenues: [38, 36, 40, 37, 39, 40] }
];

const initialEscalations = [
  { id: 'esc-1', title: 'Pfizer Submission Delay', accountId: 'pfizer', severity: 'Critical', loggedDate: 'June 14, 2026', owner: 'Sarah Jenkins', status: 'Active' },
  { id: 'esc-2', title: 'J&J Analytics Integration Block', accountId: 'jnj', severity: 'Major', loggedDate: 'June 15, 2026', owner: 'Emma Stone', status: 'Pending' },
  { id: 'esc-3', title: 'Novartis Brand Feedback Review', accountId: 'novartis', severity: 'Minor', loggedDate: 'June 12, 2026', owner: 'Alex Mercer', status: 'In Progress' }
];

const initialEvents = [
  { id: 'ev-1', title: 'QBR with Pfizer Team', accountId: 'pfizer', date: 'Tomorrow at 10:00 AM', type: 'meeting' },
  { id: 'ev-2', title: 'AstraZeneca Milestone Review', accountId: 'astrazeneca', date: 'June 18, 2026 at 2:00 PM', type: 'demo' },
  { id: 'ev-3', title: 'Merck Alignment Steering Committee', accountId: 'merck', date: 'June 22, 2026 at 11:30 AM', type: 'meeting' }
];

const initialAchievements = [
  { id: 'ach-1', title: 'Pfizer Submission Completed 2 weeks early', accountId: 'pfizer', desc: 'Accelerated submission velocity.' },
  { id: 'ach-2', title: 'AstraZeneca Portal Renewal approved for Q3', accountId: 'astrazeneca', desc: 'Extended operational contract.' },
  { id: 'ach-3', title: 'Novartis Client Score hit record 9.5 CSAT', accountId: 'novartis', desc: 'Excellent feedback on delivery.' }
];

export const apiClient = {
  get: async (resource) => {
    await delay(300);
    switch (resource) {
      case 'accounts':
        return getStore('db_accounts', initialAccounts);
      case 'projects':
        return getStore('db_projects', initialProjects);
      case 'escalations':
        return getStore('db_escalations', initialEscalations);
      case 'events':
        return getStore('db_events', initialEvents);
      case 'achievements':
        return getStore('db_achievements', initialAchievements);
      default:
        throw new Error(`Resource ${resource} not found.`);
    }
  },
  post: async (resource, payload) => {
    await delay(400);
    const dbKey = `db_${resource}`;
    const initialData = 
      resource === 'accounts' ? initialAccounts : 
      resource === 'projects' ? initialProjects : 
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
    await delay(400);
    const dbKey = `db_${resource}`;
    const initialData = 
      resource === 'accounts' ? initialAccounts : 
      resource === 'projects' ? initialProjects : 
      resource === 'escalations' ? initialEscalations : 
      resource === 'events' ? initialEvents : 
      resource === 'achievements' ? initialAchievements : [];
    let list = getStore(dbKey, initialData);
    list = list.map(item => item.id === id ? { ...item, ...payload } : item);
    setStore(dbKey, list);
    return { id, ...payload };
  },
  delete: async (resource, id) => {
    await delay(300);
    const dbKey = `db_${resource}`;
    const initialData = 
      resource === 'accounts' ? initialAccounts : 
      resource === 'projects' ? initialProjects : 
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
