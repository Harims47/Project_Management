/**
 * Filters the master projects array against the active filtering criteria.
 */
export const filterProjects = (projectsList = [], filters = {}, selectedAccountId = null) => {
  return projectsList.filter(proj => {
    // 1. Account Scope Filter (inside Drawer view)
    if (selectedAccountId && proj.clientId !== selectedAccountId) {
      return false;
    }

    // 2. Global Text Search (matches Project Code, Project Name, or Manager name)
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const codeMatch = proj.projectCode.toLowerCase().includes(q);
      const nameMatch = proj.projectName.toLowerCase().includes(q);
      const managerMatch = proj.manager.toLowerCase().includes(q);
      
      if (!codeMatch && !nameMatch && !managerMatch) {
        return false;
      }
    }

    // 3. Multi Project Codes Search (e.g. "CR-1001, CR-1002")
    if (filters.multiSearch) {
      const codes = filters.multiSearch
        .split(/[\s,\n]+/)
        .map(c => c.trim().toLowerCase())
        .filter(Boolean);
      
      if (codes.length > 0) {
        const match = codes.some(code => proj.projectCode.toLowerCase().includes(code));
        if (!match) return false;
      }
    }

    // 4. Capability / Service line
    if (filters.service && proj.service !== filters.service) {
      return false;
    }

    // 5. Delivery Status
    if (filters.status && proj.status !== filters.status) {
      return false;
    }

    // 6. Project Manager Selector
    if (filters.manager && proj.manager !== filters.manager) {
      return false;
    }

    // 7. Client Account Selector (on master grid filters)
    if (filters.client && proj.clientId !== filters.client) {
      return false;
    }

    // 8. Revenue Range Filters (Min & Max Bounds)
    if (filters.minRevenue !== undefined && filters.minRevenue !== '' && filters.minRevenue !== null) {
      if (proj.revenue < Number(filters.minRevenue)) {
        return false;
      }
    }
    
    if (filters.maxRevenue !== undefined && filters.maxRevenue !== '' && filters.maxRevenue !== null) {
      if (proj.revenue > Number(filters.maxRevenue)) {
        return false;
      }
    }

    // 9. Start Date boundary
    if (filters.startDate && proj.startDate < filters.startDate) {
      return false;
    }

    // 10. End Date boundary
    if (filters.endDate && proj.endDate > filters.endDate) {
      return false;
    }

    return true;
  });
};

export default filterProjects;
