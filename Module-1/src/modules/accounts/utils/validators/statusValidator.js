const VALID_STATUSES = ['Completed', 'Ongoing', 'Pipeline', 'Cancelled'];
const VALID_SERVICES = ['Creative', 'Digital', 'Research', 'Video'];
const MAX_REMARKS_LENGTH = 500;

export const validateStatusAndService = (status, service, remarks, rowIndex) => {
  const errors = [];

  if (status && !VALID_STATUSES.includes(status)) {
    errors.push({
      row: rowIndex,
      column: 'Status',
      invalidValue: String(status),
      errorCategory: 'Invalid Status Value',
      errorDescription: `Status must be exactly: ${VALID_STATUSES.join(', ')}.`,
      suggestedFix: `Change status to one of: ${VALID_STATUSES.join(', ')}.`
    });
  }

  if (service && !VALID_SERVICES.includes(service)) {
    errors.push({
      row: rowIndex,
      column: 'Service',
      invalidValue: String(service),
      errorCategory: 'Invalid Service Line',
      errorDescription: `Service Line must be exactly: ${VALID_SERVICES.join(', ')}.`,
      suggestedFix: `Change service line to one of: ${VALID_SERVICES.join(', ')}.`
    });
  }

  if (remarks && String(remarks).length > MAX_REMARKS_LENGTH) {
    errors.push({
      row: rowIndex,
      column: 'Remarks',
      invalidValue: `${String(remarks).substring(0, 30)}...`,
      errorCategory: 'Remarks Length Exceeded',
      errorDescription: `Remarks text is too long (current length ${String(remarks).length} chars, max allowed is ${MAX_REMARKS_LENGTH} chars).`,
      suggestedFix: `Shorten the remarks text to less than ${MAX_REMARKS_LENGTH} characters.`
    });
  }

  return errors;
};

export default validateStatusAndService;
