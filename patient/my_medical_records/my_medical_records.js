/* -----------------------------------------------------------------------
   my_medical_records.js – Patient read‑only view of medical records
   Relies on globals from shared.js (no ES‑module import)
   ----------------------------------------------------------------------- */

/* ---------------------------- Setup ----------------------------------- */
ensureDefaults();                         // from shared.js

const CURRENT_PATIENT = "patient_sarah";

/* ---------------------------- DOM refs -------------------------------- */
const tbody        = document.querySelector("#recordsTable tbody");
const backBtn      = document.getElementById("backButton");
const infoMsg      = document.getElementById("infoMessage");
const errMsg       = document.getElementById("errorMessage");

/* ---------------------------- Init ------------------------------------ */
window.addEventListener("load", () => {
  renderTable();

  backBtn.onclick = () =>
    (window.location.href = "../../index/index.html?role=patient");

  logAction("Open my medical records page | patient");
});

/* =======================================================================
   Render
   ======================================================================= */
function renderTable() {
  tbody.innerHTML = "";

  const data = loadData("medicalRecords").filter(
    r => r.patientName === CURRENT_PATIENT
  );

  if (!data.length) {
    showInfo("No medical records found.");
    return;
  }

  data.forEach(rec => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${fmtDate(rec.lastUpdated || rec.date)}</td>
        <td>${rec.doctor || "—"}</td>
        <td>${rec.diagnosis}</td>
        <td>${rec.prescriptions}</td>
        <td>${rec.labResults}</td>
      </tr>`);
  });
}

/* =======================================================================
   Helpers
   ======================================================================= */
function fmtDate(raw) {
  const d = new Date(raw);
  return isNaN(d) ? (raw || "—") : d.toLocaleDateString();
}

function showInfo (m){ infoMsg.innerText = m; infoMsg.style.display = "block"; errMsg.style.display = "none"; }
function showError(m){ errMsg .innerText = m; errMsg .style.display = "block"; infoMsg.style.display = "none"; }
