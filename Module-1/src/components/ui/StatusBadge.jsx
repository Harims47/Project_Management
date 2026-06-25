import React from 'react';

export const StatusBadge = ({ status = '', className = '' }) => {
  if (!status) return null;
  const normStatus = status.trim().toLowerCase();
  
  let badgeStyles = 'badge-primary'; // default blue
  
  if (
    normStatus === 'active' || 
    normStatus === 'on track' || 
    normStatus === 'completed' || 
    normStatus === 'success' ||
    normStatus === 'green'
  ) {
    badgeStyles = 'badge-success'; // green
  } else if (
    normStatus === 'pending' || 
    normStatus === 'at risk' || 
    normStatus === 'warning' ||
    normStatus === 'amber'
  ) {
    badgeStyles = 'badge-warning'; // yellow/orange
  } else if (
    normStatus === 'inactive' || 
    normStatus === 'blocked' || 
    normStatus === 'critical' || 
    normStatus === 'danger' || 
    normStatus === 'red'
  ) {
    badgeStyles = 'badge-danger'; // red
  } else if (
    normStatus === 'major'
  ) {
    badgeStyles = 'bg-amber-600/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400';
  } else if (
    normStatus === 'minor' || 
    normStatus === 'info'
  ) {
    badgeStyles = 'badge-secondary'; // cyan/blue-light
  }

  return (
    <span className={`badge ${badgeStyles} font-bold text-xs uppercase tracking-wider select-none ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
