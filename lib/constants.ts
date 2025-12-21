// Application constants

export const INDUSTRIES = [
  'plumbing',
  'electrical',
  'hvac',
  'restaurant',
  'cafe',
  'retail',
  'gym',
  'lawyer',
  'accountant',
  'consultant',
  'other'
] as const

export const LEAD_STATUSES = [
  'pending',
  'scraped',
  'generated',
  'emailed',
  'opened',
  'clicked',
  'subscribed',
  'delivered',
  'canceled'
] as const

export const PRICING_TIERS = {
  starter: {
    name: 'Starter',
    price: 99,
    updates_per_month: 3,
    features: [
      '1 premium template',
      'AI-generated copy',
      'Custom domain + email',
      '3 updates/month',
      '48-hour support'
    ]
  },
  professional: {
    name: 'Professional',
    price: 149,
    updates_per_month: 6,
    features: [
      'Premium templates',
      'AI + human polish',
      'Custom domain + 5 emails',
      '6 updates/month',
      '24-hour support',
      'Basic SEO'
    ]
  },
  premium: {
    name: 'Premium',
    price: 249,
    updates_per_month: -1, // unlimited
    features: [
      'Custom template selection',
      'Professional copywriter',
      'Custom domain + unlimited emails',
      'Unlimited updates',
      'Same-day support',
      'Advanced SEO + GMB setup'
    ]
  }
} as const
