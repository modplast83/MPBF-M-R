// Performance optimization utilities for the production management system

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Optimized resize observer with error handling
export const createOptimizedResizeObserver = (
  callback: (entries: ResizeObserverEntry[]) => void,
  options?: ResizeObserverOptions
): ResizeObserver => {
  const debouncedCallback = debounce(callback, 100);
  
  return new ResizeObserver((entries) => {
    try {
      // Use requestAnimationFrame to prevent loops
      requestAnimationFrame(() => {
        debouncedCallback(entries);
      });
    } catch (error) {
      // Silently handle ResizeObserver errors
      if (!(error instanceof Error) || !error.message.includes('ResizeObserver loop')) {
        console.error('ResizeObserver error:', error);
      }
    }
  });
};

// Memoization utility for expensive computations
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
};

// Optimized intersection observer for lazy loading
export const createOptimizedIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver => {
  const throttledCallback = throttle(callback, 100);
  
  return new IntersectionObserver((entries) => {
    try {
      throttledCallback(entries);
    } catch (error) {
      console.error('IntersectionObserver error:', error);
    }
  }, options);
};

// Utility to batch DOM updates
export const batchUpdates = (updates: (() => void)[]): void => {
  requestAnimationFrame(() => {
    updates.forEach(update => {
      try {
        update();
      } catch (error) {
        console.error('Batch update error:', error);
      }
    });
  });
};

// Memory efficient array operations
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Optimized deep comparison for React dependencies
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  
  return true;
};

// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => any): any => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${end - start} milliseconds`);
  }
  
  return result;
};

// Async performance monitoring
export const measureAsyncPerformance = async (
  name: string, 
  fn: () => Promise<any>
): Promise<any> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${end - start} milliseconds`);
  }
  
  return result;
};