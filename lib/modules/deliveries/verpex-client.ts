/**
 * Verpex/cPanel Client (MOCKED)
 *
 * This is a MOCKED implementation for development and testing.
 * In production, replace with actual cPanel/WHM API calls.
 *
 * Real API documentation:
 * - WHM API: https://api.docs.cpanel.net/openapi/whm/
 * - cPanel API: https://api.docs.cpanel.net/openapi/cpanel/
 */

export interface EmailAccountResult {
  success: boolean
  email: string
  password: string
  error?: string
}

export interface CpanelAccountResult {
  success: boolean
  username: string
  password: string
  cpanelUrl: string
  error?: string
}

/**
 * Generate secure random password
 */
function generatePassword(length: number = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

/**
 * Create email account in cPanel
 * MOCKED: Always succeeds and returns mock credentials
 *
 * In production, this would call cPanel API:
 * POST https://your-cpanel-server.com:2087/json-api/cpanel
 * Module: Email
 * Function: add_pop
 */
export async function createEmailAccount(
  domain: string,
  emailPrefix: string = 'info'
): Promise<EmailAccountResult> {
  console.log('[MOCK] Verpex/cPanel: Creating email account...')
  console.log('[MOCK] Domain:', domain)
  console.log('[MOCK] Email prefix:', emailPrefix)

  const email = `${emailPrefix}@${domain}`
  const password = generatePassword()

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('[MOCK] ✓ Email account created')
  console.log('[MOCK] Email:', email)
  console.log('[MOCK] Password:', password)

  /* PRODUCTION CODE:
  const cpanelHost = process.env.CPANEL_HOST
  const cpanelApiToken = process.env.CPANEL_API_TOKEN
  const cpanelUsername = process.env.CPANEL_USERNAME

  const response = await fetch(`https://${cpanelHost}:2087/json-api/cpanel`, {
    method: 'POST',
    headers: {
      'Authorization': `cpanel ${cpanelUsername}:${cpanelApiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cpanel_jsonapi_module: 'Email',
      cpanel_jsonapi_func: 'add_pop',
      cpanel_jsonapi_apiversion: '2',
      domain: domain,
      email: emailPrefix,
      password: password,
      quota: 250, // MB
    }),
  })

  const data = await response.json()

  if (!data.cpanelresult?.data?.[0]?.result) {
    throw new Error(data.cpanelresult?.data?.[0]?.reason || 'Failed to create email')
  }
  */

  return {
    success: true,
    email,
    password,
  }
}

/**
 * Create cPanel account for customer
 * MOCKED: Always succeeds and returns mock credentials
 *
 * In production, this would call WHM API:
 * POST https://your-whm-server.com:2087/json-api/createacct
 */
export async function createCpanelAccount(
  domain: string,
  businessName: string
): Promise<CpanelAccountResult> {
  console.log('[MOCK] Verpex/WHM: Creating cPanel account...')
  console.log('[MOCK] Domain:', domain)
  console.log('[MOCK] Business name:', businessName)

  // Generate username from domain (max 16 chars for cPanel)
  const username = domain
    .replace(/\.(com|net|org|au|co)\.?/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .substring(0, 16)
    .toLowerCase()

  const password = generatePassword()
  const cpanelUrl = `https://cpanel.${domain}:2083`

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  console.log('[MOCK] ✓ cPanel account created')
  console.log('[MOCK] Username:', username)
  console.log('[MOCK] Password:', password)
  console.log('[MOCK] cPanel URL:', cpanelUrl)

  /* PRODUCTION CODE:
  const whmHost = process.env.WHM_HOST
  const whmApiToken = process.env.WHM_API_TOKEN
  const whmUsername = process.env.WHM_USERNAME

  const response = await fetch(`https://${whmHost}:2087/json-api/createacct`, {
    method: 'POST',
    headers: {
      'Authorization': `WHM ${whmUsername}:${whmApiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      domain: domain,
      password: password,
      contactemail: `info@${domain}`,
      plan: 'default', // Your hosting plan name
      featurelist: 'default',
      quota: 0, // Unlimited
      maxaddon: 0, // Unlimited addon domains
      maxsql: 0, // Unlimited MySQL databases
      maxftp: 0, // Unlimited FTP accounts
      maxlst: 0, // Unlimited mailing lists
      maxsub: 0, // Unlimited subdomains
      maxpark: 0, // Unlimited parked domains
      cpmod: 'jupiter', // cPanel theme
    }),
  })

  const data = await response.json()

  if (!data.metadata?.result) {
    throw new Error(data.metadata?.reason || 'Failed to create cPanel account')
  }
  */

  return {
    success: true,
    username,
    password,
    cpanelUrl,
  }
}

/**
 * Get mail server hostname for DNS configuration
 * MOCKED: Returns standard mail server hostname
 *
 * In production, this would be your actual mail server hostname
 */
export function getMailServerHostname(domain: string): string {
  // In production, this would typically be something like:
  // - mail.yourhostingserver.com
  // - server123.verpex.com
  // For now, return a standard format
  const mailServer = `mail.${domain}`

  console.log('[MOCK] Mail server hostname:', mailServer)
  return mailServer
}
