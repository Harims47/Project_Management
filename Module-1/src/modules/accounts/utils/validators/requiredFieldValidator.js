export const validateRequiredFields = (row, rowIndex) => {
  const errors = [];
  const requiredFields = [
    { key: 'projectCode', label: 'Project Code' },
    { key: 'projectName', label: 'Project Name' },
    { key: 'clientName', label: 'Client Name' },
    { key: 'manager', label: 'Manager' },
    { key: 'service', label: 'Service' },
    { key: 'status', label: 'Status' },
    { key: 'startDate', label: 'Start Date' }
  ];

  requiredFields.forEach(field => {
    const value = row[field.key];
    if (value === undefined || value === null || String(value).trim() === '') {
      errors.push({
        row: rowIndex,
        column: field.label,
        invalidValue: value !== undefined && value !== null ? String(value) : 'EMPTY',
        errorCategory: 'Missing Required Field',
        errorDescription: `The field "${field.label}" is mandatory but is empty.`,
        suggestedFix: `Enter a valid ${field.label} value.`
      });
    }
  });

  return errors;
};

export default validateRequiredFields;
