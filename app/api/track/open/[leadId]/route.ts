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

    // 1. Get lead from database
    const { data: lead, error: leadError } = await getById<Lead>('leads', leadId)

    if (!leadError && lead) {
      // 2. Only update if email_opened_at is NULL (track first open only)
      if (!lead.email_opened_at) {
        const now = new Date().toISOString()

        // Update lead
        await supabase
          .from('leads')
          .update({ email_opened_at: now })
          .eq('id', leadId)

        // Update most recent email log
        const { data: emailLogs } = await query<EmailLog>('email_logs', { lead_id: leadId })

        if (emailLogs && emailLogs.length > 0) {
          // Sort by sent_at and get most recent
          const sortedLogs = emailLogs.sort((a, b) =>
            new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
          )
          const mostRecent = sortedLogs[0]

          if (mostRecent && !mostRecent.opened_at) {
            await supabase
              .from('email_logs')
              .update({ opened_at: now })
              .eq('id', mostRecent.id)
          }
        }
      }
    }

    // 3. Return 1x1 transparent GIF
    const gif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )

    return new Response(gif, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error tracking email open:', error)

    // Still return gif even on error
    const gif = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'base64'
    )

    return new Response(gif, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  }
}
