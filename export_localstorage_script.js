
(function(){
  const db = {};
  Object.keys(localStorage).forEach(key => {
    try {
      db[key] = JSON.parse(localStorage.getItem(key));
    } catch {
      db[key] = localStorage.getItem(key);
    }
  });
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "localStorageDump.json";
  a.click();
})();
