/*
  prescription_refills.js
  - Mock data for patient's active prescriptions
  - "Request Refill" actions (table row + separate form)
  - "Back to Dashboard" => patient homepage
*/

/** DOM References */
const prescriptionsTableBody = document.querySelector("#prescriptionsTable tbody");
const medicationSelect = document.getElementById("medicationSelect");
const refillForm = document.getElementById("refillForm");
const backButton = document.getElementById("backButton");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock Prescriptions */
let mockPrescriptions = [
  {
    id: 1,
    medication: "Metformin",
    dosage: "500mg",
    refillsLeft: 2,
    status: "Active"
  },
  {
    id: 2,
    medication: "Losartan",
    dosage: "50mg",
    refillsLeft: 1,
    status: "Active"
  },
  {
    id: 3,
    medication: "Atorvastatin",
    dosage: "20mg",
    refillsLeft: 0,
    status: "Expired"
  }
];

window.onload = () => {
  populatePrescriptionsTable();
  populateMedicationSelect();

  // Events
  refillForm.addEventListener("submit", handleRefillFormSubmit);
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=patient";
  });
};

/**
 * Populate the table with current prescriptions
 */
function populatePrescriptionsTable() {
  prescriptionsTableBody.innerHTML = "";

  if (mockPrescriptions.length === 0) {
    displayInfo("You have no active prescriptions.");
    return;
  }

  mockPrescriptions.forEach((rx) => {
    const tr = document.createElement("tr");

    const tdMed = document.createElement("td");
    tdMed.textContent = rx.medication;

    const tdDosage = document.createElement("td");
    tdDosage.textContent = rx.dosage;

    const tdRefillsLeft = document.createElement("td");
    tdRefillsLeft.textContent = rx.refillsLeft;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = rx.status;

    const tdAction = document.createElement("td");
    if (rx.status === "Active" && rx.refillsLeft > 0) {
      const reqRefillBtn = document.createElement("button");
      reqRefillBtn.classList.add("action-btn");
      reqRefillBtn.textContent = "Request Refill";
      reqRefillBtn.onclick = () => handleInlineRefillRequest(rx.id);
      tdAction.appendChild(reqRefillBtn);
    } else {
      tdAction.textContent = "Not Refillable";
    }

    tr.appendChild(tdMed);
    tr.appendChild(tdDosage);
    tr.appendChild(tdRefillsLeft);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);

    prescriptionsTableBody.appendChild(tr);
  });
}

/**
 * Populate the medication dropdown with "active" prescriptions
 */
function populateMedicationSelect() {
  medicationSelect.innerHTML = "<option value=''>--Select Medication--</option>";
  // Only add active & refillable items
  const activeRefillable = mockPrescriptions.filter(
    (rx) => rx.status === "Active" && rx.refillsLeft > 0
  );
  activeRefillable.forEach((rx) => {
    const option = document.createElement("option");
    option.value = rx.id; // store ID
    option.textContent = `${rx.medication} (${rx.dosage}) - ${rx.refillsLeft} refills left`;
    medicationSelect.appendChild(option);
  });
}

/**
 * Inline refill request from the table
 */
function handleInlineRefillRequest(rxId) {
  // Just mimic the action of requesting refill
  const foundRx = mockPrescriptions.find((r) => r.id === rxId);
  if (!foundRx) {
    displayError("Prescription not found.");
    return;
  }
  if (foundRx.refillsLeft <= 0) {
    displayError("No refills left for this medication.");
    return;
  }

  // Decrement refills
  foundRx.refillsLeft--;
  displayInfo(`Refill requested for ${foundRx.medication} (inline).`);
  populatePrescriptionsTable();
  populateMedicationSelect();
}

/**
 * Handle the refill form submission
 */
function handleRefillFormSubmit(e) {
  e.preventDefault();

  const selectedId = medicationSelect.value;
  if (!selectedId) {
    displayError("Please select a medication to refill.");
    return;
  }

  const foundRx = mockPrescriptions.find((r) => r.id == selectedId);
  if (!foundRx) {
    displayError("Medication not found.");
    return;
  }
  if (foundRx.refillsLeft <= 0) {
    displayError("No refills left for this medication.");
    return;
  }

  // Optionally handle comments
  const comments = document.getElementById("comments").value.trim();

  // Decrement refills
  foundRx.refillsLeft--;
  displayInfo(
    `Refill requested for ${foundRx.medication}. ${comments ? "Comments: " + comments : ""}`
  );
  // Clear the form
  refillForm.reset();

  // Re-render table + dropdown
  populatePrescriptionsTable();
  populateMedicationSelect();
}

/** Message utilities */
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
