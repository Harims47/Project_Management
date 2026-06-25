import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsUpDown, 
  ChevronUp, 
  ChevronDown, 
  SlidersHorizontal,
  Search
} from 'lucide-react';

export const DataTable = ({
  columns,
  data,
  placeholder = 'No results found.',
  searchPlaceholder = 'Search all columns...',
  enableGlobalSearch = true,
  enableColumnToggle = true,
  initialPageSize = 10,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Global Filter Search */}
        {enableGlobalSearch && (
          <div className="relative flex items-center max-w-md w-full">
            <Search className="absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full py-2 pl-9 pr-4 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        )}

        {/* Column Visibility Control */}
        {enableColumnToggle && (
          <div className="relative group">
            <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <SlidersHorizontal className="h-4 w-4" />
              Columns
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block z-50 min-w-[150px] p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card shadow-lg animate-fadeIn">
              <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                <label className="flex items-center gap-2 px-1.5 py-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Toggle Columns
                </label>
                {table.getAllLeafColumns().map(column => {
                  if (column.id === 'actions') return null;
                  return (
                    <label key={column.id} className="flex items-center gap-2 px-1.5 py-1 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer capitalize">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4 w-4"
                      />
                      {column.id}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Table Element */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card">
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-1.5 cursor-pointer ${
                            header.column.getCanSort() ? 'hover:text-gray-900 dark:hover:text-gray-100' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: <ChevronUp className="h-3.5 w-3.5" />,
                                desc: <ChevronDown className="h-3.5 w-3.5" />,
                              }[header.column.getIsSorted()] ?? <ChevronsUpDown className="h-3.5 w-3.5" />}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-150 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 last:border-0 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 text-gray-700 dark:text-gray-200 font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 font-medium">
                    {placeholder}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Pagination Component */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 px-2">
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <span>
            Page <strong className="text-gray-700 dark:text-gray-200">{table.getState().pagination.pageIndex + 1}</strong> of{' '}
            <strong className="text-gray-700 dark:text-gray-200">{table.getPageCount()}</strong>
          </span>
          <span className="text-gray-300 dark:text-gray-750">|</span>
          <div className="flex items-center gap-1.5">
            Show
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="py-1 px-2.5 rounded border border-gray-200 dark:border-gray-850 bg-white dark:bg-brandDark-card text-gray-700 dark:text-gray-200 outline-none text-sm cursor-pointer"
            >
              {[5, 10, 20, 30, 45].map(size => (
                <option key={size} value={size}>
                  {size} rows
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-gray-850 bg-white dark:bg-brandDark-card text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 disabled:opacity-50 disabled:pointer-events-none transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center justify-center p-2 rounded-lg border border-gray-200 dark:border-gray-850 bg-white dark:bg-brandDark-card text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 disabled:opacity-50 disabled:pointer-events-none transition-all"
            title="Next Page"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
