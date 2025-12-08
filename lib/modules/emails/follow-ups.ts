import { supabase } from '@/lib/supabase'
import { query, getById } from '@/lib/db'
import type { Lead, EmailTemplate, Site } from '@/types'
import { sendEmail, replaceVariables, extractFirstName } from './sender'

export interface FollowUpResult {
  day3Sent: number
  day7Sent: number
  day14Sent: number
  total: number
  errors: string[]
}

/**
 * Check and send automated follow-up emails
 * This should be run periodically via cron
 */
export async function checkAndSendFollowUps(): Promise<FollowUpResult> {
  const result: FollowUpResult = {
    day3Sent: 0,
    day7Sent: 0,
    day14Sent: 0,
    total: 0,
    errors: [],
  }

  try {
    // Get all templates for follow-ups
    const { data: templates } = await query<EmailTemplate>('email_templates', { is_active: true })

    if (!templates || templates.length === 0) {
      result.errors.push('No active email templates found')
      return result
    }

    // Find templates by name
    const day3Template = templates.find(t => t.name.toLowerCase().includes('day 3'))
    const day7Template = templates.find(t => t.name.toLowerCase().includes('day 7'))
    const day14Template = templates.find(t => t.name.toLowerCase().includes('day 14'))

    // Day 3: Not opened (sent 3+ days ago, never opened)
    const day3Leads = await findDay3Leads()
    if (day3Template && day3Leads.length > 0) {
      for (const lead of day3Leads) {
        try {
          await sendFollowUpToLead(lead, day3Template)
          result.day3Sent++
          result.total++
        } catch (error) {
          result.errors.push(`Day 3 - ${lead.business_name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    // Day 7: Opened but not clicked (sent 7+ days ago, opened but never clicked)
    const day7Leads = await findDay7Leads()
    if (day7Template && day7Leads.length > 0) {
      for (const lead of day7Leads) {
        try {
          await sendFollowUpToLead(lead, day7Template)
          result.day7Sent++
          result.total++
        } catch (error) {
          result.errors.push(`Day 7 - ${lead.business_name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    // Day 14: Final follow-up (sent 14+ days ago, not subscribed/delivered/canceled)
    const day14Leads = await findDay14Leads()
    if (day14Template && day14Leads.length > 0) {
      for (const lead of day14Leads) {
        try {
          await sendFollowUpToLead(lead, day14Template)
          result.day14Sent++
          result.total++
        } catch (error) {
          result.errors.push(`Day 14 - ${lead.business_name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    return result
  } catch (error) {
    console.error('Follow-up check error:', error)
    result.errors.push(`System error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }
}

/**
 * Find leads needing Day 3 follow-up
 * Criteria: Email sent 3+ days ago, never opened, not paused
 */
async function findDay3Leads(): Promise<Lead[]> {
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .not('email_sent_at', 'is', null)
    .is('email_opened_at', null)
    .lt('email_sent_at', threeDaysAgo.toISOString())
    .is('automation_paused', null)

  if (error) {
    console.error('Error finding Day 3 leads:', error)
    return []
  }

  return (data as Lead[]) || []
}

/**
 * Find leads needing Day 7 follow-up
 * Criteria: Email sent 7+ days ago, opened but never clicked, not paused
 */
async function findDay7Leads(): Promise<Lead[]> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .not('email_opened_at', 'is', null)
    .is('email_clicked_at', null)
    .lt('email_sent_at', sevenDaysAgo.toISOString())
    .is('automation_paused', null)

  if (error) {
    console.error('Error finding Day 7 leads:', error)
    return []
  }

  return (data as Lead[]) || []
}

/**
 * Find leads needing Day 14 follow-up
 * Criteria: Email sent 14+ days ago, not in final statuses, not paused
 */
async function findDay14Leads(): Promise<Lead[]> {
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .lt('email_sent_at', fourteenDaysAgo.toISOString())
    .not('status', 'in', '("subscribed","delivered","canceled")')
    .is('automation_paused', null)

  if (error) {
    console.error('Error finding Day 14 leads:', error)
    return []
  }

  return (data as Lead[]) || []
}

/**
 * Send a follow-up email to a specific lead
 */
async function sendFollowUpToLead(lead: Lead, template: EmailTemplate): Promise<void> {
  if (!lead.email) {
    throw new Error('Lead has no email address')
  }

  // Get site for preview URL
  const { data: sites } = await query<Site>('sites', { lead_id: lead.id })
  const site = sites && sites.length > 0 ? sites[0] : null

  if (!site || !site.preview_url) {
    throw new Error('No website generated for this lead')
  }

  // Prepare variables
  const variables = {
    businessName: lead.business_name,
    firstName: extractFirstName(lead.business_name),
    previewUrl: `${process.env.NEXT_PUBLIC_SITE_URL}${site.preview_url}`,
  }

  // Replace variables
  const subject = replaceVariables(template.subject, variables)
  const htmlBody = replaceVariables(template.html_body, variables)
  const textBody = template.text_body ? replaceVariables(template.text_body, variables) : undefined

  // Send email
  const result = await sendEmail({
    to: lead.email,
    subject,
    htmlBody,
    textBody,
    leadId: lead.id,
    templateId: template.id,
  })

  if (!result.success) {
    throw new Error(result.error || 'Failed to send email')
  }
}
