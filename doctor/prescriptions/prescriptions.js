/*
  prescriptions.js
  - Doctor's interface for viewing/creating/editing prescriptions
  - Mock data to simulate real usage
  - "Back to Dashboard" => index with role=doctor
*/

/** DOM References */
const backButton = document.getElementById("backButton");
const prescriptionsTableBody = document.querySelector("#prescriptionsTable tbody");

const newPrescriptionForm = document.getElementById("newPrescriptionForm");
const patientNameInput = document.getElementById("patientName");
const medicationInput = document.getElementById("medication");
const dosageInput = document.getElementById("dosage");
const refillsInput = document.getElementById("refills");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock Prescriptions Data */
let mockPrescriptions = [
  {
    id: 1001,
    patientName: "Raid Gadhi",
    medication: "Metformin",
    dosage: "500mg",
    refills: 2
  },
  {
    id: 1002,
    patientName: "Zahid AlAbadllah",
    medication: "Amlodipine",
    dosage: "5mg",
    refills: 1
  }
];

window.onload = () => {
  populatePrescriptionsTable();
  // Event Listeners
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=doctor";
  });

  newPrescriptionForm.addEventListener("submit", handleNewPrescription);
};

/**
 * Populate table with mockPrescriptions
 */
function populatePrescriptionsTable() {
  prescriptionsTableBody.innerHTML = "";

  if (mockPrescriptions.length === 0) {
    displayInfo("No prescriptions found.");
    return;
  }

  mockPrescriptions.forEach((rx) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = rx.id;

    const tdPatient = document.createElement("td");
    tdPatient.textContent = rx.patientName;

    const tdMedication = document.createElement("td");
    tdMedication.textContent = rx.medication;

    const tdDosage = document.createElement("td");
    tdDosage.textContent = rx.dosage;

    const tdRefills = document.createElement("td");
    tdRefills.textContent = rx.refills;

    const tdActions = document.createElement("td");
    // Edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("action-btn");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => handleEditPrescription(rx.id);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("action-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => handleDeletePrescription(rx.id);

    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    tr.appendChild(tdId);
    tr.appendChild(tdPatient);
    tr.appendChild(tdMedication);
    tr.appendChild(tdDosage);
    tr.appendChild(tdRefills);
    tr.appendChild(tdActions);

    prescriptionsTableBody.appendChild(tr);
  });
}

/**
 * Handle creating new prescription
 */
function handleNewPrescription(e) {
  e.preventDefault();
  clearMessages();

  const patientName = patientNameInput.value.trim();
  const medication = medicationInput.value.trim();
  const dosage = dosageInput.value.trim();
  const refills = parseInt(refillsInput.value, 10);

  if (!patientName || !medication || !dosage || isNaN(refills)) {
    displayError("All fields are required. Please fill out the form correctly.");
    return;
  }

  // Create a new prescription object
  const newRx = {
    id: generateNewId(),
    patientName,
    medication,
    dosage,
    refills
  };

  mockPrescriptions.push(newRx);
  displayInfo("New prescription created successfully!");

  newPrescriptionForm.reset();
  populatePrescriptionsTable();
}

/**
 * Generate new ID (mock)
 */
function generateNewId() {
  let maxId = 0;
  mockPrescriptions.forEach(rx => {
    if (rx.id > maxId) {
      maxId = rx.id;
    }
  });
  return maxId + 1;
}

/**
 * Edit an existing prescription
 * For the demo, let's just do a simple prompt
 */
function handleEditPrescription(rxId) {
  const rx = mockPrescriptions.find(r => r.id === rxId);
  if (!rx) {
    displayError("Prescription not found.");
    return;
  }

  // Basic approach: prompt for new dosage & refills
  const newDosage = prompt("Enter new dosage (e.g. '500mg'):", rx.dosage);
  if (newDosage === null) return; // user canceled
  const newRefillsStr = prompt("Enter new refills (e.g. '2'):", rx.refills);
  if (newRefillsStr === null) return; // user canceled

  const newRefills = parseInt(newRefillsStr, 10);
  if (isNaN(newRefills)) {
    displayError("Invalid refills input.");
    return;
  }

  rx.dosage = newDosage;
  rx.refills = newRefills;
  displayInfo(`Prescription #${rx.id} updated successfully.`);

  populatePrescriptionsTable();
}

/**
 * Delete a prescription
 */
function handleDeletePrescription(rxId) {
  const confirmDelete = confirm("Are you sure you want to delete this prescription?");
  if (!confirmDelete) return;

  mockPrescriptions = mockPrescriptions.filter(r => r.id !== rxId);
  displayInfo("Prescription deleted.");
  populatePrescriptionsTable();
}

/** Utility: clear messages */
function clearMessages() {
  infoMessage.style.display = "none";
  errorMessage.style.display = "none";
}

/** Utility: display info */
function displayInfo(msg) {
  infoMessage.style.display = "block";
  infoMessage.innerText = msg;
  errorMessage.style.display = "none";
}

/** Utility: display error */
function displayError(msg) {
  errorMessage.style.display = "block";
  errorMessage.innerText = msg;
  infoMessage.style.display = "none";
}
