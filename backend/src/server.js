import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import reviewsRoute from "./routes/reviews.js";
import comparisonsRoute from "./routes/comparisons.js";
import feedbackRoute from "./routes/feedback.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Second Opinion API is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/comparisons", comparisonsRoute);
app.use("/api/feedback", feedbackRoute);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.DATABASE_URL) {
    console.error("⚠️ WARNING: DATABASE_URL is missing in Railway Variables!");
  } else {
    console.log("✅ DATABASE_URL is connected.");
  }
});

// Dual port fallback listener
if (process.env.PORT && String(process.env.PORT) !== "5000") {
  try {
    app.listen(5000, "0.0.0.0", () => {
      console.log("Backend fallback listener running on port 5000");
    });
  } catch (err) {
    // Ignored if port 5000 in use
  }
}