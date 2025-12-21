/**
 * MOCK Scraper Client
 * Simulates scraping Google Maps or an existing website.
 */

export async function scrapeBusinessData(
  websiteUrl: string | undefined,
  businessName: string
) {
  console.log(
    `[MOCK SCRAPER] Analyzing ${businessName} ${
      websiteUrl ? `at ${websiteUrl}` : ""
    }...`
  );

  // Simulate scraping delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    logoUrl: "https://via.placeholder.com/150", // Placeholder logo
    colors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      background: "#ffffff",
    },
    extractedText: "Mock extracted text from existing digital footprint...",
    socialLinks: {
      facebook: `https://facebook.com/${businessName.replace(/\s+/g, "")}`,
      instagram: `https://instagram.com/${businessName.replace(/\s+/g, "")}`,
    },
  };
}
