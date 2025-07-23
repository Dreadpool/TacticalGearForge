import { useEffect } from 'react';

declare global {
  interface Window {
    Lenis?: any;
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    // Import Lenis dynamically
    const loadLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

        const raf = (time: number) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        // Store in window for cleanup
        window.Lenis = lenis;

        return () => {
          lenis.destroy();
        };
      } catch (error) {
        console.warn('Lenis smooth scroll not available');
      }
    };

    loadLenis();

    return () => {
      if (window.Lenis) {
        window.Lenis.destroy();
      }
    };
  }, []);
}