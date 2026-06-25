import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth, RequireGuest } from './guards';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../components/Login';
import Signup from '../components/Signup';
import ForgotPassword from '../components/ForgotPassword';

// Dynamic feature module views
import DashboardView from '../modules/dashboard/views/DashboardView';
import AccountsView from '../modules/accounts/views/AccountsView';
import AccountCreateView from '../modules/accounts/views/AccountCreateView';
import AccountEditView from '../modules/accounts/views/AccountEditView';
import AccountDetailView from '../modules/accounts/views/AccountDetailView';

// Legacy components folder views
import {
  ProjectsView,
  ServicesView,
  RevenueView,
  EventsView,
  AchievementsView,
  EscalationsView,
  TestimonialsView
} from '../components/Pages';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Shell */}
      <Route element={<RequireGuest><AuthLayout /></RequireGuest>}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Private Application Shell */}
      <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
        {/* Redirect base root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Modular Features */}
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/accounts" element={<AccountsView />} />
        <Route path="/accounts/create" element={<AccountCreateView />} />
        <Route path="/accounts/:id" element={<AccountDetailView />} />
        <Route path="/accounts/:id/edit" element={<AccountEditView />} />

        {/* Legacy Views */}
        <Route path="/projects" element={<ProjectsView />} />
        <Route path="/services" element={<ServicesView />} />
        <Route path="/revenue" element={<RevenueView />} />
        <Route path="/events" element={<EventsView />} />
        <Route path="/achievements" element={<AchievementsView />} />
        <Route path="/escalations" element={<EscalationsView />} />
        <Route path="/testimonials" element={<TestimonialsView />} />
      </Route>

      {/* Wildcard redirects */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
