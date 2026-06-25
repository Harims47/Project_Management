import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const location = useLocation();
  
  // Guard check: redirect to /login if not authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Detect system default color scheme preference
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to document node
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Derive active link ID from router location
  const getActivePageId = () => {
    const path = location.pathname.substring(1); // strip leading slash
    return path || 'dashboard';
  };

  return (
    <div className="app-container">
      {/* Collapsible Sidebar */}
      <Sidebar 
        activePage={getActivePageId()} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Pane */}
      <main className="app-main">
        {/* Navigation Topbar */}
        <Topbar 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Dynamic Outlet Routing Panel */}
        <div className="app-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
