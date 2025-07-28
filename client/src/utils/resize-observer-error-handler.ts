import { setupGlobalErrorHandling } from './error-boundary-utils';

// Global error handler for ResizeObserver loop errors
// This prevents the ResizeObserver loop completed with undelivered notifications error
// which is common in responsive applications

export function setupResizeObserverErrorHandler() {
  const originalError = console.error;
  
  console.error = function(...args: any[]) {
    // Filter out the ResizeObserver loop error
    if (
      args.length > 0 &&
      typeof args[0] === 'object' &&
      args[0]?.message?.includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      // Silently ignore this error as it's not harmful
      return;
    }
    
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      args[0].includes('ResizeObserver loop completed with undelivered notifications')
    ) {
      // Silently ignore this error as it's not harmful
      return;
    }
    
    // For all other errors, call the original console.error
    originalError.apply(console, args);
  };
}

// Enhanced global error handler setup
export function setupGlobalErrorHandlers() {
  // Handle ResizeObserver errors
  setupResizeObserverErrorHandler();
  
  // Setup comprehensive error handling
  setupGlobalErrorHandling();
  
  // Additional React Beautiful DnD error suppression
  const originalWarn = console.warn;
  console.warn = function(...args: any[]) {
    // Filter out React Beautiful DnD defaultProps warnings
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      args[0].includes('defaultProps will be removed from memo components')
    ) {
      // Silently ignore these warnings as they're from the library
      return;
    }
    
    // For all other warnings, call the original console.warn
    originalWarn.apply(console, args);
  };
}