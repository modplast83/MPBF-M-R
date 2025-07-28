// Error boundary and error handling utilities

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

export class AppError extends Error {
  public code: string;
  public context?: Record<string, any>;
  
  constructor(message: string, code: string = 'UNKNOWN_ERROR', context?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}

export const handleError = (error: Error, context?: Record<string, any>): void => {
  // Log error with context
  console.error('Application Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
  
  // You can extend this to send errors to a logging service
  // Example: sendToLogggingService(error, context);
};

export const createErrorHandler = (componentName: string) => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    handleError(error, {
      component: componentName,
      errorInfo,
    });
  };
};

// Utility for safe async operations
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: Record<string, any>
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error as Error, context);
    return fallback;
  }
};

// Utility for safe synchronous operations
export const safeSync = <T>(
  operation: () => T,
  fallback?: T,
  context?: Record<string, any>
): T | undefined => {
  try {
    return operation();
  } catch (error) {
    handleError(error as Error, context);
    return fallback;
  }
};

// Network error handling
export const isNetworkError = (error: any): boolean => {
  return (
    error.name === 'NetworkError' ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed') ||
    error.code === 'NETWORK_ERROR'
  );
};

// Retry logic for failed operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: Record<string, any>
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries - 1) {
        handleError(lastError, { ...context, retryAttempt: i + 1 });
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError!;
};

// Validation error utilities
export const createValidationError = (field: string, message: string): AppError => {
  return new AppError(message, 'VALIDATION_ERROR', { field });
};

export const isValidationError = (error: any): error is AppError => {
  return error instanceof AppError && error.code === 'VALIDATION_ERROR';
};

// Global error handler setup
export const setupGlobalErrorHandling = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('ResizeObserver loop')) {
      event.preventDefault();
      return;
    }
    
    handleError(
      new AppError(
        event.reason?.message || 'Unhandled promise rejection',
        'UNHANDLED_REJECTION'
      ),
      { reason: event.reason }
    );
  });
  
  // Handle other runtime errors
  window.addEventListener('error', (event) => {
    if (event.message?.includes('ResizeObserver loop')) {
      event.preventDefault();
      return;
    }
    
    handleError(
      new AppError(
        event.message || 'Runtime error',
        'RUNTIME_ERROR'
      ),
      { 
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno 
      }
    );
  });
};