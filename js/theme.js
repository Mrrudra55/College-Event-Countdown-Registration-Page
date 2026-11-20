/**
 * TECHFEST 2026 — Theme Switcher Module
 * Handles Dark/Light theme switching with localStorage persistence
 * and system preference fallback.
 */

const ThemeManager = (() => {
  const STORAGE_KEY = 'techfest-2026-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  /**
   * Get preferred initial theme
   * 1. Stored preference in localStorage
   * 2. System preference via prefers-color-scheme
   * 3. Default to 'dark' for futuristic conference aesthetic
   */
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === THEME_DARK || savedTheme === THEME_LIGHT) {
      return savedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return THEME_LIGHT;
    }

    return THEME_DARK;
  };

  /**
   * Apply theme to DOM and update button accessibility attributes
   * @param {string} theme
   * @param {HTMLButtonElement|null} toggleBtn
   */
  const applyTheme = (theme, toggleBtn) => {
    document.documentElement.setAttribute('data-theme', theme);

    if (toggleBtn) {
      const isDark = theme === THEME_DARK;
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      toggleBtn.setAttribute('aria-label', label);
      toggleBtn.setAttribute('title', label);
      toggleBtn.setAttribute('aria-pressed', isDark ? 'false' : 'true');
    }
  };

  /**
   * Initialize Theme Manager
   */
  const init = () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const initialTheme = getPreferredTheme();

    applyTheme(initialTheme, toggleBtn);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_DARK;
        const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;

        applyTheme(newTheme, toggleBtn);
        try {
          localStorage.setItem(STORAGE_KEY, newTheme);
        } catch (e) {
          console.warn('Unable to persist theme to localStorage:', e);
        }
      });
    }

    // Optional: Listen for OS theme changes if user has not set a manual override
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? THEME_LIGHT : THEME_DARK, toggleBtn);
        }
      });
    }
  };

  return { init };
})();

window.TechfestTheme = ThemeManager;

