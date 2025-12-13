import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const issues: any[] = []
  const warnings: any[] = []
  const stats: any = {}

  try {
    // 1. Check Leads Table
    const { data: leads, count: leadsCount, error: leadsError } = await supabase
      .from('leads')
      .select('*', { count: 'exact' })

    if (leadsError) {
      issues.push({
        severity: 'critical',
        table: 'leads',
        issue: 'Cannot query leads table',
        error: leadsError.message,
      })
    } else {
      stats.totalLeads = leadsCount || 0

      // Check for leads with missing email
      const missingEmail = leads?.filter(l => !l.email).length || 0
      if (missingEmail > 0) {
        warnings.push({
          severity: 'warning',
          table: 'leads',
          issue: `${missingEmail} leads missing email addresses`,
          count: missingEmail,
        })
      }

      // Check for duplicate emails
      const emails = leads?.map(l => l.email).filter(Boolean) || []
      const duplicates = emails.filter((e, i) => emails.indexOf(e) !== i)
      if (duplicates.length > 0) {
        warnings.push({
          severity: 'warning',
          table: 'leads',
          issue: `${duplicates.length} duplicate email addresses found`,
          duplicates: [...new Set(duplicates)],
        })
      }

      // Check status distribution
      const statuses: any = {}
      leads?.forEach(l => {
        statuses[l.status] = (statuses[l.status] || 0) + 1
      })
      stats.leadStatuses = statuses
    }

    // 2. Check Sites Table
    const { data: sites, count: sitesCount, error: sitesError } = await supabase
      .from('sites')
      .select('*', { count: 'exact' })

    if (sitesError) {
      issues.push({
        severity: 'critical',
        table: 'sites',
        issue: 'Cannot query sites table',
        error: sitesError.message,
      })
    } else {
      stats.totalSites = sitesCount || 0

      // Check for sites without preview URL
      const missingPreview = sites?.filter(s => !s.preview_url).length || 0
      if (missingPreview > 0) {
        warnings.push({
          severity: 'warning',
          table: 'sites',
          issue: `${missingPreview} sites missing preview URLs`,
          count: missingPreview,
        })
      }

      // Check for orphaned sites (no lead_id)
      const orphaned = sites?.filter(s => !s.lead_id).length || 0
      if (orphaned > 0) {
        issues.push({
          severity: 'error',
          table: 'sites',
          issue: `${orphaned} orphaned sites (no lead_id)`,
          count: orphaned,
        })
      }
    }

    // 3. Check Subscriptions Table
    const { data: subscriptions, count: subsCount, error: subsError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact' })

    if (subsError) {
      issues.push({
        severity: 'critical',
        table: 'subscriptions',
        issue: 'Cannot query subscriptions table',
        error: subsError.message,
      })
    } else {
      stats.totalSubscriptions = subsCount || 0

      const activeCount = subscriptions?.filter(s => s.status === 'active').length || 0
      stats.activeSubscriptions = activeCount

      // Calculate MRR
      const mrr = subscriptions
        ?.filter(s => s.status === 'active')
        .reduce((sum, s) => sum + parseFloat(s.amount?.toString() || '0'), 0) || 0
      stats.mrr = Math.round(mrr * 100) / 100

      // Calculate ARR
      stats.arr = Math.round(mrr * 12 * 100) / 100

      // Check for subscriptions without lead_id
      const noLead = subscriptions?.filter(s => !s.lead_id).length || 0
      if (noLead > 0) {
        warnings.push({
          severity: 'warning',
          table: 'subscriptions',
          issue: `${noLead} subscriptions without lead_id`,
          count: noLead,
        })
      }
    }

    // 4. Check Email Logs
    const { count: emailsSent, error: emailError } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })

    if (!emailError) {
      stats.totalEmailsSent = emailsSent || 0

      const { count: emailsOpened } = await supabase
        .from('email_logs')
        .select('*', { count: 'exact', head: true })
        .not('opened_at', 'is', null)

      stats.emailsOpened = emailsOpened || 0
      stats.openRate = emailsSent && emailsSent > 0
        ? Math.round((emailsOpened! / emailsSent) * 100 * 10) / 10
        : 0
    }

    // 5. Calculate Conversion Metrics
    const leadsContacted = leads?.filter(l => l.email_sent_at).length || 0
    stats.leadsContacted = leadsContacted

    stats.conversionRate = leadsContacted > 0
      ? Math.round((stats.activeSubscriptions / leadsContacted) * 100 * 10) / 10
      : 0

    // 6. Check for data integrity issues
    if (stats.conversionRate > 100) {
      issues.push({
        severity: 'critical',
        calculation: 'conversion_rate',
        issue: `Conversion rate is ${stats.conversionRate}% (impossible - must be ≤100%)`,
        activeSubscriptions: stats.activeSubscriptions,
        leadsContacted: stats.leadsContacted,
      })
    }

    // 7. Check QA Reviews
    const { count: qaCount } = await supabase
      .from('qa_reviews')
      .select('*', { count: 'exact', head: true })

    stats.totalQAReviews = qaCount || 0

    // 8. Check Support Tickets
    const { count: ticketsCount } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })

    stats.totalSupportTickets = ticketsCount || 0

    const { count: openTickets } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open')

    stats.openSupportTickets = openTickets || 0

    return NextResponse.json({
      status: 'complete',
      summary: {
        totalIssues: issues.length,
        totalWarnings: warnings.length,
        criticalIssues: issues.filter(i => i.severity === 'critical').length,
      },
      issues,
      warnings,
      stats,
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      issues: [{
        severity: 'critical',
        issue: 'Diagnostic scan failed',
        error: error.message,
      }],
    }, { status: 500 })
  }
}
