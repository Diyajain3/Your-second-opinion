import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function buildReviewPrompt(reviews) {
  return `You are analyzing customer reviews for a product to give an honest "second opinion."

Here are the reviews:
---
${reviews}
---

Rules you must follow:
- Respond with ONLY the JSON object below. No explanation, no markdown code fences, no extra text before or after.
- fakeReviewScore must be a whole number between 0 and 100.
- genuinePros and genuineCons must only reflect things actually mentioned in the reviews — do not invent details.
- If reviews are too few or too vague to judge confidently, say so in honestSummary instead of guessing.

Respond in exactly this JSON format:

{
  "overallSentiment": "positive" | "mixed" | "negative",
  "fakeReviewScore": 0-100,
  "fakeReviewReasoning": "short explanation",
  "genuinePros": ["pro 1", "pro 2", "pro 3"],
  "genuineCons": ["con 1", "con 2", "con 3"],
  "redFlags": ["suspicious patterns you noticed"],
  "honestSummary": "2-3 sentence plain summary"
}`;
}

function buildComparePrompt(productA, productB) {
  return `Compare two products based on their customer reviews.

Product A: ${productA.name}
Reviews:
---
${productA.reviewText}
---

Product B: ${productB.name}
Reviews:
---
${productB.reviewText}
---

Rules you must follow:
- Respond with ONLY the JSON object below. No explanation, no markdown code fences, no extra text before or after.
- fakeReviewScore for each product must be a whole number between 0 and 100.
- genuinePros and genuineCons must only reflect things actually mentioned in that product's reviews — do not invent details.
- Only declare a "winner" if the evidence clearly favors one product. If they are close or serve different needs, use "tie" and explain the tradeoff in comparisonSummary.
- If either product has too few or too vague reviews to judge confidently, say so in comparisonSummary instead of guessing.

Respond in exactly this JSON format:

{
  "winner": "product_a" | "product_b" | "tie",
  "comparisonSummary": "2-3 sentence explanation of the verdict",
  "productAResult": {
    "overallSentiment": "positive" | "mixed" | "negative",
    "fakeReviewScore": 0-100,
    "genuinePros": ["..."],
    "genuineCons": ["..."]
  },
  "productBResult": {
    "overallSentiment": "positive" | "mixed" | "negative",
    "fakeReviewScore": 0-100,
    "genuinePros": ["..."],
    "genuineCons": ["..."]
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