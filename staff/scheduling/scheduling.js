/*
  scheduling.js
  Staff scheduling page logic
  - Manages new appointment requests, checks doctor availability, approves or rejects
  - "Back to Dashboard" => index with role=staff
*/

/** DOM refs */
const backButton = document.getElementById("backButton");
const requestsTableBody = document.querySelector("#requestsTable tbody");
const availabilityList = document.getElementById("availabilityList");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock Appointment Requests */
let mockRequests = [
  {
    id: 1001,
    datetime: "2025-08-15T09:00",
    patient: "Patient Ali",
    doctor: "Dr. Abdullah",
    status: "Pending"
  },
  {
    id: 1002,
    datetime: "2025-08-16T13:30",
    patient: "Patient Reem",
    doctor: "Dr. Sarah",
    status: "Pending"
  }
];

/** Mock Doctor Availability */
let mockDoctorAvailability = [
  { doctor: "Dr. Abdullah", slot: "2025-08-15T09:00" },
  { doctor: "Dr. Abdullah", slot: "2025-08-15T10:00" },
  { doctor: "Dr. Sarah", slot: "2025-08-16T13:30" },
];

window.onload = () => {
  populateRequestsTable();
  populateAvailabilityList();

  // Return to staff dashboard
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=staff";
  });
};

/**
 * Populate the requests table
 */
function populateRequestsTable() {
  requestsTableBody.innerHTML = "";

  if (mockRequests.length === 0) {
    displayInfo("No appointment requests pending.");
    return;
  }

  mockRequests.forEach((req) => {
    const tr = document.createElement("tr");

    const tdDateTime = document.createElement("td");
    tdDateTime.textContent = formatDateTime(req.datetime);

    const tdPatient = document.createElement("td");
    tdPatient.textContent = req.patient;

    const tdDoctor = document.createElement("td");
    tdDoctor.textContent = req.doctor;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = req.status;

    const tdAction = document.createElement("td");
    if (req.status === "Pending") {
      const approveBtn = document.createElement("button");
      approveBtn.classList.add("action-btn");
      approveBtn.textContent = "Approve";
      approveBtn.onclick = () => handleApprove(req.id);

      const rejectBtn = document.createElement("button");
      rejectBtn.classList.add("action-btn");
      rejectBtn.textContent = "Reject";
      rejectBtn.onclick = () => handleReject(req.id);

      tdAction.appendChild(approveBtn);
      tdAction.appendChild(rejectBtn);
    } else {
      tdAction.textContent = "No Action";
    }

    tr.appendChild(tdDateTime);
    tr.appendChild(tdPatient);
    tr.appendChild(tdDoctor);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);

    requestsTableBody.appendChild(tr);
  });
}

/**
 * Approve an appointment if a matching doctor slot is available
 */
function handleApprove(reqId) {
  const req = mockRequests.find(r => r.id === reqId);
  if (!req) {
    displayError("Request not found.");
    return;
  }

  // Check matching availability
  const available = mockDoctorAvailability.some(av => {
    return av.doctor === req.doctor && av.slot === req.datetime;
  });

  if (!available) {
    displayError("No matching availability slot for this request.");
    return;
  }

  req.status = "Approved";
  displayInfo(`Appointment #${reqId} approved successfully.`);
  populateRequestsTable();
}

/**
 * Reject a request
 */
function handleReject(reqId) {
  const req = mockRequests.find(r => r.id === reqId);
  if (!req) {
    displayError("Request not found.");
    return;
  }
  req.status = "Rejected";
  displayInfo(`Appointment #${reqId} rejected.`);
  populateRequestsTable();
}

/**
 * Display doctor availability
 */
function populateAvailabilityList() {
  availabilityList.innerHTML = "";

  if (mockDoctorAvailability.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No availability slots found.";
    availabilityList.appendChild(li);
    return;
  }

  mockDoctorAvailability.forEach(av => {
    const li = document.createElement("li");
    li.textContent = `${av.doctor} - ${formatDateTime(av.slot)}`;
    availabilityList.appendChild(li);
  });
}

/** Format date/time */
function formatDateTime(dtString) {
  const dt = new Date(dtString);
  if (isNaN(dt.getTime())) return dtString;
  return dt.toLocaleString();
}

/** Utility: info/error */
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
