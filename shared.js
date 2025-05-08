/* =========================================================================
   shared.js  – Single source of truth for helpers + session timer
   -------------------------------------------------------------------------
   • loadData / saveData
   • logAction / getLogs / clearLogs
   • ensureDefaults
   • startSessionMonitor(opts) / stopSessionMonitor()
   -------------------------------------------------------------------------
   NO ES‑modules – works directly from file:// or Go Live.
   ========================================================================= */

   (function () {
    /* ---------- core helpers --------------------------------------------- */
    function loadData(key, def = []) {
      try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : def; }
      catch (e) { console.warn(`shared.js: bad JSON in "${key}"`, e); return def; }
    }
    function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
    
    /* ---------- audit ----------------------------------------------------- */
    function logAction(msg) {
      const now  = new Date().toLocaleString();
      const logs = loadData("auditLog", []);
      logs.push(`${now} | ${msg}`);
      saveData("auditLog", logs);
    }
    const getLogs   = () => loadData("auditLog", []);
    const clearLogs = () => localStorage.removeItem("auditLog");
    
    /* ---------- defaults -------------------------------------------------- */
    function ensureDefaults() {
      const defaults = {
        patients:      [],
        appointments:  [],
        prescriptions: [],
        medicalRecords:[],
        labReports:    [],
        auditLog:      []
      };
      Object.entries(defaults).forEach(([k,v])=>{
        if (!localStorage.getItem(k)) saveData(k,v);
      });
    }
    ensureDefaults();
    
    /* =======================================================================
                         SESSION  MONITOR  (1‑minute idle)
       ===================================================================== */
    
    let cfg    = null;   // current config
    let idleMs = 0;      // accumulated idle ms
    let ticker = null;   // setInterval handle
    
    /* ---------- helper: build / show modal -------------------------------- */
    function buildModal() {
      let m = document.getElementById("sessionWarningModal");
      if (m) return m;
      m = document.createElement("div");
      m.id = "sessionWarningModal";
      m.style.cssText = `
        position:fixed;inset:0;display:flex;justify-content:center;align-items:center;
        background:rgba(0,0,0,.4);z-index:9999;font-family:Nunito,Arial`;
      m.innerHTML = `
        <div style="background:#fff;padding:1.5rem 2rem;border-radius:10px;max-width:320px;
                    text-align:center;box-shadow:0 6px 24px rgba(0,0,0,.3);">
          <h3 style="margin:0 0 .6rem">Are you still there?</h3>
          <p id="swmCountdown" style="margin:.3rem 0 1rem;font-size:.95rem">
            You will be logged out in <strong>30</strong>s.
          </p>
          <button id="swmStayBtn" style="
            background:#2b90d9;color:#fff;border:none;padding:.55rem 1.4rem;
            border-radius:22px;font-size:.95rem;cursor:pointer">Stay Logged In</button>
        </div>`;
      document.body.appendChild(m);
      return m;
    }
    function showModal() {
      const m = buildModal(); m.style.display = "flex";
      document.getElementById("swmStayBtn").onclick = () => {
        logAction("Session extended by user");
        resetIdle(); hideModal();
      };
    }
    function hideModal() {
      const m = document.getElementById("sessionWarningModal");
      if (m) m.style.display = "none";
    }
    function updateCountdown(sec) {
      const el = document.getElementById("swmCountdown");
      if (el) el.querySelector("strong").textContent = Math.ceil(sec);
    }
    
    /* ---------- generic redirect helper ---------------------------------- */
    function redirectToLogin() {
      const segs = location.pathname.split("/").filter(Boolean);
      let rel = "";
      for (let i = 0; i < segs.length - 2; i++) rel += "../";
      window.location.href = rel + "login/login.html";
    }
    
    /* ---------- default auto‑logout -------------------------------------- */
    function defaultAutoLogout() {
      localStorage.removeItem("loginState");
      redirectToLogin();
    }
    
    /* ---------- idle tracking -------------------------------------------- */
    function resetIdle() { idleMs = 0; hideModal(); }
    function onActivity() { if (cfg) resetIdle(); }
    
    /* ---------- public: start monitor ------------------------------------ */
    function startSessionMonitor(opts = {}) {
      stopSessionMonitor();            // reset if already running
    
      cfg = {
        warnAfter:   opts.warnAfter   || 30000,
        logoutAfter: opts.logoutAfter || 60000,
        onLogout:    typeof opts.onLogout === "function" ? opts.onLogout : defaultAutoLogout
      };
      idleMs = 0;
    
      ticker = setInterval(() => {
        idleMs += 1000;
    
        if (idleMs >= cfg.warnAfter && idleMs < cfg.logoutAfter) {
          showModal();
          updateCountdown((cfg.logoutAfter - idleMs) / 1000);
        }
    
        if (idleMs >= cfg.logoutAfter) {
          logAction("Session auto‑logout (idle)");
          stopSessionMonitor();
          cfg.onLogout();
        }
      }, 1000);
    
      ["mousemove","keydown","click","scroll","touchstart"]
        .forEach(evt => document.addEventListener(evt,onActivity,{passive:true}));
      logAction("Session monitor started");
    }
    
    /* ---------- public: stop monitor ------------------------------------- */
    function stopSessionMonitor() {
      if (!cfg) return;
      clearInterval(ticker);
      ticker = null;
      cfg = null;
      ["mousemove","keydown","click","scroll","touchstart"]
        .forEach(evt => document.removeEventListener(evt,onActivity,{passive:true}));
      hideModal();
      logAction("Session monitor stopped");
    }
    
    /* ---------- export globals ------------------------------------------- */
    window.loadData            = loadData;
    window.saveData            = saveData;
    window.logAction           = logAction;
    window.getLogs             = getLogs;
    window.clearLogs           = clearLogs;
    window.startSessionMonitor = startSessionMonitor;
    window.stopSessionMonitor  = stopSessionMonitor;
    /* 🆕 make ensureDefaults globally available */
    window.ensureDefaults      = ensureDefaults;
    if (typeof window !== "undefined") {
      window.saveStorageToDisk = () => {
        const dump = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          try {
            dump[key] = JSON.parse(localStorage.getItem(key));
          } catch {
            dump[key] = localStorage.getItem(key);
          }
        }
    
        fetch("http://localhost:9999/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dump)
        }).then(() => alert("✅ localStorage saved to disk."));
      };
    }
    
    })();   // ← end IIFE
    