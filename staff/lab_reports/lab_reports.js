/*
  lab_reports.js
  Staff page for managing lab reports
  - Mock data of existing reports
  - "Upload" new report
  - "Back to Dashboard" => staff
*/

/** DOM Refs */
const backButton = document.getElementById("backButton");
const reportsTableBody = document.querySelector("#reportsTable tbody");

const newReportForm = document.getElementById("newReportForm");
const patientNameInput = document.getElementById("patientName");
const testTypeInput = document.getElementById("testType");
const fileInput = document.getElementById("fileInput");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock existing lab reports */
let mockReports = [
  {
    id: 5001,
    patient: "Patient Sarah",
    testType: "Blood Test",
    status: "Completed"
  },
  {
    id: 5002,
    patient: "Patient Fahad",
    testType: "X-Ray",
    status: "Pending"
  }
];

window.onload = () => {
  populateReportsTable();

  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=staff";
  });

  newReportForm.addEventListener("submit", handleNewReport);
};

/**
 * Populate the table
 */
function populateReportsTable() {
  reportsTableBody.innerHTML = "";

  if (mockReports.length === 0) {
    displayInfo("No lab reports found.");
    return;
  }

  mockReports.forEach((rep) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = rep.id;

    const tdPatient = document.createElement("td");
    tdPatient.textContent = rep.patient;

    const tdTest = document.createElement("td");
    tdTest.textContent = rep.testType;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = rep.status;

    const tdAction = document.createElement("td");
    // For demonstration, staff can "mark completed" if pending, or "reopen" if completed
    if (rep.status === "Pending") {
      const completeBtn = document.createElement("button");
      completeBtn.classList.add("action-btn");
      completeBtn.textContent = "Mark Completed";
      completeBtn.onclick = () => handleMarkCompleted(rep.id);

      tdAction.appendChild(completeBtn);
    } else if (rep.status === "Completed") {
      const reopenBtn = document.createElement("button");
      reopenBtn.classList.add("action-btn");
      reopenBtn.textContent = "Reopen";
      reopenBtn.onclick = () => handleReopenReport(rep.id);

      tdAction.appendChild(reopenBtn);
    }

    tr.appendChild(tdId);
    tr.appendChild(tdPatient);
    tr.appendChild(tdTest);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);

    reportsTableBody.appendChild(tr);
  });
}

/** Mark a report as completed */
function handleMarkCompleted(reportId) {
  const found = mockReports.find(r => r.id === reportId);
  if (!found) {
    displayError("Report not found.");
    return;
  }
  found.status = "Completed";
  displayInfo(`Report #${reportId} marked as completed.`);
  populateReportsTable();
}

/** Reopen a completed report */
function handleReopenReport(reportId) {
  const found = mockReports.find(r => r.id === reportId);
  if (!found) {
    displayError("Report not found.");
    return;
  }
  found.status = "Pending";
  displayInfo(`Report #${reportId} reopened for edits.`);
  populateReportsTable();
}

/**
 * Handle new report submission
 */
function handleNewReport(e) {
  e.preventDefault();
  clearMessages();

  const patientName = patientNameInput.value.trim();
  const testType = testTypeInput.value.trim();

  if (!patientName || !testType) {
    displayError("Patient name and test type are required.");
    return;
  }

  // We'll simulate "uploading" the file
  const file = fileInput.files[0];
  if (file) {
    // Just pretend we do something with it
    console.log("File chosen:", file.name);
  }

  // Add new mock report
  const newReport = {
    id: generateNewReportId(),
    patient: patientName,
    testType,
    status: "Pending"
  };

  mockReports.push(newReport);
  displayInfo(`New lab report #${newReport.id} added (status pending).`);

  newReportForm.reset();
  populateReportsTable();
}

/** Generate new ID for lab reports */
function generateNewReportId() {
  let maxId = 0;
  mockReports.forEach(r => {
    if (r.id > maxId) maxId = r.id;
  });
  return maxId + 1;
}

/** Utility: Show info or error */
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
