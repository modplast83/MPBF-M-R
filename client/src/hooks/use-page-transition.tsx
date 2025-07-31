import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

interface PageTransitionState {
  isTransitioning: boolean;
  direction: 'forward' | 'backward' | 'none';
  previousPath: string | null;
  currentPath: string;
}

export const usePageTransition = () => {
  const [location] = useLocation();
  const [transitionState, setTransitionState] = useState<PageTransitionState>({
    isTransitioning: false,
    direction: 'none',
    previousPath: null,
    currentPath: location
  });

  const [pageHistory, setPageHistory] = useState<string[]>([location]);

  useEffect(() => {
    if (location !== transitionState.currentPath) {
      setTransitionState(prev => ({
        ...prev,
        isTransitioning: true,
        previousPath: prev.currentPath,
        currentPath: location,
        direction: pageHistory.includes(location) ? 'backward' : 'forward'
      }));

      // Update page history
      setPageHistory(prev => {
        if (prev.includes(location)) {
          // Going back to a previous page
          const index = prev.indexOf(location);
          return prev.slice(0, index + 1);
        } else {
          // Going to a new page
          return [...prev, location];
        }
      });

      // Reset transition state after animation
      const timer = setTimeout(() => {
        setTransitionState(prev => ({
          ...prev,
          isTransitioning: false
        }));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location, transitionState.currentPath, pageHistory]);

  const triggerTransition = (newPath: string) => {
    setTransitionState(prev => ({
      ...prev,
      isTransitioning: true,
      direction: 'forward'
    }));
  };

  return {
    ...transitionState,
    triggerTransition,
    pageHistory
  };
};

export default usePageTransition;