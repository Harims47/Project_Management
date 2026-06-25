import React, { useState } from 'react';
import { Card } from '../../../components/cards/DashboardCards';
import { History, ChevronDown, ChevronUp, FileText, CheckCircle2, XCircle } from 'lucide-react';

export const ImportHistoryPanel = ({ history = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="p-4 text-left mb-6 border-l-4 border-gray-400 bg-gray-50/20">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200 text-sm">
          <History className="h-4.5 w-4.5 text-gray-450" />
          <span>Excel Import Audit Trail History ({history.length} Logs)</span>
        </div>
        <div>
          {isOpen ? <ChevronUp className="h-4.5 w-4.5 text-gray-400" /> : <ChevronDown className="h-4.5 w-4.5 text-gray-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 border-t border-gray-150 dark:border-gray-850 pt-3 animate-fadeIn">
          {history.length > 0 ? (
            <div className="w-full overflow-hidden rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-150 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">File Name</th>
                      <th className="px-4 py-2.5">Uploaded Date/Time</th>
                      <th className="px-4 py-2.5 text-center">Total Rows</th>
                      <th className="px-4 py-2.5 text-center">Valid Rows</th>
                      <th className="px-4 py-2.5 text-center">Errors Count</th>
                      <th className="px-4 py-2.5 text-right">Import Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-850 font-medium">
                    {history.map((log) => {
                      const isSuccess = log.status === 'Success';
                      return (
                        <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                          <td className="px-4 py-3 font-bold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="truncate max-w-[150px] sm:max-w-[250px]">{log.fileName}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{log.uploadedDate}</td>
                          <td className="px-4 py-3 text-center font-bold text-gray-700 dark:text-gray-300">{log.totalRecords}</td>
                          <td className="px-4 py-3 text-center font-bold text-emerald-600 dark:text-emerald-450">{log.validRecords}</td>
                          <td className="px-4 py-3 text-center font-bold text-accent">{log.invalidRecords}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {isSuccess ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-405 dark:text-gray-505 font-bold italic py-4 text-center">
              💡 No import events recorded during the current browser session.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default ImportHistoryPanel;
