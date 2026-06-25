import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 select-none">
      <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-primary dark:hover:text-primary-light transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700" />
          {item.path ? (
            <Link to={item.path} className="hover:text-primary dark:hover:text-primary-light transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 dark:text-gray-200 font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
