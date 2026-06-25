import React from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  HelpCircle, 
  ChevronDown 
} from 'lucide-react';

const Topbar = ({ 
  isMobileOpen, 
  setIsMobileOpen, 
  darkMode, 
  setDarkMode 
}) => {
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        {/* Mobile menu hamburger toggle */}
        <button 
          className="topbar-mobile-menu-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} />
        </button>

        {/* Global Search Bar */}
        <div className="topbar-search-wrapper">
          <Search className="topbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search accounts, projects..." 
            className="topbar-search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* Help Center */}
        <button className="topbar-btn" title="Documentation & Help">
          <HelpCircle size={20} />
        </button>

        {/* Light/Dark Mode Switcher */}
        <button 
          className="topbar-btn" 
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Center */}
        <button className="topbar-btn" title="Notifications">
          <Bell size={20} />
          <span className="topbar-btn-badge">3</span>
        </button>

        {/* Separator line */}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>

        {/* User Profile Badge */}
        <div className="topbar-profile">
          <div className="topbar-profile-avatar">
            JD
          </div>
          <div className="topbar-profile-info" style={{ display: 'none', md: 'flex' }}>
            <span className="topbar-profile-name">Jonathan Doe</span>
            <span className="topbar-profile-status">Portfolio Director</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
