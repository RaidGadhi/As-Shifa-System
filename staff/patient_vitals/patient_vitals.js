/*
  patient_vitals.js
  - Staff page for searching a patient and recording/updating their vitals
  - Uses mock data for demonstration
  - "Back to Dashboard" => ../index/index.html?role=staff
*/

/** DOM References */
const backButton = document.getElementById("backButton");
const searchForm = document.getElementById("searchForm");
const patientSearchInput = document.getElementById("patientSearch");
const vitalsForm = document.getElementById("vitalsForm");

const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const bloodPressureInput = document.getElementById("bloodPressure");
const tempInput = document.getElementById("temp");
const notesInput = document.getElementById("notes");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock Patient Vitals Data (by ID or name) */
let mockVitalsRecords = {
  "12345": {
    height: 170,
    weight: 70,
    bloodPressure: "120/80",
    temp: 37,
    notes: "No current complaints."
  },
  "john doe": {
    height: 180,
    weight: 80,
    bloodPressure: "130/85",
    temp: 37.5,
    notes: "Mild cough reported."
  }
};

// The "current" key after a search
let currentPatientKey = null;

window.onload = () => {
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=staff";
  });

  searchForm.addEventListener("submit", handleSearch);
  vitalsForm.addEventListener("submit", handleSaveVitals);
};

/**
 * Handle searching for a patient
 */
function handleSearch(e) {
  e.preventDefault();
  clearMessages();

  const query = patientSearchInput.value.trim().toLowerCase();
  if (!query) {
    displayError("Please enter a patient ID or name.");
    return;
  }

  // Check if we have that record in mockVitalsRecords
  if (mockVitalsRecords[query]) {
    currentPatientKey = query;
    populateVitalsForm(mockVitalsRecords[query]);
    displayInfo(`Patient record found for "${query}". Update vitals as needed.`);
  } else {
    // Not found
    currentPatientKey = null;
    clearVitalsForm();
    displayError(`No record found for "${query}".`);
  }
}

/**
 * Populate the vitals form with data
 */
function populateVitalsForm(vitalsData) {
  heightInput.value = vitalsData.height || "";
  weightInput.value = vitalsData.weight || "";
  bloodPressureInput.value = vitalsData.bloodPressure || "";
  tempInput.value = vitalsData.temp || "";
  notesInput.value = vitalsData.notes || "";
}

/**
 * Clear the vitals form
 */
function clearVitalsForm() {
  heightInput.value = "";
  weightInput.value = "";
  bloodPressureInput.value = "";
  tempInput.value = "";
  notesInput.value = "";
}

/**
 * Handle saving vitals
 */
function handleSaveVitals(e) {
  e.preventDefault();
  clearMessages();

  if (!currentPatientKey) {
    displayError("No patient selected. Please search for a patient first.");
    return;
  }

  // Update the mock data
  mockVitalsRecords[currentPatientKey] = {
    height: parseInt(heightInput.value, 10) || 0,
    weight: parseInt(weightInput.value, 10) || 0,
    bloodPressure: bloodPressureInput.value.trim(),
    temp: parseFloat(tempInput.value) || 0,
    notes: notesInput.value.trim()
  };

  displayInfo("Vitals saved successfully!");
}

/** Utility: show info/error */
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
