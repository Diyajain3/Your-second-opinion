import express from "express";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { compareProducts } from "../services/aiService.js";
import { parseAiResponse } from "../utils/parseAiResponse.js";

const router = express.Router();

// POST /api/comparisons
router.post("/", requireAuth, async (req, res) => {
  const { productA, productB } = req.body;

  if (!productA?.reviewText || !productB?.reviewText) {
    return res.status(400).json({ error: "Both products need review text" });
  }

  try {
    const rawAiText = await compareProducts(productA, productB);
    const result = parseAiResponse(rawAiText);

    const saved = await prisma.comparison.create({
      data: {
        userId: req.userId,
        productAName: productA.name || "Product A",
        productALink: productA.link,
        productAReviewText: productA.reviewText,
        productBName: productB.name || "Product B",
        productBLink: productB.link,
        productBReviewText: productB.reviewText,
        winner: result.winner,
        comparisonSummary: result.comparisonSummary,
        productAResult: result.productAResult,
        productBResult: result.productBResult,
      },
    });
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compare products", details: err.message });
  }
});

// GET /api/comparisons (supports scope=all for community activity)
router.get("/", requireAuth, async (req, res) => {
  const scope = req.query.scope;
  const whereClause = scope === "all" ? {} : { userId: req.userId };

  const comparisons = await prisma.comparison.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });
  res.json(comparisons);
});

export default router;