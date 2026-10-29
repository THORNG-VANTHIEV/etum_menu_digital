import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

// Keep in sync with the inline script in index.html, which applies the saved
// theme before the first paint so dark mode does not flash light on load.
export const THEME_STORAGE_KEY = 'restaurant_menu_theme';

const readTheme = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light';

/** Light/dark theme stored per device. Light is the default. */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // storage disabled (private mode): the theme still applies for this visit
    }
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
};
