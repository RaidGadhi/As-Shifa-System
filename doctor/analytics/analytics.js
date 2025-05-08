/* doctor/analytics/analytics.js  (FULL FILE)
   – Builds mock stats
   – Renders bar‑chart
   – Own idle‑timeout (warn 30 s ➜ logout 60 s)
*/

/* ------------------------------------------------------------------ */
/* Tiny helpers (no shared.js) */
function loadData(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
function ensureDefaults() {
  const d = { patients:[], appointments:[], prescriptions:[],
              medicalRecords:[], labReports:[], auditLog:[] };
  Object.entries(d).forEach(([k,v])=>{
    if(!localStorage.getItem(k)) localStorage.setItem(k,JSON.stringify(v));
  });
}
ensureDefaults();

/* ------------------------------------------------------------------ */
/* Constants & DOM refs */
const DOCTOR_NAME         = "Dr. Abdullah AlQahtani";
const backButton          = document.getElementById("backButton");
const patientsSeenValue   = document.getElementById("patientsSeenValue");
const completedApptsValue = document.getElementById("completedApptsValue");
const topDiagnosesList    = document.getElementById("topDiagnosesList");
const ctx                 = document.getElementById("prescriptionChart").getContext("2d");
const infoMessage         = document.getElementById("infoMessage");
const errorMessage        = document.getElementById("errorMessage");

/* ------------------------------------------------------------------ */
/* Boot */
window.addEventListener("load", () => {
  backButton.onclick = () =>
    window.location.href = "../../index/index.html?role=doctor";

  computeStats();
  startIdleTimer();    // ← idle‑timeout here
});

/* ------------------------------------------------------------------ */
/* Idle‑timeout (30 s warn → 60 s logout) */
function startIdleTimer() {
  let idle = 0;
  const warn = 30, logout = 60;

  function reset() {
    idle = 0;
    const m = document.getElementById("idleWarnModal");
    if (m) m.style.display = "none";
  }

  function warnModal() {
    let m = document.getElementById("idleWarnModal");
    if (!m) {
      m = document.createElement("div");
      m.id = "idleWarnModal";
      m.style.cssText =
        "position:fixed;inset:0;display:flex;justify-content:center;align-items:center;" +
        "background:rgba(0,0,0,.45);z-index:9999;font-family:Nunito,Arial";
      m.innerHTML = `
        <div style="background:#fff;padding:1.5rem 2rem;border-radius:10px;max-width:320px;
                    text-align:center;box-shadow:0 6px 24px rgba(0,0,0,.3);">
          <h3 style="margin:0 0 .6rem">Still there?</h3>
          <p>You’ll be logged out in <strong id="countDown">30</strong>s.</p>
          <button style="padding:.55rem 1.3rem;background:#2b90d9;color:#fff;border:none;
                         border-radius:20px;cursor:pointer">Stay Logged In</button>
        </div>`;
      m.querySelector("button").onclick = reset;
      document.body.appendChild(m);
    } else { m.style.display = "flex"; }
  }

  setInterval(()=>{
    idle++;
    if(idle===warn) warnModal();
    if(idle>warn && idle<logout){
      const cd=document.getElementById("countDown");
      if(cd) cd.textContent = logout-idle;
    }
    if(idle>=logout){
      window.location.href = "../../login/login.html";
    }
  },1000);

  ["mousemove","keydown","click","scroll","touchstart"]
    .forEach(e=>document.addEventListener(e,reset,{passive:true}));
}

/* ------------------------------------------------------------------ */
/* Stats & chart */
function computeStats() {
  const appts   = loadData("appointments");
  const recs    = loadData("medicalRecords");
  const rxs     = loadData("prescriptions");

  const now = new Date(), m = now.getMonth(), y = now.getFullYear();

  const myAppts = appts.filter(a=>{
    const d = new Date(a.datetime);
    return a.doctor===DOCTOR_NAME && d.getFullYear()===y && d.getMonth()===m;
  });
  const patientsSeen = new Set(
    myAppts.filter(a=>["Completed","Confirmed"].includes(a.status)).map(a=>a.patient)
  );
  const completed = myAppts.filter(a=>a.status==="Completed").length;

  const diagFreq={};
  recs.filter(r=>r.doctor===DOCTOR_NAME).forEach(r=>{
    diagFreq[r.diagnosis]=(diagFreq[r.diagnosis]||0)+1;
  });
  const topDiag = Object.entries(diagFreq).sort((a,b)=>b[1]-a[1]).slice(0,3).map(d=>d[0]);

  const usage={};
  rxs.filter(r=>r.doctor===DOCTOR_NAME).forEach(r=>{
    usage[r.medication]=(usage[r.medication]||0)+1;
  });
  const usageArr=Object.entries(usage).sort((a,b)=>b[1]-a[1]).slice(0,5)
        .map(([med,count])=>({med,count}));

  /* DOM */
  patientsSeenValue.textContent   = patientsSeen.size;
  completedApptsValue.textContent = completed;

  topDiagnosesList.innerHTML="";
  topDiag.forEach(d=>{
    const li=document.createElement("li");
    li.textContent=d;
    topDiagnosesList.appendChild(li);
  });

  drawChart(usageArr);
}

/* ------------------------------------------------------------------ */
function drawChart(data){
  const W=ctx.canvas.width,H=ctx.canvas.height;
  ctx.clearRect(0,0,W,H);
  if(!data.length){info("No Rx data");return;}

  const max=Math.max(...data.map(d=>d.count));
  const padL=50,padB=40,barW=40,gap=30,chartH=H-padB-20;

  data.forEach((d,i)=>{
    const x=padL+i*(barW+gap);
    const barH=(d.count/max)*chartH;
    const y=H-padB-barH;
    ctx.fillStyle="#2b90d9";
    ctx.fillRect(x,y,barW,barH);

    ctx.fillStyle="#333";ctx.font="14px Nunito";
    ctx.fillText(d.count,x+barW/4,y-5);
    ctx.fillStyle="#444";
    ctx.fillText(d.med,x,H-padB+15);
  });
  ctx.strokeStyle="#444";ctx.beginPath();ctx.moveTo(padL,0);ctx.lineTo(padL,H-padB);ctx.stroke();
}

function info(msg){infoMessage.style.display="block";infoMessage.textContent=msg;
                   errorMessage.style.display="none";}
