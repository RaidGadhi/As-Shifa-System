/*
  appointments_patient.js
  - Mock data for upcoming appointments
  - Functions to cancel an appointment or book a new one
  - "Back to Dashboard" => ../index/index.html?role=patient
*/

/** DOM references */
const appointmentsTableBody = document.querySelector("#appointmentsTable tbody");
const bookingForm = document.getElementById("bookingForm");
const doctorSelect = document.getElementById("doctorSelect");

const backButton = document.getElementById("backButton");
const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Example Mock Doctors List */
const mockDoctors = [
  { name: "Dr. Abdullah AlQahtani" },
  { name: "Dr. Sarah AlMohanna" },
  { name: "Dr. Samer Aziz" }
];

/** Example Mock Appointments */
let mockAppointments = [
  {
    id: 1,
    datetime: "2025-04-15T10:30",
    doctor: "Dr. Abdullah AlQahtani",
    status: "Confirmed"
  },
  {
    id: 2,
    datetime: "2025-04-20T14:00",
    doctor: "Dr. Sarah AlMohanna",
    status: "Pending"
  }
];

/** On page load */
window.onload = () => {
  populateAppointmentsTable();
  populateDoctorSelect();

  // Event listeners
  bookingForm.addEventListener("submit", handleBookingForm);
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=patient";
  });
};

/**
 * Populates appointments table with mockAppointments
 */
function populateAppointmentsTable() {
  appointmentsTableBody.innerHTML = "";

  if (mockAppointments.length === 0) {
    displayInfo("No upcoming appointments found.");
    return;
  }

  mockAppointments.forEach(appt => {
    const tr = document.createElement("tr");

    // Date & Time
    const tdDateTime = document.createElement("td");
    tdDateTime.textContent = formatDateTime(appt.datetime);

    // Doctor
    const tdDoctor = document.createElement("td");
    tdDoctor.textContent = appt.doctor;

    // Status
    const tdStatus = document.createElement("td");
    tdStatus.textContent = appt.status;

    // Actions
    const tdAction = document.createElement("td");
    // We add some action buttons
    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("action-btn");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => handleCancelAppointment(appt.id);

    // Optional: Reschedule button
    const rescheduleBtn = document.createElement("button");
    rescheduleBtn.classList.add("action-btn");
    rescheduleBtn.textContent = "Reschedule";
    rescheduleBtn.onclick = () => handleRescheduleAppointment(appt.id);

    tdAction.appendChild(cancelBtn);
    tdAction.appendChild(rescheduleBtn);

    tr.appendChild(tdDateTime);
    tr.appendChild(tdDoctor);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);

    appointmentsTableBody.appendChild(tr);
  });
}

/**
 * Populates the doctorSelect dropdown
 */
function populateDoctorSelect() {
  // Clear existing options
  doctorSelect.innerHTML = "<option value=''>--Select a Doctor--</option>";
  mockDoctors.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.name;
    opt.textContent = doc.name;
    doctorSelect.appendChild(opt);
  });
}

/**
 * Handle booking form submission
 */
function handleBookingForm(e) {
  e.preventDefault();

  const datetime = document.getElementById("appointmentDate").value;
  const doctor = document.getElementById("doctorSelect").value;

  if (!datetime || !doctor) {
    displayError("Please select date/time and doctor.");
    return;
  }

  // Create new mock appointment
  const newAppt = {
    id: mockAppointments.length + 1,
    datetime,
    doctor,
    status: "Pending"
  };

  mockAppointments.push(newAppt);

  displayInfo("Appointment requested! Status: Pending");
  bookingForm.reset();
  populateAppointmentsTable();
}

/**
 * Cancel an appointment
 */
function handleCancelAppointment(apptId) {
  // Simple example: remove from array
  mockAppointments = mockAppointments.filter(a => a.id !== apptId);
  displayInfo("Appointment has been canceled.");
  populateAppointmentsTable();
}

/**
 * Reschedule an appointment
 *  - For this mock, let's just change the status or show a prompt
 */
function handleRescheduleAppointment(apptId) {
  const newDateTime = prompt("Enter new date/time (YYYY-MM-DDTHH:mm):", "");
  if (!newDateTime) {
    displayError("Reschedule canceled or invalid input.");
    return;
  }

  // Update the appointment in mock data
  const found = mockAppointments.find(a => a.id === apptId);
  if (found) {
    found.datetime = newDateTime;
    found.status = "Pending";
    displayInfo("Appointment rescheduled to " + formatDateTime(newDateTime) + " (Pending)");
    populateAppointmentsTable();
  }
}

/**
 * Utility: Format date/time for display
 */
function formatDateTime(dtString) {
  // Basic example
  const dt = new Date(dtString);
  if (isNaN(dt.getTime())) return dtString; // fallback if invalid
  return dt.toLocaleString(); // e.g. "4/15/2025, 10:30:00 AM"
}

/**
 * Display info message
 */
function displayInfo(msg) {
  infoMessage.style.display = "block";
  infoMessage.innerText = msg;
  errorMessage.style.display = "none";
}

/**
 * Display error message
 */
function displayError(msg) {
  errorMessage.style.display = "block";
  errorMessage.innerText = msg;
  infoMessage.style.display = "none";
}
