import { Resend } from 'resend'
import { insert, update } from '@/lib/db'
import type { EmailLog } from '@/types'
import { logEmailCost } from '@/lib/modules/financial/expense-tracker'

const resend = new Resend(process.env.RESEND_API_KEY!)

export interface SendEmailParams {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
  leadId: string
  templateId?: string
}

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send an email with tracking (open pixel + click tracking)
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const { to, subject, htmlBody, textBody, leadId, templateId } = params

    // 1. Inject tracking pixel
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_SITE_URL}/api/track/open/${leadId}" width="1" height="1" style="display:none" />`
    const htmlWithPixel = htmlBody + trackingPixel

    // 2. Wrap all links with click tracking
    const htmlWithTracking = wrapLinksWithTracking(htmlWithPixel, leadId)

    // 3. Generate text body if not provided
    const finalTextBody = textBody || stripHtml(htmlBody)

    // 4. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Your Agency <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: htmlWithTracking,
      text: finalTextBody,
    })

    if (error) {
      console.error('Resend error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send email',
      }
    }

    // 5. Log to database
    try {
      await insert<Partial<EmailLog>>('email_logs', {
        id: crypto.randomUUID(),
        lead_id: leadId,
        template_id: templateId || null,
        subject: subject,
        resend_message_id: data?.id || null,
      })
    } catch (logError) {
      console.error('Failed to log email:', logError)
      // Don't fail the whole operation if logging fails
    }

    // 6. Update lead.email_sent_at if NULL
    try {
      // We'll check and update conditionally in the API endpoint
      await update('leads', leadId, {
        email_sent_at: new Date().toISOString(),
      })
    } catch (updateError) {
      console.error('Failed to update lead:', updateError)
      // Don't fail if update fails
    }

    // 7. Log email cost
    try {
      await logEmailCost(leadId, 1)
    } catch (expenseError) {
      console.error('Failed to log email expense (non-fatal):', expenseError)
    }

    return {
      success: true,
      messageId: data?.id,
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Replace template variables with actual values
 */
export function replaceVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template

  // Replace {{business_name}}
  if (variables.businessName) {
    result = result.replace(/\{\{business_name\}\}/gi, variables.businessName)
  }

  // Replace {{first_name}}
  if (variables.firstName) {
    result = result.replace(/\{\{first_name\}\}/gi, variables.firstName)
  }

  // Replace {{preview_url}} and {{demo_url}}
  if (variables.previewUrl) {
    result = result.replace(/\{\{preview_url\}\}/gi, variables.previewUrl)
    result = result.replace(/\{\{demo_url\}\}/gi, variables.previewUrl)
  }

  return result
}

/**
 * Extract first name from business name
 * e.g., "John's Plumbing" -> "John"
 * e.g., "ABC Company" -> "there"
 */
export function extractFirstName(businessName: string): string {
  // Try to extract name before 's, apostrophe s
  const possessiveMatch = businessName.match(/^([A-Z][a-z]+)'s?\s/i)
  if (possessiveMatch) {
    return possessiveMatch[1]
  }

  // Try first word if it looks like a name (starts with capital, all letters)
  const firstWord = businessName.split(/\s+/)[0]
  if (firstWord && /^[A-Z][a-z]+$/.test(firstWord)) {
    return firstWord
  }

  // Default fallback
  return 'there'
}

/**
 * Wrap all <a href> links with tracking
 */
function wrapLinksWithTracking(html: string, leadId: string): string {
  // Match all <a href="..."> tags
  const linkRegex = /<a\s+([^>]*href=["']([^"']*)["'][^>]*)>/gi

  return html.replace(linkRegex, (match, attributes, originalUrl) => {
    // Skip if already a tracking link
    if (originalUrl.includes('/api/track/click')) {
      return match
    }

    // Create tracking URL
    const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/track/click/${leadId}?url=${encodeURIComponent(originalUrl)}`

    // Replace the href in the attributes
    const newAttributes = attributes.replace(
      /href=["'][^"']*["']/i,
      `href="${trackingUrl}"`
    )

    return `<a ${newAttributes}>`
  })
}

/**
 * Strip HTML tags and convert to plain text
 */
export function stripHtml(html: string): string {
  // Convert <br> and </p> to newlines
  let text = html.replace(/<br\s*\/?>/gi, '\n')
  text = text.replace(/<\/p>/gi, '\n\n')

  // Remove all other HTML tags
  text = text.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')

  // Clean up extra whitespace
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n')
  text = text.trim()

  return text
}
