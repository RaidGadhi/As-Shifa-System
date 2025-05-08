/* -------------------------------------------------------------------------
   appointments_patient.js – Patient view & actions
   Relies on globals from shared.js (already loaded)
   ------------------------------------------------------------------------- */

/* ---------------------------- Config ----------------------------------- */
const CURRENT_PATIENT = "patient_sarah";
const DEFAULT_DOCTOR  = "Dr. Abdullah AlQahtani";

/* ---------------------------- Ensure storage --------------------------- */
ensureDefaults();          // provided by shared.js
seedDemoAppointment();

/* ---------------------------- DOM refs -------------------------------- */
const tbody        = document.querySelector("#appointmentsTable tbody");
const form         = document.getElementById("bookingForm");
const dateInput    = document.getElementById("appointmentDate");
const doctorSelect = document.getElementById("doctorSelect");
const backBtn      = document.getElementById("backButton");
const infoMsg      = document.getElementById("infoMessage");
const errorMsg     = document.getElementById("errorMessage");

/* ---------------------------- Init ------------------------------------ */
window.addEventListener("load", () => {
  populateDoctorSelect();
  renderTable();

  form.addEventListener("submit", handleBooking);
  tbody.addEventListener("click", handleRowAction);
  backBtn.addEventListener("click", () =>
    (window.location.href = "../../index/index.html?role=patient")
  );

  logAction("Open appointments page | patient");
});

/* =======================================================================
   Helper Functions
   ======================================================================= */
function seedDemoAppointment() {
  const appts = loadData("appointments");
  if (appts.length) return;                // already seeded

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  appts.push({
    id:       1,
    datetime: tomorrow.toISOString().slice(0,16), // YYYY‑MM‑DDTHH:mm
    doctor:   DEFAULT_DOCTOR,
    patient:  CURRENT_PATIENT,
    status:   "Pending"
  });
  saveData("appointments", appts);
}

function populateDoctorSelect() {
  doctorSelect.innerHTML = `
    <option value="">‑‑ Select Doctor ‑‑</option>
    <option value="${DEFAULT_DOCTOR}">${DEFAULT_DOCTOR}</option>`;
}

function renderTable() {
  tbody.innerHTML = "";
  const rows = loadData("appointments")
      .filter(a => a.patient === CURRENT_PATIENT);

  if (!rows.length) { showInfo("No appointments."); return; }

  rows.forEach(a => {
    const editable = a.status !== "Completed";
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${formatDate(a.datetime)}</td>
        <td>${a.doctor}</td>
        <td>${a.status}</td>
        <td>
          ${editable ? `
            <button class="action-btn" data-id="${a.id}" data-act="cancel">Cancel</button>
            <button class="action-btn" data-id="${a.id}" data-act="reschedule">Reschedule</button>` : ""}
        </td>
      </tr>`);
  });
}

function handleBooking(e) {
  e.preventDefault();

  const dt  = dateInput.value.trim();
  const doc = doctorSelect.value.trim();

  if (!dt || !doc) { showError("Choose a date/time and a doctor."); return; }

  const appts = loadData("appointments");
  const newAppt = {
    id:       Date.now(),  // unique demo id
    datetime: dt,
    doctor:   doc,
    patient:  CURRENT_PATIENT,
    status:   "Pending"
  };
  appts.push(newAppt);
  saveData("appointments", appts);
  logAction(`Appointment booked | id=${newAppt.id} | ${doc} | ${dt}`);

  form.reset();
  showInfo("Appointment request sent (Pending).");
  renderTable();
}

function handleRowAction(e) {
  if (!e.target.matches(".action-btn")) return;

  const id  = Number(e.target.dataset.id);
  const act = e.target.dataset.act;

  const appts = loadData("appointments");
  const idx   = appts.findIndex(a => a.id === id && a.patient === CURRENT_PATIENT);
  if (idx === -1) { showError("Appointment not found."); return; }

  if (act === "cancel") {
    appts.splice(idx, 1);
    saveData("appointments", appts);
    logAction(`Appointment cancelled | id=${id} | ${CURRENT_PATIENT}`);
    showInfo("Appointment cancelled.");
  }

  if (act === "reschedule") {
    const newDT = prompt("Enter new date/time (YYYY‑MM‑DDTHH:mm):", appts[idx].datetime);
    if (!newDT) return;
    appts[idx].datetime = newDT;
    appts[idx].status   = "Pending";
    saveData("appointments", appts);
    logAction(`Appointment rescheduled | id=${id} | new=${newDT}`);
    showInfo("Appointment rescheduled.");
  }

  renderTable();
}

const formatDate = d => {
  const t = new Date(d);
  return isNaN(t) ? d : t.toLocaleString();
};

function showInfo (msg){ infoMsg .innerText = msg; infoMsg .style.display = "block"; errorMsg.style.display = "none"; }
function showError(msg){ errorMsg.innerText = msg; errorMsg.style.display = "block"; infoMsg .style.display = "none"; }
