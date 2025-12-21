import { NextRequest, NextResponse } from 'next/server'
import { getById, query } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import type { Lead, EmailLog } from '@/types'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{
    leadId: string
  }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { leadId } = await context.params
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json(
        { error: 'Missing url parameter' },
        { status: 400 }
      )
    }

    // 1. Get lead from database
    const { data: lead, error: leadError } = await getById<Lead>('leads', leadId)

    if (!leadError && lead) {
      // 2. Only update if email_clicked_at is NULL (track first click only)
      if (!lead.email_clicked_at) {
        const now = new Date().toISOString()

        // Update lead
        await supabase
          .from('leads')
          .update({ email_clicked_at: now })
          .eq('id', leadId)

        // Update most recent email log
        const { data: emailLogs } = await query<EmailLog>('email_logs', { lead_id: leadId })

        if (emailLogs && emailLogs.length > 0) {
          // Sort by sent_at and get most recent
          const sortedLogs = emailLogs.sort((a, b) =>
            new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
          )
          const mostRecent = sortedLogs[0]

          if (mostRecent && !mostRecent.clicked_at) {
            await supabase
              .from('email_logs')
              .update({ clicked_at: now })
              .eq('id', mostRecent.id)
          }
        }
      }
    }

    // 3. Redirect to original URL
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Error tracking email click:', error)

    // Try to redirect anyway if we have a URL
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (url) {
      return NextResponse.redirect(url)
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
