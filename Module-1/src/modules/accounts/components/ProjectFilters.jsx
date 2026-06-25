import React from 'react';
import { Card } from '../../../components/cards/DashboardCards';
import { Filter, RotateCcw, Search, Calendar, FileText } from 'lucide-react';
import { Input, Select, TextArea } from '../../../components/forms/FormControls';

export const ProjectFilters = ({ 
  filters, 
  onFilterChange, 
  onResetFilters,
  managersList = [],
  clientsList = [],
  servicesList = [],
  statusesList = []
}) => {

  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="p-5 text-left mb-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Filter className="h-4 w-4" />
          <span>Advanced Project Filter Dashboard</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-gray-400 hover:text-primary hover:underline flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {/* Search */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Search Text</label>
          <div className="relative flex items-center w-full mt-1">
            <Search className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              placeholder="Code, Name, Manager..."
              className="w-full py-2 pl-11 pr-4 rounded-lg border text-sm transition-all bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Multi Project Code Search */}
        <div className="flex flex-col gap-1 w-full text-left md:col-span-2 lg:col-span-1">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Multi Project Codes</label>
          <div className="relative flex items-center w-full mt-1">
            <FileText className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              type="text"
              value={filters.multiSearch || ''}
              onChange={(e) => handleChange('multiSearch', e.target.value)}
              placeholder="e.g. CR-1001, CR-1002"
              className="w-full py-2 pl-11 pr-4 rounded-lg border text-sm transition-all bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Capability / Service */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Service Line</label>
          <select
            value={filters.service || ''}
            onChange={(e) => handleChange('service', e.target.value)}
            className="w-full mt-1 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-sm text-gray-800 dark:text-gray-200 outline-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">All Capability Lines</option>
            {servicesList.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Delivery Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full mt-1 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-sm text-gray-800 dark:text-gray-200 outline-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            {statusesList.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>

        {/* Manager */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Project Manager</label>
          <select
            value={filters.manager || ''}
            onChange={(e) => handleChange('manager', e.target.value)}
            className="w-full mt-1 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-sm text-gray-800 dark:text-gray-200 outline-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">All Managers</option>
            {managersList.map(mgr => <option key={mgr} value={mgr}>{mgr}</option>)}
          </select>
        </div>

        {/* Client Account */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Client Account</label>
          <select
            value={filters.client || ''}
            onChange={(e) => handleChange('client', e.target.value)}
            className="w-full mt-1 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-sm text-gray-800 dark:text-gray-200 outline-none cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">All Client Accounts</option>
            {clientsList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Date range - Start */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Start Date From</label>
          <div className="relative flex items-center w-full mt-1">
            <Calendar className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full py-2 pl-11 pr-4 rounded-lg border text-sm transition-all bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 outline-none border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Date range - End */}
        <div className="flex flex-col gap-1 w-full text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">End Date To</label>
          <div className="relative flex items-center w-full mt-1">
            <Calendar className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full py-2 pl-11 pr-4 rounded-lg border text-sm transition-all bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 outline-none border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
      
      {/* Help tooltip for multi search */}
      <div className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold mt-3.5 leading-relaxed bg-gray-50 dark:bg-gray-900/40 p-2.5 rounded border border-gray-150 dark:border-gray-850">
        💡 <strong>Tip:</strong> You can search for multiple project codes simultaneously by entering them in the "Multi Project Codes" field separated by commas or spaces (e.g., <code>CR-1001, CR-1002, DG-1025</code>).
      </div>
    </Card>
  );
};

export default ProjectFilters;
