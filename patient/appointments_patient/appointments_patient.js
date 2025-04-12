/* appointments_patient.js */

// DOM references
const appointmentsTableBody = document.querySelector("#appointmentsTable tbody");
const bookingForm = document.getElementById("bookingForm");
const doctorSelect = document.getElementById("doctorSelect");
const backButton = document.getElementById("backButton");
const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

// Example Mock Doctors List
const mockDoctors = [
  { name: "Dr. Abdullah AlQahtani" },
  { name: "Dr. Sarah AlMohanna" },
  { name: "Dr. Samer Aziz" }
];

// Example Mock Appointments
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

window.onload = () => {
  populateAppointmentsTable();
  populateDoctorSelect();

  bookingForm.addEventListener("submit", handleBookingForm);
  backButton.addEventListener("click", () => {
    // "Meaningful action": user clicked to go back
    resetInactivityTimer();
    window.location.href = "../../index/index.html?role=patient";
  });

  // (1) For quick testing: ensure isLoggedIn is "true"
  //    If you have a real login flow, remove this line.
  if (localStorage.getItem("isLoggedIn") !== "true") {
    localStorage.setItem("isLoggedIn", "true");
    console.log("For DEMO: forced isLoggedIn=true so inactivity timer runs.");
  }
};

/**
 * Populate the appointments table
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
    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("action-btn");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => {
      resetInactivityTimer(); // user clicked "Cancel"
      handleCancelAppointment(appt.id);
    };

    const rescheduleBtn = document.createElement("button");
    rescheduleBtn.classList.add("action-btn");
    rescheduleBtn.textContent = "Reschedule";
    rescheduleBtn.onclick = () => {
      resetInactivityTimer(); // user clicked "Reschedule"
      handleRescheduleAppointment(appt.id);
    };

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
 * Populate the doctorSelect dropdown
 */
function populateDoctorSelect() {
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

  resetInactivityTimer(); // user performed "Book Appointment"

  const datetime = document.getElementById("appointmentDate").value;
  const doctor = document.getElementById("doctorSelect").value;

  if (!datetime || !doctor) {
    displayError("Please select date/time and doctor.");
    return;
  }

  const newAppt = {
    id: mockAppointments.length + 1,
    datetime,
    doctor,
    status: "Pending"
  };

  mockAppointments.push(newAppt);

  displayInfo("Appointment requested! Status: Pending.");
  bookingForm.reset();
  populateAppointmentsTable();
}

/**
 * Cancel appointment
 */
function handleCancelAppointment(apptId) {
  mockAppointments = mockAppointments.filter(a => a.id !== apptId);
  displayInfo("Appointment canceled.");
  populateAppointmentsTable();
}

/**
 * Reschedule
 */
function handleRescheduleAppointment(apptId) {
  const newDateTime = prompt("Enter new date/time (YYYY-MM-DDTHH:mm):", "");
  if (!newDateTime) {
    displayError("Reschedule canceled or invalid input.");
    return;
  }
  const found = mockAppointments.find(a => a.id === apptId);
  if (found) {
    found.datetime = newDateTime;
    found.status = "Pending";
    displayInfo("Appointment rescheduled to " + formatDateTime(newDateTime) + ".");
    populateAppointmentsTable();
  }
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
 * Info / Error messages
 */
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
