import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';

export const ProjectTable = ({ 
  projects = [], 
  onEdit, 
  onDelete 
}) => {
  // Sorting local state
  const [sortField, setSortField] = useState('projectCode');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  
  // Pagination local state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Sorting logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // reset to page 1
  };

  const sortedProjects = useMemo(() => {
    const data = [...projects];
    if (!sortField) return data;

    data.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle null/undefined
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      // Numeric comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      // String comparison
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [projects, sortField, sortDirection]);

  // Pagination logic
  const totalItems = sortedProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Clamp page
  const activePage = Math.min(currentPage, totalPages);
  
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const paginatedProjects = useMemo(() => {
    return sortedProjects.slice(startIndex, endIndex);
  }, [sortedProjects, startIndex, endIndex]);

  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-3.5 w-3.5 text-primary" /> 
      : <ChevronDown className="h-3.5 w-3.5 text-primary" />;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Table Main Wrapper */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-150 dark:border-gray-850 bg-white dark:bg-brandDark-card shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/30">
                <th 
                  onClick={() => handleSort('projectCode')}
                  className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none cursor-pointer hover:bg-gray-100/30"
                >
                  <div className="flex items-center gap-1">
                    Code {renderSortIndicator('projectCode')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('projectName')}
                  className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none cursor-pointer hover:bg-gray-100/30"
                >
                  <div className="flex items-center gap-1">
                    Project Name {renderSortIndicator('projectName')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('clientName')}
                  className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none cursor-pointer hover:bg-gray-100/30"
                >
                  <div className="flex items-center gap-1">
                    Client {renderSortIndicator('clientName')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('manager')}
                  className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none cursor-pointer hover:bg-gray-100/30"
                >
                  <div className="flex items-center gap-1">
                    Manager {renderSortIndicator('manager')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('service')}
                  className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none cursor-pointer hover:bg-gray-100/30"
                >
                  <div className="flex items-center gap-1">
                    Capability {renderSortIndicator('service')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('status')}
                  className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none cursor-pointer hover:bg-gray-100/30"
                >
                  <div className="flex items-center gap-1">
                    Status {renderSortIndicator('status')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('revenue')}
                  className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none cursor-pointer hover:bg-gray-100/30 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    Revenue {renderSortIndicator('revenue')}
                  </div>
                </th>
                <th className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none">
                  Dates
                </th>
                <th className="px-5 py-3.5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs select-none text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedProjects.length > 0 ? (
                paginatedProjects.map((p) => (
                  <tr 
                    key={p.id}
                    className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold text-primary dark:text-primary-light">
                      {p.projectCode}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-gray-200">
                      <div className="flex flex-col">
                        <span>{p.projectName}</span>
                        {p.remarks && (
                          <span className="text-[10px] text-gray-400 font-normal mt-0.5 line-clamp-1">
                            {p.remarks}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium">
                      {p.clientName}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-medium">
                      {p.manager}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 font-medium">
                      {p.service}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-900 dark:text-gray-100 font-black text-right">
                      ${p.revenue.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 text-xs font-semibold whitespace-nowrap">
                      <div>S: {p.startDate}</div>
                      <div>E: {p.endDate}</div>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => onEdit(p)}
                          title="Edit Project"
                          className="p-1 text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p)}
                          title="Delete Project"
                          className="p-1 text-gray-400 hover:text-accent transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-gray-400 dark:text-gray-500 font-semibold italic">
                    ⚠️ No project records matching filters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Bar */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 px-1 mt-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-gray-800 dark:text-gray-200">{startIndex + 1}</strong> to{' '}
              <strong className="text-gray-800 dark:text-gray-200">{endIndex}</strong> of{' '}
              <strong className="text-gray-800 dark:text-gray-200">{totalItems}</strong> records
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <div className="flex items-center gap-1.5">
              Show
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 rounded border border-gray-200 dark:border-gray-850 bg-white dark:bg-brandDark-card text-gray-700 dark:text-gray-300 outline-none text-xs cursor-pointer focus:border-primary"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="flex items-center justify-center p-1.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>
              Page <strong className="text-gray-850 dark:text-gray-250">{activePage}</strong> of{' '}
              <strong className="text-gray-850 dark:text-gray-250">{totalPages}</strong>
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={activePage === totalPages}
              className="flex items-center justify-center p-1.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;
