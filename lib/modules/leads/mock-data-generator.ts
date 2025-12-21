export interface MockLeadConfig {
  count: number
  city?: string
  industry?: string
}

export function generateMockLeads(config: MockLeadConfig) {
  const leads = []

  const cities = ['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide']
  const industries = ['plumbing', 'electrical', 'hvac', 'roofing', 'landscaping', 'painting']
  const businessTypes = ['Services', 'Co', 'Group', 'Experts', 'Solutions', 'Pros']
  const streets = ['Main St', 'High St', 'King St', 'Queen St', 'Smith St', 'Collins St']
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Sophie']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Wilson', 'Taylor']

  for (let i = 0; i < config.count; i++) {
    const city = config.city || cities[Math.floor(Math.random() * cities.length)]
    const industry = config.industry || industries[Math.floor(Math.random() * industries.length)]
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)]
    const street = streets[Math.floor(Math.random() * streets.length)]
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    const businessName = `${city} ${industry.charAt(0).toUpperCase() + industry.slice(1)} ${businessType}`
    const hasWebsite = Math.random() > 0.5
    const hasEmail = Math.random() > 0.3

    leads.push({
      business_name: businessName,
      email: hasEmail ? `contact@${businessName.toLowerCase().replace(/\s/g, '')}.com.au` : null,
      phone: `04${Math.floor(10000000 + Math.random() * 90000000)}`,
      website: hasWebsite ? `https://${businessName.toLowerCase().replace(/\s/g, '')}.com.au` : null,
      address: `${Math.floor(Math.random() * 999) + 1} ${street}, ${city} VIC ${3000 + i}`,
      city: city,
      state: 'VIC',
      postcode: `${3000 + i}`,
      industry: industry,
      owner_name: `${firstName} ${lastName}`,
      business_age: Math.floor(Math.random() * 20) + 1,
      rating: Math.random() > 0.2 ? (3.5 + Math.random() * 1.5) : null,
      reviews_count: Math.random() > 0.2 ? Math.floor(Math.random() * 200) + 1 : null,
      source: 'mock',
      source_metadata: {
        mock_id: `mock-${i}`,
        generated_at: new Date().toISOString(),
      },
    })
  }

  return leads
}
