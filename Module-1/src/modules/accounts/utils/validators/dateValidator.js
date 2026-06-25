export const validateDates = (startDate, endDate, rowIndex) => {
  const errors = [];

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  const startValid = startDate ? isValidDate(startDate) : false;
  const endValid = endDate ? isValidDate(endDate) : false;

  if (startDate && !startValid) {
    errors.push({
      row: rowIndex,
      column: 'Start Date',
      invalidValue: String(startDate),
      errorCategory: 'Invalid Date Format',
      errorDescription: 'Start Date is not in a valid date format (expected YYYY-MM-DD).',
      suggestedFix: 'Reformat the date to YYYY-MM-DD.'
    });
  }

  if (endDate && !endValid) {
    errors.push({
      row: rowIndex,
      column: 'End Date',
      invalidValue: String(endDate),
      errorCategory: 'Invalid Date Format',
      errorDescription: 'End Date is not in a valid date format (expected YYYY-MM-DD).',
      suggestedFix: 'Reformat the date to YYYY-MM-DD.'
    });
  }

  if (startValid && endValid) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      errors.push({
        row: rowIndex,
        column: 'End Date',
        invalidValue: String(endDate),
        errorCategory: 'Invalid Chronology',
        errorDescription: `End Date (${endDate}) cannot be before Start Date (${startDate}).`,
        suggestedFix: 'Set End Date to a date on or after the Start Date.'
      });
    }
  }

  return errors;
};

export default validateDates;
