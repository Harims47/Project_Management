import React from 'react';
import { Search, AlertCircle } from 'lucide-react';

// Common Error/Helper Text Wrapper
// Common Error/Helper Text Wrapper (FormField)
export const FormField = ({ label, error, helperText, children, required }) => (
  <div className="flex flex-col gap-1 w-full text-left">
    {label && (
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
    )}
    {children}
    {error && (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-accent mt-0.5 animate-shake">
        <AlertCircle className="h-3.5 w-3.5" />
        {error}
      </span>
    )}
    {!error && helperText && (
      <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
        {helperText}
      </span>
    )}
  </div>
);

// 1. Text Input Component
export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  required,
  icon: Icon,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <FormField label={label} error={error} helperText={helperText} required={required}>
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full py-2.5 rounded-lg border text-sm transition-all duration-200 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error 
              ? 'border-accent focus:border-accent focus:ring-1 focus:ring-accent' 
              : 'border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary'
            }
            ${className}`}
          {...props}
        />
      </div>
    </FormField>
  );
});
Input.displayName = 'Input';

// 2. TextArea Component
export const TextArea = React.forwardRef(({
  label,
  error,
  helperText,
  required,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  return (
    <FormField label={label} error={error} helperText={helperText} required={required}>
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full p-4 rounded-lg border text-sm transition-all duration-200 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none
          ${error 
            ? 'border-accent focus:border-accent focus:ring-1 focus:ring-accent' 
            : 'border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary'
          }
          ${className}`}
        {...props}
      />
    </FormField>
  );
});
TextArea.displayName = 'TextArea';

// 3. Dropdown Select Component
export const Select = React.forwardRef(({
  label,
  error,
  helperText,
  required,
  options = [],
  className = '',
  placeholder = 'Select an option',
  ...props
}, ref) => {
  return (
    <FormField label={label} error={error} helperText={helperText} required={required}>
      <select
        ref={ref}
        className={`w-full py-2.5 px-4 rounded-lg border text-sm transition-all duration-200 bg-white dark:bg-brandDark-card text-gray-900 dark:text-gray-100 outline-none appearance-none cursor-pointer
          ${error 
            ? 'border-accent focus:border-accent focus:ring-1 focus:ring-accent' 
            : 'border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-1 focus:ring-primary'
          }
          ${className}`}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
});
Select.displayName = 'Select';

// 4. Checkbox Component
export const Checkbox = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1 text-left">
      <label className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-sm font-medium text-gray-700 dark:text-gray-200 ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer"
          {...props}
        />
        {label}
      </label>
      {error && <span className="text-xs text-accent font-semibold">{error}</span>}
      {!error && helperText && <span className="text-xs text-gray-400 dark:text-gray-500">{helperText}</span>}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';

// 5. Toggle Switch Component
export const Toggle = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  checked,
  onChange,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1 text-left">
      <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div className={`block w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
          <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${checked ? 'transform translate-x-5' : ''}`}></div>
        </div>
        {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>}
      </label>
      {error && <span className="text-xs text-accent font-semibold">{error}</span>}
      {!error && helperText && <span className="text-xs text-gray-400 dark:text-gray-500">{helperText}</span>}
    </div>
  );
});
Toggle.displayName = 'Toggle';

// 6. Search Box Component
export const SearchBox = React.forwardRef(({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`relative flex items-center w-full max-w-sm ${className}`}>
      <div className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
        <Search className="h-4.5 w-4.5" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-2 pl-11 pr-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-brandDark-card text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
        {...props}
      />
    </div>
  );
});
SearchBox.displayName = 'SearchBox';
