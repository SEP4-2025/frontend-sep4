import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 1024;

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    // Initial check in case window size changes before effect runs or between renders
    handleResize(); 
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
