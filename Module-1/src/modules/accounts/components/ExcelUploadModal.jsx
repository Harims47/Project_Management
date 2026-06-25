import React, { useState, useRef, useMemo } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Upload, FileText, CheckCircle2, AlertTriangle, X, Play, Loader2, ArrowUpDown, ChevronDown, ChevronUp, ChevronsUpDown, Download } from 'lucide-react';
import { parseExcelFile } from '../utils/excel/excelParser';
import { exportValidationErrorsToExcel } from '../utils/excel/excelExporter';

export const ExcelUploadModal = ({
  isOpen,
  onClose,
  existingProjects = [],
  onImportConfirm
}) => {
  const fileInputRef = useRef(null);

  // States
  const [file, setFile] = useState(null);
  const [importMode, setImportMode] = useState('append');
  
  // Progress states
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');

  // Results states
  const [results, setResults] = useState(null); // { success, errors, validRows, summary }
  
  // Error Grid Filters / Sorting
  const [errorSearch, setErrorSearch] = useState('');
  const [errorSortField, setErrorSortField] = useState('row');
  const [errorSortDir, setErrorSortDir] = useState('asc'); // 'asc' | 'desc'

  const handleReset = () => {
    setFile(null);
    setResults(null);
    setIsValidating(false);
    setProgress(0);
    setProgressMsg('');
    setErrorSearch('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      alert('❌ Invalid file format! Please upload only .xlsx or .xls spreadsheets.');
      return;
    }
    setFile(selectedFile);
    runParsingFlow(selectedFile);
  };

  // Simulated validation progress bar pipeline
  const runParsingFlow = (selectedFile) => {
    setIsValidating(true);
    setProgress(15);
    setProgressMsg('Reading Workbook...');

    setTimeout(() => {
      setProgress(40);
      setProgressMsg('Parsing Worksheets...');
      
      setTimeout(() => {
        setProgress(70);
        setProgressMsg('Running Validation Engine...');
        
        parseExcelFile(selectedFile, existingProjects, (msg, prg) => {
          // Callback inside parser for live updates
          setProgress(prg);
          setProgressMsg(msg);
        })
        .then(parseResults => {
          setTimeout(() => {
            setProgress(100);
            setProgressMsg('Complete!');
            setIsValidating(false);
            setResults(parseResults);
          }, 300);
        })
        .catch(err => {
          setIsValidating(false);
          setProgress(0);
          setProgressMsg('');
          alert('❌ Error parsing Excel workbook: ' + err.message);
        });

      }, 400);
    }, 400);
  };

  // Filter and sort validation errors
  const processedErrors = useMemo(() => {
    if (!results || !results.errors) return [];

    let errs = [...results.errors];

    // Search query
    if (errorSearch.trim()) {
      const q = errorSearch.toLowerCase().trim();
      errs = errs.filter(e => 
        String(e.sheet).toLowerCase().includes(q) ||
        String(e.row).toLowerCase().includes(q) ||
        String(e.column).toLowerCase().includes(q) ||
        String(e.errorCategory).toLowerCase().includes(q) ||
        String(e.errorDescription).toLowerCase().includes(q)
      );
    }

    // Sort rows
    errs.sort((a, b) => {
      let valA = a[errorSortField];
      let valB = b[errorSortField];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return errorSortDir === 'asc' ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return errorSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return errorSortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return errs;
  }, [results, errorSearch, errorSortField, errorSortDir]);

  const handleSortErrors = (field) => {
    if (errorSortField === field) {
      setErrorSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setErrorSortField(field);
      setErrorSortDir('asc');
    }
  };

  const handleExportErrors = () => {
    if (results && results.errors.length > 0) {
      exportValidationErrorsToExcel(results.errors, `${file.name.split('.')[0]}_errors`);
    }
  };

  const handleConfirmImport = () => {
    if (results && results.success) {
      onImportConfirm(results.validRows, file.name, results.summary);
      onClose();
      handleReset();
    }
  };

  const renderSortArrow = (field) => {
    if (errorSortField !== field) return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />;
    return errorSortDir === 'asc' 
      ? <ChevronUp className="h-3.5 w-3.5 text-accent" /> 
      : <ChevronDown className="h-3.5 w-3.5 text-accent" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        handleReset();
      }}
      title="Upload and Validate Excel Workbook"
      size="xl"
    >
      <div className="flex flex-col gap-5 text-left">
        
        {/* Step A: Choose File (when no file loaded yet) */}
        {!file && !isValidating && (
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-250">
                Drag and drop your spreadsheet here, or <span className="text-primary hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-1">
                Supports Excel Workbooks (.xlsx, .xls) up to 10MB
              </p>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>
        )}

        {/* Step B: Progress Bar Panel */}
        {isValidating && (
          <div className="border border-gray-150 dark:border-gray-850 rounded-xl p-8 flex flex-col gap-4 text-center items-center justify-center bg-gray-50/50 dark:bg-gray-900/10">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div className="flex flex-col gap-1.5 w-full max-w-md">
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>{progressMsg}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step C: Results Summary & Details Panel */}
        {file && results && (
          <div className="flex flex-col gap-5">
            {/* File info card with remove/replace */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-150 dark:border-gray-850">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px] sm:max-w-md">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    Size: {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-gray-400 hover:text-accent flex items-center gap-1 hover:underline"
              >
                <X className="h-4 w-4" /> Replace
              </button>
            </div>

            {/* Import options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Import Strategy Mode</label>
                <select
                  value={importMode}
                  onChange={(e) => setImportMode(e.target.value)}
                  className="mt-1 w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-sm outline-none cursor-pointer focus:border-primary"
                >
                  <option value="append">Append Records (Add new projects to session)</option>
                  <option value="replace" disabled>Replace Existing Records (Future - Disabled)</option>
                  <option value="skip" disabled>Skip Existing Records (Future - Disabled)</option>
                </select>
              </div>
            </div>

            {/* Validation Dashboard Metrics */}
            <div>
              <h4 className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2.5">
                Validation Summary Panel
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3 bg-white dark:bg-brandDark-card border border-gray-150 dark:border-gray-850 rounded-lg text-left">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Rows</span>
                  <span className="text-2xl font-black mt-1 text-gray-900 dark:text-gray-100">
                    {results.summary.totalRecords}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-brandDark-card border border-gray-150 dark:border-gray-850 rounded-lg text-left">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase block">Valid Rows</span>
                  <span className="text-2xl font-black mt-1 text-emerald-500">
                    {results.summary.validRecords}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-brandDark-card border border-gray-150 dark:border-gray-850 rounded-lg text-left">
                  <span className="text-[10px] text-accent font-bold uppercase block">Errors Found</span>
                  <span className="text-2xl font-black mt-1 text-accent">
                    {results.summary.invalidRecords}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-brandDark-card border border-gray-150 dark:border-gray-850 rounded-lg text-left">
                  <span className="text-[10px] text-amber-500 font-bold uppercase block">Duplicates</span>
                  <span className="text-2xl font-black mt-1 text-amber-500">
                    {results.summary.duplicateCount}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-brandDark-card border border-gray-150 dark:border-gray-850 rounded-lg text-left">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Empty Fields</span>
                  <span className="text-2xl font-black mt-1 text-gray-700 dark:text-gray-300">
                    {results.summary.emptyFieldsCount}
                  </span>
                </div>
              </div>
            </div>

            {/* CASE 1: Validation Fails - Render Error Table */}
            {!results.success && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-850 pt-4">
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-accent flex items-center gap-1.5">
                      <AlertTriangle className="h-4.5 w-4.5" />
                      Import Blocked: Errors Detected
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      The sheet contains {results.errors.length} validation errors. Fix them in your spreadsheet to import.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={Download} 
                    onClick={handleExportErrors}
                  >
                    Download Error List
                  </Button>
                </div>

                {/* Error Grid Controls */}
                <div className="relative flex items-center max-w-sm w-full mt-1.5">
                  <input
                    type="text"
                    value={errorSearch}
                    onChange={(e) => setErrorSearch(e.target.value)}
                    placeholder="Search errors list..."
                    className="w-full py-1.5 px-3 rounded border border-gray-200 dark:border-gray-850 text-xs bg-white dark:bg-brandDark-card outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Validation Grid */}
                <div className="w-full overflow-hidden rounded border border-gray-150 dark:border-gray-850 bg-white dark:bg-brandDark-card">
                  <div className="overflow-x-auto w-full max-h-[250px]">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 font-bold text-gray-500">
                        <tr>
                          <th onClick={() => handleSortErrors('sheet')} className="px-4 py-2 cursor-pointer select-none hover:bg-gray-100">
                            <div className="flex items-center gap-1">Sheet {renderSortArrow('sheet')}</div>
                          </th>
                          <th onClick={() => handleSortErrors('row')} className="px-4 py-2 cursor-pointer select-none hover:bg-gray-100">
                            <div className="flex items-center gap-1">Row {renderSortArrow('row')}</div>
                          </th>
                          <th onClick={() => handleSortErrors('column')} className="px-4 py-2 cursor-pointer select-none hover:bg-gray-100">
                            <div className="flex items-center gap-1">Column {renderSortArrow('column')}</div>
                          </th>
                          <th className="px-4 py-2">Invalid Value</th>
                          <th className="px-4 py-2">Category</th>
                          <th className="px-4 py-2">Description</th>
                          <th className="px-4 py-2">Suggested Resolution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-850 font-medium">
                        {processedErrors.length > 0 ? (
                          processedErrors.map((err, idx) => {
                            const isWarning = err.errorCategory === 'Duplicate Project Code' && err.errorDescription.includes('system');
                            const indicatorColor = isWarning ? 'text-amber-500 bg-amber-500/10' : 'text-accent bg-accent/10';
                            
                            return (
                              <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                <td className="px-4 py-2.5 font-bold">{err.sheet}</td>
                                <td className="px-4 py-2.5 font-black text-gray-800 dark:text-gray-300">{err.row}</td>
                                <td className="px-4 py-2.5 font-bold text-gray-600 dark:text-gray-400">{err.column}</td>
                                <td className="px-4 py-2.5 font-bold break-all max-w-[120px] text-gray-900 dark:text-gray-250 bg-gray-50/20">
                                  {err.invalidValue !== undefined && err.invalidValue !== null ? String(err.invalidValue) : 'EMPTY'}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${indicatorColor}`}>
                                    {isWarning ? 'Warning' : 'Error'}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 leading-relaxed max-w-[200px] break-words">
                                  {err.errorDescription}
                                </td>
                                <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-450 leading-relaxed max-w-[180px] break-words">
                                  {err.suggestedFix}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" className="px-4 py-8 text-center text-gray-400 italic">
                              No errors match search keyword.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: Validation Succeeds - Render Preview Grid */}
            {results.success && (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>Validation passed! Ready to import {results.validRows.length} project records successfully.</span>
                </div>
                
                <div>
                  <h4 className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2.5">
                    Data Preview Grid
                  </h4>
                  <div className="w-full overflow-hidden rounded border border-gray-150 dark:border-gray-850 bg-white dark:bg-brandDark-card">
                    <div className="overflow-x-auto w-full max-h-[220px]">
                      <table className="w-full text-left text-xs">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 font-bold text-gray-500">
                          <tr>
                            <th className="px-4 py-2">Code</th>
                            <th className="px-4 py-2">Project Name</th>
                            <th className="px-4 py-2">Client</th>
                            <th className="px-4 py-2">Manager</th>
                            <th className="px-4 py-2">Capability</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2 text-right">Revenue</th>
                            <th className="px-4 py-2">Start Date</th>
                            <th className="px-4 py-2">End Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-850 font-medium">
                          {results.validRows.map((r, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                              <td className="px-4 py-2 font-bold text-primary dark:text-primary-light">{r.projectCode}</td>
                              <td className="px-4 py-2 text-gray-900 dark:text-gray-200">{r.projectName}</td>
                              <td className="px-4 py-2">{r.clientName}</td>
                              <td className="px-4 py-2">{r.manager}</td>
                              <td className="px-4 py-2 text-gray-500">{r.service}</td>
                              <td className="px-4 py-2">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary uppercase">
                                  {r.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right font-black">${r.revenue.toLocaleString()}</td>
                              <td className="px-4 py-2 text-gray-400 font-semibold">{r.startDate}</td>
                              <td className="px-4 py-2 text-gray-400 font-semibold">{r.endDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-3 mt-4 border-t border-gray-100 dark:border-gray-850 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              onClose();
              handleReset();
            }}
          >
            Close
          </Button>
          
          {file && results && results.success && (
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmImport}
            >
              Confirm Import
            </Button>
          )}
        </div>

      </div>
    </Modal>
  );
};

export default ExcelUploadModal;
