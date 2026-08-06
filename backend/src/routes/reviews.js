import express from "express";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { analyzeReview } from "../services/aiService.js";
import { parseAiResponse } from "../utils/parseAiResponse.js";

const router = express.Router();

//POST /api/reviews-analyze + save a new review
router.post("/", requireAuth, async (req, res) => {
  const { productName, productLink, reviewText } = req.body;

  if (!reviewText || reviewText.trim().length === 0) {
    return res.status(400).json({ error: "reviewText is required" });
  }

  try {
    const rawAiText = await analyzeReview(reviewText);
    const result = parseAiResponse(rawAiText);

    if (
      typeof result.fakeReviewScore !== "number" ||
      !Array.isArray(result.genuinePros)
    ) {
      return res
        .status(502)
        .json({ error: "AI returned an unexpected format, please try again" });
    }
    const saved = await prisma.review.create({
      data: {
        userId: req.userId,
        productName: productName || "Unknown product",
        productLink,
        rawReviewText: reviewText,
        overallSentiment: result.overallSentiment,
        fakeReviewScore: result.fakeReviewScore,
        fakeReviewReasoning: result.fakeReviewReasoning,
        genuinePros: result.genuinePros,
        genuineCons: result.genuineCons,
        redFlags: result.redFlags,
        honestSummary: result.honestSummary,
      },
    });
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to analyze review", details: err.message });
  }
});

//GET /api/reviews-list logged-in user's past reviews
router.get("/", requireAuth, async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(reviews);
});

//GET /api/reviews/:id- single review
router.get("/:id", requireAuth, async (req, res) => {
  const review = await prisma.review.findFirst({
    where: { id: Number(req.params.id), userId: req.userId },
  });
  if (!review) return res.status(404).json({ error: "Review not found" });
  res.json(review);
});
export default router;
