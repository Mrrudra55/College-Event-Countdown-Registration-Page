/**
 * TECHFEST 2026 — Registration Form Module
 * Handles client-side validation, inline error messaging, real-time clearing,
 * accessible error states, simulated ticket generation, and pre-selection from event cards.
 */

const RegistrationManager = (() => {
  // Regex for reasonable email format validation
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  /**
   * Generates a realistic mock registration ticket code (e.g., TF26-K9P42)
   */
  const generateTicketCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TF26-${code}`;
  };

  /**
   * Sets error state on a field
   * @param {HTMLElement} inputEl
   * @param {HTMLElement} errorEl
   * @param {string} message
   */
  const setError = (inputEl, errorEl, message) => {
    const group = inputEl.closest('.form-group');
    if (group) group.classList.add('has-error');

    inputEl.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  /**
   * Clears error state on a field
   * @param {HTMLElement} inputEl
   * @param {HTMLElement} errorEl
   */
  const clearError = (inputEl, errorEl) => {
    const group = inputEl.closest('.form-group');
    if (group) group.classList.remove('has-error');

    inputEl.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
    }
  };

  /**
   * Initialize Registration Form
   */
  const init = () => {
    const form = document.getElementById('registration-form');
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const eventSelect = document.getElementById('reg-event');

    const nameError = document.getElementById('error-name');
    const emailError = document.getElementById('error-email');
    const eventError = document.getElementById('error-event');

    const successCard = document.getElementById('registration-success');
    const resetBtn = document.getElementById('btn-register-another');

    const receiptName = document.getElementById('receipt-name');
    const receiptEmail = document.getElementById('receipt-email');
    const receiptEvent = document.getElementById('receipt-event');
    const receiptPass = document.getElementById('receipt-pass');

    if (!form || !nameInput || !emailInput || !eventSelect) return;

    // Real-time error clearance on user input
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 0) {
        clearError(nameInput, nameError);
      }
    });

    emailInput.addEventListener('input', () => {
      if (EMAIL_REGEX.test(emailInput.value.trim())) {
        clearError(emailInput, emailError);
      }
    });

    eventSelect.addEventListener('change', () => {
      if (eventSelect.value !== '') {
        clearError(eventSelect, eventError);
      }
    });

    // Form Submission Handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // 1. Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        setError(nameInput, nameError, 'Full name is required and cannot be empty.');
        isValid = false;
      } else if (nameVal.length < 2) {
        setError(nameInput, nameError, 'Please enter a valid name (at least 2 characters).');
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // 2. Validate Email
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        setError(emailInput, emailError, 'Email address is required.');
        isValid = false;
      } else if (!EMAIL_REGEX.test(emailVal)) {
        setError(emailInput, emailError, 'Please enter a valid email address (e.g. name@example.com).');
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // 3. Validate Event Selection
      const eventVal = eventSelect.value;
      if (!eventVal || eventVal === '') {
        setError(eventSelect, eventError, 'Please select an event to participate in.');
        isValid = false;
      } else {
        clearError(eventSelect, eventError);
      }

      // If invalid, focus the first invalid input for accessibility
      if (!isValid) {
        const firstErrorField = form.querySelector('.form-group.has-error .form-input, .form-group.has-error .form-select');
        if (firstErrorField) {
          firstErrorField.focus();
        }
        return;
      }

      // On successful validation: simulate frontend confirmation
      const selectedOptionText = eventSelect.options[eventSelect.selectedIndex].text;
      const passId = generateTicketCode();

      if (receiptName) receiptName.textContent = nameVal;
      if (receiptEmail) receiptEmail.textContent = emailVal;
      if (receiptEvent) receiptEvent.textContent = selectedOptionText;
      if (receiptPass) receiptPass.textContent = passId;

      // Display success feedback
      form.style.display = 'none';
      if (successCard) {
        successCard.style.display = 'block';
        successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Reset button to register another participant
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(eventSelect, eventError);

        if (successCard) successCard.style.display = 'none';
        form.style.display = 'flex';
        nameInput.focus();
      });
    }

    // Connect event card CTA buttons to auto-select the chosen event
    const eventCardButtons = document.querySelectorAll('[data-select-event]');
    eventCardButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetEventVal = btn.getAttribute('data-select-event');
        if (targetEventVal) {
          eventSelect.value = targetEventVal;
          clearError(eventSelect, eventError);

          // If success card was showing, reset view back to form
          if (successCard && successCard.style.display === 'block') {
            form.style.display = 'flex';
            successCard.style.display = 'none';
          }

          // Smooth scroll to register section
          const registerSection = document.getElementById('register');
          if (registerSection) {
            registerSection.scrollIntoView({ behavior: 'smooth' });
          }

          // Focus on the name input after smooth scroll begins
          setTimeout(() => {
            nameInput.focus();
          }, 400);
        }
      });
    });
  };

  return { init };
})();

window.TechfestForm = RegistrationManager;
