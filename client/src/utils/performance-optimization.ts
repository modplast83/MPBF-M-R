import { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Debounce hook for expensive operations
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for frequent events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef<number>(0);
  const handler = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      } else {
        clearTimeout(handler.current);
        handler.current = setTimeout(() => {
          callback(...args);
          lastRan.current = Date.now();
        }, delay);
      }
    },
    [callback, delay]
  ) as T;
}

// Memoized selector hook
export function useMemoizedSelector<T, R>(
  data: T[],
  selector: (item: T) => R,
  deps: React.DependencyList = []
): R[] {
  return useMemo(() => {
    return data.map(selector);
  }, [data, ...deps]);
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef<number>();

  useEffect(() => {
    startTime.current = performance.now();
    renderCount.current++;
  });

  useEffect(() => {
    if (startTime.current) {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      if (renderTime > 16) { // 60fps threshold
        console.warn(`[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
      }
    }
  });

  return {
    renderCount: renderCount.current,
    logPerformance: (operation: string, duration: number) => {
      if (duration > 100) {
        console.warn(`[Performance] ${componentName} - ${operation} took ${duration.toFixed(2)}ms`);
      }
    }
  };
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

// Optimized list rendering hook
export function useVirtualizedList<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  buffer: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const containerItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(
      items.length,
      startIndex + containerItemCount + buffer * 2
    );

    return {
      items: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, scrollTop, containerHeight, itemHeight, buffer]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    handleScroll,
    totalHeight: visibleItems.totalHeight,
    offsetY: visibleItems.offsetY,
  };
}

// Memory usage monitoring
export function useMemoryMonitor(componentName: string) {
  useEffect(() => {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1048576);
      const totalMB = Math.round(memoryInfo.totalJSHeapSize / 1048576);
      
      if (usedMB > 50) { // Alert if using more than 50MB
        console.warn(`[Memory] ${componentName} - High memory usage: ${usedMB}MB / ${totalMB}MB`);
      }
    }
  }, [componentName]);
}

