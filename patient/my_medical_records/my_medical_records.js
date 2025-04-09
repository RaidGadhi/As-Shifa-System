/*
  my_medical_records.js
  - Mock data for the patient's medical records
  - Populates the table
  - "Back to Dashboard" button => ../index/index.html?role=patient
*/

/** DOM Elements */
const recordsTableBody = document.querySelector("#recordsTable tbody");
const backButton = document.getElementById("backButton");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock Medical Records (for demonstration) */
const mockRecords = [
  {
    date: "2025-03-10",
    doctor: "Dr. Abdullah AlQahtani",
    diagnosis: "Type 2 Diabetes - Stable",
    prescriptions: "Metformin 500mg",
    labResults: "HbA1c: 6.8%"
  },
  {
    date: "2025-03-22",
    doctor: "Dr. Sarah AlMohanna",
    diagnosis: "Seasonal Allergies",
    prescriptions: "Cetirizine 10mg",
    labResults: "Allergy Test Panel: Positive for pollen"
  },
  {
    date: "2025-04-05",
    doctor: "Dr. Abdullah AlQahtani",
    diagnosis: "Follow-up - Diabetes",
    prescriptions: "Metformin 500mg, Vitamin D supplement",
    labResults: "HbA1c: 6.5%"
  },
];

/** On page load, populate the table with mock data */
window.onload = () => {
  populateRecordsTable();
};

/** Populate the table with the mockRecords array */
function populateRecordsTable() {
  // Clear existing rows
  recordsTableBody.innerHTML = "";

  if (mockRecords.length === 0) {
    displayInfo("No medical records found.");
    return;
  }

  // Create a row for each record
  mockRecords.forEach(record => {
    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    tdDate.textContent = record.date;

    const tdDoctor = document.createElement("td");
    tdDoctor.textContent = record.doctor;

    const tdDiagnosis = document.createElement("td");
    tdDiagnosis.textContent = record.diagnosis;

    const tdPrescriptions = document.createElement("td");
    tdPrescriptions.textContent = record.prescriptions;

    const tdLabResults = document.createElement("td");
    tdLabResults.textContent = record.labResults;

    tr.appendChild(tdDate);
    tr.appendChild(tdDoctor);
    tr.appendChild(tdDiagnosis);
    tr.appendChild(tdPrescriptions);
    tr.appendChild(tdLabResults);

    recordsTableBody.appendChild(tr);
  });
}

/** Handle messages */
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

/** "Back to Dashboard" => patient role */
backButton.addEventListener("click", () => {
  window.location.href = "../../index/index.html?role=patient";
});
