import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

// Base Portal wrapper to attach to document body
const ModalPortal = ({ children }) => {
  return ReactDOM.createPortal(
    children,
    document.body
  );
};

// 1. Generic Modal Component
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <ModalPortal>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all duration-300"
        onClick={() => closeOnOverlayClick && onClose()}
      >
        {/* Modal Window Container */}
        <div 
          className={`relative w-full bg-white dark:bg-brandDark-card rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col animate-scaleIn ${sizeClasses[size]}`}
          onClick={(e) => e.stopPropagation()} // block backdrop triggers
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-850">
              {title && (
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button 
                  onClick={onClose}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
            {children}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

// 2. Confirmation Action Dialog
export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm to proceed.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger', // danger, primary
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false} closeOnOverlayClick={!isLoading}>
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Warning Icon Badge */}
        <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        
        {/* Text descriptions */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{message}</p>
        </div>

        {/* Dialog Actions buttons */}
        <div className="flex gap-3 w-full mt-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={variant} 
            onClick={onConfirm} 
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
