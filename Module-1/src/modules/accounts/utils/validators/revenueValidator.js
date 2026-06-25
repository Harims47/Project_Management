export const validateRevenue = (revenue, rowIndex) => {
  const errors = [];
  
  if (revenue === undefined || revenue === null || String(revenue).trim() === '') {
    return errors; // Handled by requiredFieldValidator
  }

  const numVal = Number(revenue);
  if (isNaN(numVal)) {
    errors.push({
      row: rowIndex,
      column: 'Revenue',
      invalidValue: String(revenue),
      errorCategory: 'Invalid Numeric Format',
      errorDescription: 'Revenue must be a valid numeric value.',
      suggestedFix: 'Remove currency symbols or text characters from the cell.'
    });
  } else if (numVal <= 0) {
    errors.push({
      row: rowIndex,
      column: 'Revenue',
      invalidValue: String(revenue),
      errorCategory: 'Negative or Zero Value',
      errorDescription: 'Revenue must be greater than zero.',
      suggestedFix: 'Enter a positive contract value amount.'
    });
  }

  return errors;
};

export default validateRevenue;
