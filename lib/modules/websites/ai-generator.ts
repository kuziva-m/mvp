import Anthropic from "@anthropic-ai/sdk";

// Initialize the client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // This pulls from your .env.local
});

export async function generateWebsiteCopy(
  businessName: string,
  industry: string,
  existingData: any
) {
  console.log(`[AI] Generating copy for ${businessName}...`);

  // 1. Construct the prompt
  const systemPrompt = `You are a professional copywriter for small businesses. 
  Write a high-converting website copy for a ${industry} business named "${businessName}".
  Return ONLY valid JSON. Do not include any conversational text.`;

  const userMessage = `
    Based on this existing data: ${JSON.stringify(existingData)}, 
    generate the following sections:
    1. hero_headline (Catchy, under 10 words)
    2. hero_subheadline (Benefit-driven, under 20 words)
    3. about_us (Professional, under 50 words)
    4. services (Array of 3 services with 'title' and 'description')
    
    Format response as JSON:
    {
      "hero": { "headline": "...", "subheadline": "..." },
      "about": "...",
      "services": [ { "title": "...", "description": "..." } ]
    }
  `;

  try {
    // 2. Call Anthropic API
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Fast & Cheap model for testing
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    // 3. Parse the response
    const textContent =
      msg.content[0].type === "text" ? msg.content[0].text : "";

    // Attempt to clean JSON if Claude added extra text (simple cleanup)
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : textContent;

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Anthropic API Error:", error);
    // Fallback if API fails so app doesn't crash
    return {
      hero: {
        headline: `Welcome to ${businessName}`,
        subheadline: "We serve the best.",
      },
      about: "Error generating copy.",
      services: [],
    };
  }
}
