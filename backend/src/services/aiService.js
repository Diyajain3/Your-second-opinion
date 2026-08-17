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

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGroqOrGrok(prompt) {
  const apiKey =
    process.env.GROQ_API_KEY ||
    process.env.GROK_API_KEY ||
    process.env.XAI_API_KEY;
  if (!apiKey || !apiKey.trim() || apiKey === "your_grok_key_here") return null;

  const keyTrimmed = apiKey.trim();
  const isGroqKey = keyTrimmed.startsWith("gsk_");
  const endpoint = isGroqKey
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.x.ai/v1/chat/completions";
  const model = isGroqKey ? "llama-3.3-70b-versatile" : "grok-2-latest";

  try {
    console.log(`Calling ${isGroqKey ? "Groq (Llama 3.3 70B)" : "Grok"} API...`);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyTrimmed}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn(`${isGroqKey ? "Groq" : "Grok"} API non-OK response:`, res.status, errData);

      if (isGroqKey) {
        return await callGroqInstantFallback(prompt, keyTrimmed);
      }
      return null;
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    if (text) {
      console.log(`✅ ${isGroqKey ? "Groq" : "Grok"} API responded successfully!`);
      return text;
    }
  } catch (err) {
    console.warn("Groq/Grok API call failed:", err.message);
  }
  return null;
}

async function callGroqInstantFallback(prompt, keyTrimmed) {
  try {
    console.log("Retrying with Groq Llama 3.1 8B instant model...");
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyTrimmed}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        console.log("✅ Groq Llama 3.1 8B responded successfully!");
        return text;
      }
    }
  } catch (e) {
    console.warn("Groq fallback model failed:", e.message);
  }
  return null;
}

async function callGemini(prompt) {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
  ];
  let lastError;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        if (response?.text) {
          return response.text;
        }
      } catch (err) {
        lastError = err;
        const errStr = String(err.message || err);
        console.warn(`Gemini attempt ${attempt} on model ${model} failed:`, errStr);

        if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED")) {
          if (attempt === 1) {
            console.log("Rate limited. Waiting 2s before retrying...");
            await delay(2000);
            continue;
          }
        }
        break;
      }
    }
  }

  throw new Error(`AI Service Error: ${lastError?.message || "All AI models unavailable"}`);
}

export async function analyzeReview(reviews) {
  const prompt = buildReviewPrompt(reviews);

  // 1. Primary AI provider: Groq / Grok
  const fastAiRes = await callGroqOrGrok(prompt);
  if (fastAiRes) return fastAiRes;

  // 2. Secondary AI provider: Gemini
  return await callGemini(prompt);
}

export async function compareProducts(productA, productB) {
  const prompt = buildComparePrompt(productA, productB);

  // 1. Primary AI provider: Groq / Grok
  const fastAiRes = await callGroqOrGrok(prompt);
  if (fastAiRes) return fastAiRes;

  // 2. Secondary AI provider: Gemini
  return await callGemini(prompt);
}