import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/modules/emails/sender'

export async function initializeOnboarding(leadId: string) {
  console.log(`🎓 Initializing onboarding for: ${leadId}`)

  // Create onboarding record
  await supabase
    .from('customer_onboarding')
    .insert({
      lead_id: leadId,
      stage: 'welcome',
    })

  // Send welcome email immediately
  await sendWelcomeEmail(leadId)
}

async function sendWelcomeEmail(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select('*, sites(*), deployments(*)')
    .eq('id', leadId)
    .single()

  if (!lead) return

  const deployment = lead.deployments?.[0]
  const site = lead.sites?.[0]

  await sendEmail({
    to: lead.email,
    subject: `Welcome to Your New Website! 🎉`,
    htmlBody: `
      <h1>Welcome, ${lead.business_name}!</h1>
      <p>Your professional website is now live and ready to attract customers.</p>

      <h2>🌐 Your Website:</h2>
      <p><a href="https://${deployment?.domain}">${deployment?.domain}</a></p>

      <h2>📧 Your Business Email:</h2>
      <p>Email: ${deployment?.email_address}</p>
      <p>Webmail: <a href="https://${deployment?.domain}/webmail">Login Here</a></p>

      <h2>✨ Quick Start Guide:</h2>
      <ul>
        <li>Check your email: Log into webmail and send a test email</li>
        <li>Share your site: Send the link to friends and customers</li>
        <li>Need changes? Just reply to this email!</li>
      </ul>

      <p>We're here to help. Reply anytime with questions!</p>

      <p>Best regards,<br>Your Website Team</p>
    `,
    textBody: `Welcome ${lead.business_name}! Your site is live at ${deployment?.domain}`,
    leadId,
  })

  // Update onboarding
  await supabase
    .from('customer_onboarding')
    .update({
      welcome_email_sent_at: new Date().toISOString(),
      stage: 'day_3',
    })
    .eq('lead_id', leadId)

  console.log(`✅ Welcome email sent to: ${lead.business_name}`)
}

// Day 3 check-in
export async function sendDay3CheckIn(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select('business_name, email')
    .eq('id', leadId)
    .single()

  if (!lead) return

  await sendEmail({
    to: lead.email,
    subject: `Quick Check-in - How's Your Website Going?`,
    htmlBody: `
      <p>Hi ${lead.business_name},</p>

      <p>Just checking in! It's been 3 days since your website went live.</p>

      <p><strong>How's everything going?</strong></p>

      <ul>
        <li>Have you been able to log into your email?</li>
        <li>Any changes you'd like to make?</li>
        <li>Questions about anything?</li>
      </ul>

      <p>Simply reply to this email and we'll help you out!</p>

      <p>Best,<br>Your Website Team</p>
    `,
    textBody: `Hi, just checking in on your website!`,
    leadId,
  })

  await supabase
    .from('customer_onboarding')
    .update({
      day_3_sent_at: new Date().toISOString(),
      stage: 'day_7',
    })
    .eq('lead_id', leadId)
}

// Day 7 tips
export async function sendDay7Tips(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select('business_name, email, industry')
    .eq('id', leadId)
    .single()

  if (!lead) return

  await sendEmail({
    to: lead.email,
    subject: `3 Tips to Get More Customers from Your Website`,
    htmlBody: `
      <p>Hi ${lead.business_name},</p>

      <p>Here are 3 quick tips to maximize your new website:</p>

      <h3>1. Add Your Website to Google My Business</h3>
      <p>This helps customers find you on Google Maps and Search.</p>

      <h3>2. Share Your Link Everywhere</h3>
      <p>Add it to: Social media bios, email signatures, business cards, invoices</p>

      <h3>3. Ask Happy Customers for Reviews</h3>
      <p>Good reviews build trust and attract more business.</p>

      <p>Need help with any of these? Just reply!</p>

      <p>Best,<br>Your Website Team</p>
    `,
    textBody: `Tips to get more customers from your website`,
    leadId,
  })

  await supabase
    .from('customer_onboarding')
    .update({
      day_7_sent_at: new Date().toISOString(),
      stage: 'day_14',
    })
    .eq('lead_id', leadId)
}

// Day 14 feature highlight
export async function sendDay14Features(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select('business_name, email')
    .eq('id', leadId)
    .single()

  if (!lead) return

  await sendEmail({
    to: lead.email,
    subject: `Did You Know Your Website Can Do This?`,
    htmlBody: `
      <p>Hi ${lead.business_name},</p>

      <p>Just wanted to highlight some features you might not know about:</p>

      <ul>
        <li><strong>Unlimited Updates:</strong> Need to change hours, add photos, update text? Just email us!</li>
        <li><strong>Professional Email:</strong> Looks more credible than Gmail to customers</li>
        <li><strong>Mobile Optimized:</strong> Your site works perfectly on all phones</li>
        <li><strong>Fast Loading:</strong> Hosted on enterprise infrastructure</li>
      </ul>

      <p>Want to make any changes? Reply to this email!</p>

      <p>Best,<br>Your Website Team</p>
    `,
    textBody: `Features of your website`,
    leadId,
  })

  await supabase
    .from('customer_onboarding')
    .update({
      day_14_sent_at: new Date().toISOString(),
      stage: 'day_30',
    })
    .eq('lead_id', leadId)
}

// Day 30 milestone
export async function sendDay30Milestone(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select('business_name, email')
    .eq('id', leadId)
    .single()

  if (!lead) return

  await sendEmail({
    to: lead.email,
    subject: `🎉 30 Days with Your New Website!`,
    htmlBody: `
      <p>Hi ${lead.business_name},</p>

      <p>It's been 30 days since your website went live - congratulations! 🎉</p>

      <p><strong>We'd love your feedback:</strong></p>
      <ul>
        <li>How has the website helped your business?</li>
        <li>Have you gotten new customers from it?</li>
        <li>Anything we can improve?</li>
      </ul>

      <p>As a thank you, we'd like to feature successful businesses like yours. Interested?</p>

      <p>Reply and let us know!</p>

      <p>Thank you for being a customer!</p>

      <p>Best,<br>Your Website Team</p>
    `,
    textBody: `30 days with your website!`,
    leadId,
  })

  await supabase
    .from('customer_onboarding')
    .update({
      day_30_sent_at: new Date().toISOString(),
      stage: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('lead_id', leadId)
}

// Check and send pending onboarding emails
export async function processOnboardingQueue() {
  console.log('📬 Processing onboarding queue...')

  const now = new Date()

  // Day 3 emails
  const day3Date = new Date(now)
  day3Date.setDate(day3Date.getDate() - 3)

  const { data: day3Customers } = await supabase
    .from('customer_onboarding')
    .select('lead_id')
    .eq('stage', 'day_3')
    .is('day_3_sent_at', null)
    .lte('welcome_email_sent_at', day3Date.toISOString())

  for (const customer of day3Customers || []) {
    await sendDay3CheckIn(customer.lead_id)
  }

  // Day 7 emails
  const day7Date = new Date(now)
  day7Date.setDate(day7Date.getDate() - 7)

  const { data: day7Customers } = await supabase
    .from('customer_onboarding')
    .select('lead_id')
    .eq('stage', 'day_7')
    .is('day_7_sent_at', null)
    .lte('welcome_email_sent_at', day7Date.toISOString())

  for (const customer of day7Customers || []) {
    await sendDay7Tips(customer.lead_id)
  }

  // Day 14 emails
  const day14Date = new Date(now)
  day14Date.setDate(day14Date.getDate() - 14)

  const { data: day14Customers } = await supabase
    .from('customer_onboarding')
    .select('lead_id')
    .eq('stage', 'day_14')
    .is('day_14_sent_at', null)
    .lte('welcome_email_sent_at', day14Date.toISOString())

  for (const customer of day14Customers || []) {
    await sendDay14Features(customer.lead_id)
  }

  // Day 30 emails
  const day30Date = new Date(now)
  day30Date.setDate(day30Date.getDate() - 30)

  const { data: day30Customers } = await supabase
    .from('customer_onboarding')
    .select('lead_id')
    .eq('stage', 'day_30')
    .is('day_30_sent_at', null)
    .lte('welcome_email_sent_at', day30Date.toISOString())

  for (const customer of day30Customers || []) {
    await sendDay30Milestone(customer.lead_id)
  }

  console.log(`✅ Onboarding queue processed`)
}
