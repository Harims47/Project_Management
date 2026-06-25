import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const Sidebar = ({
  activePage,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navigate = useNavigate();

  // Navigation Menu Items configuration
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'accounts', label: 'Accounts', icon: Users, path: '/accounts' },
    // { id: 'projects', label: 'Projects', icon: Briefcase, path: '/projects' },
    // { id: 'services', label: 'Services', icon: Layers, path: '/services' },
    // { id: 'revenue', label: 'Revenue', icon: DollarSign, path: '/revenue' },
    // { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
    // { id: 'achievements', label: 'Achievements', icon: Trophy, path: '/achievements' },
    { id: 'escalations', label: 'Escalations', icon: AlertOctagon, path: '/escalations' },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, path: '/testimonials' }
  ];

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile background overlay */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'show' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      {/* Main Sidebar Panel */}
      <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>

        {/* Sidebar Header Logo Section */}
        <div className="sidebar-header">
          {isCollapsed ? (
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">
                i
              </div>
            </div>
          ) : (
            <BrandLogo size="small" className="sidebar-brand-logo" />
          )}

          {/* Collapse Button (Visible on desktop) */}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ display: 'flex' }}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Navigation Menu List */}
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <li key={item.id} className="sidebar-item">
                <Link
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  title={item.label}
                  style={{ display: 'flex' }}
                >
                  <Icon className="sidebar-icon" />
                  <span className="sidebar-link-text">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Sidebar User Footer */}
        <div
          className="sidebar-footer"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <div className="sidebar-avatar">
              JD
            </div>
            {!isCollapsed && (
              <div className="sidebar-user-info" style={{ whiteSpace: 'nowrap' }}>
                <span className="sidebar-username">Jonathan Doe</span>
                <span className="sidebar-user-role">Director</span>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              className="sidebar-toggle-btn"
              onClick={handleSignOut}
              title="Sign Out"
              style={{ border: 'none', background: 'transparent' }}
            >
              <LogOut size={16} color="var(--accent)" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
