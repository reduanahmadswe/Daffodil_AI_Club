'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);

    // Update body inline styles for SSR compatibility
    if (activeTheme === 'dark') {
      document.body.style.background = '#000000';
      document.body.style.color = '#FFFFFF';
    } else {
      document.body.style.background = '#FAFBFF';
      document.body.style.color = '#1A1A2E';
    }
  }, [theme, mounted]);

  // Listen for system theme changes when 'system' is selected
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');

      if (e.matches) {
        document.body.style.background = '#000000';
        document.body.style.color = '#FFFFFF';
      } else {
        document.body.style.background = '#FAFBFF';
        document.body.style.color = '#1A1A2E';
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Prevent flash: render children only after mount to avoid hydration mismatch
  // The SSR HTML has class="dark" so it defaults to dark theme
  return <>{children}</>;
}
