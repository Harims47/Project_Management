import React from 'react';
import { Loader2, Inbox, AlertOctagon } from 'lucide-react';
import { Button } from '../ui/Button';

// 1. Loading Spinner / Overlay Component
export const Loader = ({
  message = 'Loading dashboard details...',
  size = 'md', // sm, md, lg
  fullPage = false,
}) => {
  const spinnerSizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const wrapperClasses = fullPage 
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 dark:bg-brandDark/70 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center p-8 w-full';

  return (
    <div className={wrapperClasses}>
      <Loader2 className={`animate-spin text-primary ${spinnerSizes[size]} flex-shrink-0`} />
      {message && (
        <p className="mt-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
};

// 2. Pulse Skeleton Loader (for tables or forms)
export const SkeletonLoader = ({
  rows = 4,
  columns = 1,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3.5 w-full animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4 w-full">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <div 
              key={cIdx} 
              className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg flex-1"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// 3. Reusable Empty State component
export const EmptyState = ({
  title = 'No records found',
  description = 'There are no active portfolio details for this filter selection.',
  icon: Icon = Inbox,
  actionLabel,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-xl w-full bg-gray-50/20 dark:bg-gray-900/5">
      <div className="p-3.5 rounded-full bg-gray-100 dark:bg-gray-850 text-gray-400 dark:text-gray-500 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onActionClick && (
        <Button onClick={onActionClick} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// 4. Reusable Error Boundary State component
export const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error loading these portfolio parameters. Please try again.',
  error,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-accent/20 rounded-xl w-full bg-accent/5">
      <div className="p-3.5 rounded-full bg-accent/10 text-accent mb-4 animate-shake">
        <AlertOctagon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-5 leading-relaxed">
        {error?.message || description}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
};
