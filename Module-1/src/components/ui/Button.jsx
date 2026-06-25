import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    danger: 'bg-accent text-white hover:bg-accent-dark focus:ring-accent',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-primary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="h-4 w-4 flex-shrink-0" />
      ) : null}
      
      {children}
      
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="h-4 w-4 flex-shrink-0" />
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
