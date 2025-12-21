<<<<<<< HEAD
import { createClient } from "@/lib/supabase/server";

/**
 * Checks for leads that need follow-up emails based on the schedule:
 * Day 3, Day 7, Day 11, Day 14 after initial contact.
 */
export async function processFollowUps() {
  const supabase = await createClient();
  const now = new Date();

  // Fetch all active leads who haven't subscribed yet
  // We type cast the select to ensure TS understands the joined structure
  const { data: leads, error } = await supabase
    .from("leads")
    .select(
      "id, business_name, email, email_sent_at, status, lead_magnet_submissions(status)"
    )
    .not("email_sent_at", "is", null) // Must have had initial contact
    .neq("status", "subscribed") // Ignore if already converted
    .neq("status", "churned"); // Ignore if dead

  if (error) {
    console.error("Error fetching leads for follow-up:", error);
    return;
  }

  // Helper to calculate days difference using native Date
  const getDaysDiff = (date1: Date, date2: Date) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date1.getTime() - date2.getTime();
    return Math.floor(diffInTime / oneDay);
  };

  const updates = [];

  for (const lead of leads) {
    if (!lead.email_sent_at) continue;

    const sentDate = new Date(lead.email_sent_at);
    const diffDays = getDaysDiff(now, sentDate);

    let templateToUse = null;

    // Day 3
    if (diffDays === 3) {
      // Fix: Handle the array returned by Supabase join
      // We explicitly treat it as an array and check the first item
      const submissions = lead.lead_magnet_submissions as unknown as {
        status: string;
      }[];
      const hasVisited =
        Array.isArray(submissions) &&
        submissions.length > 0 &&
        submissions[0].status === "visited";

      templateToUse = hasVisited
        ? "follow-up-day-3-visited"
        : "follow-up-day-3-not-visited";
    }
    // Day 7
    else if (diffDays === 7) {
      templateToUse = "follow-up-day-7-value";
    }
    // Day 11 (Urgency: "Removed in 3 days")
    else if (diffDays === 11) {
      templateToUse = "follow-up-day-11-warning";
    }
    // Day 14 (Final: "24 hours left")
    else if (diffDays === 14) {
      templateToUse = "follow-up-day-14-final";
    }

    if (templateToUse) {
      console.log(
        `[FollowUp] Sending ${templateToUse} to ${lead.business_name} (Day ${diffDays})`
      );
      updates.push({ lead: lead.business_name, template: templateToUse });

      // Perform Mock Send
      // In real implementation: await sendEmail(lead.email, templateToUse, { ...context });
    }
  }

  return { processed: leads.length, emailsTriggered: updates.length };
=======
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
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
}
