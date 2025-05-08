/* -----------------------------------------------------------------------
   prescriptions.js – Doctor creates / edits / deletes prescriptions
   Uses global helpers from shared.js (no ES‑module import)
   ----------------------------------------------------------------------- */

/* ---------------------------- Setup ----------------------------------- */
ensureDefaults();                           // from shared.js

const DOCTOR_NAME = "Dr. Abdullah AlQahtani";

/* ---------------------------- DOM refs -------------------------------- */
const backBtn = document.getElementById("backButton");
const tbody   = document.querySelector("#prescriptionsTable tbody");

const form       = document.getElementById("newPrescriptionForm");
const selPatient = document.getElementById("patientName");
const inputMed   = document.getElementById("medication");
const inputDose  = document.getElementById("dosage");
const inputRefs  = document.getElementById("refills");

const infoMsg = document.getElementById("infoMessage");
const errMsg  = document.getElementById("errorMessage");

/* ---------------------------- Init ------------------------------------ */
window.addEventListener("load", () => {
  buildPatientDropdown();
  renderTable();

  backBtn.onclick = () =>
    (window.location.href = "../../index/index.html?role=doctor");

  form .addEventListener("submit", createRx);
  tbody.addEventListener("click", tableAction);

  logAction("Open prescriptions page | doctor");
});

/* =======================================================================
   Build patient dropdown
   ======================================================================= */
function buildPatientDropdown() {
  const names = new Set();
  loadData("medicalRecords").forEach(r => names.add(r.patientName));
  loadData("appointments")  .forEach(a => names.add(a.patient));
  loadData("prescriptions") .forEach(r => names.add(r.patientName));
  names.add("patient_sarah"); // ensure demo patient exists

  selPatient.innerHTML = "<option value=''>-- Select Patient --</option>";

  if (!names.size) {
    showWarn("No patients in the system yet.");
    return;
  }

  names.forEach(n =>
    selPatient.insertAdjacentHTML("beforeend",
      `<option value="${n}">${n}</option>`));
}

/* =======================================================================
   Render table
   ======================================================================= */
function renderTable() {
  tbody.innerHTML = "";
  const list = loadData("prescriptions").filter(
    r => r.doctor === DOCTOR_NAME
  );

  if (!list.length) { showInfo("No prescriptions."); return; }

  list.forEach(rx => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${rx.id}</td>
        <td>${rx.patientName}</td>
        <td>${rx.medication}</td>
        <td>${rx.dosage}</td>
        <td>${rx.refills}</td>
        <td>
          <button class="action-btn" data-id="${rx.id}" data-act="edit">Edit</button>
          <button class="action-btn" data-id="${rx.id}" data-act="delete">Delete</button>
        </td>
      </tr>`);
  });
}

/* -------------------- table actions ----------------------------------- */
function tableAction(e) {
  if (!e.target.matches(".action-btn")) return;

  const id  = Number(e.target.dataset.id);
  const act = e.target.dataset.act;

  const list = loadData("prescriptions");
  const idx  = list.findIndex(r => r.id === id && r.doctor === DOCTOR_NAME);
  if (idx === -1) { showError("Prescription not found."); return; }

  if (act === "edit") {
    const newDose = prompt("New dosage:", list[idx].dosage);
    if (newDose === null) return;

    const newRef = parseInt(prompt("New refills:", list[idx].refills), 10);
    if (isNaN(newRef)) { showError("Invalid refills."); return; }

    list[idx].dosage  = newDose;
    list[idx].refills = newRef;
    saveData("prescriptions", list);

    logAction(`Rx edited | id=${id} | doctor`);
    showInfo("Prescription updated.");
  }

  if (act === "delete") {
    if (!confirm("Delete this prescription?")) return;
    list.splice(idx, 1);
    saveData("prescriptions", list);

    logAction(`Rx deleted | id=${id} | doctor`);
    showInfo("Prescription deleted.");
  }

  renderTable();
}

/* -------------------- create new Rx ----------------------------------- */
function createRx(e) {
  e.preventDefault();
  clearMessages();

  const patient = selPatient.value.trim();
  const med  = inputMed.value.trim();
  const dose = inputDose.value.trim();
  const refs = parseInt(inputRefs.value, 10);

  if (!patient || !med || !dose || isNaN(refs)) {
    showError("Please fill all fields.");
    return;
  }

  const list  = loadData("prescriptions");
  const newId = Math.max(1000, ...list.map(r => r.id)) + 1;

  list.push({
    id: newId,
    doctor: DOCTOR_NAME,
    patientName: patient,
    medication: med,
    dosage: dose,
    refills: refs
  });

  saveData("prescriptions", list);
  logAction(`Rx created | id=${newId} | patient=${patient}`);
  showInfo("Prescription added.");

  form.reset();
  buildPatientDropdown();
  renderTable();
}

/* =======================================================================
   Helpers
   ======================================================================= */
function showInfo (m){ infoMsg.innerText = m; infoMsg.style.display = "block"; errMsg.style.display = "none"; }
function showError(m){ errMsg .innerText = m; errMsg .style.display = "block"; infoMsg.style.display = "none"; }
function showWarn (m){ infoMsg.innerText = m; infoMsg.style.display = "block"; errMsg.style.display = "none"; }
function clearMessages(){ infoMsg.style.display="none"; errMsg.style.display="none"; }
