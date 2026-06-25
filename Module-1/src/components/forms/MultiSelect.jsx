import React from 'react';
import ReactSelect from 'react-select';
import { AlertCircle } from 'lucide-react';

export const MultiSelect = React.forwardRef(({
  label,
  error,
  helperText,
  required,
  options = [],
  value,
  onChange,
  className = '',
  placeholder = 'Select options...',
  name,
  onBlur,
  ...props
}, ref) => {
  // Map array of string values to react-select options array
  const selectValue = options.filter(opt => {
    if (Array.isArray(value)) {
      return value.includes(opt.value);
    }
    return false;
  });

  const handleChange = (selected) => {
    if (onChange) {
      onChange(selected ? selected.map(s => s.value) : []);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'var(--bg-card)',
      borderColor: error 
        ? 'var(--accent)' 
        : state.isFocused 
          ? 'var(--primary)' 
          : 'var(--border-color)',
      color: 'var(--text-primary)',
      borderRadius: '8px',
      minHeight: '42px',
      boxShadow: 'none',
      borderWidth: '1px',
      outline: 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: error ? 'var(--accent)' : 'var(--primary)'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--bg-card)',
      borderColor: 'var(--border-color)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 50
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'var(--primary)' 
        : state.isFocused 
          ? 'var(--bg-hover)' 
          : 'transparent',
      color: state.isSelected ? 'white' : 'var(--text-primary)',
      cursor: 'pointer',
      fontSize: '14px',
      '&:active': {
        backgroundColor: 'var(--primary)'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-primary)'
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'var(--bg-app)',
      borderRadius: '6px',
      border: '1px solid var(--border-color)'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'var(--text-primary)',
      fontSize: '13px',
      fontWeight: '500'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'var(--text-muted)',
      '&:hover': {
        backgroundColor: 'var(--accent)',
        color: 'white'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'var(--text-muted)',
      fontSize: '14px'
    })
  };

  return (
    <div className={`flex flex-col gap-1 w-full text-left ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-accent ml-1">*</span>}
        </label>
      )}
      <ReactSelect
        ref={ref}
        name={name}
        onBlur={onBlur}
        options={options}
        value={selectValue}
        onChange={handleChange}
        isMulti={true}
        styles={customStyles}
        placeholder={placeholder}
        classNamePrefix="react-select"
        {...props}
      />
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
});

MultiSelect.displayName = 'MultiSelect';
export default MultiSelect;
