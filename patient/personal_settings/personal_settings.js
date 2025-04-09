/*
  personal_settings.js
  - Mock data for user profile (name, email, phone)
  - Allows changing password with basic checks
  - "Back to Dashboard" => patient homepage
*/

/** DOM References */
const backButton = document.getElementById("backButton");
const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");

/** Some mock user profile data */
let mockUserProfile = {
  fullName: "Sarah Al-Mutairi",
  email: "sarah@example.com",
  phone: "055-123-4567"
};

window.onload = () => {
  // Populate the profile form
  document.getElementById("fullName").value = mockUserProfile.fullName;
  document.getElementById("email").value = mockUserProfile.email;
  document.getElementById("phone").value = mockUserProfile.phone;

  // Setup event handlers
  profileForm.addEventListener("submit", handleProfileUpdate);
  passwordForm.addEventListener("submit", handlePasswordChange);
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=patient";
  });
};

/**
 * Handle saving updated profile info
 */
function handleProfileUpdate(e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!fullName || !email) {
    displayError("Full Name and Email are required.");
    return;
  }

  // In a real app, we'd call an API here
  mockUserProfile.fullName = fullName;
  mockUserProfile.email = email;
  mockUserProfile.phone = phone;

  displayInfo("Profile updated successfully.");
}

/**
 * Handle password update
 */
function handlePasswordChange(e) {
  e.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // In a real app, we'd verify currentPassword is correct on the server
  // We just do a quick match check
  if (!currentPassword || !newPassword || !confirmPassword) {
    displayError("All password fields are required.");
    return;
  }

  if (newPassword !== confirmPassword) {
    displayError("New password and confirmation do not match.");
    return;
  }

  // For demonstration, let's just say success
  displayInfo("Password changed successfully.");
  passwordForm.reset();
}

/** Utility: Show info */
function displayInfo(msg) {
  infoMessage.style.display = "block";
  infoMessage.innerText = msg;
  errorMessage.style.display = "none";
}

/** Utility: Show error */
function displayError(msg) {
  errorMessage.style.display = "block";
  errorMessage.innerText = msg;
  infoMessage.style.display = "none";
}
