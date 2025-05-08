/*
  index.js
  - Reads ?role= from the query (doctor, staff, or patient)
  - Renders the advanced dashboard
  - Adds Profile & Help pop-ups, plus Home link logic
  - Adds direct session timeout logic (warn at 30s, logout at 60s)
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
    window.location.href = `index.html?role=${userRole}`;
  });

  profileLink.addEventListener("click", () => {
    profileModal.style.display = "flex";
  });

  helpLink.addEventListener("click", () => {
    helpModal.style.display = "flex";
  });

  closeProfileModal.addEventListener("click", () => {
    profileModal.style.display = "none";
  });

  closeHelpModal.addEventListener("click", () => {
    helpModal.style.display = "none";
  });

  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) profileModal.style.display = "none";
  });

  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) helpModal.style.display = "none";
  });

  logoutButton.addEventListener("click", () => {
    window.location.href = "../login/login.html";
  });

  /* ===================== IDLE TIMEOUT SECTION ===================== */
  let idleTime = 0;
  const warnAfter = 30;  // seconds
  const logoutAfter = 60; // seconds

  function resetIdle() {
    idleTime = 0;
    const modal = document.getElementById("sessionWarningModal");
    if (modal) modal.style.display = "none";
  }

  function showWarningModal() {
    if (!document.getElementById("sessionWarningModal")) {
      const div = document.createElement("div");
      div.id = "sessionWarningModal";
      div.style.cssText = `
        position:fixed;inset:0;display:flex;justify-content:center;align-items:center;
        background:rgba(0,0,0,.4);z-index:9999;font-family:Nunito,Arial`;
      div.innerHTML = `
        <div style="background:#fff;padding:1.5rem 2rem;border-radius:10px;
                    max-width:320px;text-align:center;box-shadow:0 6px 24px rgba(0,0,0,.3);">
          <h3 style="margin-top:0;">Are you still there?</h3>
          <p>You will be logged out soon due to inactivity.</p>
          <button style="padding:.5rem 1.2rem;background:#2b90d9;color:#fff;
                         border:none;border-radius:20px;cursor:pointer"
                  onclick="document.getElementById('sessionWarningModal').style.display='none'; idleTime=0;">
            Stay Logged In
          </button>
        </div>`;
      document.body.appendChild(div);
    } else {
      document.getElementById("sessionWarningModal").style.display = "flex";
    }
  }

  setInterval(() => {
    idleTime++;
    if (idleTime === warnAfter) showWarningModal();
    if (idleTime >= logoutAfter) {
      window.location.href = "../login/login.html";
    }
  }, 1000);

  ["mousemove", "keydown", "click", "scroll", "touchstart"].forEach(evt => {
    document.addEventListener(evt, resetIdle, { passive: true });
  });
};

/* ----------------------------------------------------------------- */
function renderDashboard(role) {
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
      window.location.href = "../login/login.html";
  }
}
