/* -----------------------------------------------------------------------
   appointments_doctor.js – doctor view: complete / delete appointments
   Relies on globals from shared.js (loadData, saveData, logAction, etc.)
   ----------------------------------------------------------------------- */

/* -------------------------------------------------- Setup ------------- */
ensureDefaults();                         // global from shared.js

const DOCTOR_NAME = "Dr. Abdullah AlQahtani";

/* -------------------------------------------------- DOM refs ---------- */
const backBtn = document.getElementById("backButton");
const tbody   = document.querySelector("#appointmentsTable tbody");
const infoMsg = document.getElementById("infoMessage");
const errMsg  = document.getElementById("errorMessage");

/* -------------------------------------------------- Init -------------- */
window.addEventListener("load", () => {
  renderTable();

  backBtn.onclick = () =>
    (window.location.href = "../../index/index.html?role=doctor");

  logAction("Open appointments page | doctor");
});

/* =======================================================================
   Rendering & actions
   ======================================================================= */
function renderTable() {
  tbody.innerHTML = "";
  const appts = loadData("appointments").filter(
    a => a.doctor === DOCTOR_NAME
  );

  if (!appts.length) { showInfo("No appointments."); return; }

  appts.forEach(a => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${fmt(a.datetime)}</td>
        <td>${a.patient}</td>
        <td>${a.status}</td>
        <td>
          ${a.status !== "Completed"
            ? `<button class="action-btn" data-id="${a.id}" data-act="complete">Complete</button>`
            : ""}
          <button class="action-btn" data-id="${a.id}" data-act="delete">Delete</button>
        </td>
      </tr>`);
  });
}

/* -------------------- row‑level actions ------------------------------- */
tbody.addEventListener("click", e => {
  if (!e.target.matches(".action-btn")) return;

  const id  = Number(e.target.dataset.id);
  const act = e.target.dataset.act;

  const appts = loadData("appointments");
  const idx   = appts.findIndex(a => a.id === id && a.doctor === DOCTOR_NAME);
  if (idx === -1) { showError("Appointment not found."); return; }

  if (act === "complete") {
    appts[idx].status = "Completed";
    saveData("appointments", appts);
    logAction(`Appointment completed | id=${id} | ${DOCTOR_NAME}`);
    showInfo(`Appointment #${id} marked completed.`);
  }

  if (act === "delete") {
    appts.splice(idx, 1);
    saveData("appointments", appts);
    logAction(`Appointment deleted | id=${id} | ${DOCTOR_NAME}`);
    showInfo(`Appointment #${id} deleted.`);
  }

  renderTable();
});

/* =======================================================================
   Tiny helpers
   ======================================================================= */
const fmt = d => {
  const x = new Date(d);
  return isNaN(x) ? d : x.toLocaleString();
};

function showInfo (msg){ infoMsg .innerText = msg; infoMsg .style.display = "block"; errMsg.style.display = "none"; }
function showError(msg){ errMsg .innerText = msg; errMsg .style.display = "block"; infoMsg.style.display = "none"; }
