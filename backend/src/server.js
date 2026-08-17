import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { execSync } from "child_process";
import authRoute from "./routes/auth.js";
import reviewsRoute from "./routes/reviews.js";
import comparisonsRoute from "./routes/comparisons.js";
import feedbackRoute from "./routes/feedback.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Support both GET and HEAD methods for UptimeRobot monitoring
app.all("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Second Opinion API is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/comparisons", comparisonsRoute);
app.use("/api/feedback", feedbackRoute);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ WARNING: DATABASE_URL is missing in environment variables.");
  } else {
    console.log("✅ DATABASE_URL is configured.");
  }
});

export default app;