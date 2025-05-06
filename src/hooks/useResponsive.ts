// hooks/useResponsive.ts
import { useEffect, useState } from 'react';

export function useResponsive() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width !== null && width <= 768;
  const isTablet = width !== null && width > 768 && width <= 1024;
  const isDesktop = width !== null && width > 1024;

  return { width, isMobile, isTablet, isDesktop };
}
