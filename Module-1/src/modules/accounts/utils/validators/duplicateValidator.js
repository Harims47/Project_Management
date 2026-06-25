export const validateDuplicates = (projectCode, rowIndex, uploadedCodesMap, existingProjectsList) => {
  const errors = [];
  if (!projectCode) return errors;

  const codeStr = String(projectCode).trim().toUpperCase();

  // 1. Check if duplicate within uploaded file
  if (uploadedCodesMap.has(codeStr)) {
    const firstOccurrenceRow = uploadedCodesMap.get(codeStr);
    errors.push({
      row: rowIndex,
      column: 'Project Code',
      invalidValue: codeStr,
      errorCategory: 'Duplicate Project Code',
      errorDescription: `Duplicate Project Code "${codeStr}" within uploaded Excel sheet (already exists on row ${firstOccurrenceRow}).`,
      suggestedFix: 'Assign a unique Project Code to this row.'
    });
  } else {
    // Record first occurrence row
    uploadedCodesMap.set(codeStr, rowIndex);
  }

  // 2. Check if duplicate against existing system project codes
  const existsInSystem = existingProjectsList.some(p => p.projectCode.trim().toUpperCase() === codeStr);
  if (existsInSystem) {
    errors.push({
      row: rowIndex,
      column: 'Project Code',
      invalidValue: codeStr,
      errorCategory: 'Duplicate Project Code',
      errorDescription: `Project Code "${codeStr}" already exists in the master system.`,
      suggestedFix: 'Choose a different project code to avoid collision.'
    });
  }

  return errors;
};

export default validateDuplicates;
