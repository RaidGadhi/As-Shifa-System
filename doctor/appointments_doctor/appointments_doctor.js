/*
  appointments_doctor.js
  - Doctor's interface for upcoming appointments + adding availability slots
  - Mock data for demonstration
  - "Back to Dashboard" => index.html?role=doctor
*/

/** DOM References */
const backButton = document.getElementById("backButton");
const appointmentsTableBody = document.querySelector("#appointmentsTable tbody");

const availabilityForm = document.getElementById("availabilityForm");
const availDateTimeInput = document.getElementById("availDateTime");
const availabilityList = document.getElementById("availabilityList");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock upcoming appointments */
let mockAppointments = [
  {
    id: 1,
    datetime: "2025-06-10T10:00",
    patient: "Faisal Alqarni",
    status: "Confirmed"
  },
  {
    id: 2,
    datetime: "2025-06-12T14:30",
    patient: "Raid Gadhi",
    status: "Pending"
  }
];

/** Mock availability slots */
let mockAvailability = [
  "2025-06-15T09:00",
  "2025-06-15T09:30",
];

window.onload = () => {
  populateAppointmentsTable();
  populateAvailabilityList();

  // Events
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=doctor";
  });

  availabilityForm.addEventListener("submit", handleAddAvailability);
};

/**
 * Populate the table with upcoming appointments
 */
function populateAppointmentsTable() {
  appointmentsTableBody.innerHTML = "";

  if (mockAppointments.length === 0) {
    displayInfo("No upcoming appointments found.");
    return;
  }

  mockAppointments.forEach(appt => {
    const tr = document.createElement("tr");

    const tdDateTime = document.createElement("td");
    tdDateTime.textContent = formatDateTime(appt.datetime);

    const tdPatient = document.createElement("td");
    tdPatient.textContent = appt.patient;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = appt.status;

    const tdAction = document.createElement("td");
    // Example "Complete" or "Cancel"
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("action-btn");
    completeBtn.textContent = "Complete";
    completeBtn.onclick = () => handleCompleteAppointment(appt.id);

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("action-btn");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => handleCancelAppointment(appt.id);

    tdAction.appendChild(completeBtn);
    tdAction.appendChild(cancelBtn);

    tr.appendChild(tdDateTime);
    tr.appendChild(tdPatient);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);

    appointmentsTableBody.appendChild(tr);
  });
}

/**
 * Format date/time
 */
function formatDateTime(dtString) {
  const dt = new Date(dtString);
  if (isNaN(dt.getTime())) return dtString;
  return dt.toLocaleString();
}

/**
 * Mark an appointment as "Completed"
 */
function handleCompleteAppointment(apptId) {
  const appt = mockAppointments.find(a => a.id === apptId);
  if (!appt) {
    displayError("Appointment not found.");
    return;
  }
  appt.status = "Completed";
  displayInfo(`Appointment #${apptId} marked as completed.`);
  populateAppointmentsTable();
}

/**
 * Cancel an appointment
 */
function handleCancelAppointment(apptId) {
  if (!confirm("Are you sure you want to cancel this appointment?")) return;
  mockAppointments = mockAppointments.filter(a => a.id !== apptId);
  displayInfo(`Appointment #${apptId} canceled.`);
  populateAppointmentsTable();
}

/**
 * Populate the list of availability
 */
function populateAvailabilityList() {
  availabilityList.innerHTML = "";

  if (mockAvailability.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No availability slots added.";
    availabilityList.appendChild(li);
    return;
  }

  mockAvailability.forEach(slot => {
    const li = document.createElement("li");
    li.textContent = formatDateTime(slot);

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-slot-btn");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => handleRemoveSlot(slot);
    li.appendChild(removeBtn);

    availabilityList.appendChild(li);
  });
}

/**
 * Handle adding new availability slot
 */
function handleAddAvailability(e) {
  e.preventDefault();
  clearMessages();

  const dtValue = availDateTimeInput.value.trim();
  if (!dtValue) {
    displayError("Please select a date/time.");
    return;
  }

  // Just add to mock array
  mockAvailability.push(dtValue);
  displayInfo("New availability slot added.");
  availabilityForm.reset();
  populateAvailabilityList();
}

/**
 * Remove an availability slot
 */
function handleRemoveSlot(slotValue) {
  mockAvailability = mockAvailability.filter(s => s !== slotValue);
  displayInfo("Slot removed.");
  populateAvailabilityList();
}

/** Utility: Messages */
function displayInfo(msg) {
  infoMessage.style.display = "block";
  infoMessage.innerText = msg;
  errorMessage.style.display = "none";
}

function displayError(msg) {
  errorMessage.style.display = "block";
  errorMessage.innerText = msg;
  infoMessage.style.display = "none";
}

function clearMessages() {
  infoMessage.style.display = "none";
  errorMessage.style.display = "none";
}
