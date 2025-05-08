// save-server.js
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

app.post("/save", (req, res) => {
  fs.writeFileSync("localstorage_backup.json", JSON.stringify(req.body, null, 2));
  console.log("✅ localStorage written to localstorage_backup.json");
  res.sendStatus(200);
});

app.listen(9999, () => console.log("🚀 Ready to receive localStorage at http://localhost:9999/save"));
