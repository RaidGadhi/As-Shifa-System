/* ------------------------------------------------------------------
   As‑Shifa login.js – front‑end login + random 2FA + audit logging
   • Register link (login.html) still points to register.html
   • Works for built‑in users AND newly‑registered patients
------------------------------------------------------------------ */

/* ---------- lightweight helpers (fallback if shared.js missing) ---- */
const loadData = window.loadData || ((k, d = []) => {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : d; }
  catch { return d; }
});
const saveData = window.saveData || ((k, v) => localStorage.setItem(k, JSON.stringify(v)));
const audit    = msg => {
  if (typeof window.logAction === "function") { window.logAction(msg); return; }
  const logs = loadData("auditLog", []);
  logs.push(`${new Date().toLocaleString()} | ${msg}`);
  saveData("auditLog", logs);
};

/* ---------- demo accounts ------------------------------------------ */
const demoEmails = {
  dr_khan:       "dr.khan@example.com",
  nurse_ali:     "nurse.ali@example.com",
  patient_sarah: "patient.sarah@example.com"
};

const mockUsers = [
  { role:"doctor",  username:"dr_khan",       password:"AsShifa#2025", email:demoEmails.dr_khan },
  { role:"staff",   username:"nurse_ali",     password:"NursePass1",   email:demoEmails.nurse_ali },
  { role:"patient", username:"patient_sarah", password:"SarahPass9",   email:demoEmails.patient_sarah }
];

const getAllUsers = () => [...mockUsers, ...loadData("patients", [])];

/* ---------- 2FA helpers --------------------------------------------- */
const gen2FACode = () => Math.floor(100000 + Math.random() * 900000).toString();
function store2FA(email, code) {
  const box = loadData("2faDemoCodes", {});
  box[email.toLowerCase()] = code;
  saveData("2faDemoCodes", box);
}

/* ---------- state ---------------------------------------------------- */
const MAX_FAILED_ATTEMPTS = 5;
const AUTO_LOGOUT_TIME    = 60000; // 1 min demo
let failedAttempts  = 0;
let isLoggedIn      = false;
let currentUser     = null;
let isWaitingForTOTP= false;
let sessionTimer    = null;

/* ---------- DOM refs ------------------------------------------------- */
const usernameInput   = document.getElementById("username");
const passwordInput   = document.getElementById("password");
const totpGroup       = document.getElementById("totpGroup");
const totpInput       = document.getElementById("totp");
const loginButton     = document.getElementById("loginButton");
const logoutButton    = document.getElementById("logoutButton");
const resetLockButton = document.getElementById("resetLockButton");
const errorMessage    = document.getElementById("errorMessage");
const infoMessage     = document.getElementById("infoMessage");
const attemptsInfo    = document.getElementById("attemptsInfo");

/* ---------- UI helpers ---------------------------------------------- */
const showError = t => { errorMessage.textContent=t; errorMessage.style.display="block"; infoMessage.style.display="none"; };
const showInfo  = t => { infoMessage.textContent =t; infoMessage.style.display ="block"; errorMessage.style.display="none"; };
const clearMsgs = () => { errorMessage.style.display = infoMessage.style.display = "none"; };
const updateAttempts = () => attemptsInfo.textContent = `Failed Attempts: ${failedAttempts} / ${MAX_FAILED_ATTEMPTS}`;

/* ---------- persistence --------------------------------------------- */
const saveState = () => saveData("loginState", { failedAttempts, isLoggedIn, currentUser, isWaitingForTOTP });
const loadState = () => {
  const s = loadData("loginState", null);
  if (!s) return;
  failedAttempts   = s.failedAttempts   || 0;
  isLoggedIn       = s.isLoggedIn       || false;
  currentUser      = s.currentUser      || null;
  isWaitingForTOTP = s.isWaitingForTOTP || false;
};

/* ---------- session reset ------------------------------------------- */
function resetSessionState() {
  isLoggedIn = false;
  currentUser = null;
  isWaitingForTOTP = false;
  usernameInput.disabled = passwordInput.disabled = false;
  usernameInput.value = passwordInput.value = totpInput.value = "";
  loginButton.style.display = "inline-block";
  logoutButton.style.display = "none";
  totpGroup.style.display = "none";
  totpInput.disabled = false;
  clearTimeout(sessionTimer);
  updateAttempts();
  saveState();
}

/* ---------- init ----------------------------------------------------- */
window.onload = () => {
  loadState();
  if (isLoggedIn) { audit("Stale session on login → reset"); resetSessionState(); }
  if (isWaitingForTOTP) {
    totpGroup.style.display = "block";
    usernameInput.disabled = passwordInput.disabled = true;
  }
  updateAttempts();
};

/* ---------- events --------------------------------------------------- */
loginButton.onclick     = handleLogin;
logoutButton.onclick    = handleLogout;
resetLockButton.onclick = resetLock;

/* ---------- login flow ---------------------------------------------- */
function handleLogin() {
  clearMsgs();
  if (isLoggedIn) return showError("You are already logged in.");
  if (failedAttempts >= MAX_FAILED_ATTEMPTS) return showError("Account locked.");
  !isWaitingForTOTP
    ? checkCredentials(usernameInput.value.trim(), passwordInput.value.trim())
    : validateTOTP(totpInput.value.trim());
}

function checkCredentials(user, pass) {
  const found = getAllUsers().find(u => u.username === user && u.password === pass);

  if (found) {
    const code  = gen2FACode();
    const email = found.email || `${found.username}@example.com`;
    store2FA(email, code);

    currentUser      = { ...found, totp: code };
    isWaitingForTOTP = true;

    showInfo("Credentials accepted. Enter the 2FA code sent to your email.");
    totpGroup.style.display = "block";
    usernameInput.disabled = passwordInput.disabled = true;
    audit(`Password OK for ${user}; 2FA code ${code} → ${email}`);
  } else {
    failedAttempts++;
    showError("Invalid username or password.");
    audit(`Failed login for ${user || "(blank user)"}`);
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) audit(`Account locked for ${user || "(blank user)"}`);
  }
  updateAttempts(); saveState();
}

function validateTOTP(code) {
  if (!currentUser) return showError("No user context found.");

  if (code === currentUser.totp) {
    isLoggedIn = true; failedAttempts = 0; isWaitingForTOTP = false;
    showInfo("Login successful!");
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";
    totpGroup.style.display = "none";
    audit(`Login success for ${currentUser.username} (${currentUser.role})`);
    startAutoLogoutTimer();
    saveState();
    setTimeout(() => location.href = `../index/index.html?role=${currentUser.role}`, 800);
  } else {
    failedAttempts++;
    showError("Invalid 2FA code.");
    audit(`Invalid TOTP for ${currentUser.username}`);
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      showError("Account locked. Too many failed attempts.");
      totpInput.disabled = true;
      audit(`Account locked for ${currentUser.username}`);
    }
    updateAttempts(); saveState();
  }
}

/* ---------- logout / reset ------------------------------------------ */
function handleLogout() {
  if (!isLoggedIn) return showError("You are not logged in.");
  audit(`Logout by ${currentUser.username}`);
  clearTimeout(sessionTimer);
  resetSessionState();
  showInfo("You have been logged out.");
}

function resetLock() {
  audit("Lock reset (test)");
  failedAttempts = 0;
  totpInput.disabled = false;
  resetSessionState();
  showInfo("Account lock reset. Try again.");
}

/* ---------- auto‑logout timer --------------------------------------- */
function startAutoLogoutTimer() {
  clearTimeout(sessionTimer);
  sessionTimer = setTimeout(() => {
    if (isLoggedIn) {
      audit(`Session timeout for ${currentUser.username}`);
      resetSessionState();
      showInfo("Session timed out. You have been logged out.");
    }
  }, AUTO_LOGOUT_TIME);
}
