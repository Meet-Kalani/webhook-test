// server.js
const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  console.log("in /");
  res.send("Hello from webhook server!");
});

app.post("/webhook", (req, res) => {
  console.log("in /webhook");
  const event = req.headers["x-gitlab-event"];
  if (event === "Push Hook") {
    console.log("🚀 Push detected, running release script...");
    exec("npm run release:patch", (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Release failed:", stderr);
      } else {
        console.log(stdout);
      }
    });
  }
  res.status(200).send("OK");
});

// Render gives port via env variable
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
