/**
 * TECHFEST 2026 — Main Application Entry Point
 * Coordinates and boots all frontend modules safely once DOM is ready.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme Switcher (Dark / Light with localStorage persistence)
  if (window.TechfestTheme && typeof window.TechfestTheme.init === 'function') {
    window.TechfestTheme.init();
  }

  // 2. Initialize Navigation (Hamburger menu, smooth scrolling & scrollspy)
  if (window.TechfestNav && typeof window.TechfestNav.init === 'function') {
    window.TechfestNav.init();
  }

  // 3. Initialize Live Countdown Timer
  if (window.TechfestCountdown && typeof window.TechfestCountdown.init === 'function') {
    window.TechfestCountdown.init();
  }

  // 4. Initialize Authentication & Local Storage Data Store
  if (window.TechfestAuth && typeof window.TechfestAuth.init === 'function') {
    window.TechfestAuth.init();
  }

  // 5. Initialize Registration Form, Auth Gate & Event Pass Manager
  if (window.TechfestForm && typeof window.TechfestForm.init === 'function') {
    window.TechfestForm.init();
  }
});
