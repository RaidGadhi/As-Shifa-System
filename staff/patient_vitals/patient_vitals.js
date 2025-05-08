/* -----------------------------------------------------------------------
   patient_vitals.js – Staff page with AES‑encrypted storage
   ----------------------------------------------------------------------- */

/* ---------------------------- Setup ----------------------------------- */
ensureDefaults();                         // from shared.js
const AES_KEY = "as-shifa-demo-key";      // static demo key (do NOT use in prod)

/* ---------------------------- DOM refs -------------------------------- */
const backBtn  = document.getElementById("backButton");
const searchF  = document.getElementById("searchForm");
const patientSearchInput = document.getElementById("patientSearch");
const vitalsF  = document.getElementById("vitalsForm");

const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const bpInput     = document.getElementById("bloodPressure");
const tempInput   = document.getElementById("temp");
const notesInput  = document.getElementById("notes");

const infoMsg = document.getElementById("infoMessage");
const errMsg  = document.getElementById("errorMessage");

/* ---------------------------- LocalStorage wrapper -------------------- */
function loadVitalsStore()  { return loadData("vitals", {}); }
function saveVitalsStore(o) { saveData("vitals", o); }

/* ---------------------------- Globals --------------------------------- */
let vitalsStore        = loadVitalsStore();
let currentPatientKey  = null;

/* ---------------------------- Init ------------------------------------ */
window.addEventListener("load", () => {
  backBtn.onclick = () =>
    (window.location.href = "../../index/index.html?role=staff");

  searchF .addEventListener("submit", handleSearch);
  vitalsF.addEventListener("submit", handleSave);

  logAction("Open patient vitals page | staff");
});

/* =======================================================================
   Search patient
   ======================================================================= */
function handleSearch(e) {
  e.preventDefault(); clearMsgs();

  const key = patientSearchInput.value.trim().toLowerCase();
  if (!key) { showError("Please enter a patient ID or name."); return; }

  if (vitalsStore[key]) {
    currentPatientKey = key;
    populateForm(decryptVitals(vitalsStore[key]));
    showInfo(`Record found for "${key}".`);
  } else {
    currentPatientKey = null;
    clearForm();
    showError(`No record found for "${key}".`);
  }
}

/* =======================================================================
   Save / update vitals
   ======================================================================= */
function handleSave(e) {
  e.preventDefault(); clearMsgs();

  const key = patientSearchInput.value.trim().toLowerCase();
  if (!key) { showError("Search for a patient first."); return; }

  const vitalsObj = {
    height: parseInt(heightInput.value, 10) || 0,
    weight: parseInt(weightInput.value, 10) || 0,
    bloodPressure: bpInput.value.trim(),
    temp: parseFloat(tempInput.value) || 0,
    notes: notesInput.value.trim(),
    updatedAt: new Date().toISOString()
  };

  const cipher = encryptVitals(vitalsObj);
  vitalsStore[key] = cipher;
  saveVitalsStore(vitalsStore);

  logAction(`Vitals saved (encrypted) | patient=${key}`);
  console.log("🔒 Encrypted:", cipher);
  console.log("🔓 Decrypted:", vitalsObj);

  showInfo("Vitals saved (encrypted).");
  currentPatientKey = key;
}

/* =======================================================================
   Encryption helpers
   ======================================================================= */
function encryptVitals(obj) {
  return CryptoJS.AES.encrypt(JSON.stringify(obj), AES_KEY).toString();
}

function decryptVitals(cipher) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, AES_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return {}; // corrupted or wrong key
  }
}

/* =======================================================================
   Form helpers
   ======================================================================= */
function populateForm(v) {
  heightInput.value = v.height || "";
  weightInput.value = v.weight || "";
  bpInput.value     = v.bloodPressure || "";
  tempInput.value   = v.temp || "";
  notesInput.value  = v.notes || "";
}

function clearForm() {
  heightInput.value = "";
  weightInput.value = "";
  bpInput.value     = "";
  tempInput.value   = "";
  notesInput.value  = "";
}

/* =======================================================================
   UI helpers
   ======================================================================= */
function showInfo (m){ infoMsg.innerText = m; infoMsg.style.display = "block"; errMsg.style.display = "none"; }
function showError(m){ errMsg .innerText = m; errMsg .style.display = "block"; infoMsg.style.display = "none"; }
function clearMsgs(){ infoMsg.style.display="none"; errMsg.style.display="none"; }
