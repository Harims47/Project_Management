import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="auth-split-container">
      {/* LEFT FORM PANEL (dynamic content) */}
      <div className="auth-left-form-panel">
        <div className="auth-form-inner-wrapper">
          <Outlet />
        </div>
      </div>

      {/* RIGHT PREVIEW PANEL (static illustration mockup) */}
      <div className="auth-right-media-panel">
        <div className="media-panel-gradient-overlay"></div>
        <div className="media-panel-content-inner">
          <h2 className="media-panel-title">All-in-One Client Portfolio Management Platform</h2>
          <p className="media-panel-desc">
            Simplify your daily operations and grow your accounts — Easily manage client details, project timelines, service catalogs, revenues, escalations, and active ratings — everything in one smart portal.
          </p>

          {/* Shared Floating UI Mockup Illustration */}
          <div className="ui-mockup-wrapper">
            <div className="ui-mockup-header-row">
              <div className="ui-mockup-dots">
                <span className="dot-red"></span>
                <span className="dot-yellow"></span>
                <span className="dot-green"></span>
              </div>
              <div className="ui-mockup-title">CPMS Dashboard Overview</div>
            </div>
            
            <div className="ui-mockup-body">
              {/* Mini Stats row */}
              <div className="ui-mockup-stats-row">
                <div className="ui-mockup-stat-card">
                  <div className="ui-mockup-stat-lbl">Income</div>
                  <div className="ui-mockup-stat-val">$1,215,153.00</div>
                </div>
                <div className="ui-mockup-stat-card">
                  <div className="ui-mockup-stat-lbl">Expense</div>
                  <div className="ui-mockup-stat-val">$321,153.00</div>
                </div>
                <div className="ui-mockup-stat-card">
                  <div className="ui-mockup-stat-lbl">Active Target</div>
                  <div className="ui-mockup-stat-val">79.5% Met</div>
                </div>
              </div>

              {/* Central Graph Area */}
              <div className="ui-mockup-graph-card">
                <div className="ui-mockup-graph-header">
                  <div>
                    <div className="ui-mockup-stat-lbl">Progress Analytics</div>
                    <div className="ui-mockup-graph-val">$79,556.65</div>
                  </div>
                  <span className="ui-mockup-badge">Yearly</span>
                </div>
                {/* Visual Chart Bars Mock */}
                <div className="ui-mockup-chart-bars">
                  <div className="chart-bar" style={{ height: '35px' }}></div>
                  <div className="chart-bar" style={{ height: '55px' }}></div>
                  <div className="chart-bar" style={{ height: '78px' }}></div>
                  <div className="chart-bar" style={{ height: '42px' }}></div>
                  <div className="chart-bar" style={{ height: '90px' }}></div>
                  <div className="chart-bar" style={{ height: '62px' }}></div>
                  <div className="chart-bar" style={{ height: '80px' }}></div>
                </div>
              </div>

              {/* Floating Cost Analytics Overlay card */}
              <div className="ui-mockup-floating-card animate-float">
                <div className="floating-card-title">Cost Analytics</div>
                <div className="floating-card-pie-row">
                  <div className="floating-card-pie">
                    <div className="pie-inner-text">$79K</div>
                  </div>
                  <div className="floating-card-legend">
                    <div className="legend-item"><span className="legend-dot" style={{ backgroundColor: 'var(--primary)' }}></span> Salary (20%)</div>
                    <div className="legend-item"><span className="legend-dot" style={{ backgroundColor: 'var(--secondary)' }}></span> Tech (52%)</div>
                    <div className="legend-item"><span className="legend-dot" style={{ backgroundColor: 'var(--accent)' }}></span> Rent (20%)</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
