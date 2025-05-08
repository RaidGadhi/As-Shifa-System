/* -----------------------------------------------------------------------
   fake_email_inbox.js – demo‑only “mailbox” that shows 2FA codes
   • Accepts either a username or an email
   • Works immediately after the new random‑code login flow
------------------------------------------------------------------------ */
(() => {
    /* ----- fallback helpers if shared.js didn’t load ----------------- */
    const loadData  = window.loadData  || ((k, d = {}) => {
      try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : d; }
      catch { return d; }
    });
    const logAction = window.logAction || (() => {});
  
    /* username → email map for built‑in demo users -------------------- */
    const demoEmails = {
      dr_khan:       "dr.khan@example.com",
      nurse_ali:     "nurse.ali@example.com",
      patient_sarah: "patient.sarah@example.com"
    };
  
    /* DOM refs -------------------------------------------------------- */
    const form      = document.getElementById("checkForm");
    const emailEl   = document.getElementById("emailInput");
    const resultBox = document.getElementById("resultCard");
    const resultTxt = document.getElementById("resultText");
    const backBtn   = document.getElementById("backButton");
  
    const norm = v => v.trim().toLowerCase();
  
    backBtn.onclick = () => (location.href = "login.html");
  
    form.addEventListener("submit", e => {
      e.preventDefault();
      const raw = norm(emailEl.value);
      if (!raw) return;
  
      /* If user typed a username, expand to its demo email */
      const emailKey = demoEmails[raw] || raw;
  
      /* look up freshly generated code ------------------- */
      const outbox = loadData("2faDemoCodes", {});
      const code   = outbox[emailKey];
  
      if (code) {
        resultTxt.innerHTML =
          `Your 2‑Factor code is: <strong>${code}</strong><br><em>${emailKey}</em>`;
        logAction(`2FA code viewed in fake inbox | ${emailKey}`);
      } else {
        resultTxt.textContent =
          "No code found. Be sure you attempted a login first.";
      }
      resultBox.style.display = "block";
    });
  })();
  