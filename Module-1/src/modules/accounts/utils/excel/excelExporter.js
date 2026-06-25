import * as XLSX from 'xlsx';

/**
 * 1. Export Filtered Projects to Excel
 */
export const exportProjectsToExcel = (projects = [], filters = {}, accountName = 'All Accounts') => {
  const wb = XLSX.utils.book_new();

  // Map data to user-friendly column headers
  const tableData = projects.map(p => ({
    'Project Code': p.projectCode,
    'Project Name': p.projectName,
    'Client Name': p.clientName,
    'Manager': p.manager,
    'Service': p.service,
    'Status': p.status,
    'Revenue': p.revenue,
    'Start Date': p.startDate,
    'End Date': p.endDate,
    'Remarks': p.remarks || ''
  }));

  const wsProjects = XLSX.utils.json_to_sheet(tableData);
  XLSX.utils.book_append_sheet(wb, wsProjects, 'Filtered Projects');

  // Add Metadata / Active Filters Tab
  const metaData = [
    { Parameter: 'Report Title', Value: 'Client Accounts Filtered Projects Export' },
    { Parameter: 'Export Date/Time', Value: new Date().toLocaleString() },
    { Parameter: 'Selected Account Scope', Value: accountName },
    { Parameter: 'Search Text Filter', Value: filters.search || 'None' },
    { Parameter: 'Multi Search Codes', Value: filters.multiSearch || 'None' },
    { Parameter: 'Service Filter', Value: filters.service || 'All' },
    { Parameter: 'Status Filter', Value: filters.status || 'All' },
    { Parameter: 'Manager Filter', Value: filters.manager || 'All' },
    { Parameter: 'Min Revenue', Value: filters.minRevenue || 'None' },
    { Parameter: 'Max Revenue', Value: filters.maxRevenue || 'None' },
    { Parameter: 'Start Date Filter', Value: filters.startDate || 'All' },
    { Parameter: 'End Date Filter', Value: filters.endDate || 'All' }
  ];

  const wsMeta = XLSX.utils.json_to_sheet(metaData);
  XLSX.utils.book_append_sheet(wb, wsMeta, 'Export Metadata');

  // Trigger file download
  const safeName = accountName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  XLSX.writeFile(wb, `${safeName}_projects_export.xlsx`);
};

/**
 * 2. Download Excel Template
 */
export const downloadExcelTemplate = () => {
  const wb = XLSX.utils.book_new();

  // Helper to generate template sheets
  const headers = [
    {
      'Project Code': 'CR-1001',
      'Project Name': 'Creative Brand Asset Design V1',
      'Client Name': 'Pfizer Inc.',
      'Manager': 'Sarah Jenkins',
      'Service': 'Creative',
      'Revenue': 85000,
      'Start Date': '2026-01-10',
      'End Date': '2026-03-15',
      'Status': 'Completed',
      'Remarks': 'Delivered on schedule and approved by client.'
    },
    {
      'Project Code': 'DG-1002',
      'Project Name': 'Digital Web Portal Dev Phase 1',
      'Client Name': 'Novartis AG',
      'Manager': 'Alex Mercer',
      'Service': 'Digital',
      'Revenue': 110000,
      'Start Date': '2026-02-05',
      'End Date': '2026-05-20',
      'Status': 'Completed',
      'Remarks': 'Successfully integrated regulatory modules.'
    }
  ];

  const ongoingSamples = [
    { ...headers[0], 'Project Code': 'RS-1003', 'Project Name': 'Clinical Research Study #1', 'Service': 'Research', 'Status': 'Ongoing', 'Remarks': 'Weekly steering updates in progress.' },
    { ...headers[0], 'Project Code': 'VD-1004', 'Project Name': 'Patient Onboarding Video v3', 'Service': 'Video', 'Status': 'Ongoing', 'Remarks': 'Script draft signed off.' }
  ];

  const pipelineSamples = [
    { ...headers[0], 'Project Code': 'CR-1005', 'Project Name': 'Oncology Creative Layout Design', 'Service': 'Creative', 'Status': 'Pipeline', 'Remarks': 'Contracts pending signature.' },
    { ...headers[0], 'Project Code': 'DG-1006', 'Project Name': 'Omnichannel Digital Mobile App', 'Service': 'Digital', 'Status': 'Pipeline', 'Remarks': 'Budgeting and resource planning.' }
  ];

  const cancelledSamples = [
    { ...headers[0], 'Project Code': 'RS-1007', 'Project Name': 'Post-Market Research Engine', 'Service': 'Research', 'Status': 'Cancelled', 'Remarks': 'Project defunded by client procurement.' }
  ];

  const sheets = [
    { name: 'Completed', data: headers },
    { name: 'Ongoing', data: ongoingSamples },
    { name: 'Pipeline', data: pipelineSamples },
    { name: 'Cancelled', data: cancelledSamples }
  ];

  sheets.forEach(sheet => {
    const ws = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  // Trigger template download
  XLSX.writeFile(wb, 'client_portfolio_import_template.xlsx');
};

/**
 * 3. Export Validation Errors to Excel
 */
export const exportValidationErrorsToExcel = (errors = [], fileName = 'excel_validation_errors') => {
  const wb = XLSX.utils.book_new();

  const formattedErrors = errors.map(e => ({
    'Sheet Name': e.sheet || 'Global',
    'Row Number': e.row,
    'Column Name': e.column,
    'Invalid Value': e.invalidValue !== undefined && e.invalidValue !== null ? String(e.invalidValue) : 'EMPTY',
    'Error Category': e.errorCategory,
    'Error Description': e.errorDescription,
    'Suggested Fix': e.suggestedFix
  }));

  const ws = XLSX.utils.json_to_sheet(formattedErrors);
  XLSX.utils.book_append_sheet(wb, ws, 'Validation Errors');

  // Trigger errors report download
  XLSX.writeFile(wb, `${fileName}_report.xlsx`);
};

export default {
  exportProjectsToExcel,
  downloadExcelTemplate,
  exportValidationErrorsToExcel
};
