import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key",
});

function buildReviewPrompt(reviews) {
  return `You are analyzing customer reviews for a product to give an honest, scannable, point-based "second opinion."

Here are the reviews:
---
${reviews}
---

Rules you must follow:
- Respond with ONLY the JSON object below. No explanation, no markdown code fences, no extra text before or after.
- fakeReviewScore must be a whole number between 0 and 100 representing authenticity confidence signal.
- genuinePros: MUST contain EXACTLY 3 crisp, main positive points (1 sentence each).
- genuineCons: MUST contain EXACTLY 3 crisp, main negative/trade-off points (1 sentence each).
- categoryMetrics: Provide EXACTLY 4 category-relevant metrics tailored to the product type (e.g., for Electronics: "Battery Life", "Build Quality", "Performance", "Value for Money"; for Clothing: "Fabric Quality", "Fit & Sizing", "Color Retention", "Comfort"; for General: "Build Quality", "Ease of Use", "Reliability", "Value for Money"). Each metric must have a score (0-100) and a short label ("Outstanding", "Good", "Mixed", or "Poor").

Respond in exactly this JSON format:

{
  "overallSentiment": "positive" | "mixed" | "negative",
  "fakeReviewScore": 85,
  "fakeReviewReasoning": "1-2 sentence plain explanation",
  "genuinePros": [
    "Short main pro 1",
    "Short main pro 2",
    "Short main pro 3"
  ],
  "genuineCons": [
    "Short main con 1",
    "Short main con 2",
    "Short main con 3"
  ],
  "redFlags": ["suspicious pattern or note if any"],
  "honestSummary": "2 sentence clear summary",
  "categoryMetrics": [
    { "name": "Metric Name 1", "score": 85, "label": "Good" },
    { "name": "Metric Name 2", "score": 90, "label": "Outstanding" },
    { "name": "Metric Name 3", "score": 75, "label": "Average" },
    { "name": "Metric Name 4", "score": 80, "label": "Good" }
  ]
}`;
}

function buildComparePrompt(productA, productB) {
  return `Compare two products head-to-head based on their customer reviews.

Product A Name: ${productA.name}
Product A Reviews:
---
${productA.reviewText}
---

Product B Name: ${productB.name}
Product B Reviews:
---
${productB.reviewText}
---

Rules you must follow:
- Respond with ONLY the JSON object below. No explanation, no markdown code fences, no extra text before or after.
- winner: "product_a" | "product_b" | "tie"
- comparisonSummary: 2 concise sentences explaining why Product A or Product B wins.
- genuinePros and genuineCons for each product MUST contain EXACTLY 3 crisp main points.
- categoryMetrics: Provide EXACTLY 4 head-to-head metric comparisons relevant to the product category (e.g. "Build & Durability", "Battery / Comfort", "Performance / Quality", "Price to Value"). Include 0-100 scores for both Product A and Product B and state which product wins that metric.

Respond in exactly this JSON format:

{
  "winner": "product_a" | "product_b" | "tie",
  "comparisonSummary": "2 sentence crisp verdict explaining the winner decision",
  "categoryMetrics": [
    { "metric": "Build & Materials", "productAScore": 88, "productBScore": 72, "winner": "Product A" },
    { "metric": "Key Performance", "productAScore": 82, "productBScore": 90, "winner": "Product B" },
    { "metric": "Daily Comfort / Ease", "productAScore": 85, "productBScore": 78, "winner": "Product A" },
    { "metric": "Value for Money", "productAScore": 75, "productBScore": 85, "winner": "Product B" }
  ],
  "productAResult": {
    "name": "${productA.name}",
    "overallSentiment": "positive" | "mixed" | "negative",
    "fakeReviewScore": 85,
    "genuinePros": ["Pro 1", "Pro 2", "Pro 3"],
    "genuineCons": ["Con 1", "Con 2", "Con 3"]
  },
  "productBResult": {
    "name": "${productB.name}",
    "overallSentiment": "positive" | "mixed" | "negative",
    "fakeReviewScore": 80,
    "genuinePros": ["Pro 1", "Pro 2", "Pro 3"],
    "genuineCons": ["Con 1", "Con 2", "Con 3"]
  }
}`;
}

async function callGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (err) {
    throw new Error(`Gemini API Error: ${err.message}`);
  }
}

export async function analyzeReview(reviews) {
  const prompt = buildReviewPrompt(reviews);
  return callGemini(prompt);
}

export async function compareProducts(productA, productB) {
  const prompt = buildComparePrompt(productA, productB);
  return callGemini(prompt);
}