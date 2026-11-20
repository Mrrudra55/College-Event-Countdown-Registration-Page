/**
 * TECHFEST 2026 — Navigation & Scrollspy Module
 * Handles mobile hamburger toggle, smooth navigation, outside-click dismissal,
 * keyboard accessibility, and active scrollspy link highlighting.
 */

const NavigationManager = (() => {
  const init = () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (!mobileToggle || !navMenu) return;

    /**
     * Toggles mobile menu drawer
     * @param {boolean} shouldOpen
     */
    const toggleMenu = (shouldOpen) => {
      const isOpen = shouldOpen !== undefined ? shouldOpen : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    // Toggle button click listener
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open')) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          toggleMenu(false);
        }
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
        mobileToggle.focus();
      }
    });

    /**
     * Scrollspy: update active nav link depending on current scroll position
     */
    const updateScrollSpy = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const headerOffset = 120; // Accounts for sticky navbar

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - headerOffset;
        const sectionId = current.getAttribute('id');
        const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          if (targetLink) {
            navLinks.forEach((link) => link.classList.remove('active'));
            targetLink.classList.add('active');
          }
        }
      });
    };

    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();
  };

  return { init };
})();

window.TechfestNav = NavigationManager;

