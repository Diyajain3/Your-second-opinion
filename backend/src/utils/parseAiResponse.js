export function parseAiResponse(rawText) {
  if (!rawText) {
    throw new Error("Empty AI response received");
  }

  // Remove markdown code fences if present
  let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Extract first JSON object match ({...})
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse AI response as JSON: ${err.message}. Raw: ${rawText}`);
  }
}