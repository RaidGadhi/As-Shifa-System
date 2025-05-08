/* -----------------------------------------------------------------------
   lab_reports.js – Staff: add / complete / reopen lab reports
   Relies on globals from shared.js (no ES‑module import)
   ----------------------------------------------------------------------- */

/* ---------------------------- Setup ----------------------------------- */
ensureDefaults();                         // from shared.js

/* ---------------------------- DOM refs -------------------------------- */
const backBtn   = document.getElementById("backButton");
const tbody     = document.querySelector("#reportsTable tbody");

const newF       = document.getElementById("newReportForm");
const selPatient = document.getElementById("patientName");
const inputTest  = document.getElementById("testType");

const infoMsg = document.getElementById("infoMessage");
const errMsg  = document.getElementById("errorMessage");

/* ---------------------------- Data load / seed ------------------------ */
let reports = loadData("labReports");

if (!reports.length) {
  reports = [
    { id: 5001, patient: "patient_sarah", testType: "Blood Test", status: "Completed" },
    { id: 5002, patient: "Patient Fahad", testType: "X‑Ray",      status: "Pending"   }
  ];
  saveData("labReports", reports);
}

/* ---------------------------- Init ------------------------------------ */
window.addEventListener("load", () => {
  buildPatientDropdown();
  renderTable();

  backBtn.onclick = () =>
    (window.location.href = "../../index/index.html?role=staff");

  newF .addEventListener("submit", addReport);
  tbody.addEventListener("click", rowAction);

  logAction("Open lab reports page | staff");
});

/* =======================================================================
   Build patient dropdown
   ======================================================================= */
function buildPatientDropdown() {
  const names = new Set();
  loadData("medicalRecords").forEach(r => names.add(r.patientName));
  loadData("appointments")  .forEach(a => names.add(a.patient));
  loadData("prescriptions") .forEach(r => names.add(r.patientName));
  loadData("labReports")    .forEach(r => names.add(r.patient));

  selPatient.innerHTML = "<option value=''>-- Select Patient --</option>";
  names.forEach(n =>
    selPatient.insertAdjacentHTML("beforeend",
      `<option value="${n}">${n}</option>`));
}

/* =======================================================================
   Render table
   ======================================================================= */
function renderTable() {
  tbody.innerHTML = "";
  if (!reports.length) { showInfo("No lab reports."); return; }

  reports.forEach(rep => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${rep.id}</td>
        <td>${rep.patient}</td>
        <td>${rep.testType}</td>
        <td>${rep.status}</td>
        <td>
          ${rep.status === "Pending"
            ? `<button class="action-btn" data-id="${rep.id}" data-act="complete">Mark Completed</button>`
            : `<button class="action-btn" data-id="${rep.id}" data-act="reopen">Reopen</button>`}
        </td>
      </tr>`);
  });
}

/* =======================================================================
   Add new report
   ======================================================================= */
function addReport(e) {
  e.preventDefault(); clearMsgs();

  const patient = selPatient.value.trim();
  const test    = inputTest.value.trim();

  if (!patient || !test) {
    showError("Patient and test type are required.");
    return;
  }

  const newId = Math.max(5000, ...reports.map(r => r.id)) + 1;
  reports.push({ id: newId, patient, testType: test, status: "Pending" });
  saveData("labReports", reports);

  logAction(`Lab report added | id=${newId} | ${patient}`);
  showInfo(`Report #${newId} added (Pending).`);

  newF.reset();
  renderTable();
}

/* =======================================================================
   Row actions
   ======================================================================= */
function rowAction(e) {
  if (!e.target.matches(".action-btn")) return;

  const id  = Number(e.target.dataset.id);
  const act = e.target.dataset.act;

  const idx = reports.findIndex(r => r.id === id);
  if (idx === -1) { showError("Report not found."); return; }

  if (act === "complete") {
    reports[idx].status = "Completed";
    logAction(`Lab report completed | id=${id}`);
  }

  if (act === "reopen") {
    reports[idx].status = "Pending";
    logAction(`Lab report reopened | id=${id}`);
  }

  saveData("labReports", reports);
  renderTable();
}

/* =======================================================================
   Helpers
   ======================================================================= */
function showInfo (m){ infoMsg.innerText = m; infoMsg.style.display = "block"; errMsg.style.display = "none"; }
function showError(m){ errMsg.innerText = m; errMsg.style.display = "block"; infoMsg.style.display = "none"; }
function clearMsgs(){ infoMsg.style.display="none"; errMsg.style.display="none"; }
