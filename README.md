# TECHFEST 2026 — Official Website

> **Beyond Innovation — Where Ideas Become Reality.**  
> A premium, responsive, production-quality landing page engineered for a flagship college technology festival.

---

## 1. Project Overview

**TECHFEST 2026** is a single-page responsive technology festival web application built strictly with vanilla web standards. Designed with a futuristic, editorial aesthetic inspired by international developer conferences (such as Next.js Conf, GitHub Universe, and ViteConf), this project demonstrates clean frontend architecture, strong visual hierarchy, modular JavaScript, accessibility compliance, and zero third-party dependencies.

- **Event Date:** 21 November 2026
- **Event Time:** 09:00 AM onwards
- **Venue:** Main College Campus
- **Live URL:** `[Live Website URL Placeholder — e.g. https://<username>.github.io/techfest-2026]`

---

## 2. Key Features

- **Live Dynamic Countdown Timer:** Real-time calculation of days, hours, minutes, and seconds until the festival opening with automatic zero-state handling.
- **Student Authentication & Session Manager:** Mandatory client-side student account registration and login (stored securely in browser `localStorage`) before applying for events.
- **Verified Official Event ID Pass & Badge:** Generates an official digital delegate lanyard pass with scannable vector QR code, barcode, security seal, and print-ready PDF stylesheet.
- **"My Passes" Vault Modal:** Logged-in students can view and review all active competition passes they have registered for at any time.
- **Duplicate Registration Prevention:** Enforces one verified pass per competition per student identity.
- **Persistent Dark / Light Theme Engine:** Smooth theme switching powered by CSS Custom Properties and synchronized with browser `localStorage` and system `prefers-color-scheme`.
- **Accessible Sticky Navigation:** Glassmorphic header with dynamic authentication pill, backdrop blur, active section scrollspy tracking, and a fully accessible mobile drawer menu.
- **Interactive Event Showcase:** Responsive CSS Grid featuring 6 flagship competitions with metadata badges and direct registration pre-selection shortcuts.
- **Event Timeline Schedule:** Structured agenda with timeline markers, time slots, and venue badges.
- **Mobile-First Responsive Architecture:** Tested across mobile (360px–390px), tablet (768px–1023px), and desktop (1024px+) viewports.
- **Accessibility & Motion Standards:** Full keyboard navigation, ARIA attributes, semantic landmarks, high contrast ratios, and `prefers-reduced-motion` support.

---

## 3. Technology Stack

This project strictly adheres to native web standards without frameworks, bundlers, or external CSS/JS libraries:

| Layer | Technology |
|---|---|
| **Markup** | HTML5 Semantic Elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) |
| **Styling** | Modern CSS3 (CSS Variables, Flexbox, CSS Grid, `clamp()` fluid typography) |
| **Interactivity** | Vanilla JavaScript (ES6+ Modules, DOM APIs, `setInterval`, `localStorage`) |
| **Icons & Media** | Native Inline SVGs (zero network icon font dependencies) |
| **Hosting & VCS** | Git, GitHub, and GitHub Pages |

---

## 4. Project Architecture

```
techfest-2026/
│
├── index.html                  # Semantic entry point with all festival sections
│
├── css/
│   ├── variables.css           # Color tokens, typography clamps, spacing scale, shadows
│   ├── style.css               # Base styles, component classes, layout rules
│   └── responsive.css          # Breakpoints (Mobile <768px, Tablet 768-1023px, Desktop 1024px+)
│
├── js/
│   ├── countdown.js            # Precise countdown timer logic & zero-state handler
│   ├── theme.js                # Dark/light theme manager & localStorage persistence
│   ├── navigation.js           # Hamburger menu drawer, outside click, scrollspy
│   ├── auth.js                 # Student accounts, authentication, session & pass storage
│   ├── form.js                 # Competition pass application, badge rendering & print handler
│   └── script.js               # Application coordinator initializing all modules on DOMContentLoaded
│
├── assets/
│   ├── icons/
│   │   └── favicon.svg         # Crisp vector brand favicon
│   └── images/
│       └── .gitkeep            # Asset directory for festival photography
│
├── README.md                   # Technical documentation and deployment guide
└── .gitignore                  # Ignore rules for OS & IDE temporary files
```

---

## 5. How to Run Locally

Because the project uses pure vanilla HTML, CSS, and JavaScript, **no build step, Node.js runtime, or package manager installation is required**.

### Method 1: Direct File Opening
Double-click `index.html` or drag it into any modern web browser (Chrome, Firefox, Safari, Edge).

### Method 2: Local HTTP Server (Recommended)
Running through an HTTP server ensures correct origin handling:

- **VS Code Live Server:** Right-click `index.html` and click **"Open with Live Server"**.
- **Python 3:** Run `python -m http.server 8000` in the project root and navigate to `http://localhost:8000`.
- **Node.js (npx):** Run `npx serve .`

---

## 6. Implementation Explanations (Beginner-Friendly)

### A. Live Countdown (`js/countdown.js`)
The countdown calculates the delta between the target festival timestamp (`2026-11-21T09:00:00+05:30`) and the client's current time:
```javascript
const distance = targetDate.getTime() - new Date().getTime();
```
- Remaining days, hours, minutes, and seconds are derived through division and modulo arithmetic.
- Numbers are formatted with `String(val).padStart(2, '0')` to always display two digits (e.g. `09`).
- When `distance <= 0`, `clearInterval()` stops execution and a zero-state banner (`"EVENT STARTED!"`) is displayed.

### B. Theme Persistence (`js/theme.js`)
The application determines theme preference using a 3-tier cascade:
1. User choice stored in browser `localStorage.getItem('techfest-2026-theme')`.
2. System preference queried via `window.matchMedia('(prefers-color-scheme: light)')`.
3. Default dark theme (`data-theme="dark"`).

When the toggle button is clicked, `document.documentElement.setAttribute('data-theme', newTheme)` dynamically swaps all CSS custom properties defined in `css/variables.css`.

### C. Client-Side Form Validation (`js/form.js`)
- Full name is checked to ensure it contains non-whitespace characters (`value.trim().length >= 2`).
- Email format is validated using regex: `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`.
- Event selection verifies a non-empty option value is selected.
- Errors trigger `.has-error` class styles and update `aria-invalid="true"` for screen readers. Real-time listeners clear errors as soon as the user corrects their input.
- On valid submission, `event.preventDefault()` suppresses page refresh and displays a mock ticket pass receipt with a generated alphanumeric identifier (e.g., `TF26-9XK42`).

---

## 7. Screenshots Placeholder

| Dark Mode (Default) | Light Mode |
|---|---|
| ![TechFest 2026 Dark Theme](https://via.placeholder.com/600x340/080B16/22D3EE?text=TechFest+2026+Dark+Theme) | ![TechFest 2026 Light Theme](https://via.placeholder.com/600x340/F8FAFC/7048E8?text=TechFest+2026+Light+Theme) |

| Mobile Navigation | Registration Confirmation |
|---|---|
| ![Mobile View](https://via.placeholder.com/300x500/101629/8B5CF6?text=Mobile+Drawer+Menu) | ![Registration Pass](https://via.placeholder.com/300x500/151E34/10B981?text=Verified+Ticket+Pass) |

---

## 8. Deployment to GitHub Pages

To publish this project live for portfolio presentations or job interviews:

1. **Initialize Git Repository:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete TechFest 2026 production landing page"
   ```

2. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/<your-username>/techfest-2026.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub.
   - Navigate to **Settings** &rarr; **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch **`main`** and folder **`/(root)`**, then click **Save**.
   - Within 1–2 minutes, your live site will be accessible at:  
     `https://<your-username>.github.io/techfest-2026/`

---

## 9. Known Limitations

- **Simulated Form Submission:** In accordance with prompt requirements, the registration form is a frontend-only simulation; registrations are confirmed client-side without permanent server storage.
- **Local Time Zone Awareness:** The target date string includes timezone offset (`+05:30`); countdown calculations render accurately relative to the visitor's local system clock.

---

## 10. License

Created for educational, demonstration, and developer portfolio purposes. Open source under the MIT License.

