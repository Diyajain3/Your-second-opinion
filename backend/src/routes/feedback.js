import express from "express";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// POST /api/feedback - Save feedback
router.post("/", requireAuth, async (req, res) => {
  const { reviewId, comparisonId, rating, comment } = req.body;

  try {
    const parseId = (val) => {
      if (!val) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    const parsedReviewId = parseId(reviewId);
    const parsedComparisonId = parseId(comparisonId);

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.userId,
        reviewId: parsedReviewId,
        comparisonId: parsedComparisonId,
        rating: rating !== undefined && rating !== null ? String(rating) : null,
        comment: comment ? String(comment).trim() : null,
      },
    });

    console.log("✅ Feedback saved successfully to database:", feedback.id);
    res.status(201).json(feedback);
  } catch (err) {
    console.error("Error saving feedback to database:", err);
    res.status(500).json({ error: "Failed to save feedback", details: err.message });
  }
});

// GET /api/feedback - Get user's feedback history
router.get("/", requireAuth, async (req, res) => {
  try {
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