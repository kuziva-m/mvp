const IS_MOCK_MODE = !process.env.SCRAPEMAPS_API_KEY

export interface ScrapeMapsConfig {
  query: string
  location: string
  limit?: number
}

export async function scrapeGoogleMaps(config: ScrapeMapsConfig) {
  if (IS_MOCK_MODE) {
    return mockScrapeMaps(config)
  }

  return realScrapeMaps(config)
}

async function realScrapeMaps(config: ScrapeMapsConfig) {
  console.log(`🗺️ [PRODUCTION] ScrapeMaps: ${config.query} in ${config.location}`)

  const response = await fetch('https://api.scrapemaps.com/v1/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SCRAPEMAPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: config.query,
      location: config.location,
      limit: config.limit || 100,
    }),
  })

  if (!response.ok) {
    throw new Error(`ScrapeMaps API error: ${response.status}`)
  }

  const data = await response.json()

  return (data.results || []).map((item: any) => ({
    business_name: item.name,
    address: item.address,
    phone: item.phone,
    website: item.website,
    rating: item.rating,
    reviews_count: item.reviews,
    category: item.category,
    lat: item.lat,
    lng: item.lng,
  }))
}

function mockScrapeMaps(config: ScrapeMapsConfig) {
  console.log(`🗺️ [MOCK] ScrapeMaps: ${config.query} in ${config.location}`)

  const { generateMockLeads } = require('../mock-data-generator')
  const mockLeads = generateMockLeads({
    count: config.limit || 100,
    city: config.location.split(',')[0],
    industry: config.query,
  })

  return mockLeads.map((lead: any) => ({
    business_name: lead.business_name,
    address: lead.address,
    phone: lead.phone,
    website: lead.website,
    rating: lead.rating,
    reviews_count: lead.reviews_count,
    category: lead.industry,
  }))
}
