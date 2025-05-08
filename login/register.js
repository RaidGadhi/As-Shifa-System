/* ------------------------------------------------------------------
   Patient Registration – front‑end only
   • Stores plain data in localStorage["patients"]
   • Hashes password with SHA‑256 → localStorage["patientHashes"]
   • Prints the hash map to the browser console
------------------------------------------------------------------ */
(() => {
    /* ---------- SHA‑256 (Web Crypto) -------------------------------- */
    const hashSHA256 = async str => {
      const buf = await crypto.subtle.digest("SHA-256",
                    new TextEncoder().encode(str));
      return [...new Uint8Array(buf)]
             .map(b => b.toString(16).padStart(2, "0")).join("");
    };
  
    /* ---------- safe JSON.parse ------------------------------------ */
    const safeJSON = (raw, fallback) => {
      try { return JSON.parse(raw); } catch { return fallback; }
    };
  
    /* DOM ------------------------------------------------------------ */
    const f = {
      fullName:        document.getElementById("fullName"),
      username:        document.getElementById("username"),
      email:           document.getElementById("email"),
      phone:           document.getElementById("phone"),
      password:        document.getElementById("password"),
      confirmPassword: document.getElementById("confirmPassword")
    };
    const registerBtn  = document.getElementById("registerButton");
    const gotoLoginBtn = document.getElementById("gotoLoginButton");
    const errMsgEl     = document.getElementById("errorMessage");
    const infoMsgEl    = document.getElementById("infoMessage");
  
    /* helpers -------------------------------------------------------- */
    const mockUsernames = ["dr_khan", "nurse_ali", "patient_sarah"];
    const showError = t => { errMsgEl.textContent = t; errMsgEl.style.display = "block"; infoMsgEl.style.display = "none"; };
    const showInfo  = t => { infoMsgEl.textContent = t; infoMsgEl.style.display = "block"; errMsgEl.style.display = "none"; };
    const strong = p => p.length >= 12 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p);
    const userExists = u => {
      const pts = safeJSON(localStorage.getItem("patients"), []);
      return pts.some(p => p.username === u) || mockUsernames.includes(u);
    };
  
    /* register click ------------------------------------------------- */
    registerBtn.onclick = async () => {
      const fullName = f.fullName.value.trim(),
            username = f.username.value.trim(),
            email    = f.email.value.trim(),
            phone    = f.phone.value.trim(),
            pwd      = f.password.value,
            pwd2     = f.confirmPassword.value;
  
      if (!fullName || !username || !email || !phone || !pwd || !pwd2)  return showError("All fields are required.");
      if (pwd !== pwd2)                                                 return showError("Passwords do not match.");
      if (!strong(pwd))                                                 return showError("Password must be ≥ 12 chars incl. upper/lower/digit/special.");
      if (userExists(username))                                         return showError("Username already taken.");
  
      /* store patient (plain pwd kept for legacy demo flow) ---------- */
      const patients = safeJSON(localStorage.getItem("patients"), []);
      patients.push({ role:"patient", username, password:pwd, totp:"111222", fullName, email, phone });
      localStorage.setItem("patients", JSON.stringify(patients));
  
      /* store SHA‑256 hash separately ------------------------------- */
      const hashes = safeJSON(localStorage.getItem("patientHashes"), {});
      hashes[username] = await hashSHA256(pwd);
      localStorage.setItem("patientHashes", JSON.stringify(hashes));
  
      /* console log -------------------------------------------------- */
      console.log("%c[patientHashes] updated:", "color:green;font-weight:bold;");
      console.table(hashes);
  
      /* audit -------------------------------------------------------- */
      const log = safeJSON(localStorage.getItem("auditLog"), []);
      log.push(`${new Date().toLocaleString()} | Patient registered (${username})`);
      localStorage.setItem("auditLog", JSON.stringify(log));
  
      /* success message & redirect ---------------------------------- */
      let n = 5;
      showInfo(`Registration successful! Redirecting in ${n}s…`);
      const t = setInterval(() => {
        n--;
        if (n) showInfo(`Registration successful! Redirecting in ${n}s…`);
        else { clearInterval(t); location.href = "login.html"; }
      }, 1000);
    };
  
    gotoLoginBtn.onclick = () => (location.href = "login.html");
  })();
  