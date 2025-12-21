/**
 * Cloudflare DNS Client (REAL API)
 *
 * This uses the actual Cloudflare API for DNS management.
 * Documentation: https://developers.cloudflare.com/api/
 */

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4'

export interface CloudflareZone {
  id: string
  name: string
  status: string
  nameServers: string[]
}

export interface DNSRecord {
  id: string
  type: string
  name: string
  content: string
  proxied: boolean
}

/**
 * Get Cloudflare API token from environment
 */
function getApiToken(): string {
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!token) {
    throw new Error('Missing CLOUDFLARE_API_TOKEN environment variable')
  }
  return token
}

/**
 * Make authenticated request to Cloudflare API
 */
async function cloudflareRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getApiToken()

  const response = await fetch(`${CLOUDFLARE_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    console.error('Cloudflare API error:', data)
    throw new Error(data.errors?.[0]?.message || 'Cloudflare API request failed')
  }

  return data.result
}

/**
 * Find existing zone or create new one
 * REAL API implementation
 */
export async function findOrCreateZone(domain: string): Promise<CloudflareZone> {
  console.log('[REAL] Cloudflare: Finding or creating zone...')
  console.log('[REAL] Domain:', domain)

  try {
    // Check if zone already exists
    const zones = await cloudflareRequest<any[]>(`/zones?name=${domain}`)

    if (zones && zones.length > 0) {
      const zone = zones[0]
      console.log('[REAL] ✓ Found existing zone:', zone.id)
      return {
        id: zone.id,
        name: zone.name,
        status: zone.status,
        nameServers: zone.name_servers || [],
      }
    }

    // Create new zone
    console.log('[REAL] Creating new zone...')
    const newZone = await cloudflareRequest<any>('/zones', {
      method: 'POST',
      body: JSON.stringify({
        name: domain,
        jump_start: true, // Auto-scan for DNS records
      }),
    })

    console.log('[REAL] ✓ Zone created:', newZone.id)
    return {
      id: newZone.id,
      name: newZone.name,
      status: newZone.status,
      nameServers: newZone.name_servers || [],
    }
  } catch (error) {
    console.error('[REAL] Error managing zone:', error)
    throw error
  }
}

/**
 * Configure DNS records for website (A and CNAME records)
 * REAL API implementation
 */
export async function configureWebsiteDNS(
  zoneId: string,
  domain: string,
  targetIp: string
): Promise<DNSRecord[]> {
  console.log('[REAL] Cloudflare: Configuring website DNS...')
  console.log('[REAL] Zone ID:', zoneId)
  console.log('[REAL] Domain:', domain)
  console.log('[REAL] Target IP:', targetIp)

  const records: DNSRecord[] = []

  try {
    // Create A record for root domain
    console.log('[REAL] Creating A record for root domain...')
    const rootRecord = await cloudflareRequest<any>(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'A',
        name: domain,
        content: targetIp,
        ttl: 1, // Auto TTL
        proxied: true, // Enable Cloudflare proxy
      }),
    })
    records.push({
      id: rootRecord.id,
      type: rootRecord.type,
      name: rootRecord.name,
      content: rootRecord.content,
      proxied: rootRecord.proxied,
    })
    console.log('[REAL] ✓ A record created')

    // Create A record for www subdomain
    console.log('[REAL] Creating A record for www subdomain...')
    const wwwRecord = await cloudflareRequest<any>(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'A',
        name: `www.${domain}`,
        content: targetIp,
        ttl: 1,
        proxied: true,
      }),
    })
    records.push({
      id: wwwRecord.id,
      type: wwwRecord.type,
      name: wwwRecord.name,
      content: wwwRecord.content,
      proxied: wwwRecord.proxied,
    })
    console.log('[REAL] ✓ WWW record created')

    return records
  } catch (error) {
    console.error('[REAL] Error configuring website DNS:', error)
    throw error
  }
}

/**
 * Configure DNS records for email (MX and TXT records)
 * REAL API implementation
 */
export async function configureEmailDNS(
  zoneId: string,
  domain: string,
  mailServer: string
): Promise<DNSRecord[]> {
  console.log('[REAL] Cloudflare: Configuring email DNS...')
  console.log('[REAL] Zone ID:', zoneId)
  console.log('[REAL] Domain:', domain)
  console.log('[REAL] Mail Server:', mailServer)

  const records: DNSRecord[] = []

  try {
    // Create MX record
    console.log('[REAL] Creating MX record...')
    const mxRecord = await cloudflareRequest<any>(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'MX',
        name: domain,
        content: mailServer,
        ttl: 1,
        priority: 10,
      }),
    })
    records.push({
      id: mxRecord.id,
      type: mxRecord.type,
      name: mxRecord.name,
      content: mxRecord.content,
      proxied: false,
    })
    console.log('[REAL] ✓ MX record created')

    // Create SPF record (TXT)
    console.log('[REAL] Creating SPF record...')
    const spfRecord = await cloudflareRequest<any>(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'TXT',
        name: domain,
        content: `v=spf1 mx a:${mailServer} ~all`,
        ttl: 1,
      }),
    })
    records.push({
      id: spfRecord.id,
      type: spfRecord.type,
      name: spfRecord.name,
      content: spfRecord.content,
      proxied: false,
    })
    console.log('[REAL] ✓ SPF record created')

    return records
  } catch (error) {
    console.error('[REAL] Error configuring email DNS:', error)
    throw error
  }
}

/**
 * Verify DNS propagation by checking if records are resolvable
 * REAL API implementation
 */
export async function verifyDNSPropagation(
  zoneId: string,
  domain: string,
  maxAttempts: number = 10,
  delayMs: number = 3000
): Promise<boolean> {
  console.log('[REAL] Cloudflare: Verifying DNS propagation...')
  console.log('[REAL] Domain:', domain)

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[REAL] Verification attempt ${attempt}/${maxAttempts}...`)

      // Get all DNS records for the zone
      const records = await cloudflareRequest<any[]>(`/zones/${zoneId}/dns_records`)

      // Check if we have at least A and MX records
      const hasARecord = records.some(r => r.type === 'A' && r.name === domain)
      const hasMXRecord = records.some(r => r.type === 'MX' && r.name === domain)

      if (hasARecord && hasMXRecord) {
        console.log('[REAL] ✓ DNS records verified')
        return true
      }

      console.log('[REAL] Records not ready, waiting...')
      await new Promise(resolve => setTimeout(resolve, delayMs))
    } catch (error) {
      console.error('[REAL] Error verifying DNS:', error)
    }
  }

  console.log('[REAL] ⚠ DNS propagation verification timeout')
  return false
}

/**
 * Get zone nameservers (to update in domain registrar)
 */
export async function getZoneNameservers(zoneId: string): Promise<string[]> {
  console.log('[REAL] Cloudflare: Getting zone nameservers...')

  try {
    const zone = await cloudflareRequest<any>(`/zones/${zoneId}`)
    console.log('[REAL] Nameservers:', zone.name_servers)
    return zone.name_servers || []
  } catch (error) {
    console.error('[REAL] Error getting nameservers:', error)
    throw error
  }
}
