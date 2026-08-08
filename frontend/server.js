import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve path to dist directory
const distPath = path.join(__dirname, "dist");
const indexPath = path.join(distPath, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("⚠️ WARNING: dist/index.html not found at:", indexPath);
} else {
  console.log("✅ dist/index.html located cleanly at:", indexPath);
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
    res.status(500).send("Frontend build dist/index.html missing. Please ensure build command runs npm run build.");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend production server running on port ${PORT}`);
});
