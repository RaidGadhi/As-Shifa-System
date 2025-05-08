/* -----------------------------------------------------------------------
   prescription_refills.js – Patient requests refills
   Relies on globals from shared.js (no ES‑module import)
   ----------------------------------------------------------------------- */

/* ---------------------------- Setup ----------------------------------- */
ensureDefaults();                         // from shared.js

const PATIENT = "patient_sarah";

/* ---------------------------- DOM refs -------------------------------- */
const tbody   = document.querySelector("#prescriptionsTable tbody");
const medSel  = document.getElementById("medicationSelect");
const form    = document.getElementById("refillForm");
const backBtn = document.getElementById("backButton");
const infoMsg = document.getElementById("infoMessage");
const errMsg  = document.getElementById("errorMessage");

/* ---------------------------- Init ------------------------------------ */
window.addEventListener("load", () => {
  renderTableAndDropdown();

  form .addEventListener("submit", submitRefill);
  tbody.addEventListener("click", inlineAction);
  backBtn.addEventListener("click",
    () => (window.location.href = "../../index/index.html?role=patient")
  );

  logAction("Open prescription refills page | patient");
});

/* =======================================================================
   Render table + dropdown
   ======================================================================= */
function renderTableAndDropdown() {
  const rxs = loadData("prescriptions").filter(
    r => r.patientName === PATIENT
  );

  /* --- table --- */
  tbody.innerHTML = "";
  if (!rxs.length) {
    showInfo("No prescriptions.");
    medSel.innerHTML = "";
    return;
  }

  rxs.forEach(rx => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${rx.medication}</td>
        <td>${rx.dosage}</td>
        <td>${rx.refills}</td>
        <td>${rx.refills > 0 ? "Active" : "Expired"}</td>
        <td>
          ${rx.refills > 0
            ? `<button class="action-btn" data-id="${rx.id}">Request Refill</button>`
            : "N/A"}
        </td>
      </tr>`);
  });

  /* --- dropdown --- */
  medSel.innerHTML = "<option value=''>-- Select Medication --</option>";
  rxs.filter(r => r.refills > 0).forEach(rx => {
    medSel.insertAdjacentHTML("beforeend", `
      <option value="${rx.id}">
        ${rx.medication} (${rx.dosage}) – ${rx.refills} left
      </option>`);
  });
}

/* -------------------- inline-button handler --------------------------- */
function inlineAction(e) {
  if (!e.target.matches(".action-btn")) return;
  requestRefill(Number(e.target.dataset.id));
}

/* -------------------- form submit ------------------------------------ */
function submitRefill(e) {
  e.preventDefault();
  const id = Number(medSel.value);
  if (!id) { showError("Select a medication."); return; }
  requestRefill(id);
}

/* =======================================================================
   Core refill logic
   ======================================================================= */
function requestRefill(id) {
  const rxs = loadData("prescriptions");
  const rx  = rxs.find(r => r.id === id && r.patientName === PATIENT);

  if (!rx)             { showError("Prescription not found."); return; }
  if (rx.refills <= 0) { showError("No refills left.");        return; }

  rx.refills--;
  saveData("prescriptions", rxs);

  logAction(`Refill requested | Rx=${id} | patient`);
  showInfo("Refill requested.");
  renderTableAndDropdown();
}

/* =======================================================================
   Helpers
   ======================================================================= */
function showInfo (m){ infoMsg.innerText = m; infoMsg.style.display = "block"; errMsg.style.display = "none"; }
function showError(m){ errMsg .innerText = m; errMsg .style.display = "block"; infoMsg.style.display = "none"; }
