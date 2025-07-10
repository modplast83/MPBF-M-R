import { useState, useEffect, useCallback } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  const checkIsMobile = useCallback(() => {
    const newIsMobile = window.innerWidth < 768;
    setIsMobile(prev => {
      // Only update if value actually changed to prevent unnecessary re-renders
      if (prev !== newIsMobile) {
        return newIsMobile;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Debounced resize handler to prevent excessive calls
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(checkIsMobile);
      }, 100); // 100ms debounce
    };

    // Initial check
    checkIsMobile();
    
    // Add resize listener with passive option for better performance
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkIsMobile]);

  return isMobile;
}
