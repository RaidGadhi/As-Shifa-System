/*
  medical_records.js
  - Doctor's interface for searching & editing patient records
  - Mock data simulating a list of patient records
  - "Back to Dashboard" => index with role=doctor
*/

/** DOM References */
const backButton = document.getElementById("backButton");
const searchForm = document.getElementById("searchForm");
const patientSearchInput = document.getElementById("patientSearch");

const recordsTableBody = document.querySelector("#recordsTable tbody");

const editModal = document.getElementById("editModal");
const closeEditModal = document.getElementById("closeEditModal");
const editForm = document.getElementById("editForm");

const editDiagnosis = document.getElementById("editDiagnosis");
const editPrescriptions = document.getElementById("editPrescriptions");
const editLabResults = document.getElementById("editLabResults");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock data: array of patient records */
let mockRecords = [
  {
    id: 101,
    patientName: "Faisal Alqarni",
    diagnosis: "Type 2 Diabetes",
    prescriptions: "Metformin 500mg",
    labResults: "HbA1c: 7.2%"
  },
  {
    id: 202,
    patientName: "Raid Gadhi",
    diagnosis: "Hypertension",
    prescriptions: "Amlodipine 5mg",
    labResults: "Blood Pressure: 145/90"
  },
  {
    id: 303,
    patientName: "Zahid AlAbadllah",
    diagnosis: "Seasonal Allergies",
    prescriptions: "Cetirizine 10mg",
    labResults: "Allergy Panel: Positive for pollen"
  }
];

/** For editing a single record, store the index of the record in this variable */
let currentEditIndex = null;

window.onload = () => {
  // No records shown initially (like default search or show all)
  populateRecordsTable(mockRecords);

  // Event Listeners
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=doctor";
  });

  searchForm.addEventListener("submit", handleSearch);

  // Closing the modal
  closeEditModal.addEventListener("click", () => {
    editModal.style.display = "none";
  });
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.style.display = "none";
    }
  });

  // Edit Form
  editForm.addEventListener("submit", handleEditForm);
};

/**
 * Populate the table with an array of records
 */
function populateRecordsTable(records) {
  recordsTableBody.innerHTML = "";

  if (records.length === 0) {
    displayInfo("No records found.");
    return;
  }

  records.forEach((rec, index) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = rec.id;

    const tdName = document.createElement("td");
    tdName.textContent = rec.patientName;

    const tdDiagnosis = document.createElement("td");
    tdDiagnosis.textContent = rec.diagnosis;

    const tdPrescriptions = document.createElement("td");
    tdPrescriptions.textContent = rec.prescriptions;

    const tdLab = document.createElement("td");
    tdLab.textContent = rec.labResults;

    const tdAction = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.classList.add("action-btn");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => showEditModal(index);
    tdAction.appendChild(editBtn);

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdDiagnosis);
    tr.appendChild(tdPrescriptions);
    tr.appendChild(tdLab);
    tr.appendChild(tdAction);

    recordsTableBody.appendChild(tr);
  });
}

/**
 * Handle search form submission
 */
function handleSearch(e) {
  e.preventDefault();
  clearMessages();

  const query = patientSearchInput.value.trim().toLowerCase();
  if (!query) {
    populateRecordsTable(mockRecords);
    return;
  }

  // Search by ID or name
  const filtered = mockRecords.filter((rec) => {
    const idString = String(rec.id).toLowerCase();
    const nameString = rec.patientName.toLowerCase();
    return idString.includes(query) || nameString.includes(query);
  });

  populateRecordsTable(filtered);
}

/**
 * Show edit modal for a particular record
 */
function showEditModal(index) {
  currentEditIndex = index;
  const record = mockRecords[index];

  editDiagnosis.value = record.diagnosis;
  editPrescriptions.value = record.prescriptions;
  editLabResults.value = record.labResults;

  editModal.style.display = "flex";
}

/**
 * Handle the edit form submission
 */
function handleEditForm(e) {
  e.preventDefault();
  if (currentEditIndex === null) {
    displayError("No record selected for editing.");
    return;
  }

  // Update the mock record
  mockRecords[currentEditIndex].diagnosis = editDiagnosis.value.trim();
  mockRecords[currentEditIndex].prescriptions = editPrescriptions.value.trim();
  mockRecords[currentEditIndex].labResults = editLabResults.value.trim();

  displayInfo("Record updated successfully!");
  // Re-populate table
  populateRecordsTable(mockRecords);

  // Hide the modal
  editModal.style.display = "none";
}

/** Utility: Info/ Error messaging */
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
