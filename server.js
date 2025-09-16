// server.js
const express = require("express");
const { exec } = require("child_process");
const http = require("http");

const app = express();
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Webhook server is running");
});

app.post("/webhook", (req, res) => {
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

// Render requirement: bind to 0.0.0.0 and use process.env.PORT
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Increase timeouts for Render (avoid 502 / timeout errors)
server.keepAliveTimeout = 120000; // 120s
server.headersTimeout = 120000;   // 120s

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
