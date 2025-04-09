/*
  index.js
  - Reads ?role= from the query (doctor, staff, or patient)
  - Renders the advanced dashboard
  - Adds Profile & Help pop-ups, plus Home link logic
*/

/** DOM references */
const roleGreeting = document.getElementById("roleGreeting");
const welcomeMessage = document.getElementById("welcomeMessage");
const roleDescription = document.getElementById("roleDescription");

const doctorSection = document.getElementById("doctorSection");
const staffSection = document.getElementById("staffSection");
const patientSection = document.getElementById("patientSection");
const logoutButton = document.getElementById("logoutButton");

// Nav links
const homeLink = document.getElementById("homeLink");
const profileLink = document.getElementById("profileLink");
const helpLink = document.getElementById("helpLink");

// Modals
const profileModal = document.getElementById("profileModal");
const closeProfileModal = document.getElementById("closeProfileModal");
const helpModal = document.getElementById("helpModal");
const closeHelpModal = document.getElementById("closeHelpModal");

window.onload = () => {
  // Parse the 'role' from URL
  const urlParams = new URLSearchParams(window.location.search);
  const userRole = urlParams.get("role"); // "doctor", "staff", "patient"

  if (!userRole) {
    // If no role, go back to login
    window.location.href = "../login/login.html";
    return;
  }

  renderDashboard(userRole.toLowerCase());

  // Setup nav link events
  homeLink.addEventListener("click", () => {
    // Reload the same page with the same role param (like going "home")
    window.location.href = `index.html?role=${userRole}`;
  });

  profileLink.addEventListener("click", () => {
    // Show profile modal
    profileModal.style.display = "flex";
  });

  helpLink.addEventListener("click", () => {
    // Show help modal
    helpModal.style.display = "flex";
  });

  // Close modals
  closeProfileModal.addEventListener("click", () => {
    profileModal.style.display = "none";
  });
  closeHelpModal.addEventListener("click", () => {
    helpModal.style.display = "none";
  });

  // If user clicks outside the modal, close it
  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) {
      profileModal.style.display = "none";
    }
  });
  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) {
      helpModal.style.display = "none";
    }
  });

  // Logout event
  logoutButton.addEventListener("click", () => {
    window.location.href = "../login/login.html";
  });
};

function renderDashboard(role) {
  // Hide all role panels initially
  doctorSection.style.display = "none";
  staffSection.style.display = "none";
  patientSection.style.display = "none";

  switch (role) {
    case "doctor":
      roleGreeting.innerText = "Role: Doctor";
      welcomeMessage.innerText = "Welcome, Doctor!";
      roleDescription.innerText =
        "You have advanced privileges for managing patient records, prescriptions, analytics, and scheduling.";
      doctorSection.style.display = "flex";
      break;

    case "staff":
      roleGreeting.innerText = "Role: Staff";
      welcomeMessage.innerText = "Welcome, Healthcare Staff!";
      roleDescription.innerText =
        "Manage appointments, update patient vitals, coordinate lab reports, and handle insurance tasks.";
      staffSection.style.display = "flex";
      break;

    case "patient":
      roleGreeting.innerText = "Role: Patient";
      welcomeMessage.innerText = "Welcome, Valued Patient!";
      roleDescription.innerText =
        "View your medical records, request refills, and manage your appointments & personal info.";
      patientSection.style.display = "flex";
      break;

    default:
      // If invalid role, redirect to login
      window.location.href = "../login/login.html";
      break;
  }
}
