import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
type StoredMode = ThemeMode | 'system';

const STORAGE_KEY = 'sound-stars-theme';

function getStoredMode(): StoredMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useThemeMode() {
  const [storedMode, setStoredMode] = useState<StoredMode>(getStoredMode);
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark);

  // Keep following the OS preference for as long as the user hasn't made an
  // explicit choice — otherwise a later OS-level theme change (e.g. a
  // time-based auto dark mode) would silently stop being reflected after the
  // first visit, even though nothing was ever toggled in-app.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (storedMode === 'system') {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem(STORAGE_KEY);
    } else {
      document.documentElement.dataset.theme = storedMode;
      localStorage.setItem(STORAGE_KEY, storedMode);
    }
  }, [storedMode]);

  const mode: ThemeMode = storedMode === 'system' ? (prefersDark ? 'dark' : 'light') : storedMode;

  const toggle = useCallback(() => {
    setStoredMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode]);

  return { mode, toggle };
}
