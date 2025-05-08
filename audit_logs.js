(function () {
    const LOG_KEY = "auditLog";
    const tbody   = document.querySelector("#logTable tbody");
    const clearBtn= document.getElementById("clearBtn");
    let lastRendered = "";
  
    function getLogs() {
      try {
        const raw = localStorage.getItem(LOG_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    }
  
    function render() {
      const logs = getLogs().slice().reverse();
      const content = logs.length
        ? logs.map(l => `<tr><td>${l}</td></tr>`).join("")
        : "<tr><td>No logs yet.</td></tr>";
  
      if (content !== lastRendered) {
        tbody.innerHTML = content;
        lastRendered = content;
      }
    }
  
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear all logs?")) {
        localStorage.removeItem(LOG_KEY);
        render();
      }
    });
  
    render();
    setInterval(render, 2000); // Refresh logs every 2 seconds
  })();
  