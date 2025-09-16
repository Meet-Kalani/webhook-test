// server.js
const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  console.log("in the get");
  res.send("Hello World!");
});

app.post("/webhook", (req, res) => {
  const event = req.headers["x-gitlab-event"];
  console.log("in the webhook");
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

app.listen(4000, "0.0.0.0", () => console.log("Webhook server running on port 4000"));
