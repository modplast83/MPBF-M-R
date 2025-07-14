// Console error filtering to reduce noise from known issues

interface ErrorFilter {
  pattern: RegExp;
  reason: string;
  level: 'suppress' | 'warn' | 'log';
}

const ERROR_FILTERS: ErrorFilter[] = [
  // React Beautiful DnD deprecation warnings
  {
    pattern: /Support for defaultProps will be removed from memo components/,
    reason: 'React Beautiful DnD library deprecation warning - known issue',
    level: 'suppress'
  },
  {
    pattern: /Connect\(Droppable\)/,
    reason: 'React Beautiful DnD component warning - known issue',
    level: 'suppress'
  },
  {
    pattern: /Invariant failed: isCombineEnabled must be a boolean/,
    reason: 'React Beautiful DnD isCombineEnabled prop issue - fixed in configuration',
    level: 'suppress'
  },
  
  // ResizeObserver errors
  {
    pattern: /ResizeObserver loop limit exceeded/,
    reason: 'ResizeObserver loop error - handled by global error handler',
    level: 'suppress'
  },
  {
    pattern: /ResizeObserver loop completed with undelivered notifications/,
    reason: 'ResizeObserver notification error - handled by global error handler',
    level: 'suppress'
  },
  
  // Chrome extension errors
  {
    pattern: /Extension context invalidated/,
    reason: 'Chrome extension error - not related to application',
    level: 'suppress'
  },
  {
    pattern: /Unchecked runtime\.lastError/,
    reason: 'Chrome extension runtime error - not related to application',
    level: 'suppress'
  },
  
  // Network errors that are expected
  {
    pattern: /Failed to fetch/,
    reason: 'Network fetch error - handled by application error handling',
    level: 'log'
  },
  {
    pattern: /NetworkError when attempting to fetch resource/,
    reason: 'Network error - handled by application error handling',
    level: 'log'
  },
  
  // React development warnings
  {
    pattern: /Warning: Each child in a list should have a unique "key" prop/,
    reason: 'React key prop warning - development only',
    level: 'warn'
  },
  {
    pattern: /Warning: Failed prop type/,
    reason: 'React prop type warning - development only',
    level: 'warn'
  },
  
  // Vite HMR messages
  {
    pattern: /\[vite\] hot updated/,
    reason: 'Vite hot module replacement - normal development message',
    level: 'suppress'
  },
  {
    pattern: /\[vite\] connecting\.\.\./,
    reason: 'Vite connection message - normal development message',
    level: 'suppress'
  },
  {
    pattern: /\[vite\] connected\./,
    reason: 'Vite connection message - normal development message',
    level: 'suppress'
  },
];

class ConsoleErrorFilter {
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;
  private originalConsoleLog: typeof console.log;
  
  constructor() {
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
    this.originalConsoleLog = console.log;
  }

  init() {
    console.error = (...args: any[]) => {
      if (this.shouldFilterError(args)) {
        return;
      }
      this.originalConsoleError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      if (this.shouldFilterWarning(args)) {
        return;
      }
      this.originalConsoleWarn.apply(console, args);
    };

    console.log = (...args: any[]) => {
      if (this.shouldFilterLog(args)) {
        return;
      }
      this.originalConsoleLog.apply(console, args);
    };
  }

  private shouldFilterError(args: any[]): boolean {
    return this.shouldFilter(args, 'suppress');
  }

  private shouldFilterWarning(args: any[]): boolean {
    return this.shouldFilter(args, 'suppress');
  }

  private shouldFilterLog(args: any[]): boolean {
    return this.shouldFilter(args, 'suppress');
  }

  private shouldFilter(args: any[], level: 'suppress' | 'warn' | 'log'): boolean {
    const message = args.join(' ');
    
    for (const filter of ERROR_FILTERS) {
      if (filter.pattern.test(message)) {
        if (filter.level === level) {
          // Log the suppression in development mode
          if (process.env.NODE_ENV === 'development') {
            this.originalConsoleLog(
              `[Console Filter] Suppressed: ${filter.reason}`,
              { originalMessage: message }
            );
          }
          return true;
        }
      }
    }
    
    return false;
  }

  restore() {
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
    console.log = this.originalConsoleLog;
  }
}

// Global error handler for unhandled promise rejections
export function setupGlobalErrorHandling() {
  const filter = new ConsoleErrorFilter();
  
  // Initialize console filtering
  filter.init();
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent default browser behavior for known issues
    if (event.reason && typeof event.reason === 'string') {
      for (const filter of ERROR_FILTERS) {
        if (filter.pattern.test(event.reason) && filter.level === 'suppress') {
          event.preventDefault();
          return;
        }
      }
    }
  });
  
  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    
    // Prevent default browser behavior for known issues
    if (event.error && event.error.message) {
      for (const filter of ERROR_FILTERS) {
        if (filter.pattern.test(event.error.message) && filter.level === 'suppress') {
          event.preventDefault();
          return;
        }
      }
    }
  });

  return filter;
}

export default ConsoleErrorFilter;