import React, { useMemo } from 'react';
import { Card } from '../../../components/cards/DashboardCards';
import { PieChart, BarChart, LineChart } from '../../../components/charts/DashboardCharts';

export const ProjectCharts = ({ filteredProjects = [] }) => {
  
  // Return empty state if no projects match filters
  if (!filteredProjects.length) {
    return (
      <Card className="p-12 text-center text-gray-400 dark:text-gray-500 font-semibold italic mt-6">
        📊 No project data available to render charts.
      </Card>
    );
  }

  // 1. Status Pie Chart data
  const statusData = useMemo(() => {
    const counts = {};
    filteredProjects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status]
    }));
  }, [filteredProjects]);

  const statusColors = ['#10b981', '#1552A6', '#f59e0b', '#EC008C']; // green, blue, yellow, red

  // 2. Service Distribution Donut Chart data
  const serviceData = useMemo(() => {
    const counts = {};
    filteredProjects.forEach(p => {
      counts[p.service] = (counts[p.service] || 0) + 1;
    });
    return Object.keys(counts).map(service => ({
      name: service,
      value: counts[service]
    }));
  }, [filteredProjects]);

  const serviceColors = ['#6366f1', '#0ea5e9', '#10b981', '#f43f5e']; // indigo, sky, emerald, rose

  // 3. Revenue by Service Bar Chart data
  const revenueByServiceData = useMemo(() => {
    const revs = {};
    filteredProjects.forEach(p => {
      revs[p.service] = (revs[p.service] || 0) + p.revenue;
    });
    return Object.keys(revs).map(service => ({
      service,
      Revenue: revs[service]
    }));
  }, [filteredProjects]);

  // 4. Monthly Trend Line Chart data
  const monthlyTrendData = useMemo(() => {
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySummary = {};
    
    // Seed Jan-Jun since that's our main date range
    for (let i = 0; i < 6; i++) {
      monthlySummary[monthsShort[i]] = { name: monthsShort[i], Revenue: 0, Projects: 0 };
    }

    filteredProjects.forEach(p => {
      if (p.startDate) {
        const parts = p.startDate.split('-');
        const monthIdx = parseInt(parts[1], 10) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          const monthName = monthsShort[monthIdx];
          if (!monthlySummary[monthName]) {
            monthlySummary[monthName] = { name: monthName, Revenue: 0, Projects: 0 };
          }
          monthlySummary[monthName].Revenue += p.revenue;
          monthlySummary[monthName].Projects += 1;
        }
      }
    });

    return Object.values(monthlySummary);
  }, [filteredProjects]);

  // 5. Completion Bar Chart (Completed vs Ongoing by Service Line)
  const completionData = useMemo(() => {
    const servicesList = ['Creative', 'Digital', 'Research', 'Video'];
    return servicesList.map(srv => {
      const srvProjects = filteredProjects.filter(p => p.service === srv);
      const completed = srvProjects.filter(p => p.status === 'Completed').length;
      const ongoing = srvProjects.filter(p => p.status === 'Ongoing').length;
      return {
        service: srv,
        Completed: completed,
        Ongoing: ongoing
      };
    });
  }, [filteredProjects]);

  // 6. Manager Workload Chart data
  const managerWorkloadData = useMemo(() => {
    const counts = {};
    filteredProjects.forEach(p => {
      counts[p.manager] = (counts[p.manager] || 0) + 1;
    });
    // Limit to top 6 managers for space cleanliness
    return Object.keys(counts)
      .map(manager => ({
        manager: manager.split(' ')[0] + ' ' + (manager.split(' ')[1] ? manager.split(' ')[1].charAt(0) + '.' : ''),
        Projects: counts[manager]
      }))
      .slice(0, 6);
  }, [filteredProjects]);

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="border-t border-gray-100 dark:border-gray-800 pt-5 text-left">
        <h3 className="text-lg font-black text-gray-900 dark:text-gray-150 tracking-tight">
          Visual Analytics Dashboard
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-0.5">
          Real-time dynamic charts representing the active filtered projects dataset
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Status Pie Chart */}
        <Card className="p-4 flex flex-col items-center">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 w-full text-left">
            Project Delivery Health (Status Pie)
          </h4>
          <PieChart 
            data={statusData} 
            colors={statusColors} 
            outerRadius={80} 
            height={220} 
          />
        </Card>

        {/* 2. Service Distribution Donut */}
        <Card className="p-4 flex flex-col items-center">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 w-full text-left">
            Service Line Distribution (Capability Donut)
          </h4>
          <PieChart 
            data={serviceData} 
            colors={serviceColors} 
            innerRadius={60} 
            outerRadius={80} 
            height={220} 
          />
        </Card>

        {/* 3. Revenue by Service Bar Chart */}
        <Card className="p-4">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 w-full text-left">
            Revenue Performance by Capability
          </h4>
          <BarChart 
            data={revenueByServiceData} 
            xKey="service" 
            series={[{ key: 'Revenue', color: '#6366f1', name: 'Billing ($)' }]} 
            prefix="$"
            height={220}
          />
        </Card>

        {/* 4. Monthly Trend Line Chart */}
        <Card className="p-4">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 w-full text-left">
            Billing & Revenue Velocity Trend
          </h4>
          <LineChart 
            data={monthlyTrendData} 
            xKey="name" 
            series={[{ key: 'Revenue', color: '#10b981', name: 'Revenue ($)' }]} 
            prefix="$"
            height={220}
          />
        </Card>

        {/* 5. Project Completion Bar Chart */}
        <Card className="p-4">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 w-full text-left">
            Completions vs Active Engagements
          </h4>
          <BarChart 
            data={completionData} 
            xKey="service" 
            series={[
              { key: 'Completed', color: '#10b981', name: 'Completed' },
              { key: 'Ongoing', color: '#1552A6', name: 'Ongoing' }
            ]} 
            height={220}
          />
        </Card>

        {/* 6. Manager Workload Chart */}
        <Card className="p-4">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 w-full text-left">
            Resource Allocation & Workload
          </h4>
          <BarChart 
            data={managerWorkloadData} 
            xKey="manager" 
            series={[{ key: 'Projects', color: '#0ea5e9', name: 'Allocated Projects' }]} 
            height={220}
          />
        </Card>
      </div>
    </div>
  );
};

export default ProjectCharts;
