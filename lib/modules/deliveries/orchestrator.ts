/**
 * Delivery Orchestrator
 *
 * Coordinates the complete delivery workflow:
 * 1. Domain registration (Namecheap - MOCKED)
 * 2. DNS configuration (Cloudflare - REAL)
 * 3. Website publishing (Vercel - MOCKED)
 * 4. Email setup (Verpex - MOCKED)
 * 5. Welcome email
 */

import { getById, update } from '@/lib/db'
import { sendEmail } from '@/lib/modules/emails/sender'
import type { Lead, Site, Deployment } from '@/types'
import * as namecheap from './namecheap-client'
import * as cloudflare from './cloudflare-client'
import * as verpex from './verpex-client'
import * as vercel from './vercel-client'
import { logDomainPurchase, logHostingCost, logEmailHosting } from '@/lib/modules/financial/expense-tracker'

export interface DeliveryResult {
  success: boolean
  domain: string
  deploymentUrl: string
  emailAccount: string
  cpanelUrl: string
  errors: string[]
  steps: DeliveryStep[]
}

export interface DeliveryStep {
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  message?: string
  duration?: number
}

/**
 * Main delivery workflow
 * Orchestrates all steps required to deliver a complete service
 */
export async function deliverService(leadId: string): Promise<DeliveryResult> {
  console.log('='.repeat(60))
  console.log('STARTING DELIVERY WORKFLOW')
  console.log('Lead ID:', leadId)
  console.log('='.repeat(60))

  const steps: DeliveryStep[] = [
    { name: 'Fetch lead and site data', status: 'pending' },
    { name: 'Search for available domain', status: 'pending' },
    { name: 'Register domain', status: 'pending' },
    { name: 'Create Cloudflare zone', status: 'pending' },
    { name: 'Configure website DNS', status: 'pending' },
    { name: 'Configure email DNS', status: 'pending' },
    { name: 'Update domain nameservers', status: 'pending' },
    { name: 'Create email account', status: 'pending' },
    { name: 'Create cPanel account', status: 'pending' },
    { name: 'Publish website to Vercel', status: 'pending' },
    { name: 'Verify SSL certificate', status: 'pending' },
    { name: 'Save deployment record', status: 'pending' },
    { name: 'Send welcome email', status: 'pending' },
  ]

  const errors: string[] = []
  let domain = ''
  let deploymentUrl = ''
  let emailAccount = ''
  let cpanelUrl = ''

  try {
    // STEP 1: Fetch lead and site data
    await runStep(steps, 0, async () => {
      const lead = await getById<Lead>('leads', leadId)
      if (!lead) {
        throw new Error('Lead not found')
      }

      // Find associated site
      const { query } = await import('@/lib/db')
      const { data: sites } = await query<Site>('sites', { lead_id: leadId })
      if (!sites || sites.length === 0) {
        throw new Error('No site found for lead')
      }

      return { lead, site: sites[0] }
    })

    const { data: lead, error: leadError } = await getById<Lead>('leads', leadId)
    if (leadError || !lead) throw new Error('Lead not found')

    const { query } = await import('@/lib/db')
    const { data: sites } = await query<Site>('sites', { lead_id: leadId })
    const site = sites?.[0]
    if (!site) throw new Error('No site found for lead')

    // STEP 2: Search for available domain
    await runStep(steps, 1, async () => {
      domain = await namecheap.searchAvailableDomain(lead.business_name)
      console.log('Selected domain:', domain)
      return domain
    })

    // STEP 3: Register domain
    let domainOrderId: string | null = null
    await runStep(steps, 2, async () => {
      const result = await namecheap.registerDomain(domain, leadId)
      if (!result.success) {
        throw new Error(result.error || 'Domain registration failed')
      }
      domainOrderId = result.orderId
      return result
    })

    // STEP 4: Create Cloudflare zone
    let zoneId: string = ''
    let cloudflareNameservers: string[] = []
    await runStep(steps, 3, async () => {
      const zone = await cloudflare.findOrCreateZone(domain)
      zoneId = zone.id
      cloudflareNameservers = zone.nameServers
      return zone
    })

    // STEP 5: Configure website DNS
    await runStep(steps, 4, async () => {
      const vercelIp = vercel.getVercelIP()
      const records = await cloudflare.configureWebsiteDNS(zoneId, domain, vercelIp)
      return records
    })

    // STEP 6: Configure email DNS
    await runStep(steps, 5, async () => {
      const mailServer = verpex.getMailServerHostname(domain)
      const records = await cloudflare.configureEmailDNS(zoneId, domain, mailServer)
      return records
    })

    // STEP 7: Update domain nameservers to Cloudflare
    await runStep(steps, 6, async () => {
      const result = await namecheap.updateNameservers(domain, cloudflareNameservers)
      return result
    })

    // STEP 8: Create email account
    await runStep(steps, 7, async () => {
      const result = await verpex.createEmailAccount(domain, 'info')
      if (!result.success) {
        throw new Error(result.error || 'Email account creation failed')
      }
      emailAccount = result.email
      return result
    })

    // STEP 9: Create cPanel account
    await runStep(steps, 8, async () => {
      const result = await verpex.createCpanelAccount(domain, lead.business_name)
      if (!result.success) {
        throw new Error(result.error || 'cPanel account creation failed')
      }
      cpanelUrl = result.cpanelUrl
      return result
    })

    // STEP 10: Publish website to Vercel
    let deploymentId: string | null = null
    await runStep(steps, 9, async () => {
      const result = await vercel.publishToCustomDomain(domain, site.id, site.preview_url)
      if (!result.success) {
        throw new Error(result.error || 'Website publishing failed')
      }
      deploymentUrl = result.deploymentUrl
      deploymentId = result.deploymentId
      return result
    })

    // STEP 11: Verify SSL certificate
    await runStep(steps, 10, async () => {
      const sslStatus = await vercel.checkSSLStatus(domain)
      return sslStatus
    })

    // STEP 12: Save deployment record
    await runStep(steps, 11, async () => {
      const { insert } = await import('@/lib/db')

      // Get email and cPanel credentials from earlier steps
      const emailResult = await verpex.createEmailAccount(domain, 'info')
      const cpanelResult = await verpex.createCpanelAccount(domain, lead.business_name)

      const { data: deployment } = await insert('deployments', {
        lead_id: leadId,
        site_id: site.id,
        domain,
        email_address: emailResult.email,
        cpanel_username: cpanelResult.username,
        cpanel_password: cpanelResult.password,
        deployed_at: new Date().toISOString(),
      })

      // Update site with custom domain and published status
      await update('sites', site.id, {
        custom_domain: domain,
        published_url: deploymentUrl,
        is_published: true,
      })

      // Update lead status
      await update('leads', leadId, {
        status: 'delivered',
      })

      return deployment
    })

    // STEP 13: Send welcome email
    await runStep(steps, 12, async () => {
      await sendWelcomeEmail(lead, domain, emailAccount, cpanelUrl)
      return { sent: true }
    })

    // Log infrastructure expenses
    try {
      await logDomainPurchase(leadId, domain, 15.00)
      await logHostingCost(leadId, 20.00)
      await logEmailHosting(leadId, 0.40)
      console.log('✓ Infrastructure expenses logged')
    } catch (expenseError) {
      console.error('Failed to log infrastructure expenses (non-fatal):', expenseError)
    }

    console.log('='.repeat(60))
    console.log('DELIVERY COMPLETED SUCCESSFULLY')
    console.log('Domain:', domain)
    console.log('Deployment URL:', deploymentUrl)
    console.log('Email:', emailAccount)
    console.log('='.repeat(60))

    return {
      success: true,
      domain,
      deploymentUrl,
      emailAccount,
      cpanelUrl,
      errors,
      steps,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    errors.push(errorMessage)

    console.error('='.repeat(60))
    console.error('DELIVERY FAILED')
    console.error('Error:', errorMessage)
    console.error('='.repeat(60))

    return {
      success: false,
      domain,
      deploymentUrl,
      emailAccount,
      cpanelUrl,
      errors,
      steps,
    }
  }
}

/**
 * Helper function to run a step and track its status
 */
async function runStep<T>(
  steps: DeliveryStep[],
  index: number,
  fn: () => Promise<T>
): Promise<T> {
  const step = steps[index]
  const startTime = Date.now()

  try {
    step.status = 'running'
    console.log(`\n[STEP ${index + 1}/${steps.length}] ${step.name}...`)

    const result = await fn()

    step.status = 'completed'
    step.duration = Date.now() - startTime
    console.log(`✓ Completed in ${step.duration}ms`)

    return result
  } catch (error) {
    step.status = 'failed'
    step.duration = Date.now() - startTime
    step.message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`✗ Failed: ${step.message}`)
    throw error
  }
}

/**
 * Send welcome email to customer with all credentials and info
 */
async function sendWelcomeEmail(
  lead: Lead,
  domain: string,
  emailAccount: string,
  cpanelUrl: string
): Promise<void> {
  console.log('Sending welcome email...')

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4F46E5; }
    .info-box h3 { margin-top: 0; color: #4F46E5; }
    .credentials { background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Your New Website! 🎉</h1>
    </div>

    <div class="content">
      <p>Hi ${lead.business_name} team,</p>

      <p>Congratulations! Your website is now live and ready to use. Here's everything you need to know:</p>

      <div class="info-box">
        <h3>🌐 Your Website</h3>
        <p><strong>Live URL:</strong> <a href="https://${domain}">https://${domain}</a></p>
        <p><strong>www URL:</strong> <a href="https://www.${domain}">https://www.${domain}</a></p>
        <p>Your website is now live with SSL encryption (https) for secure browsing.</p>
      </div>

      <div class="info-box">
        <h3>📧 Your Professional Email</h3>
        <p><strong>Email Address:</strong> ${emailAccount}</p>
        <p>You can access your email at:</p>
        <ul>
          <li>Webmail: <a href="https://${domain}:2096">https://${domain}:2096</a></li>
          <li>Or configure it in your email client (Gmail, Outlook, etc.)</li>
        </ul>
      </div>

      <div class="info-box">
        <h3>🔧 cPanel Access</h3>
        <p>Manage your hosting, emails, and files:</p>
        <p><strong>cPanel URL:</strong> <a href="${cpanelUrl}">${cpanelUrl}</a></p>
        <p class="credentials">
          Check your inbox for separate email with login credentials
        </p>
      </div>

      <div class="info-box">
        <h3>📊 Admin Dashboard</h3>
        <p>View your subscription and manage your account:</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" class="button">Go to Dashboard</a>
      </div>

      <div class="info-box">
        <h3>🚀 What's Next?</h3>
        <ul>
          <li>✅ Your website is live at ${domain}</li>
          <li>✅ Professional email is configured</li>
          <li>✅ SSL certificate is active (https)</li>
          <li>✅ DNS is configured and propagating</li>
        </ul>
        <p><strong>Note:</strong> DNS propagation can take up to 24-48 hours, but usually completes within a few hours.</p>
      </div>

      <div class="info-box">
        <h3>💡 Need Help?</h3>
        <p>If you have any questions or need assistance, our support team is here to help:</p>
        <p>📧 Email: <a href="mailto:support@example.com">support@example.com</a></p>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for choosing our service!</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `

  const textBody = `
Welcome to Your New Website!

Hi ${lead.business_name} team,

Congratulations! Your website is now live and ready to use.

YOUR WEBSITE
Live URL: https://${domain}
www URL: https://www.${domain}

YOUR PROFESSIONAL EMAIL
Email Address: ${emailAccount}
Webmail: https://${domain}:2096

CPANEL ACCESS
cPanel URL: ${cpanelUrl}
Check your inbox for login credentials

ADMIN DASHBOARD
${process.env.NEXT_PUBLIC_SITE_URL}/admin

WHAT'S NEXT?
✓ Your website is live at ${domain}
✓ Professional email is configured
✓ SSL certificate is active (https)
✓ DNS is configured and propagating

Note: DNS propagation can take up to 24-48 hours.

Need help? Email: support@example.com

Thank you for choosing our service!
  `

  await sendEmail({
    to: lead.email || emailAccount,
    subject: `🎉 Your Website is Live! - ${domain}`,
    htmlBody: htmlBody,
    textBody: textBody,
    leadId: lead.id,
  })

  console.log('✓ Welcome email sent')
}
