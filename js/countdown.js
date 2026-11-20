/**
 * TECHFEST 2026 — Countdown Module
 * Calculates live remaining time to the festival opening.
 * Target: 21 November 2026, 09:00 AM.
 */

const Countdown = (() => {
  // Configuration: Event date ISO-8601 string
  // Easy to adjust if the festival date changes
  const EVENT_DATE_ISO = '2026-11-21T09:00:00+05:30';

  let timerInterval = null;

  /**
   * Helper: Pad single digits with leading zero (e.g. 5 -> "05")
   * @param {number} num
   * @returns {string}
   */
  const padZero = (num) => String(Math.max(0, Math.floor(num))).padStart(2, '0');

  /**
   * Calculates time difference and updates DOM elements
   * @param {Date} targetDate
   * @param {Object} elements - Cached DOM references
   */
  const updateCountdown = (targetDate, elements) => {
    const now = new Date().getTime();
    const targetTime = targetDate.getTime();

    // Check for invalid date
    if (isNaN(targetTime)) {
      console.error('TechFest Countdown: Invalid target date configuration.');
      if (elements.status) elements.status.textContent = 'Date Error';
      return;
    }

    const distance = targetTime - now;

    // Check if event has already started
    if (distance <= 0) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      if (elements.days) elements.days.textContent = '00';
      if (elements.hours) elements.hours.textContent = '00';
      if (elements.minutes) elements.minutes.textContent = '00';
      if (elements.seconds) elements.seconds.textContent = '00';

      if (elements.grid) elements.grid.style.display = 'none';
      if (elements.finishedState) elements.finishedState.style.display = 'block';
      if (elements.status) elements.status.textContent = 'LIVE NOW';
      return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // DOM Updates
    if (elements.days) elements.days.textContent = padZero(days);
    if (elements.hours) elements.hours.textContent = padZero(hours);
    if (elements.minutes) elements.minutes.textContent = padZero(minutes);
    if (elements.seconds) elements.seconds.textContent = padZero(seconds);
  };

  /**
   * Initialize Countdown
   */
  const init = () => {
    const elements = {
      days: document.getElementById('cd-days'),
      hours: document.getElementById('cd-hours'),
      minutes: document.getElementById('cd-minutes'),
      seconds: document.getElementById('cd-seconds'),
      grid: document.getElementById('countdown-grid'),
      finishedState: document.getElementById('countdown-finished'),
      status: document.getElementById('countdown-status-text')
    };

    // If core elements don't exist on page, abort gracefully
    if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) {
      return;
    }

    const targetDate = new Date(EVENT_DATE_ISO);

    // Initial immediate calculation
    updateCountdown(targetDate, elements);

    // Tick every second (1000ms)
    timerInterval = setInterval(() => {
      updateCountdown(targetDate, elements);
    }, 1000);
  };

  return { init };
})();

// Export globally for script.js
window.TechfestCountdown = Countdown;
