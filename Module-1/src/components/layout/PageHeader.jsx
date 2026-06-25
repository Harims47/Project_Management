import React from 'react';
import Breadcrumb from './Breadcrumb';

export const PageHeader = ({ title, subtitle, breadcrumbs = [], actions = null }) => {
  return (
    <div className="flex flex-col gap-2 mb-8 select-none">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-1">
        <div className="flex flex-col gap-1 text-left">
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
