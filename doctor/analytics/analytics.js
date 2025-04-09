/*
  analytics.js
  Doctor's analytics page
  - Mock data for monthly stats
  - Minimal bar chart in pure JS
  - "Back to Dashboard" => index.html?role=doctor
*/

/** DOM References */
const backButton = document.getElementById("backButton");
const patientsSeenValue = document.getElementById("patientsSeenValue");
const completedApptsValue = document.getElementById("completedApptsValue");
const topDiagnosesList = document.getElementById("topDiagnosesList");

const prescriptionChart = document.getElementById("prescriptionChart").getContext("2d");

const infoMessage = document.getElementById("infoMessage");
const errorMessage = document.getElementById("errorMessage");

/** Mock Stats */
const mockStats = {
  patientsSeen: 48, // this month
  completedAppointments: 36,
  topDiagnoses: ["Diabetes", "Hypertension", "Allergies"],

  // For the bar chart: medication name + usage count
  prescriptionUsage: [
    { medication: "Metformin", count: 15 },
    { medication: "Amlodipine", count: 9 },
    { medication: "Cetirizine", count: 6 },
    { medication: "Atorvastatin", count: 5 },
    { medication: "Omeprazole", count: 4 }
  ]
};

window.onload = () => {
  backButton.addEventListener("click", () => {
    window.location.href = "../../index/index.html?role=doctor";
  });

  populateStats();
  drawPrescriptionChart();
};

/**
 * Populate the stats cards & list
 */
function populateStats() {
  // Basic text
  patientsSeenValue.innerText = mockStats.patientsSeen;
  completedApptsValue.innerText = mockStats.completedAppointments;

  // Diagnoses
  topDiagnosesList.innerHTML = "";
  mockStats.topDiagnoses.forEach(d => {
    const li = document.createElement("li");
    li.textContent = d;
    topDiagnosesList.appendChild(li);
  });
}

/**
 * Basic bar chart using the <canvas> with minimal vanilla JS
 */
function drawPrescriptionChart() {
  const usageData = mockStats.prescriptionUsage;
  if (usageData.length === 0) {
    displayInfo("No prescription data available for chart.");
    return;
  }

  // We'll do a simple bar chart
  const canvas = prescriptionChart.canvas;
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  prescriptionChart.clearRect(0, 0, width, height);

  // Define some margins
  const paddingLeft = 50;
  const paddingBottom = 40;
  const barWidth = 40;
  const barGap = 30;

  // Find max
  let maxCount = 0;
  usageData.forEach(u => {
    if (u.count > maxCount) maxCount = u.count;
  });
  // Some spacing logic
  const chartHeight = height - paddingBottom - 20;

  usageData.forEach((rx, index) => {
    const x = paddingLeft + index * (barWidth + barGap);
    // scale the bar height
    const barHeight = (rx.count / maxCount) * chartHeight;
    const y = height - paddingBottom - barHeight;

    // Draw bar
    prescriptionChart.fillStyle = "#2b90d9";
    prescriptionChart.fillRect(x, y, barWidth, barHeight);

    // Show count on top
    prescriptionChart.fillStyle = "#333";
    prescriptionChart.font = "14px Nunito";
    prescriptionChart.fillText(rx.count, x + barWidth / 4, y - 5);

    // Label medication name
    prescriptionChart.fillStyle = "#444";
    prescriptionChart.font = "14px Nunito";
    prescriptionChart.fillText(rx.medication, x, height - paddingBottom + 15);
  });

  // Optionally draw y-axis
  prescriptionChart.strokeStyle = "#444";
  prescriptionChart.beginPath();
  prescriptionChart.moveTo(paddingLeft, 0);
  prescriptionChart.lineTo(paddingLeft, height - paddingBottom);
  prescriptionChart.stroke();
}

/**
 * Utility: info & error
 */
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
