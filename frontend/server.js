import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve path to dist directory
const distPath = path.join(__dirname, "dist");
const indexPath = path.join(distPath, "index.html");

// Auto build dist if missing
if (!fs.existsSync(indexPath)) {
  console.log("⚠️ dist/index.html missing. Auto-building dist folder...");
  try {
    execSync("npx vite build", { cwd: __dirname, stdio: "inherit" });
    console.log("✅ Auto build completed successfully!");
  } catch (e) {
    console.error("Auto build failed:", e);
  }
} else {
  console.log("✅ dist/index.html verified.");
}

// Serve static assets built by Vite
app.use(express.static(distPath));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", distExists: fs.existsSync(indexPath) });
});

// SPA fallback for all client routes (/login, /review, /compare, /history)
app.use((req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send("Frontend build in progress. Please refresh in a few seconds.");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend production server running on port ${PORT}`);
});
