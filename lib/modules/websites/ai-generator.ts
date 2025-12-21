/**
 * MOCK AI Generator
 * Simulates calling Anthropic to write website copy.
 */

export async function generateWebsiteCopy(
  businessName: string,
  industry: string,
  existingData: any
) {
  console.log(`[MOCK AI] Generating copy for ${businessName} (${industry})...`);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    hero: {
      headline: `Welcome to ${businessName}`,
      subheadline: `The best ${industry} services in the region. Quality you can trust.`,
      ctaText: "Get a Quote",
    },
    about: {
      title: "Our Story",
      content: `${businessName} has been serving the community with dedication and excellence. We pride ourselves on customer satisfaction.`,
    },
    services: [
      {
        title: "Service 1",
        description: "High quality service description tailored to your needs.",
      },
      {
        title: "Service 2",
        description: "Another premium offering that our customers love.",
      },
      {
        title: "Service 3",
        description: "Comprehensive solutions for your specific requirements.",
      },
    ],
    contact: {
      email:
        existingData.email ||
        `contact@${businessName.replace(/\s+/g, "").toLowerCase()}.com`,
      phone: existingData.phone || "555-0123",
      address: "123 Main St, Sydney NSW",
    },
  };
}
