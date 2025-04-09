/*
  insurance_billing.js
  - Staff page for insurance & billing tasks
  - Mock data for claims
  - "Back to Dashboard" => index with role=staff
*/

/** DOM References */
const backButton = document.getElementById("backButton");
const claimsTableBody = document.querySelector("#claimsTable tbody");

const newClaimForm = document.getElementById("newClaimForm");
const patientNameInput = document.getElementById("patientName");
const providerInput = document.getElementById("provider");
const claimAmountInput = document.getElementById("claimAmount");
const descriptionInput = document.getElementById("description");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock Claims */
let mockClaims = [
  {
    id: 9001,
    patient: "Patient Mona",
    provider: "SaudiCare",
    status: "Pending"
  },
  {
    id: 9002,
    patient: "Patient Faisal",
    provider: "HealthPlus",
    status: "Approved"
  }
];

/** On load */
window.onload = () => {
  populateClaimsTable();
  // Events
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=staff";
  });

  newClaimForm.addEventListener("submit", handleNewClaim);
};

/**
 * Populate table with existing claims
 */
function populateClaimsTable() {
  claimsTableBody.innerHTML = "";

  if (mockClaims.length === 0) {
    displayInfo("No insurance claims found.");
    return;
  }

  mockClaims.forEach((claim) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = claim.id;

    const tdPatient = document.createElement("td");
    tdPatient.textContent = claim.patient;

    const tdProvider = document.createElement("td");
    tdProvider.textContent = claim.provider;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = claim.status;

    const tdAction = document.createElement("td");
    if (claim.status === "Pending") {
      // Approve or Reject
      const approveBtn = document.createElement("button");
      approveBtn.classList.add("action-btn");
      approveBtn.textContent = "Approve";
      approveBtn.onclick = () => handleApproveClaim(claim.id);

      const rejectBtn = document.createElement("button");
      rejectBtn.classList.add("action-btn");
      rejectBtn.textContent = "Reject";
      rejectBtn.onclick = () => handleRejectClaim(claim.id);

      tdAction.appendChild(approveBtn);
      tdAction.appendChild(rejectBtn);
    } else if (claim.status === "Approved") {
      // Mark Paid or Reopen
      const paidBtn = document.createElement("button");
      paidBtn.classList.add("action-btn");
      paidBtn.textContent = "Mark Paid";
      paidBtn.onclick = () => handleMarkPaid(claim.id);

      const reopenBtn = document.createElement("button");
      reopenBtn.classList.add("action-btn");
      reopenBtn.textContent = "Reopen";
      reopenBtn.onclick = () => handleReopenClaim(claim.id);

      tdAction.appendChild(paidBtn);
      tdAction.appendChild(reopenBtn);
    } else if (claim.status === "Paid" || claim.status === "Rejected") {
      tdAction.textContent = "No Action";
    }

    tr.appendChild(tdId);
    tr.appendChild(tdPatient);
    tr.appendChild(tdProvider);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAction);

    claimsTableBody.appendChild(tr);
  });
}

/** Handle Approving a Claim */
function handleApproveClaim(id) {
  const found = mockClaims.find(c => c.id === id);
  if (!found) {
    displayError("Claim not found.");
    return;
  }
  found.status = "Approved";
  displayInfo(`Claim #${id} approved.`);
  populateClaimsTable();
}

/** Handle Rejecting a Claim */
function handleRejectClaim(id) {
  const found = mockClaims.find(c => c.id === id);
  if (!found) {
    displayError("Claim not found.");
    return;
  }
  found.status = "Rejected";
  displayInfo(`Claim #${id} rejected.`);
  populateClaimsTable();
}

/** Handle Marking a Claim as Paid */
function handleMarkPaid(id) {
  const found = mockClaims.find(c => c.id === id);
  if (!found) {
    displayError("Claim not found.");
    return;
  }
  found.status = "Paid";
  displayInfo(`Claim #${id} marked as paid.`);
  populateClaimsTable();
}

/** Handle Reopening a Claim */
function handleReopenClaim(id) {
  const found = mockClaims.find(c => c.id === id);
  if (!found) {
    displayError("Claim not found.");
    return;
  }
  found.status = "Pending";
  displayInfo(`Claim #${id} reopened for further processing.`);
  populateClaimsTable();
}

/**
 * Handle the new claim form
 */
function handleNewClaim(e) {
  e.preventDefault();
  clearMessages();

  const patientName = patientNameInput.value.trim();
  const provider = providerInput.value.trim();
  const claimAmount = parseFloat(claimAmountInput.value);
  const desc = descriptionInput.value.trim();

  if (!patientName || !provider || isNaN(claimAmount) || !desc) {
    displayError("All fields are required. Please fill out the form correctly.");
    return;
  }

  // Create new claim with "Pending" status
  const newClaim = {
    id: generateNewClaimId(),
    patient: patientName,
    provider,
    status: "Pending"
    // We won't store amount/desc in table for simplicity, but you could
  };

  mockClaims.push(newClaim);
  displayInfo(`New claim #${newClaim.id} submitted successfully!`);

  newClaimForm.reset();
  populateClaimsTable();
}

/** Generate new ID for claims (mock) */
function generateNewClaimId() {
  let maxId = 0;
  mockClaims.forEach(c => {
    if (c.id > maxId) {
      maxId = c.id;
    }
  });
  return maxId + 1;
}

/** Utility: Clear messages */
function clearMessages() {
  infoMessage.style.display = "none";
  errorMessage.style.display = "none";
}

/** Utility: Info / Error */
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
