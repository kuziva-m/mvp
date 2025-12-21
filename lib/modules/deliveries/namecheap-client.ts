/**
 * Namecheap Domain Registration Client (MOCKED)
 *
 * This is a MOCKED implementation for development and testing.
 * In production, replace with actual Namecheap API calls.
 *
 * Real API documentation: https://www.namecheap.com/support/api/intro/
 */

export interface DomainRegistrationResult {
  success: boolean
  domain: string
  orderId: string | null
  expiresAt: Date | null
  error?: string
}

/**
 * Sanitize business name to create a valid domain
 */
function sanitizeDomainName(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .substring(0, 63) // Max domain label length
}

/**
 * Search for available domain based on business name
 * MOCKED: Always returns a .com.au domain
 *
 * In production, this would call Namecheap API:
 * POST https://api.namecheap.com/xml.response
 * Command: namecheap.domains.check
 */
export async function searchAvailableDomain(businessName: string): Promise<string> {
  console.log('[MOCK] Namecheap: Searching for available domain...')
  console.log('[MOCK] Business name:', businessName)

  const baseDomain = sanitizeDomainName(businessName)

  // Simulate checking multiple TLDs
  const tlds = ['.com.au', '.com', '.net.au']

  for (const tld of tlds) {
    const domain = `${baseDomain}${tld}`
    console.log(`[MOCK] Checking availability: ${domain}`)

    // MOCK: First domain is always available
    console.log(`[MOCK] ✓ ${domain} is available`)
    return domain
  }

  // Fallback
  return `${baseDomain}.com.au`
}

/**
 * Register domain with Namecheap
 * MOCKED: Always succeeds and returns mock order ID
 *
 * In production, this would call Namecheap API:
 * POST https://api.namecheap.com/xml.response
 * Command: namecheap.domains.create
 *
 * Required params:
 * - DomainName
 * - Years (default: 1)
 * - RegistrantContact (FirstName, LastName, Address, etc.)
 * - TechContact
 * - AdminContact
 * - BillingContact
 */
export async function registerDomain(
  domain: string,
  leadId: string
): Promise<DomainRegistrationResult> {
  console.log('[MOCK] Namecheap: Registering domain...')
  console.log('[MOCK] Domain:', domain)
  console.log('[MOCK] Lead ID:', leadId)

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // MOCK: Always successful
  const mockResult: DomainRegistrationResult = {
    success: true,
    domain,
    orderId: `NC-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  }

  console.log('[MOCK] ✓ Domain registered successfully')
  console.log('[MOCK] Order ID:', mockResult.orderId)
  console.log('[MOCK] Expires:', mockResult.expiresAt?.toISOString())

  /* PRODUCTION CODE:
  const namecheapApiKey = process.env.NAMECHEAP_API_KEY
  const namecheapUsername = process.env.NAMECHEAP_USERNAME
  const namecheapApiUser = process.env.NAMECHEAP_API_USER

  const response = await fetch('https://api.namecheap.com/xml.response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      ApiUser: namecheapApiUser,
      ApiKey: namecheapApiKey,
      UserName: namecheapUsername,
      Command: 'namecheap.domains.create',
      ClientIp: '0.0.0.0', // Your server IP
      DomainName: domain,
      Years: '1',
      // Add contact information from lead data
    }),
  })

  const xmlText = await response.text()
  // Parse XML response and extract order details
  */

  return mockResult
}

/**
 * Update domain nameservers to point to Cloudflare
 * MOCKED: Always succeeds
 *
 * In production, this would call Namecheap API:
 * POST https://api.namecheap.com/xml.response
 * Command: namecheap.domains.dns.setCustom
 */
export async function updateNameservers(
  domain: string,
  nameservers: string[]
): Promise<{ success: boolean }> {
  console.log('[MOCK] Namecheap: Updating nameservers...')
  console.log('[MOCK] Domain:', domain)
  console.log('[MOCK] Nameservers:', nameservers)

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  console.log('[MOCK] ✓ Nameservers updated successfully')

  /* PRODUCTION CODE:
  const namecheapApiKey = process.env.NAMECHEAP_API_KEY
  const namecheapUsername = process.env.NAMECHEAP_USERNAME
  const namecheapApiUser = process.env.NAMECHEAP_API_USER

  // Extract domain and TLD
  const [sld, ...tldParts] = domain.split('.')
  const tld = tldParts.join('.')

  const params = new URLSearchParams({
    ApiUser: namecheapApiUser,
    ApiKey: namecheapApiKey,
    UserName: namecheapUsername,
    Command: 'namecheap.domains.dns.setCustom',
    ClientIp: '0.0.0.0',
    SLD: sld,
    TLD: tld,
    Nameservers: nameservers.join(','),
  })

  const response = await fetch('https://api.namecheap.com/xml.response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })

  const xmlText = await response.text()
  // Parse XML and check for success
  */

  return { success: true }
}
