import { useState, useEffect } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Use requestAnimationFrame to prevent ResizeObserver loops
    const handleResize = () => {
      requestAnimationFrame(checkIsMobile);
    };

    checkIsMobile();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
