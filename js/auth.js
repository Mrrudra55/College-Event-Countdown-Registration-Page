/**
 * INNOVEX 2026 — Authentication & Session Manager
 * Manages user registration, login, logout, and persisted session states in browser localStorage.
 */

const AuthManager = (() => {
  const STORAGE_USERS = 'innovex_2026_users';
  const STORAGE_SESSION = 'innovex_2026_session';
  const STORAGE_PASSES = 'innovex_2026_passes';

  /**
   * Retrieves all registered users from localStorage
   * @returns {Array<Object>}
   */
  const getUsers = () => {
    try {
      const data = localStorage.getItem(STORAGE_USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading users from localStorage:', e);
      return [];
    }
  };

  /**
   * Saves users array to localStorage
   * @param {Array<Object>} users
   */
  const saveUsers = (users) => {
    try {
      localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
    }
  };

  /**
   * Gets currently logged in user session
   * @returns {Object|null}
   */
  const getCurrentUser = () => {
    try {
      const data = localStorage.getItem(STORAGE_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading session from localStorage:', e);
      return null;
    }
  };

  /**
   * Sets the active user session
   * @param {Object} user
   */
  const setSession = (user) => {
    try {
      // Store session without plain password
      const sessionUser = {
        id: user.id,
        name: user.name,
        collegeId: user.collegeId,
        email: user.email.toLowerCase().trim()
      };
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(sessionUser));
      notifyAuthChange(sessionUser);
    } catch (e) {
      console.error('Error setting session in localStorage:', e);
    }
  };

  /**
   * Clears the active session (Logout)
   */
  const clearSession = () => {
    try {
      localStorage.removeItem(STORAGE_SESSION);
      notifyAuthChange(null);
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  };

  /**
   * Broadcasts an auth change event for UI reactivity
   * @param {Object|null} user
   */
  const notifyAuthChange = (user) => {
    const event = new CustomEvent('techfestAuthChange', { detail: { user } });
    document.dispatchEvent(event);
  };

  /**
   * Registers a new user account
   * @param {string} name
   * @param {string} collegeId
   * @param {string} email
   * @param {string} password
   * @returns {{success: boolean, message: string, user?: Object}}
   */
  const register = (name, collegeId, email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    const users = getUsers();

    // Check for existing account with same email
    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please log in.' };
    }

    const newUser = {
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      collegeId: collegeId.trim().toUpperCase(),
      email: cleanEmail,
      password: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    setSession(newUser);

    return { success: true, message: 'Account created successfully! You are now logged in.', user: newUser };
  };

  /**
   * Logs in an existing user
   * @param {string} email
   * @param {string} password
   * @returns {{success: boolean, message: string, user?: Object}}
   */
  const login = (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    const users = getUsers();

    const user = users.find((u) => u.email === cleanEmail);
    if (!user) {
      return { success: false, message: 'No account found with this email. Please check or create an account.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    setSession(user);
    return { success: true, message: 'Logged in successfully!', user };
  };

  /**
   * Retrieves all event passes stored in localStorage
   * @returns {Array<Object>}
   */
  const getAllPasses = () => {
    try {
      const data = localStorage.getItem(STORAGE_PASSES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading passes:', e);
      return [];
    }
  };

  /**
   * Gets passes specifically issued to the current user
   * @param {string} userEmail
   * @returns {Array<Object>}
   */
  const getUserPasses = (userEmail) => {
    if (!userEmail) return [];
    const cleanEmail = userEmail.toLowerCase().trim();
    const passes = getAllPasses();
    return passes.filter((p) => p.userEmail.toLowerCase().trim() === cleanEmail);
  };

  /**
   * Saves a newly generated event entry pass
   * @param {Object} passData
   * @returns {{success: boolean, message: string, pass?: Object}}
   */
  const savePass = (passData) => {
    try {
      const passes = getAllPasses();

      // Check if user already registered for this specific competition
      const alreadyRegistered = passes.some(
        (p) => p.userEmail.toLowerCase().trim() === passData.userEmail.toLowerCase().trim() && p.eventId === passData.eventId
      );

      if (alreadyRegistered) {
        return {
          success: false,
          message: `You already hold a verified pass for ${passData.eventName}. You can view or print it from your passes.`
        };
      }

      passes.push(passData);
      localStorage.setItem(STORAGE_PASSES, JSON.stringify(passes));
      return { success: true, message: 'Pass issued successfully!', pass: passData };
    } catch (e) {
      console.error('Error saving pass:', e);
      return { success: false, message: 'Failed to issue pass. Please try again.' };
    }
  };

  /**
   * Pre-seed a sample demo student user if empty for immediate testing
   */
  const seedDemoIfEmpty = () => {
    const users = getUsers();
    if (users.length === 0) {
      const demoUser = {
        id: 'USR-DEMO1',
        name: 'Alex Rivera',
        collegeId: 'TECH-2026-089',
        email: 'alex@university.edu',
        password: 'password123',
        createdAt: new Date().toISOString()
      };
      saveUsers([demoUser]);
    }
  };

  const init = () => {
    seedDemoIfEmpty();
  };

  return {
    init,
    getCurrentUser,
    register,
    login,
    clearSession,
    getUserPasses,
    savePass
  };
})();

window.TechfestAuth = AuthManager;
