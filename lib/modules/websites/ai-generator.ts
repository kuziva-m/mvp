export async function generateAICopy({
  businessName,
  industry,
  templateId,
}: any) {
  // Placeholder for Anthropic API call
  console.log(`Generating copy for ${businessName} in ${industry}`);

  // Return mock content structure expected by the templates
  return {
    heroHeadline: `The Best ${industry} Services in Town`,
    heroSubheadline: `We help ${businessName} customers get what they need.`,
    aboutText: `Welcome to ${businessName}. We are committed to excellence...`,
    contactEmail: "contact@example.com",
    services: ["Service A", "Service B", "Service C"],
    // Add more fields as needed by your templates
  };
}
