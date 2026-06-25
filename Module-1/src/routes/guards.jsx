import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const RequireAuth = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const RequireGuest = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
