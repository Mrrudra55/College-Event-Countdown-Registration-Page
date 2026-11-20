/**
 * INNOVEX 2026 — Registration, Authentication & Official ID Pass Module
 * Enforces mandatory login/registration before competition application.
 * Generates verified, printable Student Event ID Passes stored in localStorage.
 */

const RegistrationManager = (() => {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Metadata for event venues and schedules (Event Date: 26 November 2026)
  const EVENT_DETAILS = {
    'code-arena': {
      name: 'Code Arena (Programming)',
      venue: 'Computer Laboratory',
      time: '10:00 AM, 26 Nov 2026',
      badgeColor: '#8B5CF6'
    },
    'hack-the-future': {
      name: 'Hack the Future (Hackathon)',
      venue: 'Innovation Hall',
      time: '02:00 PM, 26 Nov 2026',
      badgeColor: '#22D3EE'
    },
    'webcraft': {
      name: 'WebCraft (Web Development)',
      venue: 'Innovation Lab',
      time: '11:00 AM, 26 Nov 2026',
      badgeColor: '#10B981'
    },
    'robo-wars': {
      name: 'Robo Wars (Robotics)',
      venue: 'Robotics Arena',
      time: '02:00 PM, 26 Nov 2026',
      badgeColor: '#F59E0B'
    },
    'brainbyte': {
      name: 'BrainByte (Technical Quiz)',
      venue: 'Main Auditorium',
      time: '12:00 PM, 26 Nov 2026',
      badgeColor: '#EC4899'
    },
    'project-expo': {
      name: 'Project Expo (Innovation)',
      venue: 'Innovation Hall',
      time: '02:00 PM, 26 Nov 2026',
      badgeColor: '#6366F1'
    }
  };

  let pendingEventId = '';

  /**
   * Helper: Generate official formatted pass number
   */
  const generatePassNumber = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `INX26-PAS-${randomDigits}`;
  };

  /**
   * Helper: Show inline field error
   */
  const setFieldError = (inputEl, errorEl, message) => {
    const group = inputEl.closest('.form-group');
    if (group) group.classList.add('has-error');
    inputEl.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'flex';
    }
  };

  /**
   * Helper: Clear inline field error
   */
  const clearFieldError = (inputEl, errorEl) => {
    const group = inputEl.closest('.form-group');
    if (group) group.classList.remove('has-error');
    inputEl.removeAttribute('aria-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  };

  /**
   * Updates Navbar authentication widget
   * @param {Object|null} user
   */
  const updateNavbarAuth = (user) => {
    const navAuth = document.getElementById('nav-auth-container');
    if (!navAuth) return;

    if (user) {
      const userPasses = window.TechfestAuth ? window.TechfestAuth.getUserPasses(user.email) : [];
      const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
      const firstName = user.name ? user.name.split(' ')[0] : 'Student';

      navAuth.innerHTML = `
        <div class="user-pill" title="Signed in as ${user.name}">
          <span class="user-avatar">${initial}</span>
          <span class="user-name">${firstName}</span>
        </div>
        <button type="button" class="btn btn-sm btn-secondary btn-passes" id="nav-btn-my-passes" title="View my festival passes">
          My Passes <span class="pass-count-badge">${userPasses.length}</span>
        </button>
        <button type="button" class="btn-text-logout" id="nav-btn-logout" title="Sign out of account">
          Sign Out
        </button>
      `;

      const passesBtn = document.getElementById('nav-btn-my-passes');
      if (passesBtn) {
        passesBtn.addEventListener('click', () => openMyPassesModal());
      }

      const logoutBtn = document.getElementById('nav-btn-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          if (window.TechfestAuth) window.TechfestAuth.clearSession();
        });
      }
    } else {
      navAuth.innerHTML = `
        <a href="#register" class="btn btn-sm btn-secondary btn-nav-signin" id="nav-btn-signin">
          Sign In
        </a>
      `;
      const signinBtn = document.getElementById('nav-btn-signin');
      if (signinBtn) {
        signinBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const regSec = document.getElementById('register');
          if (regSec) regSec.scrollIntoView({ behavior: 'smooth' });
          switchAuthTab('login');
        });
      }
    }
  };

  /**
   * Switches between Login and Create Account tabs
   * @param {'login'|'register'} tabName
   */
  const switchAuthTab = (tabName) => {
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');
    const formLogin = document.getElementById('auth-form-login');
    const formRegister = document.getElementById('auth-form-register');

    if (!tabLogin || !tabRegister || !formLogin || !formRegister) return;

    if (tabName === 'login') {
      tabLogin.classList.add('active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabRegister.classList.remove('active');
      tabRegister.setAttribute('aria-selected', 'false');

      formLogin.style.display = 'flex';
      formRegister.style.display = 'none';
      const emailInput = document.getElementById('login-email');
      if (emailInput) emailInput.focus();
    } else {
      tabRegister.classList.add('active');
      tabRegister.setAttribute('aria-selected', 'true');
      tabLogin.classList.remove('active');
      tabLogin.setAttribute('aria-selected', 'false');

      formRegister.style.display = 'flex';
      formLogin.style.display = 'none';
      const nameInput = document.getElementById('signup-name');
      if (nameInput) nameInput.focus();
    }
  };

  /**
   * Refreshes the registration section based on authentication state
   * @param {Object|null} user
   */
  const renderPortalState = (user) => {
    const authGate = document.getElementById('auth-gate-container');
    const appPortal = document.getElementById('event-application-container');
    const passDisplay = document.getElementById('active-pass-container');

    if (!authGate || !appPortal || !passDisplay) return;

    if (!user) {
      // User is logged out: show login/register gate
      authGate.style.display = 'block';
      appPortal.style.display = 'none';
      passDisplay.style.display = 'none';
    } else {
      // User is logged in: show competition application form
      authGate.style.display = 'none';
      passDisplay.style.display = 'none';
      appPortal.style.display = 'block';

      // Update student profile summary in application card
      const userNameEl = document.getElementById('app-user-name');
      const userCollegeEl = document.getElementById('app-user-college');
      const userEmailEl = document.getElementById('app-user-email');

      if (userNameEl) userNameEl.textContent = user.name;
      if (userCollegeEl) userCollegeEl.textContent = user.collegeId;
      if (userEmailEl) userEmailEl.textContent = user.email;

      // If an event was selected via event card click, apply it
      const eventSelect = document.getElementById('apply-event-select');
      if (eventSelect && pendingEventId) {
        eventSelect.value = pendingEventId;
      }
    }
  };

  /**
   * Renders the Official TechFest 2026 Digital ID Pass
   * @param {Object} pass
   */
  const renderOfficialPass = (pass) => {
    const appPortal = document.getElementById('event-application-container');
    const passDisplay = document.getElementById('active-pass-container');

    if (!passDisplay) return;
    if (appPortal) appPortal.style.display = 'none';
    passDisplay.style.display = 'block';

    // Populate pass elements
    document.getElementById('pass-badge-id').textContent = pass.passId;
    document.getElementById('pass-student-name').textContent = pass.userName;
    document.getElementById('pass-student-college').textContent = pass.collegeId;
    document.getElementById('pass-student-email').textContent = pass.userEmail;
    document.getElementById('pass-event-name').textContent = pass.eventName;
    document.getElementById('pass-event-venue').textContent = pass.venue;
    document.getElementById('pass-event-time').textContent = pass.time;
    document.getElementById('pass-issued-date').textContent = new Date(pass.issuedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    passDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  /**
   * Opens the "My Registered Passes" modal
   */
  const openMyPassesModal = () => {
    const modal = document.getElementById('my-passes-modal');
    const listContainer = document.getElementById('my-passes-list');
    const user = window.TechfestAuth ? window.TechfestAuth.getCurrentUser() : null;

    if (!modal || !listContainer) return;

    if (!user) {
      listContainer.innerHTML = '<p class="modal-empty-msg">Please sign in to view your registered passes.</p>';
    } else {
      const passes = window.TechfestAuth.getUserPasses(user.email);
      if (passes.length === 0) {
        listContainer.innerHTML = `
          <div class="modal-empty-msg">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <p>You have not applied for any competitions yet.</p>
            <a href="#events" class="btn btn-sm btn-primary" onclick="document.getElementById('my-passes-modal').close()">
              Explore Flagship Events
            </a>
          </div>
        `;
      } else {
        listContainer.innerHTML = passes
          .map(
            (p) => `
            <div class="user-pass-card">
              <div class="user-pass-header">
                <span class="user-pass-id">${p.passId}</span>
                <span class="user-pass-status">Verified Pass</span>
              </div>
              <h4 class="user-pass-event">${p.eventName}</h4>
              <div class="user-pass-meta">
                <span>📍 ${p.venue}</span>
                <span>⏰ ${p.time}</span>
              </div>
              <div class="user-pass-actions">
                <button type="button" class="btn btn-sm btn-secondary btn-view-single-pass" data-pass-id="${p.passId}">
                  Display Badge
                </button>
              </div>
            </div>
          `
          )
          .join('');

        // Wire click listener for "Display Badge" buttons
        listContainer.querySelectorAll('.btn-view-single-pass').forEach((btn) => {
          btn.addEventListener('click', () => {
            const pid = btn.getAttribute('data-pass-id');
            const targetPass = passes.find((item) => item.passId === pid);
            if (targetPass) {
              modal.close();
              renderOfficialPass(targetPass);
            }
          });
        });
      }
    }

    modal.showModal();
  };

  /**
   * Initialize All Forms & Event Listeners
   */
  const init = () => {
    // 1. Initial auth state synchronization
    const initialUser = window.TechfestAuth ? window.TechfestAuth.getCurrentUser() : null;
    updateNavbarAuth(initialUser);
    renderPortalState(initialUser);

    // Listen to auth changes dispatched by AuthManager
    document.addEventListener('techfestAuthChange', (e) => {
      const user = e.detail ? e.detail.user : null;
      updateNavbarAuth(user);
      renderPortalState(user);
    });

    // 2. Auth Tab Buttons
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');

    if (tabLogin) tabLogin.addEventListener('click', () => switchAuthTab('login'));
    if (tabRegister) tabRegister.addEventListener('click', () => switchAuthTab('register'));

    // 3. Login Form Submission
    const loginForm = document.getElementById('auth-form-login');
    const loginEmail = document.getElementById('login-email');
    const loginPass = document.getElementById('login-password');
    const loginError = document.getElementById('login-error-msg');

    if (loginForm && loginEmail && loginPass) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = loginEmail.value.trim();
        const passVal = loginPass.value;

        if (!emailVal) {
          setFieldError(loginEmail, loginError, 'Email address is required.');
          return;
        }
        if (!passVal) {
          setFieldError(loginPass, loginError, 'Password is required.');
          return;
        }

        const res = window.TechfestAuth.login(emailVal, passVal);
        if (!res.success) {
          if (loginError) {
            loginError.textContent = res.message;
            loginError.style.display = 'block';
          }
        } else {
          loginForm.reset();
          if (loginError) loginError.style.display = 'none';
        }
      });
    }

    // 4. Registration Form Submission
    const signupForm = document.getElementById('auth-form-register');
    const signupName = document.getElementById('signup-name');
    const signupCollege = document.getElementById('signup-college-id');
    const signupEmail = document.getElementById('signup-email');
    const signupPass = document.getElementById('signup-password');
    const signupError = document.getElementById('signup-error-msg');

    if (signupForm && signupName && signupCollege && signupEmail && signupPass) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = signupName.value.trim();
        const collegeVal = signupCollege.value.trim();
        const emailVal = signupEmail.value.trim();
        const passVal = signupPass.value;

        if (!nameVal || nameVal.length < 2) {
          setFieldError(signupName, signupError, 'Full name is required (minimum 2 characters).');
          return;
        }
        if (!collegeVal || collegeVal.length < 3) {
          setFieldError(signupCollege, signupError, 'Valid Student / College ID is required.');
          return;
        }
        if (!emailVal || !EMAIL_REGEX.test(emailVal)) {
          setFieldError(signupEmail, signupError, 'Please enter a valid email address.');
          return;
        }
        if (!passVal || passVal.length < 6) {
          setFieldError(signupPass, signupError, 'Password must be at least 6 characters.');
          return;
        }

        const res = window.TechfestAuth.register(nameVal, collegeVal, emailVal, passVal);
        if (!res.success) {
          if (signupError) {
            signupError.textContent = res.message;
            signupError.style.display = 'block';
          }
        } else {
          signupForm.reset();
          if (signupError) signupError.style.display = 'none';
        }
      });
    }

    // 5. In-Portal Sign Out Button
    const portalLogoutBtn = document.getElementById('portal-logout-btn');
    if (portalLogoutBtn) {
      portalLogoutBtn.addEventListener('click', () => {
        if (window.TechfestAuth) window.TechfestAuth.clearSession();
      });
    }

    // 6. Competition Pass Application Form
    const applyForm = document.getElementById('event-application-form');
    const applySelect = document.getElementById('apply-event-select');
    const applyError = document.getElementById('apply-error-msg');

    if (applyForm && applySelect) {
      applySelect.addEventListener('change', () => {
        if (applySelect.value !== '') {
          clearFieldError(applySelect, applyError);
        }
      });

      applyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentUser = window.TechfestAuth ? window.TechfestAuth.getCurrentUser() : null;

        if (!currentUser) {
          renderPortalState(null);
          return;
        }

        const eventVal = applySelect.value;
        if (!eventVal || !EVENT_DETAILS[eventVal]) {
          setFieldError(applySelect, applyError, 'Please choose a competition to apply for.');
          return;
        }

        const eventMeta = EVENT_DETAILS[eventVal];
        const passRecord = {
          passId: generatePassNumber(),
          userEmail: currentUser.email,
          userName: currentUser.name,
          collegeId: currentUser.collegeId,
          eventId: eventVal,
          eventName: eventMeta.name,
          venue: eventMeta.venue,
          time: eventMeta.time,
          issuedAt: new Date().toISOString()
        };

        const res = window.TechfestAuth.savePass(passRecord);
        if (!res.success) {
          if (applyError) {
            applyError.textContent = res.message;
            applyError.style.display = 'block';
          }
        } else {
          if (applyError) applyError.style.display = 'none';
          pendingEventId = '';
          updateNavbarAuth(currentUser);
          renderOfficialPass(passRecord);
        }
      });
    }

    // 7. Pass Badge Buttons (Print Pass & Apply Another)
    const printBtn = document.getElementById('btn-print-pass');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const applyAnotherBtn = document.getElementById('btn-apply-another');
    if (applyAnotherBtn) {
      applyAnotherBtn.addEventListener('click', () => {
        const currentUser = window.TechfestAuth ? window.TechfestAuth.getCurrentUser() : null;
        renderPortalState(currentUser);
      });
    }

    const viewAllPassesBtn = document.getElementById('btn-view-all-passes');
    if (viewAllPassesBtn) {
      viewAllPassesBtn.addEventListener('click', () => {
        openMyPassesModal();
      });
    }

    // 8. Close Modal Listeners
    const modal = document.getElementById('my-passes-modal');
    const closeModalBtn = document.getElementById('modal-close-btn');
    if (modal && closeModalBtn) {
      closeModalBtn.addEventListener('click', () => modal.close());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
      });
    }

    // 9. Event Cards "Register for this event" Buttons Pre-selection Handler
    const selectButtons = document.querySelectorAll('[data-select-event]');
    selectButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetEventVal = btn.getAttribute('data-select-event');
        pendingEventId = targetEventVal || '';

        const currentUser = window.TechfestAuth ? window.TechfestAuth.getCurrentUser() : null;
        const regSection = document.getElementById('register');

        if (regSection) {
          regSection.scrollIntoView({ behavior: 'smooth' });
        }

        if (currentUser) {
          renderPortalState(currentUser);
          if (applySelect && pendingEventId) {
            applySelect.value = pendingEventId;
          }
        } else {
          switchAuthTab('login');
          const loginTip = document.getElementById('auth-prompt-badge');
          if (loginTip && targetEventVal && EVENT_DETAILS[targetEventVal]) {
            loginTip.textContent = `Please sign in or register to apply for ${EVENT_DETAILS[targetEventVal].name}`;
            loginTip.style.display = 'block';
          }
        }
      });
    });
  };

  return { init };
})();

window.TechfestForm = RegistrationManager;
