import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, ChevronLeft, Calendar, Award, ShieldAlert, MessageSquare, DollarSign, Briefcase, Star, Plus } from 'lucide-react';
import PageHeader from '../../../components/layout/PageHeader';
import StatusBadge from '../../../components/ui/StatusBadge';
import { Card, StatisticCard } from '../../../components/cards/DashboardCards';
import { DataTable } from '../../../components/tables/DataTable';
import { Loader, ErrorState } from '../../../components/feedback/FeedbackStates';
import { Button } from '../../../components/ui/Button';
import accountsService from '../services/accountsService';
import apiClient from '../../../api/client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const AccountDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const [projects, setProjects] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch account
        const acc = await accountsService.getAccount(id);
        if (!acc) {
          throw new Error('Client Account not found.');
        }
        setAccount(acc);

        // Fetch other collections
        const allProj = await apiClient.get('projects');
        setProjects(allProj.filter(p => p.accountId === id));

        const allEsc = await apiClient.get('escalations');
        setEscalations(allEsc.filter(e => e.accountId === id));

        const allEvt = await apiClient.get('events');
        setEvents(allEvt.filter(ev => ev.accountId === id));

        const allAch = await apiClient.get('achievements');
        setAchievements(allAch.filter(a => a.accountId === id));

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <Loader message="Loading client portfolio detailed insights..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => navigate('/accounts')} />;
  }

  // -------------------------------------------------------------
  // Data Summaries for Revenue Tab
  // -------------------------------------------------------------
  const activeProjectsCount = projects.length;
  // Calculate total value
  const totalAccountValue = projects.reduce((sum, p) => sum + (p.value || 0) * 1000, 0);
  // Recharts Monthly Revenue Trend Curve
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlyRevenues = months.map((m, idx) => {
    const revenueSum = projects.reduce((sum, p) => {
      const pRevenues = p.revenues || [0, 0, 0, 0, 0, 0];
      return sum + (pRevenues[idx] || 0) * 1000;
    }, 0);
    return { name: m, revenue: revenueSum };
  });

  const currentMonthRevenue = monthlyRevenues[5]?.revenue || 0;

  // Breadcrumbs path
  const breadcrumbs = [
    { label: 'Accounts', path: '/accounts' },
    { label: account.name }
  ];

  // Tab Header Items
  const tabItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: `Projects (${projects.length})` },
    { id: 'revenue', label: 'Revenue' },
    { id: 'achievements', label: `Achievements (${achievements.length})` },
    { id: 'events', label: `Events (${events.length})` },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'escalations', label: `Escalations (${escalations.length})` },
  ];

  return (
    <div className="page-container text-left select-none">
      
      {/* 1. Header with custom Action Buttons */}
      <PageHeader
        title={account.name}
        subtitle={`Enterprise Client Portfolio: ${account.client || account.name}`}
        breadcrumbs={breadcrumbs}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/accounts')} icon={ChevronLeft}>
              Back
            </Button>
            <Button onClick={() => navigate(`/accounts/${id}/edit`)} icon={Edit}>
              Edit Profile
            </Button>
          </>
        }
      />

      {/* 2. Account Summary Header Card */}
      <Card className="mb-8 p-6 grid grid-cols-1 md:grid-cols-5 gap-6 items-center border-t-4 border-primary">
        <div className="md:col-span-2 flex flex-col gap-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{account.name}</span>
            <StatusBadge status={account.status || 'Active'} />
            <StatusBadge status={account.tier || 'Strategic Platinum'} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Code: {account.code || 'N/A'}</p>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Market Region</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{account.region || 'Global'}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Global Lead</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{account.lead || 'Sarah Jenkins'}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">CSAT Score</span>
          <div className="flex items-center gap-1 text-secondary">
            <Star className="h-4 w-4 fill-secondary" />
            <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200">{(account.satisf || 4.5).toFixed(1)} / 5.0</span>
          </div>
        </div>
      </Card>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto gap-2 scrollbar-none">
        {tabItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-4 font-semibold text-sm border-b-2 whitespace-nowrap transition-all duration-200
              ${activeTab === tab.id
                ? 'border-primary text-primary dark:text-primary-light font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Lazy Loaded Tab Sections */}
      <div>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Business details */}
              <Card className="p-6 text-left flex flex-col gap-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Business & Geography</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div>
                    <span className="block text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Industry</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{account.industry || 'Life Sciences'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Country</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{account.country || 'Global'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-gray-400 dark:text-gray-500 font-bold uppercase mb-2">Capabilities / Services Offered</span>
                    <div className="flex flex-wrap gap-2">
                      {account.services && account.services.length > 0 ? (
                        account.services.map(srv => (
                          <span key={srv} className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            {srv}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">No capability offerings mapped.</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Ownership details */}
              <Card className="p-6 text-left flex flex-col gap-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Account Ownership</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div>
                    <span className="block text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Global Account Lead</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{account.lead || 'Sarah Jenkins'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Account Manager</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{account.manager || 'Not Assigned'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Delivery Lead</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{account.deliveryManager || 'Not Assigned'}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Description */}
            <Card className="p-6 text-left flex flex-col gap-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Profile Description</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {account.description || 'This strategic client profile monitors life sciences business development, clinical operations, regulatory operations and omnichannel brand engagements. Mapped to regional and global capability delivery hubs.'}
              </p>
            </Card>
          </div>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="animate-fadeIn">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Client Engagement Portfolios</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Active programs and timelines mapped to this account profile</p>
                </div>
              </div>

              <DataTable
                data={projects}
                placeholder="No projects registered under this account."
                enableGlobalSearch={true}
                enableColumnToggle={false}
                columns={[
                  {
                    accessorKey: 'title',
                    header: 'Project Title',
                    cell: info => <span className="font-bold text-primary dark:text-gray-200">{info.getValue()}</span>
                  },
                  {
                    accessorKey: 'serviceId',
                    header: 'Capability Offering',
                    cell: info => <span className="capitalize">{info.getValue()}</span>
                  },
                  {
                    accessorKey: 'status',
                    header: 'Delivery Status',
                    cell: info => <StatusBadge status={info.getValue()} />
                  },
                  {
                    accessorKey: 'progress',
                    header: 'Timeline Weight',
                    cell: info => {
                      const val = info.getValue() || 0;
                      return (
                        <div className="flex items-center gap-2 max-w-[120px]">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="h-full bg-primary" style={{ width: `${val}%` }}></div>
                          </div>
                          <span className="text-xs font-bold">{val}%</span>
                        </div>
                      );
                    }
                  }
                ]}
              />
            </Card>
          </div>
        )}

        {/* TAB 3: REVENUE */}
        {activeTab === 'revenue' && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* KPI statistics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatisticCard
                title="Account Portfolio Value"
                value={`$${(totalAccountValue / 1000).toFixed(0)}K`}
                icon={Briefcase}
                subtitle="total active value"
              />
              <StatisticCard
                title="Monthly Run Rate"
                value={`$${(currentMonthRevenue / 1000).toFixed(0)}K`}
                icon={DollarSign}
                subtitle="recurring target"
              />
              <StatisticCard
                title="Active Engagements"
                value={activeProjectsCount}
                icon={Star}
                subtitle="active programs"
              />
            </div>

            {/* Recharts trend */}
            <Card className="p-6 text-left flex flex-col gap-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Revenue Velocity Chart</h3>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenues} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={val => `$${val / 1000}K`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      formatter={val => [`$${val.toLocaleString()}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="animate-fadeIn">
            <Card className="p-6 text-left flex flex-col gap-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Client Milestones & Achievements</h3>
              
              <div className="timeline-wrapper">
                {achievements.length > 0 ? (
                  achievements.map((ach) => (
                    <div key={ach.id} className="timeline-item">
                      <div className="timeline-connector"></div>
                      <div className="timeline-badge bg-primary/10 text-primary">
                        <Award size={16} />
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-date">Verified Milestone</span>
                        <h4 className="timeline-title">{ach.title}</h4>
                        <p className="timeline-desc">{ach.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 dark:text-gray-500 font-medium">
                    🏆 No verified achievements logged for this client yet.
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 5: EVENTS */}
        {activeTab === 'events' && (
          <div className="animate-fadeIn">
            <Card className="p-6 text-left flex flex-col gap-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-2">Upcoming Events & Schedule</h3>
              
              <div className="timeline-wrapper">
                {events.length > 0 ? (
                  events.map((ev) => (
                    <div key={ev.id} className="timeline-item">
                      <div className="timeline-connector"></div>
                      <div className="timeline-badge bg-secondary/10 text-secondary">
                        <Calendar size={16} />
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-date">{ev.date}</span>
                        <h4 className="timeline-title capitalize">{ev.title}</h4>
                        <p className="timeline-desc">Operational category: <strong className="text-gray-700 dark:text-gray-300 capitalize">{ev.type}</strong></p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 dark:text-gray-500 font-medium">
                    📅 No calendar meetings or events scheduled.
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 6: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            <Card className="p-6 text-left flex flex-col gap-4 border-t-2 border-secondary justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex text-secondary gap-0.5">
                  <Star className="h-4 w-4 fill-secondary" />
                  <Star className="h-4 w-4 fill-secondary" />
                  <Star className="h-4 w-4 fill-secondary" />
                  <Star className="h-4 w-4 fill-secondary" />
                  <Star className="h-4 w-4 fill-secondary" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed font-medium">
                  "The capability delivery and automation support for our regulatory pipelines has been exceptional. Indegene has streamlined our timelines by 25%."
                </p>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-secondary text-sm select-none">
                  KH
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Katherine H.</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">VP, Regulatory Ops</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 text-left flex flex-col gap-4 border-t-2 border-primary justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex text-secondary gap-0.5">
                  <Star className="h-4 w-4 fill-secondary" />
                  <Star className="h-4 w-4 fill-secondary" />
                  <Star className="h-4 w-4 fill-secondary" />
                  <Star className="h-4 w-4 fill-secondary" />
                  <Star className="h-4 w-4 fill-secondary" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed font-medium">
                  "Indegene's design implementation team has provided highly modular layouts. The shared library speeded up our rollout of new portals significantly."
                </p>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm select-none">
                  TL
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">Tom L.</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">Global Omnichannel Lead</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 7: ESCALATIONS */}
        {activeTab === 'escalations' && (
          <div className="animate-fadeIn">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4 text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Account Escalation Logs</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">High priority operational blockers currently open for resolution</p>
                </div>
              </div>

              <DataTable
                data={escalations}
                placeholder="No escalations logged for this client."
                enableGlobalSearch={false}
                enableColumnToggle={false}
                columns={[
                  {
                    accessorKey: 'title',
                    header: 'Issue Description',
                    cell: info => <span className="font-bold text-accent">{info.getValue()}</span>
                  },
                  {
                    accessorKey: 'severity',
                    header: 'Severity Scale',
                    cell: info => <StatusBadge status={info.getValue()} />
                  },
                  {
                    accessorKey: 'loggedDate',
                    header: 'Logged Date'
                  },
                  {
                    accessorKey: 'owner',
                    header: 'Responsible Owner'
                  },
                  {
                    accessorKey: 'status',
                    header: 'Current Status',
                    cell: info => <StatusBadge status={info.getValue()} />
                  }
                ]}
              />
            </Card>
          </div>
        )}
      </div>

    </div>
  );
};

export default AccountDetailView;
