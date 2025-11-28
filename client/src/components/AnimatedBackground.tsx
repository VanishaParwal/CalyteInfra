import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export function AnimatedBackground() {
  const { isDarkMode, isBreathing } = useTheme();
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const updateGradients = useCallback(() => {
    const time = Date.now() / 6000;
    const x = 50 + Math.sin(time) * 18;
    const y = 50 + Math.cos(time * 0.9) * 18;
    const scale = 1 + Math.sin(time / 2) * 0.08;

    const primaryEl = primaryRef.current;
    const secondaryEl = secondaryRef.current;

    if (primaryEl && secondaryEl) {
      if (isDarkMode) {
        primaryEl.style.background = `radial-gradient(circle at ${x}% ${y}%,
          rgba(255, 240, 200, 0.85) 0%,
          rgba(255, 220, 120, 0.75) 8%,
          rgba(255, 190, 100, 0.65) 18%,
          rgba(90, 90, 100, 0.8) 28%,
          rgba(35, 35, 40, 0.95) 45%,
          rgba(10, 10, 12, 1) 100%
        )`;

        secondaryEl.style.background = `radial-gradient(circle at ${x}% ${y}%,
          rgba(255, 220, 120, 0.18) 0%,
          rgba(120,120,130,0.25) 18%,
          rgba(30,30,36,0.95) 50%,
          rgba(10,10,12,1) 100%
        )`;
      } else {
        primaryEl.style.background = `radial-gradient(circle at ${x}% ${y}%,
          rgba(255, 255, 255, 0.65) 0%,
          rgba(255, 245, 200, 0.75) 3%,
          rgba(255, 230, 140, 0.80) 8%,
          rgba(255, 210, 120, 0.85) 14%,
          rgba(130, 210, 255, 0.85) 45%,
          rgba(255, 180, 180, 0.85) 100%
        )`;

        secondaryEl.style.background = `radial-gradient(circle at ${x}% ${y}%,
          rgba(255,250,220,0.12) 0%,
          rgba(200,220,255,0.10) 20%,
          rgba(240,245,255,0.05) 60%,
          rgba(255,255,255,0) 100%
        )`;
      }

      primaryEl.style.transform = `scale(${scale + 0.15})`;
      secondaryEl.style.transform = `scale(${scale})`;
    }

    rafRef.current = requestAnimationFrame(updateGradients);
  }, [isDarkMode]);

  useEffect(() => {
    if (rafRef.current == null) updateGradients();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [updateGradients]);

  return (
    <div className="fixed inset-0 rounded-3xl overflow-hidden pointer-events-none">
      <div 
        ref={primaryRef} 
        className={`absolute inset-0 rounded-3xl blur-[48px] transition-transform duration-1000 ${isBreathing ? 'animate-breathe' : ''}`} 
      />
      <div 
        ref={secondaryRef} 
        className={`absolute inset-0 rounded-3xl opacity-60 blur-[28px] transition-transform duration-1000 ${isBreathing ? 'animate-breathe' : ''}`} 
      />

      <div className="absolute inset-0 smoke-cloud cloud-1" />
      <div className="absolute inset-0 smoke-cloud cloud-2" />
      <div className="absolute inset-0 smoke-cloud cloud-3" />

      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay noise-overlay" />
    </div>
  );
}
