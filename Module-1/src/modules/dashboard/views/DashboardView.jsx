import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  AlertOctagon, 
  Calendar, 
  Trophy, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';

import dashboardService from '../services/dashboardService';
import { Button } from '../../../components/ui/Button';
import { Card, StatisticCard, KPICard } from '../../../components/cards/DashboardCards';
import { LineChart, PieChart } from '../../../components/charts/DashboardCharts';
import { Loader, ErrorState, EmptyState } from '../../../components/feedback/FeedbackStates';

export const DashboardView = () => {
  const navigate = useNavigate();

  // Filter States
  const [accountFilter, setAccountFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  
  // Data State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getSummaryMetrics({
        accountFilter,
        projectFilter,
        serviceFilter
      });
      setMetrics(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [accountFilter, projectFilter, serviceFilter]);

  const handleResetFilters = () => {
    setAccountFilter('all');
    setProjectFilter('all');
    setServiceFilter('all');
  };

  if (loading && !metrics) {
    return <Loader message="Analyzing client portfolio metrics..." fullPage={false} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchMetrics} />;
  }

  const {
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
    accountsList
  } = metrics;

  // Format total revenue label
  const totalRevenue = totalRevenueVal >= 1000000 
    ? `$${(totalRevenueVal / 1000000).toFixed(2)}M` 
    : `$${(totalRevenueVal / 1000).toFixed(0)}K`;

  // Segment allocations for donut chart
  const healthData = [
    { name: 'On Track', value: onTrackCount },
    { name: 'At Risk', value: atRiskCount },
    { name: 'Blocked', value: blockedCount }
  ].filter(h => h.value > 0);

  const healthColors = ['#10b981', '#f59e0b', '#EC008C'];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-row">
          <div className="text-left">
            <h1 className="page-title text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Executive Portfolio Overview</h1>
            <p className="page-subtitle text-sm text-gray-400 mt-1">Real-time metrics, project status, financial trends, and client parameters.</p>
          </div>
          <Button onClick={() => navigate('/projects')} icon={Plus}>
            New Project
          </Button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 text-primary font-bold text-sm mb-3">
          <Filter className="h-4.5 w-4.5" />
          <span>Global Portfolio Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Account Filter */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Client Account</label>
            <select
              value={accountFilter}
              onChange={(e) => {
                setAccountFilter(e.target.value);
                setProjectFilter('all');
              }}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
            >
              <option value="all">All Accounts (6)</option>
              {accountsList.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>

          {/* Project Filter */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Project Name</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
            >
              <option value="all">All Projects</option>
              {filteredProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>

          {/* Service Filter */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Capability Line</label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
            >
              <option value="all">All Services (4)</option>
              <option value="commercialization">Commercialization & Brand Launch</option>
              <option value="regulatory">Regulatory Operations & Submissions</option>
              <option value="clinical">Clinical Trials Tech Enablement</option>
              <option value="analytics">Omnichannel Data & Analytics</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {(accountFilter !== 'all' || projectFilter !== 'all' || serviceFilter !== 'all') && (
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                icon={RefreshCw}
                className="w-full py-2"
                size="sm"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <StatisticCard 
          title="Portfolio Revenue" 
          value={totalRevenue} 
          icon={DollarSign} 
          trend={{ value: '+15.2%', type: 'up' }}
          subtitle="vs base period"
          accentColor="primary"
        />
        <StatisticCard 
          title="Active Projects" 
          value={activeProjectsCount} 
          icon={Briefcase} 
          trend={{ value: `${onTrackCount} stable`, type: 'up' }}
          subtitle="on track engagements"
          accentColor="secondary"
        />
        <KPICard 
          title="Portfolio Health Index" 
          value={`${avgHealthScore}%`} 
          percentage={avgHealthScore}
          status={avgHealthScore >= 85 ? 'success' : avgHealthScore >= 70 ? 'warning' : 'danger'}
        />
        <StatisticCard 
          title="Critical Escalations" 
          value={filteredEscalations.length} 
          icon={AlertOctagon} 
          trend={filteredEscalations.length > 0 ? { value: 'Attention Needed', type: 'down' } : null}
          subtitle="logged tickets pending"
          accentColor="accent"
        />
      </div>

      {/* Charts & Operational widgets block */}
      <div className="dashboard-sections mt-6">
        {/* Left Side: Trends and Allocations */}
        <div className="flex flex-col gap-6 w-full">
          {/* Revenue Sparkline Area Chart */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Revenue Trend Velocity</h2>
              <span className="badge badge-primary">Monthly Billing ($K)</span>
            </div>
            {trendData.length > 0 ? (
              <LineChart 
                data={trendData} 
                xKey="name" 
                series={[{ key: 'revenue', color: 'var(--secondary)', name: 'Earnings' }]} 
                prefix="$"
                height={220}
              />
            ) : (
              <EmptyState title="No data to render" />
            )}
          </Card>

          {/* Allocation by Services */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Revenue Allocation by Service Line</h2>
            <div className="flex flex-col gap-4">
              {serviceRevenues.map((serv, idx) => {
                const percentage = totalRevenueVal > 0 ? Math.round((serv.value / totalRevenueVal) * 100) : 0;
                const barColor = idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-secondary' : idx === 2 ? 'bg-accent' : 'bg-emerald-500';
                
                return (
                  <div key={serv.id} className="flex flex-col gap-1.5 text-left">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{serv.name}</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        ${(serv.value / 1000).toFixed(0)}K ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Operational lists */}
        <div className="flex flex-col gap-6 w-full">
          {/* Portfolio Health Donut */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Operational Status Health</h2>
            {healthData.length > 0 ? (
              <div className="relative">
                <PieChart 
                  data={healthData} 
                  colors={healthColors} 
                  innerRadius={60} 
                  outerRadius={80} 
                  height={200}
                />
                <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 text-center">
                  <span className="text-2xl font-black text-gray-900 dark:text-gray-100">{onTrackCount} / {activeProjectsCount}</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">On Track</p>
                </div>
              </div>
            ) : (
              <EmptyState title="No active projects" />
            )}
          </Card>

          {/* Escalations timeline */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Escalation Summary</h2>
              <span className="badge badge-accent">Tickets ({filteredEscalations.length})</span>
            </div>
            <div className="flex flex-col gap-3.5">
              {filteredEscalations.length > 0 ? (
                filteredEscalations.map(esc => (
                  <div key={esc.id} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-850 pb-3 last:border-none last:pb-0 text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{esc.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Owner: {esc.owner} • {esc.loggedDate || esc.date}</p>
                      </div>
                    </div>
                    <span className={`badge ${esc.severity === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>
                      {esc.severity}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState title="All quiet" description="There are no active escalations logged." />
              )}
            </div>
          </Card>

          {/* Upcoming timeline milestones */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Upcoming Schedule</h2>
            <div className="flex flex-col gap-3.5">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-850 pb-3 last:border-none last:pb-0 text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{ev.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{ev.date}</p>
                      </div>
                    </div>
                    <span className="badge badge-primary">{ev.type}</span>
                  </div>
                ))
              ) : (
                <EmptyState title="No events" description="No operational reviews scheduled." />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
