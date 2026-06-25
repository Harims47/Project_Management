export const SERVICE_PREFIX_MAP = {
  'Creative': 'CR',
  'Digital': 'DG',
  'Research': 'RS',
  'Video': 'VD'
};

export const validateProjectCode = (projectCode, service, rowIndex) => {
  const errors = [];
  
  if (!projectCode) return errors; // Handled by requiredFieldValidator

  const codeStr = String(projectCode).trim();

  // Pattern check: letters, exactly one hyphen, numbers (e.g. CR-1001)
  // Check for any spaces or special characters
  const codeRegex = /^[A-Z]+-[0-9]+$/;
  
  if (!codeRegex.test(codeStr)) {
    let reason = 'Project Code format is invalid.';
    if (codeStr.includes(' ')) {
      reason += ' No spaces are allowed.';
    } else if ((codeStr.match(/-/g) || []).length !== 1) {
      reason += ' Must contain exactly one hyphen (-).';
    } else {
      reason += ' Structure must be letters on left and numbers on right (e.g., CR-1001).';
    }

    errors.push({
      row: rowIndex,
      column: 'Project Code',
      invalidValue: codeStr,
      errorCategory: 'Invalid Project Code',
      errorDescription: reason,
      suggestedFix: 'Correct the format to letters-numbers (e.g., CR-1001).'
    });
    return errors; // Stop here if format itself is wrong
  }

  // Prefix check mapping
  const prefix = codeStr.split('-')[0];
  const expectedPrefix = SERVICE_PREFIX_MAP[service];

  if (expectedPrefix && prefix !== expectedPrefix) {
    errors.push({
      row: rowIndex,
      column: 'Project Code',
      invalidValue: codeStr,
      errorCategory: 'Invalid Prefix',
      errorDescription: `Code prefix "${prefix}" does not match the service line "${service}" (expected prefix "${expectedPrefix}").`,
      suggestedFix: `Change the prefix to "${expectedPrefix}" or change the service line to match.`
    });
  }

  return errors;
};

export default validateProjectCode;
