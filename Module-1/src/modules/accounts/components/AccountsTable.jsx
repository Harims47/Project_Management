import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

export const AccountsTable = ({ 
  accounts = [], 
  projects = [], 
  onView, 
  onEdit, 
  onDelete 
}) => {
  
  // Pre-calculate aggregates for each account
  const accountStats = React.useMemo(() => {
    const stats = {};
    accounts.forEach(acc => {
      const accProjects = projects.filter(p => p.clientId === acc.id);
      const creative = accProjects.filter(p => p.service === 'Creative').length;
      const digital = accProjects.filter(p => p.service === 'Digital').length;
      const research = accProjects.filter(p => p.service === 'Research').length;
      const video = accProjects.filter(p => p.service === 'Video').length;
      const total = accProjects.length;
      const revenue = accProjects.reduce((sum, p) => sum + p.revenue, 0);

      stats[acc.id] = { creative, digital, research, video, total, revenue };
    });
    return stats;
  }, [accounts, projects]);

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-150 dark:border-gray-850 bg-white dark:bg-brandDark-card shadow-sm text-left">
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none">
                Account Name
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none">
                Global Lead
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none">
                Region
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none text-center bg-indigo-50/20 dark:bg-indigo-900/5">
                Creative
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none text-center bg-sky-50/20 dark:bg-sky-900/5">
                Digital
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none text-center bg-emerald-50/20 dark:bg-emerald-900/5">
                Research
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none text-center bg-rose-50/20 dark:bg-rose-900/5">
                Video
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none text-center font-black">
                Total Projects
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none text-right">
                Revenue
              </th>
              <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wide text-xs select-none text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {accounts.map(acc => {
              const stats = accountStats[acc.id] || { creative: 0, digital: 0, research: 0, video: 0, total: 0, revenue: 0 };
              return (
                <tr 
                  key={acc.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors cursor-pointer"
                  onClick={() => onView(acc)}
                >
                  <td className="px-6 py-4 font-black text-primary dark:text-primary-light hover:underline">
                    {acc.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-semibold">
                    {acc.globalLead}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">
                    {acc.region}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/5">
                    {stats.creative}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-sky-600 dark:text-sky-400 bg-sky-50/10 dark:bg-sky-950/5">
                    {stats.digital}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/10 dark:bg-emerald-950/5">
                    {stats.research}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-rose-600 dark:text-rose-400 bg-rose-50/10 dark:bg-rose-950/5">
                    {stats.video}
                  </td>
                  <td className="px-6 py-4 text-center font-black text-gray-800 dark:text-gray-200">
                    {stats.total}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-gray-100">
                    ${stats.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onView(acc)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-primary-light hover:underline"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => onEdit(acc)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                        title="Edit Account"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(acc)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-accent"
                        title="Delete Account"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountsTable;
