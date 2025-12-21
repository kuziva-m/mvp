interface LeadData {
  business_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  address?: string;
}

export function calculateLeadQualityScore(lead: LeadData): number {
  let score = 0;

  // 1. Mandatory Fields (Baseline)
  if (lead.business_name && lead.email) {
    score += 30;
  } else {
    return 0; // Disqualified if basics missing
  }

  // 2. Communication Channels
  if (lead.phone) score += 20;

  // 3. Digital Presence
  // If they HAVE a website, they might be lower priority for a "new website" service?
  // Or higher priority because they spend money on marketing?
  // Assuming they are higher quality if they have a website we can scrape to improve.
  if (lead.website) {
    score += 20;
  } else {
    // If they don't have a website, they are a PERFECT candidate for a new one.
    // Let's actually weight 'no website' higher for a web design agency lead.
    score += 30;
  }

  // 4. Industry Clarity
  if (lead.industry && lead.industry.toLowerCase() !== "other") {
    score += 10;
  }

  // 5. Email Quality (Simple heuristic)
  if (
    lead.email &&
    !lead.email.includes("gmail.com") &&
    !lead.email.includes("yahoo.com")
  ) {
    // Business email domain usually indicates higher value
    score += 10;
  }

  return Math.min(score, 100);
}
