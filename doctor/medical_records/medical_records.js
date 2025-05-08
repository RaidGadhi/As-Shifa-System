/* -----------------------------------------------------------------------
   medical_records.js – Doctor view: search & edit medical records
   Relies on globals from shared.js (no ES‑module import)
   ----------------------------------------------------------------------- */

/* ---------------------------- Setup ----------------------------------- */
ensureDefaults();                         // from shared.js

const DOCTOR_NAME = "Dr. Abdullah AlQahtani";

/* ---------------------------- DOM refs -------------------------------- */
const backBtn   = document.getElementById("backButton");
const searchF   = document.getElementById("searchForm");
const qInput    = document.getElementById("patientSearch");
const tbody     = document.querySelector("#recordsTable tbody");

const modal     = document.getElementById("editModal");
const modalClose= document.getElementById("closeEditModal");
const editF     = document.getElementById("editForm");
const fldDiag   = document.getElementById("editDiagnosis");
const fldRx     = document.getElementById("editPrescriptions");
const fldLab    = document.getElementById("editLabResults");

const infoMsg = document.getElementById("infoMessage");
const errMsg  = document.getElementById("errorMessage");

/* ---------------------------- Data load / seed ------------------------ */
let records = loadData("medicalRecords");

/* seed demo */
if (!records.length) {
  records = [
    {
      id: 101,
      patientName: "patient_sarah",
      doctor: DOCTOR_NAME,
      diagnosis: "Type 2 Diabetes",
      prescriptions: "Metformin 500 mg",
      labResults: "HbA1c 7.2%"
    },
    {
      id: 102,
      patientName: "Patient Fahad",
      doctor: DOCTOR_NAME,
      diagnosis: "Hypertension",
      prescriptions: "Amlodipine 5 mg",
      labResults: "BP 145/90"
    }
  ];
  saveData("medicalRecords", records);
}

/* ---------------------------- Globals --------------------------------- */
let editIdx = null;

/* ---------------------------- Init ------------------------------------ */
window.addEventListener("load", () => {
  render(records);

  backBtn.onclick  = () =>
    (window.location.href = "../../index/index.html?role=doctor");

  searchF.onsubmit = e => { e.preventDefault(); doSearch(); };

  modalClose.onclick = () => (modal.style.display = "none");
  modal.onclick      = e => { if (e.target === modal) modal.style.display = "none"; };

  editF.onsubmit = saveEdit;

  logAction("Open medical records page | doctor");
});

/* =======================================================================
   Rendering
   ======================================================================= */
function render(list) {
  tbody.innerHTML = "";
  if (!list.length) { showInfo("No records."); return; }

  list.forEach((r, i) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${r.id}</td>
        <td>${r.patientName}</td>
        <td>${r.diagnosis}</td>
        <td>${r.prescriptions}</td>
        <td>${r.labResults}</td>
        <td><button class="action-btn" data-idx="${i}">Edit</button></td>
      </tr>`);
  });
}

/* click “Edit” */
tbody.onclick = e => {
  if (!e.target.matches(".action-btn")) return;

  editIdx = Number(e.target.dataset.idx);
  const r = records[editIdx];

  fldDiag.value = r.diagnosis;
  fldRx.value   = r.prescriptions;
  fldLab.value  = r.labResults;

  modal.style.display = "flex";
};

/* =======================================================================
   Search
   ======================================================================= */
function doSearch() {
  const q = qInput.value.trim().toLowerCase();
  if (!q) { render(records); return; }

  const filtered = records.filter(r =>
    String(r.id).includes(q) || r.patientName.toLowerCase().includes(q)
  );
  render(filtered);
}

/* =======================================================================
   Save edits
   ======================================================================= */
function saveEdit(e) {
  e.preventDefault();
  if (editIdx === null) { showError("No record selected."); return; }

  const rec = records[editIdx];
  rec.diagnosis     = fldDiag.value.trim();
  rec.prescriptions = fldRx.value.trim();
  rec.labResults    = fldLab.value.trim();
  rec.lastUpdated   = new Date().toISOString();

  saveData("medicalRecords", records);
  logAction(`Record updated | id=${rec.id} | ${rec.patientName}`);
  modal.style.display = "none";
  showInfo("Record updated.");
  render(records);
}

/* =======================================================================
   Helpers
   ======================================================================= */
function showInfo (m){ infoMsg.innerText = m; infoMsg.style.display = "block"; errMsg.style.display = "none"; }
function showError(m){ errMsg.innerText = m; errMsg.style.display = "block"; infoMsg.style.display = "none"; }
