import * as XLSX from 'xlsx';
import { validateProjectRow } from '../validators/validationEngine';

// Date utility to convert Excel date objects / strings to YYYY-MM-DD
const formatDate = (val) => {
  if (val === undefined || val === null || val === '') return '';
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  
  // If parsing string e.g. "4/20/2026" or serial number
  const strVal = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(strVal)) return strVal;
  
  const parsedTime = Date.parse(strVal);
  if (!isNaN(parsedTime)) {
    const dObj = new Date(parsedTime);
    const y = dObj.getFullYear();
    const m = String(dObj.getMonth() + 1).padStart(2, '0');
    const d = String(dObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  
  return strVal;
};

export const parseExcelFile = (file, existingProjectsList, onProgress) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (onProgress) onProgress('Reading Workbook...', 20);
        
        const data = new Uint8Array(e.target.result);
        // cellDates: true parses dates as native JS Date objects
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        if (onProgress) onProgress('Parsing Worksheets...', 50);

        const requiredSheets = ['Completed', 'Ongoing', 'Pipeline', 'Cancelled'];
        const missingSheets = requiredSheets.filter(sheet => !workbook.SheetNames.includes(sheet));
        
        if (missingSheets.length > 0) {
          resolve({
            success: false,
            errors: [{
              sheet: 'Global',
              row: 'N/A',
              column: 'Worksheets',
              invalidValue: missingSheets.join(', '),
              errorCategory: 'Missing Sheet Name',
              errorDescription: `Workbook is missing required sheet(s): ${missingSheets.join(', ')}.`,
              suggestedFix: 'Rename the worksheets in Excel to: Completed, Ongoing, Pipeline, Cancelled.'
            }],
            validRows: [],
            summary: { totalRecords: 0, validRecords: 0, invalidRecords: 1, duplicateCount: 0, emptyFieldsCount: 0, codeErrorsCount: 0, dateErrorsCount: 0, revenueErrorsCount: 0, missingFieldsCount: 0 }
          });
          return;
        }

        const allParsedRows = [];
        const errors = [];
        const uploadedCodesMap = new Map(); // projectCode -> row number

        if (onProgress) onProgress('Running Validation...', 70);

        requiredSheets.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
          
          let sheetRowIndex = 2; // Headers is row 1, data starts on row 2
          
          rows.forEach(r => {
            // Map header column strings to standard object keys
            const mappedRow = {
              projectCode: r['Project Code'] !== undefined ? String(r['Project Code']).trim() : '',
              projectName: r['Project Name'] !== undefined ? String(r['Project Name']).trim() : '',
              clientName: r['Client Name'] !== undefined ? String(r['Client Name']).trim() : '',
              manager: r['Manager'] !== undefined ? String(r['Manager']).trim() : '',
              service: r['Service'] !== undefined ? String(r['Service']).trim() : '',
              revenue: r['Revenue'] !== undefined ? r['Revenue'] : '',
              startDate: formatDate(r['Start Date']),
              endDate: formatDate(r['End Date']),
              status: r['Status'] !== undefined ? String(r['Status']).trim() : sheetName,
              remarks: r['Remarks'] !== undefined ? String(r['Remarks']).trim() : ''
            };

            // Run validation engine
            const rowErrors = validateProjectRow(mappedRow, sheetRowIndex, uploadedCodesMap, existingProjectsList);
            
            // Check status mismatch with sheetName
            if (mappedRow.status && mappedRow.status.toLowerCase() !== sheetName.toLowerCase()) {
              rowErrors.push({
                row: sheetRowIndex,
                column: 'Status',
                invalidValue: mappedRow.status,
                errorCategory: 'Status Mismatch',
                errorDescription: `Project status "${mappedRow.status}" does not match active sheet tab "${sheetName}".`,
                suggestedFix: `Move this row to the "${mappedRow.status}" sheet, or rename Status to "${sheetName}".`
              });
            }

            if (rowErrors.length > 0) {
              rowErrors.forEach(err => {
                err.sheet = sheetName;
                errors.push(err);
              });
            }

            allParsedRows.push({
              sheet: sheetName,
              rowNumber: sheetRowIndex,
              data: mappedRow,
              hasErrors: rowErrors.length > 0,
              errors: rowErrors
            });
            
            sheetRowIndex++;
          });
        });

        if (onProgress) onProgress('Preparing Preview...', 90);

        const totalRecords = allParsedRows.length;
        const invalidRecords = allParsedRows.filter(r => r.hasErrors).length;
        const validRecords = totalRecords - invalidRecords;
        
        // Summarize stats
        const duplicateCount = errors.filter(e => e.errorCategory === 'Duplicate Project Code').length;
        const emptyFieldsCount = errors.filter(e => e.errorCategory === 'Missing Required Field').length;
        const codeErrorsCount = errors.filter(e => e.errorCategory === 'Invalid Project Code' || e.errorCategory === 'Invalid Prefix').length;
        const dateErrorsCount = errors.filter(e => e.errorCategory === 'Invalid Date Format' || e.errorCategory === 'Invalid Chronology').length;
        const revenueErrorsCount = errors.filter(e => e.errorCategory === 'Invalid Numeric Format' || e.errorCategory === 'Negative or Zero Value').length;

        const summary = {
          totalRecords,
          validRecords,
          invalidRecords,
          duplicateCount,
          emptyFieldsCount,
          codeErrorsCount,
          dateErrorsCount,
          revenueErrorsCount,
          missingFieldsCount: emptyFieldsCount
        };

        resolve({
          success: errors.length === 0,
          errors,
          validRows: allParsedRows.filter(r => !r.hasErrors).map(r => r.data),
          summary
        });

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
