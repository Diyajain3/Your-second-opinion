export function parseAiResponse(rawText)
{
  const cleaned=rawText.replace(/```json|```/g,"").trim();

  try{
    return JSON.parse(cleaned);
  }catch(err)
  {
    throw new Error("Failed to parse AI response as JSON:"+err.message)
  }
}