/********************************************************************
 * inactivity-handler.js
 * 
 * DEMO: 30s total limit, 20s threshold => show 10s warning.
 ********************************************************************/
const INACTIVITY_LIMIT_MS = 30 * 1000;   // 30 seconds total
const WARNING_THRESHOLD_MS = 20 * 1000;  // 20 seconds => show 10s warning

let lastActivityTime = Date.now();
let warningShown = false;

window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    console.log("Inactivity handler: Timer started (20s warn, 30s logout).");
    setInterval(checkInactivity, 1000);
    resetInactivityTimer();
  } else {
    console.log("Inactivity handler: user is not logged in, ignoring.");
  }
});

function checkInactivity() {
  const elapsed = Date.now() - lastActivityTime;

  // Show warning at 20s
  if (!warningShown && elapsed >= WARNING_THRESHOLD_MS && elapsed < INACTIVITY_LIMIT_MS) {
    alert("Warning: You've been inactive 20s. 10s left before logout!");
    warningShown = true;
  }

  // Logout at 30s
  if (elapsed >= INACTIVITY_LIMIT_MS) {
    forceLogout();
  }
}

function resetInactivityTimer() {
  lastActivityTime = Date.now();
  warningShown = false;
  // we also store for next page load if needed
  localStorage.setItem("lastActivityTime", String(lastActivityTime));
}

function forceLogout() {
  alert("Auto-logout after 30s inactivity! Clearing localStorage and redirecting.");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("lastActivityTime");

  // Because we're inside /patient/appointments_patient/ => 2 levels up to get to /As-Shifa-Project
  // then into /login/login.html
  window.location.href = "../../login/login.html";
}
