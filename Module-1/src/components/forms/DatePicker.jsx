import React from 'react';
import { Input } from './FormControls';

export const DatePicker = React.forwardRef(({
  label,
  error,
  helperText,
  required,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      type="date"
      className="cursor-pointer"
      {...props}
    />
  );
});

DatePicker.displayName = 'DatePicker';
export default DatePicker;
