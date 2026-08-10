import express from "express";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Helper middleware to extract userId if valid token present, without blocking unauthenticated requests
function softAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const secret = process.env.JWT_SECRET || "default_jwt_secret";
      const decoded = jwt.verify(token, secret);
      req.userId = decoded.userId;
    } catch (e) {
      // Ignored if invalid token
    }
  }
  next();
}

// POST /api/feedback - Save feedback cleanly
router.post("/", softAuth, async (req, res) => {
  const { reviewId, comparisonId, rating, comment } = req.body;

  try {
    const parseId = (val) => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    const parsedReviewId = parseId(reviewId);
    const parsedComparisonId = parseId(comparisonId);

    // Verify if userId exists in new database before attaching foreign key
    let validUserId = null;
    if (req.userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true },
      });
      if (userExists) {
        validUserId = userExists.id;
      }
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: validUserId,
        reviewId: parsedReviewId,
        comparisonId: parsedComparisonId,
        rating: rating !== undefined && rating !== null ? String(rating) : null,
        comment: comment ? String(comment).trim() : null,
      },
    });

    console.log("✅ Feedback saved to database with ID:", feedback.id);
    res.status(201).json(feedback);
  } catch (err) {
    console.error("Error saving feedback to database:", err);
    res.status(500).json({ error: "Failed to save feedback", details: err.message });
  }
});

// GET /api/feedback - Get user's feedback history
router.get("/", softAuth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.json([]);
    }
    const feedbacks = await prisma.feedback.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      include: {
        review: { select: { productName: true } },
        comparison: { select: { productAName: true, productBName: true } },
      },
    });
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

export default router;