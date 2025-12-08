import { NextRequest, NextResponse } from 'next/server'
import { getById, query } from '@/lib/db'
import type { Lead, Site, EmailTemplate } from '@/types'
import { sendEmail, replaceVariables, extractFirstName } from '@/lib/modules/emails/sender'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: leadId } = await context.params
    const body = await request.json()

    if (!body.templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // 1. Get lead from database
    const { data: lead, error: leadError } = await getById<Lead>('leads', leadId)

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    if (!lead.email) {
      return NextResponse.json(
        { error: 'Lead has no email address' },
        { status: 400 }
      )
    }

    // 2. Get template from database
    const { data: template, error: templateError } = await getById<EmailTemplate>(
      'email_templates',
      body.templateId
    )

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    if (!template.is_active) {
      return NextResponse.json(
        { error: 'Template is inactive' },
        { status: 400 }
      )
    }

    // 3. Get site from database (for preview_url)
    const { data: sites } = await query<Site>('sites', { lead_id: leadId })
    const site = sites && sites.length > 0 ? sites[0] : null

    if (!site || !site.preview_url) {
      return NextResponse.json(
        { error: 'No website generated for this lead' },
        { status: 400 }
      )
    }

    // 4. Prepare variables for replacement
    const variables = {
      businessName: lead.business_name,
      firstName: extractFirstName(lead.business_name),
      previewUrl: `${process.env.NEXT_PUBLIC_SITE_URL}${site.preview_url}`,
    }

    // 5. Replace variables in subject and body
    const subject = replaceVariables(template.subject, variables)
    const htmlBody = replaceVariables(template.html_body, variables)
    const textBody = template.text_body ? replaceVariables(template.text_body, variables) : undefined

    // 6. Send email
    const result = await sendEmail({
      to: lead.email,
      subject,
      htmlBody,
      textBody,
      leadId,
      templateId: template.id,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error during email sending:', error)
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
