import apiClient from '../../../api/client';

export const dashboardService = {
  getSummaryMetrics: async (filters = {}) => {
    // Fetch all related databases
    const [accounts, projects, escalations, events, achievements] = await Promise.all([
      apiClient.get('accounts'),
      apiClient.get('projects'),
      apiClient.get('escalations'),
      apiClient.get('events'),
      apiClient.get('achievements')
    ]);

    const { accountFilter = 'all', projectFilter = 'all', serviceFilter = 'all' } = filters;

    // Apply Filter Logic
    const filteredProjects = projects.filter(p => {
      const matchAccount = accountFilter === 'all' || p.accountId === accountFilter;
      const matchProject = projectFilter === 'all' || p.id === projectFilter;
      const matchService = serviceFilter === 'all' || p.serviceId === serviceFilter;
      return matchAccount && matchProject && matchService;
    });

    const filteredEscalations = escalations.filter(e => {
      return accountFilter === 'all' || e.accountId === accountFilter;
    });

    const filteredEvents = events.filter(ev => {
      return accountFilter === 'all' || ev.accountId === accountFilter;
    });

    const filteredAchievements = achievements.filter(a => {
      return accountFilter === 'all' || a.accountId === accountFilter;
    });

    // Calculations
    const activeProjectsCount = filteredProjects.length;
    const onTrackCount = filteredProjects.filter(p => p.status === 'On Track' || p.status === 'Completed').length;
    const atRiskCount = filteredProjects.filter(p => p.status === 'At Risk').length;
    const blockedCount = filteredProjects.filter(p => p.status === 'Blocked').length;

    const totalRevenueVal = filteredProjects.reduce((sum, p) => {
      // Sum all months' revenues
      const pSum = (p.revenues || []).reduce((s, r) => s + r, 0);
      return sum + pSum * 1000; // represent total value
    }, 0);

    const avgHealthScore = filteredProjects.length > 0
      ? Math.round(filteredProjects.reduce((sum, p) => sum + p.healthScore, 0) / filteredProjects.length)
      : 100;

    // Segment distributions
    const services = [
      { id: 'commercialization', title: 'Commercialization & Brand Launch' },
      { id: 'regulatory', title: 'Regulatory Operations & Submissions' },
      { id: 'clinical', title: 'Clinical Trials Tech Enablement' },
      { id: 'analytics', title: 'Omnichannel Data & Analytics' }
    ];

    const serviceRevenues = services.map((s, idx) => {
      const sProjects = filteredProjects.filter(p => p.serviceId === s.id);
      const rev = sProjects.reduce((sum, p) => {
        const pSum = (p.revenues || []).reduce((inner, r) => inner + r, 0);
        return sum + pSum * 1000;
      }, 0);
      return { id: s.id, name: s.title, value: rev };
    });

    // Monthly Trends
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trendData = monthLabels.map((month, mIdx) => {
      const total = filteredProjects.reduce((sum, p) => {
        return sum + (p.revenues?.[mIdx] || 0);
      }, 0);
      return { name: month, revenue: total };
    });

    return {
      activeProjectsCount,
      onTrackCount,
      atRiskCount,
      blockedCount,
      totalRevenueVal,
      avgHealthScore,
      serviceRevenues,
      trendData,
      filteredProjects,
      filteredEscalations,
      filteredEvents,
      filteredAchievements,
      accountsList: accounts
    };
  }
};

export default dashboardService;
