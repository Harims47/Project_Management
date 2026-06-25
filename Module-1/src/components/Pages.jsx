import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  DollarSign,
  Calendar,
  Trophy,
  AlertOctagon,
  MessageSquare,
  TrendingUp,
  Plus,
  ArrowRight,
  Star,
  ExternalLink,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

// Common Page Header Component to reuse
const PageHeader = ({ title, subtitle, actionLabel, onActionClick }) => (
  <div className="page-header">
    <div className="page-title-row">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {actionLabel && (
        <button onClick={onActionClick} className="btn btn-primary">
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

// 1. Dashboard View
export const DashboardView = () => {
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // Raw Data Model (CPMS Master Records)
  // -------------------------------------------------------------
  const allProjects = [
    { id: 'p1', title: 'Regulatory Submission Automation', client: 'Pfizer Inc.', type: 'Regulatory Operations & Submissions', progress: 94, status: 'On Track', due: 'July 20, 2026', value: 180000, health: 'Green', score: 94, revenues: [12000, 14000, 15000, 15000, 15000, 16000] },
    { id: 'p2', title: 'Regulatory Dossier Compiler', client: 'Pfizer Inc.', type: 'Regulatory Operations & Submissions', progress: 62, status: 'At Risk', due: 'August 14, 2026', value: 160000, health: 'Amber', score: 72, revenues: [10000, 11000, 12000, 10000, 9000, 11000] },
    { id: 'p3', title: 'Patient Outreach Platform', client: 'Novartis AG', type: 'Commercialization & Brand Launch', progress: 92, status: 'On Track', due: 'September 10, 2026', value: 280000, health: 'Green', score: 92, revenues: [20000, 22000, 24000, 23000, 25000, 25000] },
    { id: 'p4', title: 'Global HCP Portal Revamp', client: 'Novartis AG', type: 'Omnichannel Data & Analytics', progress: 100, status: 'Completed', due: 'Completed', value: 220000, health: 'Green', score: 100, revenues: [18000, 18000, 20000, 20000, 20000, 20000] },
    { id: 'p5', title: 'Omnichannel Patient Portal', client: 'AstraZeneca', type: 'Clinical Trials Tech Enablement', progress: 85, status: 'On Track', due: 'July 20, 2026', value: 410000, health: 'Green', score: 89, revenues: [30000, 32000, 34000, 33000, 35000, 36000] },
    { id: 'p6', title: 'Clinical Site Engagement Portal', client: 'Roche Holding', type: 'Clinical Trials Tech Enablement', progress: 40, status: 'On Track', due: 'October 05, 2026', value: 220000, health: 'Green', score: 88, revenues: [15000, 17000, 18000, 18000, 19000, 19000] },
    { id: 'p7', title: 'Post-Market Surveillance Engine', client: 'Merck & Co.', type: 'Regulatory Operations & Submissions', progress: 10, status: 'On Track', due: 'Dec 15, 2026', value: 95000, health: 'Green', score: 90, revenues: [6000, 7000, 8000, 8000, 8000, 8000] },
    { id: 'p8', title: 'Efficacy Dashboard Integration', client: 'Johnson & Johnson', type: 'Omnichannel Data & Analytics', progress: 25, status: 'Blocked', due: 'September 12, 2026', value: 120000, health: 'Red', score: 45, revenues: [10000, 10000, 9000, 8000, 5000, 5000] }
  ];

  const allEscalations = [
    { id: 'e1', title: 'API access blocked by J&J security', client: 'Johnson & Johnson', severity: 'Critical', date: 'June 10, 2026', owner: 'Dave Patel' },
    { id: 'e2', title: 'Resource constraints on Dossier compilation', client: 'Pfizer Inc.', severity: 'Major', date: 'June 12, 2026', owner: 'Sarah Jenkins' },
    { id: 'e3', title: 'Minor database migration lag', client: 'Novartis AG', severity: 'Minor', date: 'June 13, 2026', owner: 'Alex Mercer' }
  ];

  const allEvents = [
    { id: 'ev1', title: 'QBR steering committee meeting', client: 'Pfizer Inc.', time: 'Tomorrow at 10:00 AM', type: 'meeting' },
    { id: 'ev2', title: 'Phase 3 Tech Launch Demo', client: 'Roche Holding', time: 'June 20, 2026 at 2:00 PM', type: 'demo' },
    { id: 'ev3', title: 'Omnichannel Portal Go-Live', client: 'AstraZeneca', time: 'June 28, 2026', type: 'milestone' }
  ];

  const allAchievements = [
    { id: 'a1', title: 'early regulatory submit', client: 'Pfizer Inc.', text: 'Regulatory Submission Automation completed 2 weeks early, speeding up client pipeline.' },
    { id: 'a2', title: 'novartis contract renewed', client: 'Novartis AG', text: 'Novartis portfolio signed a $500K renewal extension for the upcoming fiscal year.' },
    { id: 'a3', title: 'csat milestone hit', client: 'AstraZeneca', text: 'Client satisfaction score hit a record-high 9.8/10 on AstraZeneca Patient Portal.' }
  ];

  // -------------------------------------------------------------
  // Filter States
  // -------------------------------------------------------------
  const [accountFilter, setAccountFilter] = React.useState('All');
  const [projectFilter, setProjectFilter] = React.useState('All');
  const [serviceFilter, setServiceFilter] = React.useState('All');
  const [dateRangeFilter, setDateRangeFilter] = React.useState('YTD'); // '30d' | '3q' | 'YTD'

  // Get lists of filter values
  const uniqueAccounts = [...new Set(allProjects.map(p => p.client))];
  const uniqueServices = [...new Set(allProjects.map(p => p.type))];

  // Reset helper
  const handleClearFilters = () => {
    setAccountFilter('All');
    setProjectFilter('All');
    setServiceFilter('All');
    setDateRangeFilter('YTD');
  };

  // -------------------------------------------------------------
  // Dynamic Filtering Logic
  // -------------------------------------------------------------
  const filteredProjects = allProjects.filter(p => {
    const matchAccount = accountFilter === 'All' || p.client === accountFilter;
    const matchProject = projectFilter === 'All' || p.title === projectFilter;
    const matchService = serviceFilter === 'All' || p.type === serviceFilter;
    return matchAccount && matchProject && matchService;
  });

  const filteredEscalations = allEscalations.filter(e => {
    const matchAccount = accountFilter === 'All' || e.client === accountFilter;
    return matchAccount;
  });

  const filteredEvents = allEvents.filter(ev => {
    const matchAccount = accountFilter === 'All' || ev.client === accountFilter;
    return matchAccount;
  });

  const filteredAchievements = allAchievements.filter(a => {
    const matchAccount = accountFilter === 'All' || a.client === accountFilter;
    return matchAccount;
  });

  // Calculate dynamic KPIs
  const totalPortfolioValue = filteredProjects.reduce((acc, p) => acc + p.value, 0);
  const activeEngagementsCount = filteredProjects.length;

  // Compute monthly sums (Jan to Jun)
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let monthlyTotals = [0, 0, 0, 0, 0, 0];

  filteredProjects.forEach(p => {
    for (let i = 0; i < 6; i++) {
      monthlyTotals[i] += p.revenues[i] || 0;
    }
  });

  // Date Range sub-filter on trend totals
  let trendData = [...monthlyTotals];
  let trendLabels = [...monthLabels];
  if (dateRangeFilter === '30d') {
    trendData = [monthlyTotals[5]];
    trendLabels = ['Jun'];
  } else if (dateRangeFilter === '3q') {
    trendData = [monthlyTotals[3], monthlyTotals[4], monthlyTotals[5]];
    trendLabels = ['Apr', 'May', 'Jun'];
  }

  const currentMonthRevenue = monthlyTotals[5] || 0;

  // Avg Health score calculation
  const totalScore = filteredProjects.reduce((acc, p) => acc + p.score, 0);
  const avgHealthScore = activeEngagementsCount > 0 ? Math.round(totalScore / activeEngagementsCount) : 0;

  // Project health segment counters
  const healthCounts = { Green: 0, Amber: 0, Red: 0 };
  filteredProjects.forEach(p => {
    healthCounts[p.health]++;
  });

  const greenPct = activeEngagementsCount > 0 ? Math.round((healthCounts.Green / activeEngagementsCount) * 100) : 0;
  const amberPct = activeEngagementsCount > 0 ? Math.round((healthCounts.Amber / activeEngagementsCount) * 100) : 0;
  const redPct = activeEngagementsCount > 0 ? 100 - greenPct - amberPct : 0; // ensure exactly 100%

  // Donut chart SVG calculations
  const circumference = 314.16; // 2 * Math.PI * 50
  const greenDashOffset = 0;
  const greenDashLength = (greenPct / 100) * circumference;
  const amberDashOffset = -greenDashLength;
  const amberDashLength = (amberPct / 100) * circumference;
  const redDashOffset = -(greenDashLength + amberDashLength);
  const redDashLength = (redPct / 100) * circumference;

  // Compute revenues by service
  const serviceRevenue = {};
  allProjects.forEach(p => {
    serviceRevenue[p.type] = 0;
  });
  filteredProjects.forEach(p => {
    serviceRevenue[p.type] += p.value;
  });

  // -------------------------------------------------------------
  // SVG Graph Layout Computations
  // -------------------------------------------------------------
  const maxTrendVal = Math.max(...trendData, 10000) * 1.1; // scale height
  const minTrendVal = Math.min(...trendData, 0) * 0.9;
  const pointCount = trendData.length;

  const getSvgCoordinates = () => {
    const width = 420;
    const height = 100;
    const startX = 45;
    const startY = 125;

    return trendData.map((val, idx) => {
      const x = startX + (idx / (pointCount - 1 || 1)) * width;
      const y = startY - ((val - minTrendVal) / (maxTrendVal - minTrendVal || 1)) * height;
      return { x, y, val };
    });
  };

  const coordinates = getSvgCoordinates();

  // Create stroke path string
  let linePathD = '';
  let areaPathD = '';
  if (coordinates.length > 0) {
    linePathD = `M ${coordinates[0].x} ${coordinates[0].y} ` + coordinates.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');
    areaPathD = `${linePathD} L ${coordinates[coordinates.length - 1].x} 130 L ${coordinates[0].x} 130 Z`;
  }

  // Hover state for tooltip overlay
  const [hoveredPoint, setHoveredPoint] = React.useState(null);

  return (
    <div className="page-container">
      {/* Header section */}
      <PageHeader
        title="Executive Portfolio Overview"
        subtitle="Real-time financial trend, health scoring, and strategic overview of corporate client portfolios."
        actionLabel="New Engagement"
        onActionClick={() => navigate('/projects')}
      />

      {/* Global Filter Bar Controls */}
      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="account-filter">Client Account</label>
          <select
            id="account-filter"
            className="filter-select"
            value={accountFilter}
            onChange={(e) => { setAccountFilter(e.target.value); setProjectFilter('All'); }}
          >
            <option value="All">All Accounts</option>
            {uniqueAccounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="project-filter">Engagement Project</label>
          <select
            id="project-filter"
            className="filter-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="All">All Projects</option>
            {allProjects
              .filter(p => accountFilter === 'All' || p.client === accountFilter)
              .map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="service-filter">Service Capability</label>
          <select
            id="service-filter"
            className="filter-select"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="All">All Services</option>
            {uniqueServices.map(srv => <option key={srv} value={srv}>{srv}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="date-filter">Analysis Period</label>
          <select
            id="date-filter"
            className="filter-select"
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
          >
            <option value="30d">Last 30 Days (June)</option>
            <option value="3q">Last Quarter (Q2)</option>
            <option value="YTD">Year to Date (Jan - Jun)</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn btn-outline filter-clear-btn" onClick={handleClearFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="stats-grid">
        <div className="card accent-border-top-primary">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Portfolio Value</span>
            <div className="stat-card-icon-wrapper icon-blue">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-card-value">${(totalPortfolioValue / 1000).toFixed(0)}K</div>
          <div className="stat-card-footer">
            <span className="stat-card-change change-up">
              <TrendingUp size={14} style={{ marginRight: '4px' }} />
              +15.2%
            </span>
            <span style={{ color: 'var(--text-muted)' }}>growth value</span>
          </div>
        </div>

        <div className="card accent-border-top-secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Engagements</span>
            <div className="stat-card-icon-wrapper icon-cyan">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="stat-card-value">{activeEngagementsCount}</div>
          <div className="stat-card-footer">
            <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: '10px' }}>
              {healthCounts.Green} Healthy
            </span>
            {healthCounts.Amber > 0 && (
              <span className="badge badge-warning" style={{ padding: '2px 8px', fontSize: '10px', marginLeft: '4px' }}>
                {healthCounts.Amber} Risk
              </span>
            )}
          </div>
        </div>

        <div className="card accent-border-top-pink">
          <div className="stat-card-header">
            <span className="stat-card-title">Est. Monthly Run Rate</span>
            <div className="stat-card-icon-wrapper icon-pink">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-card-value">${(currentMonthRevenue / 1000).toFixed(0)}K</div>
          <div className="stat-card-footer">
            <span className="stat-card-change change-up">
              <TrendingUp size={14} style={{ marginRight: '4px' }} />
              +4.8%
            </span>
            <span style={{ color: 'var(--text-muted)' }}>recurring target</span>
          </div>
        </div>
      </div>

      {/* Charts Block Section (2x2 Dashboard Layout) */}
      <div className="executive-grid-2x2">

        {/* Chart 1: Revenue Velocity Trend */}
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Revenue Trend Curve</h2>
              <span className="chart-subtitle">Direct operational run rate metrics in USD ($)</span>
            </div>
            <span className="badge badge-primary">{dateRangeFilter === 'YTD' ? 'YTD (6M)' : dateRangeFilter === '3q' ? 'Q2 (3M)' : '30 Days'}</span>
          </div>

          <div style={{ position: 'relative' }}>
            <svg className="svg-chart-container" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" className="svg-chart-grid" />
              <line x1="40" y1="75" x2="480" y2="75" className="svg-chart-grid" />
              <line x1="40" y1="130" x2="480" y2="130" className="svg-chart-grid" />

              {/* Gradient Area under line */}
              {areaPathD && <path d={areaPathD} fill="url(#revGradient)" className="svg-chart-area" />}

              {/* Line path */}
              {linePathD && <path d={linePathD} className="svg-chart-path" stroke="var(--primary)" />}

              {/* SVG interactive circles */}
              {coordinates.map((c, idx) => (
                <circle
                  key={idx}
                  cx={c.x}
                  cy={c.y}
                  r={hoveredPoint === idx ? 7 : 4}
                  fill={hoveredPoint === idx ? 'var(--accent)' : 'var(--secondary)'}
                  stroke="var(--bg-card)"
                  strokeWidth="2"
                  className="svg-chart-dot"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* X Axis Labels */}
              {coordinates.map((c, idx) => (
                <text key={idx} x={c.x} y="146" textAnchor="middle" className="svg-chart-axis" style={{ fontWeight: '600' }}>
                  {trendLabels[idx]}
                </text>
              ))}

              {/* Y Axis Limits */}
              <text x="35" y="24" textAnchor="end" className="svg-chart-axis">${(maxTrendVal / 1000).toFixed(0)}K</text>
              <text x="35" y="134" textAnchor="end" className="svg-chart-axis">${(minTrendVal / 1000).toFixed(0)}K</text>
            </svg>

            {/* Float Tooltip Overlay on hover */}
            {hoveredPoint !== null && coordinates[hoveredPoint] && (
              <div style={{
                position: 'absolute',
                top: `${coordinates[hoveredPoint].y - 45}px`,
                left: `${coordinates[hoveredPoint].x - 60}px`,
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-card)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '700',
                pointerEvents: 'none',
                boxShadow: 'var(--shadow-md)',
                zIndex: 10,
                textAlign: 'center'
              }}>
                {trendLabels[hoveredPoint]}: ${(coordinates[hoveredPoint].val / 1000).toFixed(1)}K
              </div>
            )}
          </div>

          <div className="chart-legend">
            <div className="chart-legend-item">
              <span className="legend-dot-primary"></span>
              <span>Revenues ($)</span>
            </div>
            <div className="chart-legend-item">
              <span className="legend-dot-secondary"></span>
              <span>Milestone Trend</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Project Health Status Split */}
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Portfolio Delivery Health</h2>
              <span className="chart-subtitle">Project execution risk distributions</span>
            </div>
            <span className="badge badge-success">{greenPct}% Green</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flex: 1, padding: '10px 0' }}>
            {/* Donut SVG Pie Chart */}
            <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
              <svg viewBox="0 0 120 120" width="130" height="130" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke="var(--border-color)"
                  strokeWidth="10"
                />

                {/* Green (On Track) segment */}
                {greenPct > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray={`${greenDashLength} ${circumference - greenDashLength}`}
                    strokeDashoffset={greenDashOffset}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                )}

                {/* Amber (At Risk) segment */}
                {amberPct > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="12"
                    strokeDasharray={`${amberDashLength} ${circumference - amberDashLength}`}
                    strokeDashoffset={amberDashOffset}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                )}

                {/* Red (Blocked) segment */}
                {redPct > 0 && (
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray={`${redDashLength} ${circumference - redDashLength}`}
                    strokeDashoffset={redDashOffset}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                )}
              </svg>

              {/* Text inside the Donut hole (not rotated) */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
                  {activeEngagementsCount}
                </span>
                <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                  Total
                </span>
              </div>
            </div>

            {/* Labels right side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500', flex: 1 }}>On Track</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{healthCounts.Green} ({greenPct}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }}></span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500', flex: 1 }}>At Risk</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{healthCounts.Amber} ({amberPct}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }}></span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500', flex: 1 }}>Blocked</span>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{healthCounts.Red} ({redPct}%)</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            Health values calculated recursively based on active timeline velocity targets.
          </div>
        </div>

        {/* Chart 3: Revenue Distribution by Capability offerings */}
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Revenue by Offering Capability</h2>
              <span className="chart-subtitle">Distribution of value across service lines</span>
            </div>
          </div>

          <div className="service-bars-container">
            {Object.keys(serviceRevenue).map((capability, idx) => {
              const val = serviceRevenue[capability];
              const maxVal = Math.max(...Object.values(serviceRevenue), 1);
              const pct = Math.round((val / maxVal) * 100);
              const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', '#10b981'];
              const fillColor = colors[idx % colors.length];

              return (
                <div key={capability} className="service-bar-item">
                  <div className="service-bar-header">
                    <span style={{ fontSize: '12px', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }} title={capability}>
                      {capability}
                    </span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>${(val / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="service-bar-track">
                    <div className="service-bar-fill" style={{ width: `${pct}%`, backgroundColor: fillColor }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '12px' }}></div>
        </div>

        {/* Chart 4: Action Hub & Escalations Summary */}
        <div className="card chart-card">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Escalation Activity Log</h2>
              <span className="chart-subtitle">Active accounts needing high-priority management</span>
            </div>
            <span className="badge badge-accent">{filteredEscalations.length} Active</span>
          </div>

          <div className="timeline-wrapper" style={{ overflowY: 'auto', maxHeight: '180px' }}>
            {filteredEscalations.length > 0 ? (
              filteredEscalations.map((esc) => (
                <div key={esc.id} className="timeline-item">
                  <div className="timeline-connector"></div>
                  <div className="timeline-badge" style={{
                    backgroundColor: esc.severity === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : esc.severity === 'Major' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(21, 82, 166, 0.1)',
                    color: esc.severity === 'Critical' ? '#ef4444' : esc.severity === 'Major' ? '#f59e0b' : 'var(--primary)'
                  }}>
                    !
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-date">{esc.client} &bull; {esc.date}</span>
                    <h4 className="timeline-title">{esc.title}</h4>
                    <p className="timeline-desc">Assigned Lead: <strong style={{ color: 'var(--text-primary)' }}>{esc.owner}</strong> &bull; Status: <span style={{ color: esc.severity === 'Critical' ? '#ef4444' : '#f59e0b', fontWeight: '700' }}>{esc.severity}</span></p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                🎉 No escalations active for the selected filters.
              </div>
            )}
          </div>

          <div className="chart-legend" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
            <button onClick={() => navigate('/escalations')} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '11px', width: '100%', justifyContent: 'center' }}>
              Access Escalation Console
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Layout Row: Accounts, Events, Achievements */}
      <div className="dashboard-sections" style={{ marginBottom: '24px' }}>

        {/* Left Columns: Active Project Health Ledger */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Top Strategic Client Accounts</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Key operational delivery accounts ledger</p>
            </div>
            <button onClick={() => navigate('/accounts')} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
              View Directory
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Client Account</th>
                  <th>Core Capability Area</th>
                  <th>Timeline Status</th>
                  <th>Contract Weight</th>
                  <th>Completion Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{p.client}</td>
                    <td>{p.type.split('&')[0]}</td>
                    <td>
                      <span className={`badge ${p.status === 'Completed' ? 'badge-success' : p.status === 'On Track' ? 'badge-primary' : p.status === 'At Risk' ? 'badge-warning' : 'badge-danger'
                        }`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', width: '60px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: p.status === 'Completed' ? '#10b981' : p.status === 'At Risk' ? '#f59e0b' : p.status === 'Blocked' ? '#ef4444' : 'var(--primary)', borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>${(p.value / 1000).toFixed(0)}K</td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                      No strategic accounts match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Columns: Upcoming Timeline & Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Upcoming Events timeline widget */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Upcoming Milestones</h2>
              <span className="badge badge-primary">{filteredEvents.length} Tasks</span>
            </div>

            <div className="timeline-wrapper">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(ev => (
                  <div className="timeline-item" key={ev.id}>
                    <div className="timeline-connector"></div>
                    <div className="timeline-badge" style={{
                      backgroundColor: ev.type === 'meeting' ? 'rgba(40, 182, 232, 0.1)' : ev.type === 'demo' ? 'rgba(236, 0, 140, 0.1)' : 'rgba(21, 82, 166, 0.1)',
                      color: ev.type === 'meeting' ? 'var(--secondary)' : ev.type === 'demo' ? 'var(--accent)' : 'var(--primary)'
                    }}>
                      {ev.type === 'meeting' ? 'M' : ev.type === 'demo' ? 'D' : 'G'}
                    </div>
                    <div className="timeline-content">
                      <span className="timeline-date">{ev.time}</span>
                      <h4 className="timeline-title" style={{ fontSize: '13px' }}>{ev.title}</h4>
                      <p className="timeline-desc" style={{ fontSize: '11px' }}>Account: {ev.client}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No upcoming milestones for selected account.
                </div>
              )}
            </div>
          </div>

          {/* Achievement Highlights Feed */}
          <div className="card">
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Achievement Highlights</h2>

            <div className="achievements-scroller">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map(ach => (
                  <div className="achievement-highlight-card" key={ach.id}>
                    <div className="achievement-badge-circle">
                      <Trophy size={16} />
                    </div>
                    <div className="achievement-highlight-info">
                      <h4 className="achievement-highlight-title" style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                        {ach.client}
                      </h4>
                      <p className="achievement-highlight-desc">
                        {ach.text}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No recent milestones registered.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

// DashboardView and AccountsView migrated to modular feature folders under src/modules/

// 3. Projects View
export const ProjectsView = () => {
  const projects = [
    { title: 'Omnichannel Patient Portal', client: 'AstraZeneca', type: 'Technology Dev', progress: 85, status: 'On Track', due: 'July 20, 2026' },
    { title: 'Regulatory Dossier Compiler', client: 'Pfizer Inc.', type: 'Automation Consulting', progress: 62, status: 'At Risk', due: 'August 14, 2026' },
    { title: 'Global HCP Portal Revamp', client: 'Novartis AG', type: 'Design System Implementation', progress: 100, status: 'Completed', due: 'Completed' },
    { title: 'Clinical Site Engagement Portal', client: 'Roche Holding', type: 'Operations Services', progress: 40, status: 'On Track', due: 'October 05, 2026' },
    { title: 'Efficacy Analytics Dashboard', client: 'Johnson & Johnson', type: 'Data Integration', progress: 25, status: 'Blocked', due: 'September 12, 2026' },
    { title: 'Post-Market Surveillance Engine', client: 'Merck & Co.', type: 'Technology Dev', progress: 10, status: 'On Track', due: 'Dec 15, 2026' }
  ];

  return (
    <div className="page-container">
      <PageHeader title="Portfolio Projects" subtitle="Track timelines, completion velocities, and delivery blockages." actionLabel="New Project" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {projects.map((p, idx) => (
          <div key={idx} className="card accent-border-top-primary" style={{ borderTopColor: p.status === 'Completed' ? '#10b981' : p.status === 'At Risk' ? 'var(--secondary)' : p.status === 'Blocked' ? 'var(--accent)' : 'var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: '10px', marginBottom: '6px' }}>{p.type}</span>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{p.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Client: <strong style={{ color: 'var(--text-secondary)' }}>{p.client}</strong></p>
              </div>
              <span className={`badge ${p.status === 'Completed' ? 'badge-success' : p.status === 'On Track' ? 'badge-primary' : p.status === 'At Risk' ? 'badge-warning' : 'badge-danger'}`}>
                {p.status}
              </span>
            </div>

            <div style={{ margin: '24px 0 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Completion Progress</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{p.progress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${p.progress}%`,
                  height: '100%',
                  background: p.status === 'Completed' ? '#10b981' : `linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)`,
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <Clock size={12} />
              <span>Target Delivery: {p.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Services View
export const ServicesView = () => {
  const serviceCatalogs = [
    { title: 'Commercialization & Brand Launch', count: 14, desc: 'Complete market-entry frameworks, digital campaign orchestrations, and doctor-patient outreach networks.', color: 'var(--primary)' },
    { title: 'Regulatory Operations & Submissions', count: 8, desc: 'Automated global regulatory publishing pipelines, audit compliance tooling, and document submission acceleration.', color: 'var(--secondary)' },
    { title: 'Clinical Trials Tech Enablement', count: 18, desc: 'Electronic data captures, patient recruitment boards, Decentralized Clinical Trials (DCT) custom mobile panels.', color: 'var(--accent)' },
    { title: 'Omnichannel Data & Analytics', count: 9, desc: 'Aggregation of healthcare professional (HCP) touchpoints, sales force enablement indices, and efficacy charts.', color: '#10b981' }
  ];

  return (
    <div className="page-container">
      <PageHeader title="Service Catalog" subtitle="Track standard service offerings and active implementation metrics across accounts." actionLabel="New Offering" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {serviceCatalogs.map((s, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  {s.count} Active Contracts
                </span>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: s.color }}></div>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>{s.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{s.desc}</p>
            </div>

            <button className="btn btn-outline" style={{ marginTop: '20px', width: '100%', justifyContent: 'center', fontSize: '13px' }}>
              View Contracts Structure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Revenue View
export const RevenueView = () => {
  const lineItems = [
    { client: 'AstraZeneca PLC', serviceLine: 'Clinical Trial Enablement', activeBilling: '$34,160/mo', bookedYTD: '$240,000', margin: '74%' },
    { client: 'Pfizer Inc.', serviceLine: 'Regulatory Operations', activeBilling: '$28,330/mo', bookedYTD: '$210,000', margin: '68%' },
    { client: 'Novartis AG', serviceLine: 'Commercial Brand Launch', activeBilling: '$23,330/mo', bookedYTD: '$180,000', margin: '72%' },
    { client: 'Roche Holding', serviceLine: 'Omnichannel Analytics', activeBilling: '$18,330/mo', bookedYTD: '$130,000', margin: '80%' }
  ];

  return (
    <div className="page-container">
      <PageHeader title="Revenue Intelligence" subtitle="Monitor active monthly billing values, contract run-rates, and profit margins." />

      <div className="stats-grid">
        <div className="card accent-border-top-primary">
          <div className="stat-card-header">
            <span className="stat-card-title">Booked YTD</span>
            <div className="stat-card-icon-wrapper icon-blue">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-card-value">$3.82M</div>
          <div className="stat-card-footer">
            <span style={{ color: 'var(--text-secondary)' }}>Target Forecast: $4.50M</span>
          </div>
        </div>

        <div className="card accent-border-top-secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Monthly Recur. (MRR)</span>
            <div className="stat-card-icon-wrapper icon-cyan">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-card-value">$104.1K</div>
          <div className="stat-card-footer">
            <span className="change-up" style={{ fontWeight: '600' }}>+8.4% monthly growth</span>
          </div>
        </div>

        <div className="card accent-border-top-pink">
          <div className="stat-card-header">
            <span className="stat-card-title">Gross Operating Margin</span>
            <div className="stat-card-icon-wrapper icon-pink">
              <Layers size={20} />
            </div>
          </div>
          <div className="stat-card-value">73.5%</div>
          <div className="stat-card-footer">
            <span style={{ color: 'var(--text-muted)' }}>Target Benchmark: 70.0%</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Revenue Contribution by Active Accounts</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Account Client</th>
                <th>Principal Service Line</th>
                <th>Active Monthly Rate</th>
                <th>Invoiced Booked YTD</th>
                <th>Project Margin %</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600' }}>{item.client}</td>
                  <td>{item.serviceLine}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: '700' }}>{item.activeBilling}</td>
                  <td>{item.bookedYTD}</td>
                  <td>
                    <span className="badge badge-success" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                      {item.margin}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6. Events View
export const EventsView = () => {
  const events = [
    { title: 'Pfizer Q2 Executive Steering Meeting', date: 'June 15, 2026', time: '10:00 AM - 11:30 AM', type: 'Quarterly Review', attendee: 'Sarah Jenkins (Owner)' },
    { title: 'AstraZeneca Project Launch Alignment', date: 'June 17, 2026', time: '2:00 PM - 3:00 PM', type: 'Technical Review', attendee: 'David Vance (Lead)' },
    { title: 'Novartis HCP Portal Demo Review', date: 'June 18, 2026', time: '11:00 AM - 12:30 PM', type: 'Client Showcase', attendee: 'Alex Mercer (Lead)' },
    { title: 'Roche Clinical Integration Workshop', date: 'June 22, 2026', time: '3:30 PM - 5:00 PM', type: 'Workshop Session', attendee: 'Elena Rostova (Host)' },
    { title: 'Portfolio Health Internal Governance Council', date: 'June 25, 2026', time: '9:00 AM - 10:30 AM', type: 'Internal Operations', attendee: 'Portfolio Directors' }
  ];

  return (
    <div className="page-container">
      <PageHeader title="Milestones & Events" subtitle="Manage scheduled operations, technical syncs, and client steering dashboards." actionLabel="Add Event" />

      <div className="card">
        <div className="list-group">
          {events.map((e, idx) => (
            <div key={idx} className="list-item" style={{ padding: '16px 0' }}>
              <div className="list-item-content" style={{ gap: '20px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-app)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {e.date.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)', lineHeight: '1.1' }}>
                    {e.date.split(' ')[1].replace(',', '')}
                  </span>
                </div>

                <div>
                  <span className="badge badge-secondary" style={{ fontSize: '10px', marginBottom: '4px' }}>{e.type}</span>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{e.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>🕒 {e.time}</span>
                    <span>👤 Leader: {e.attendee}</span>
                  </div>
                </div>
              </div>

              <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Access Meeting
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. Achievements View
export const AchievementsView = () => {
  const milestones = [
    { title: 'ISO 27001 Security Accreditation', client: 'System-wide Security Audit', date: 'March 2026', icon: 'shield', desc: 'Successfully certified the portfolio dashboard infrastructure under global information security benchmarks.' },
    { title: '99.99% Systems SLA Uptime Met', client: 'Pfizer / AstraZeneca Platforms', date: 'Q1 2026', icon: 'uptime', desc: 'Maintained zero unscheduled downtime across patient databases hosting active clinical studies.' },
    { title: 'Outstanding Service Delivery Award', client: 'Granted by Novartis Board', date: 'December 2025', icon: 'award', desc: 'Recognized for delivering a complex multi-region oncology platform 3 weeks ahead of regulatory schedule.' },
    { title: '2 Million Active Patients Served', client: 'Commercial Engagement Portals', date: 'October 2025', icon: 'patients', desc: 'Reached a critical milestone of active registered patients securely accessing support services.' }
  ];

  return (
    <div className="page-container">
      <PageHeader title="Portfolio Achievements" subtitle="Celebrate compliance checkpoints, client awards, and delivery excellence." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {milestones.map((m, idx) => (
          <div key={idx} className="card accent-border-top-secondary" style={{ display: 'flex', gap: '16px', padding: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(40, 182, 232, 0.1)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Trophy size={24} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{m.title}</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.client}</p>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '10px 0' }}>{m.desc}</p>
              <span className="badge badge-primary" style={{ fontSize: '10px' }}>Completed: {m.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 8. Escalations View
export const EscalationsView = () => {
  const issues = [
    { id: 'ESC-402', client: 'Johnson & Johnson', issue: 'Data-integration schema latency blocking phase 3 patient uploads.', priority: 'critical', assigned: 'Elena Rostova', daysOpen: 4 },
    { id: 'ESC-399', client: 'Pfizer Inc.', issue: 'Sign-on validation timeout causing delay in regional investigator audits.', priority: 'critical', assigned: 'Sarah Jenkins', daysOpen: 2 },
    { id: 'ESC-385', client: 'Merck & Co.', issue: 'Design styling layout alignment shifts on iOS Safari browser viewports.', priority: 'major', assigned: 'Marcus Brody', daysOpen: 5 },
    { id: 'ESC-371', client: 'Sanofi S.A.', issue: 'Archived contract PDF download failures in secondary account panels.', priority: 'minor', assigned: 'Luc Picard', daysOpen: 1 }
  ];

  return (
    <div className="page-container">
      <PageHeader title="Critical Escalations" subtitle="Monitor active service-level agreement infractions and delivery blocks." />

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="stat-card-title">Critical Severity</div>
          <div className="stat-card-value" style={{ color: '#ef4444' }}>2</div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Immediate executive action required</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="stat-card-title">Major Severity</div>
          <div className="stat-card-value" style={{ color: '#f59e0b' }}>1</div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>SLA target limit: 48 hours remaining</p>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="stat-card-title">Mean Time to Resolution</div>
          <div className="stat-card-value" style={{ color: '#10b981' }}>18h</div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Averages 12% faster than contract mandate</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Active Escalation Log</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Client Account</th>
                <th>Symptom & Impact Summary</th>
                <th>Priority</th>
                <th>Assigned Operations Lead</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((i, idx) => (
                <tr key={idx} style={{ backgroundColor: i.priority === 'critical' ? 'rgba(239, 68, 68, 0.02)' : 'transparent' }}>
                  <td style={{ fontWeight: '700', color: 'var(--accent)' }}>{i.id}</td>
                  <td style={{ fontWeight: '600' }}>{i.client}</td>
                  <td style={{ maxWidth: '300px', lineHeight: '1.4' }}>{i.issue}</td>
                  <td>
                    <span className={`badge ${i.priority === 'critical' ? 'badge-danger' : i.priority === 'major' ? 'badge-warning' : 'badge-primary'}`}>
                      {i.priority}
                    </span>
                  </td>
                  <td>{i.assigned}</td>
                  <td>{i.daysOpen} days</td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '11px' }}>
                      Remediate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 9. Testimonials View
export const TestimonialsView = () => {
  const reviews = [
    {
      author: 'Sarah Jenkins',
      title: 'Global Clinical Operations Director, Pfizer',
      content: 'The regulatory compilation engine set up by your team shaved weeks off our European submissions schedule. Their response time and technical excellence are second to none.',
      rating: 5,
      engagement: 'Regulatory Automation'
    },
    {
      author: 'Alex Mercer',
      title: 'Global Account Lead, Novartis',
      content: 'The patient outreach framework delivered by your team has boosted clinical recruitment rates by over 35% in our phase 3 oncology trials. Our board was highly impressed.',
      rating: 5,
      engagement: 'Patient Outreach Portal'
    },
    {
      author: 'David Vance',
      title: 'IT Director, AstraZeneca',
      content: 'Excellent support in establishing our brand-level digital design systems. We have accelerated subsequent site rollouts by 60% with the reusable UI foundation.',
      rating: 5,
      engagement: 'HCP Portal Design'
    },
    {
      author: 'Elena Rostova',
      title: 'VP of Commercial Strategy, Roche',
      content: 'The omnichannel analytical trackers provided us with real-time insight on field activity that we previously spent weeks assembling manually. High impact tool!',
      rating: 4,
      engagement: 'Data Analytics Integration'
    }
  ];

  return (
    <div className="page-container">
      <PageHeader title="Client Feedback & Testimonials" subtitle="Read testimonials, review ratings, and track customer satisfaction scores (CSAT)." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {reviews.map((r, idx) => (
          <div key={idx} className="card accent-border-top-pink" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-primary" style={{ fontSize: '10px' }}>{r.engagement}</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < r.rating ? 'var(--accent)' : 'none'}
                      color={i < r.rating ? 'var(--accent)' : 'var(--text-muted)'}
                    />
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '24px' }}>
                "{r.content}"
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {r.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{r.author}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 10. Resource Utilization View
export const ResourceUtilizationView = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deptFilter, setDeptFilter] = React.useState('All');

  const resources = [
    { name: 'Sarah Jenkins', role: 'Solutions Architect', allocation: 'Pfizer Inc. (80%), Novartis AG (20%)', utilization: 100, status: 'Optimal', department: 'Technology' },
    { name: 'Alex Mercer', role: 'Lead Frontend Engineer', allocation: 'Novartis AG (100%)', utilization: 100, status: 'Optimal', department: 'Engineering' },
    { name: 'Dave Patel', role: 'Senior Database Administrator', allocation: 'Johnson & Johnson (60%), Merck & Co. (20%)', utilization: 80, status: 'Optimal', department: 'Database' },
    { name: 'Elena Rostova', role: 'Business Analyst', allocation: 'Roche Holding (90%)', utilization: 90, status: 'Optimal', department: 'Strategy' },
    { name: 'David Vance', role: 'Creative Director', allocation: 'AstraZeneca (110%)', utilization: 110, status: 'Over-utilized', department: 'Creative' },
    { name: 'Marcus Aurelius', role: 'QA Automation Engineer', allocation: 'Pfizer Inc. (40%)', utilization: 40, status: 'Under-utilized', department: 'Quality Assurance' },
    { name: 'Priya Sharma', role: 'Regulatory Consultant', allocation: 'Merck & Co. (50%), Pfizer Inc. (50%)', utilization: 100, status: 'Optimal', department: 'Regulatory' }
  ];

  const uniqueDepts = ['All', ...new Set(resources.map(r => r.department))];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || r.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalHeadcount = resources.length;
  const avgUtilization = Math.round(resources.reduce((acc, r) => acc + r.utilization, 0) / totalHeadcount);
  const overUtilizedCount = resources.filter(r => r.utilization > 100).length;
  const underUtilizedCount = resources.filter(r => r.utilization < 70).length;

  return (
    <div className="page-container">
      <PageHeader 
        title="Resource Utilization & Capacity" 
        subtitle="Manage delivery headcount workloads, capability allocation ratios, and operational efficiency." 
      />

      {/* Filter and Search Bar */}
      <div className="filter-bar" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
        <div className="filter-group" style={{ flex: 1, minWidth: '240px' }}>
          <label htmlFor="resource-search">Search Staff</label>
          <input
            id="resource-search"
            type="text"
            placeholder="Search by name or role..."
            className="filter-select"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group" style={{ minWidth: '180px' }}>
          <label htmlFor="dept-filter">Department</label>
          <select
            id="dept-filter"
            className="filter-select"
            style={{ width: '100%' }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="filter-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {(searchTerm !== '' || deptFilter !== 'All') && (
            <button 
              className="btn btn-outline" 
              onClick={() => { setSearchTerm(''); setDeptFilter('All'); }}
              style={{ padding: '8px 16px' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="card accent-border-top-primary">
          <div className="stat-card-header">
            <span className="stat-card-title">Staff Headcount</span>
            <div className="stat-card-icon-wrapper icon-blue">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-value">{totalHeadcount}</div>
          <div className="stat-card-footer">
            <span style={{ color: 'var(--text-muted)' }}>active specialists</span>
          </div>
        </div>

        <div className="card accent-border-top-secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Avg Utilization Rate</span>
            <div className="stat-card-icon-wrapper icon-cyan">
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-card-value">{avgUtilization}%</div>
          <div className="stat-card-footer">
            <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: '10px' }}>
              Target: 85%
            </span>
          </div>
        </div>

        <div className="card accent-border-top-pink">
          <div className="stat-card-header">
            <span className="stat-card-title">Capacity Status Alert</span>
            <div className="stat-card-icon-wrapper icon-pink">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="stat-card-value">
            {overUtilizedCount + underUtilizedCount > 0 ? `${overUtilizedCount} Over / ${underUtilizedCount} Under` : 'Optimal'}
          </div>
          <div className="stat-card-footer">
            <span style={{ color: 'var(--text-muted)' }}>attention required</span>
          </div>
        </div>
      </div>

      {/* Resources Table Card */}
      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Operational Staff Allocation Ledger</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time workload tracker by capability offering</p>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Core Role</th>
                <th>Department</th>
                <th>Active Project Allocations</th>
                <th>Utilization (%)</th>
                <th>Workload Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{res.name}</td>
                  <td>{res.role}</td>
                  <td>
                    <span className="badge badge-primary" style={{ opacity: 0.85 }}>{res.department}</span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{res.allocation}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', width: '80px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${Math.min(res.utilization, 100)}%`, 
                          height: '100%', 
                          backgroundColor: res.utilization > 100 ? '#ef4444' : res.utilization < 70 ? '#f59e0b' : '#10b981', 
                          borderRadius: '3px' 
                        }}></div>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>{res.utilization}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      res.status === 'Optimal' ? 'badge-success' : 
                      res.status === 'Over-utilized' ? 'badge-danger' : 'badge-warning'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredResources.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    No resource records match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

