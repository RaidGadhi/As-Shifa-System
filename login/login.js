/*
  login.js
  - Multiple user roles (Doctor, Staff, Patient) with unique credentials & TOTP
  - Lockout after 5 failed attempts
  - TOTP only appears after correct username+password
  - On successful TOTP, redirect to "../index/index.html"
  - Persists state in localStorage to handle page refresh gracefully
  - Adds a "Reset Lock (Test Only)" button to unlock after max attempts
*/

/**
 * Mock Users
 * - Doctor:    dr_khan       / AsShifa#2025  / TOTP: 123456
 * - Staff:     nurse_ali     / NursePass1    / TOTP: 654321
 * - Patient:   patient_sarah / SarahPass9    / TOTP: 999999
 */
const mockUsers = [
  {
    role: "doctor",
    username: "dr_khan",
    password: "AsShifa#2025",
    totp: "123456",
  },
  {
    role: "staff",
    username: "nurse_ali",
    password: "NursePass1",
    totp: "654321",
  },
  {
    role: "patient",
    username: "patient_sarah",
    password: "SarahPass9",
    totp: "999999",
  },
];

// Lockout & session
const MAX_FAILED_ATTEMPTS = 5;
let failedAttempts = 0;
let isLoggedIn = false;
let currentUser = null;
let isWaitingForTOTP = false; // tracks if we showed TOTP input

// 1 minute auto logout for demo
const AUTO_LOGOUT_TIME = 60000;
let sessionTimer = null;

/** DOM Elements */
const usernameInput     = document.getElementById("username");
const passwordInput     = document.getElementById("password");
const totpGroup         = document.getElementById("totpGroup");
const totpInput         = document.getElementById("totp");
const loginButton       = document.getElementById("loginButton");
const logoutButton      = document.getElementById("logoutButton");
const resetLockButton   = document.getElementById("resetLockButton");

const errorMessage      = document.getElementById("errorMessage");
const infoMessage       = document.getElementById("infoMessage");
const attemptsInfo      = document.getElementById("attemptsInfo");

/** On load */
window.onload = () => {
  // Load any previous state from localStorage
  loadStateFromStorage();

  // Re-apply the UI based on loaded state
  updateAttemptsInfo();

  // If we were in the TOTP step before the refresh, show TOTP group
  if (isWaitingForTOTP) {
    totpGroup.style.display = "block";
    usernameInput.disabled = true;
    passwordInput.disabled = true;
  } else {
    totpGroup.style.display = "none";
  }

  // If we were already logged in
  if (isLoggedIn) {
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";
  } else {
    loginButton.style.display = "inline-block";
    logoutButton.style.display = "none";
  }
};

/** Event listeners */
loginButton.addEventListener("click", handleLogin);
logoutButton.addEventListener("click", handleLogout);
resetLockButton.addEventListener("click", handleResetLock);

/** Handle login logic */
function handleLogin() {
  clearMessages();

  if (isLoggedIn) {
    displayError("You are already logged in.");
    return;
  }
  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    displayError("Account locked due to too many failed attempts.");
    return;
  }

  // Step 1: If TOTP is hidden, check username + password
  if (!isWaitingForTOTP) {
    checkCredentials(usernameInput.value.trim(), passwordInput.value.trim());
  } else {
    // Step 2: Validate TOTP
    validateTOTP(totpInput.value.trim());
  }
}

/** Check credentials against mockUsers array */
function checkCredentials(username, password) {
  const foundUser = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (foundUser) {
    currentUser = foundUser;
    isWaitingForTOTP = true; // indicates we've passed password step
    displayInfo("Credentials accepted. Please enter your 2FA code.");
    totpGroup.style.display = "block";
    usernameInput.disabled = true;
    passwordInput.disabled = true;
  } else {
    failedAttempts++;
    displayError("Invalid username or password.");
  }

  updateAttemptsInfo();
  saveStateToStorage();
}

/** Validate TOTP */
function validateTOTP(enteredTOTP) {
  if (!currentUser) {
    displayError("No user context found. Please try again.");
    return;
  }

  if (enteredTOTP === currentUser.totp) {
    // Success
    isLoggedIn = true;
    failedAttempts = 0;
    isWaitingForTOTP = false;
    displayInfo("Login successful!");
    updateAttemptsInfo();

    // Hide login button, show logout
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";
    totpGroup.style.display = "none";

    // Start session timer
    startAutoLogoutTimer();

    saveStateToStorage();

    // Redirect after short delay
    setTimeout(() => {
      const targetURL = `../index/index.html?role=${currentUser.role}`;
      window.location.href = targetURL;
    }, 800);

  } else {
    failedAttempts++;
    displayError("Invalid 2FA code.");
    updateAttemptsInfo();

    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      displayError("Account locked. Too many failed attempts.");
      totpInput.disabled = true;
    }
    saveStateToStorage();
  }
}

/** Handle logout */
function handleLogout() {
  if (!isLoggedIn) {
    displayError("You are not logged in.");
    return;
  }

  isLoggedIn = false;
  currentUser = null;
  failedAttempts = 0;
  isWaitingForTOTP = false;

  clearTimeout(sessionTimer);
  sessionTimer = null;

  displayInfo("You have been logged out.");
  updateAttemptsInfo();

  // Reset form & UI
  usernameInput.disabled = false;
  passwordInput.disabled = false;
  totpInput.disabled = false;
  usernameInput.value = "";
  passwordInput.value = "";
  totpInput.value = "";

  loginButton.style.display = "inline-block";
  logoutButton.style.display = "none";
  totpGroup.style.display = "none";

  saveStateToStorage();
}

/** Start auto-logout timer (1 minute) for demonstration */
function startAutoLogoutTimer() {
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    if (isLoggedIn) {
      // End session
      isLoggedIn = false;
      currentUser = null;
      failedAttempts = 0;
      isWaitingForTOTP = false;

      displayInfo("Session timed out. You have been logged out.");
      updateAttemptsInfo();

      usernameInput.disabled = false;
      passwordInput.disabled = false;
      totpInput.disabled = false;
      usernameInput.value = "";
      passwordInput.value = "";
      totpInput.value = "";

      loginButton.style.display = "inline-block";
      logoutButton.style.display = "none";
      totpGroup.style.display = "none";

      saveStateToStorage();
    }
  }, AUTO_LOGOUT_TIME);
}

/** Update attempts info */
function updateAttemptsInfo() {
  attemptsInfo.innerText = `Failed Attempts: ${failedAttempts} / ${MAX_FAILED_ATTEMPTS}`;
}

/** Utility: Display error */
function displayError(msg) {
  errorMessage.style.display = "block";
  errorMessage.innerText = msg;
  infoMessage.style.display = "none";
}

/** Utility: Display info */
function displayInfo(msg) {
  infoMessage.style.display = "block";
  infoMessage.innerText = msg;
  errorMessage.style.display = "none";
}

/** Utility: Clear both messages */
function clearMessages() {
  errorMessage.style.display = "none";
  infoMessage.style.display = "none";
}

/** 
 * Reset lock state for testing 
 */
function handleResetLock() {
  failedAttempts = 0;
  isLoggedIn = false;
  isWaitingForTOTP = false;
  currentUser = null;

  // Re-enable form
  usernameInput.disabled = false;
  passwordInput.disabled = false;
  totpInput.disabled = false;
  totpGroup.style.display = "none";

  // Hide logout, show login
  loginButton.style.display = "inline-block";
  logoutButton.style.display = "none";

  clearMessages();
  displayInfo("Account lock has been reset. Try logging in again.");
  updateAttemptsInfo();

  saveStateToStorage();
}

/** 
 * Persist login state in localStorage 
 */
function saveStateToStorage() {
  const state = {
    failedAttempts,
    isLoggedIn,
    currentUser,
    isWaitingForTOTP
  };
  localStorage.setItem("loginState", JSON.stringify(state));
}

/** 
 * Load state from localStorage 
 */
function loadStateFromStorage() {
  const saved = localStorage.getItem("loginState");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      failedAttempts = parsed.failedAttempts || 0;
      isLoggedIn = parsed.isLoggedIn || false;
      currentUser = parsed.currentUser || null;
      isWaitingForTOTP = parsed.isWaitingForTOTP || false;
    } catch (e) {
      console.warn("Error parsing saved login state:", e);
    }
  }
}
