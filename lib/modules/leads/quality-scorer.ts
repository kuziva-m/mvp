<<<<<<< HEAD
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
=======
export interface EnrichedLead {
  business_name: string
  email?: string | null
  phone?: string | null
  website?: string | null
  industry: string
  has_website: boolean
  website_age?: number | null
  business_age?: number | null
  owner_name?: string | null
  employee_count?: number | null
  rating?: number | null
  reviews_count?: number | null
}

export interface QualityScore {
  score: number
  breakdown: {
    websiteStatus: number
    credibility: number
    maturity: number
    contactInfo: number
    industry: number
  }
  tier: 'high' | 'medium' | 'low'
  shouldAutoAdd: boolean
}

export function scoreLeadQuality(lead: EnrichedLead): QualityScore {
  const breakdown = {
    websiteStatus: 0,
    credibility: 0,
    maturity: 0,
    contactInfo: 0,
    industry: 0,
  }

  // 1. Website Status (40 points) - NO WEBSITE IS BEST!
  if (!lead.has_website) {
    breakdown.websiteStatus = 40
  } else if (lead.website_age && lead.website_age >= 10) {
    breakdown.websiteStatus = 25
  } else if (lead.website_age && lead.website_age >= 5) {
    breakdown.websiteStatus = 15
  } else {
    breakdown.websiteStatus = 5
  }

  // 2. Credibility (30 points)
  if (lead.rating && lead.rating >= 4.5 && lead.reviews_count && lead.reviews_count >= 50) {
    breakdown.credibility = 30
  } else if (lead.rating && lead.rating >= 4.0 && lead.reviews_count && lead.reviews_count >= 20) {
    breakdown.credibility = 20
  } else if (lead.rating && lead.rating >= 3.5) {
    breakdown.credibility = 10
  }

  if (lead.phone && lead.email) {
    breakdown.credibility += 5
  }

  breakdown.credibility = Math.min(breakdown.credibility, 30)

  // 3. Maturity (15 points)
  if (lead.business_age && lead.business_age >= 10) {
    breakdown.maturity = 15
  } else if (lead.business_age && lead.business_age >= 5) {
    breakdown.maturity = 10
  } else if (lead.business_age && lead.business_age >= 2) {
    breakdown.maturity = 5
  }

  if (lead.employee_count) {
    if (lead.employee_count >= 10) breakdown.maturity += 5
    else if (lead.employee_count >= 5) breakdown.maturity += 3
  }

  breakdown.maturity = Math.min(breakdown.maturity, 15)

  // 4. Contact Info (10 points)
  if (lead.phone) breakdown.contactInfo += 5
  if (lead.email) breakdown.contactInfo += 5

  // 5. Industry (5 points)
  const tier1 = ['plumber', 'plumbing', 'electrician', 'electrical', 'hvac', 'heating', 'cooling', 'roofing', 'landscaping']
  const tier2 = ['locksmith', 'pest', 'cleaning', 'painting', 'carpentry']

  const industry = lead.industry.toLowerCase()

  if (tier1.some(i => industry.includes(i))) {
    breakdown.industry = 5
  } else if (tier2.some(i => industry.includes(i))) {
    breakdown.industry = 3
  } else {
    breakdown.industry = 1
  }

  const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  let tier: 'high' | 'medium' | 'low'
  if (score >= 70) tier = 'high'
  else if (score >= 50) tier = 'medium'
  else tier = 'low'

  const shouldAutoAdd = score >= 60

  return { score, breakdown, tier, shouldAutoAdd }
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
}
