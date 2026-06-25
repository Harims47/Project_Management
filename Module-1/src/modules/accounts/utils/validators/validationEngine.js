import { validateRequiredFields } from './requiredFieldValidator';
import { validateProjectCode } from './projectCodeValidator';
import { validateDates } from './dateValidator';
import { validateRevenue } from './revenueValidator';
import { validateStatusAndService } from './statusValidator';
import { validateDuplicates } from './duplicateValidator';

export const validateProjectRow = (row, rowIndex, uploadedCodesMap, existingProjectsList) => {
  const errors = [];
  
  // 1. Required fields check
  const reqErrors = validateRequiredFields(row, rowIndex);
  errors.push(...reqErrors);

  // Derive which columns failed mandatory check to avoid duplicate alerts
  const missingColumns = reqErrors.map(e => e.column);

  // 2. Project Code Format, Prefix, and Duplicate validation
  if (!missingColumns.includes('Project Code')) {
    const codeErrors = validateProjectCode(row.projectCode, row.service, rowIndex);
    errors.push(...codeErrors);
    
    const duplicateErrors = validateDuplicates(row.projectCode, rowIndex, uploadedCodesMap, existingProjectsList);
    errors.push(...duplicateErrors);
  }

  // 3. Chronological Date validations
  if (!missingColumns.includes('Start Date') && !missingColumns.includes('End Date')) {
    const dateErrors = validateDates(row.startDate, row.endDate, rowIndex);
    errors.push(...dateErrors);
  }

  // 4. Positive Revenue validation
  if (!missingColumns.includes('Revenue')) {
    const revenueErrors = validateRevenue(row.revenue, rowIndex);
    errors.push(...revenueErrors);
  }

  // 5. Enumeration checks for Status, Service, and optional Remarks limits
  if (!missingColumns.includes('Status') && !missingColumns.includes('Service')) {
    const statusErrors = validateStatusAndService(row.status, row.service, row.remarks, rowIndex);
    errors.push(...statusErrors);
  }

  return errors;
};

export default validateProjectRow;
