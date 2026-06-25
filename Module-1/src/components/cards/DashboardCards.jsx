import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// 1. Basic Content Panel Card
export const Card = ({
  children,
  className = '',
  accentColor = '', // 'primary', 'secondary', 'accent', 'green'
  interactive = false,
  ...props
}) => {
  const accentClasses = {
    primary: 'border-t-4 border-primary',
    secondary: 'border-t-4 border-secondary',
    accent: 'border-t-4 border-accent',
    green: 'border-t-4 border-emerald-500',
  };

  return (
    <div
      className={`rounded-xl bg-white dark:bg-brandDark-card border border-gray-150 dark:border-gray-850 p-6 shadow-sm transition-all duration-300
        ${accentColor ? accentClasses[accentColor] : ''}
        ${interactive ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 2. Standard Statistic Card
export const StatisticCard = ({
  title,
  value,
  icon: Icon,
  trend, // { value: '+12%', type: 'up' | 'down' }
  subtitle,
  className = '',
  accentColor,
}) => {
  return (
    <Card className={className} accentColor={accentColor}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            {value}
          </span>
        </div>
        
        {Icon && (
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-850 text-gray-500 dark:text-gray-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="flex items-center gap-2 mt-4 text-xs font-semibold">
          {trend && (
            <span className={`inline-flex items-center gap-0.5 ${trend.type === 'up' ? 'text-emerald-500' : 'text-accent'}`}>
              {trend.type === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-gray-400 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

// 3. High-Fidelity KPI Card (featuring status indicators / mini progress visualizer)
export const KPICard = ({
  title,
  value,
  target,
  percentage,
  trend,
  className = '',
  status = 'stable', // 'success', 'warning', 'danger', 'stable'
}) => {
  const statusColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-accent',
    stable: 'bg-primary',
  };

  const statusBadges = {
    success: 'text-emerald-500 bg-emerald-500/10',
    warning: 'text-amber-500 bg-amber-500/10',
    danger: 'text-accent bg-accent/10',
    stable: 'text-primary bg-primary/10',
  };

  return (
    <Card className={className} interactive={true}>
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusBadges[status]}`}>
            {status}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            {value}
          </span>
          {target && (
            <span className="text-xs text-gray-400 font-medium">
              Target: {target}
            </span>
          )}
        </div>

        {/* Progress Bar visual indicator */}
        {percentage !== undefined && (
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-400">Progress</span>
              <span className="text-gray-800 dark:text-gray-200">{percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${statusColors[status]}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {trend && (
          <div className="flex items-center gap-1.5 text-xs mt-0.5 font-bold">
            <span className={`inline-flex items-center gap-0.5 ${trend.type === 'up' ? 'text-emerald-500' : 'text-accent'}`}>
              {trend.type === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {trend.value}
            </span>
            <span className="text-gray-400 font-normal">vs base period</span>
          </div>
        )}
      </div>
    </Card>
  );
};
