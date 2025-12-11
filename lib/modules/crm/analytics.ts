/**
 * CRM Analytics Module
 *
 * Provides comprehensive analytics calculations for:
 * - Key business metrics (MRR, ARR, LTV, CAC, etc.)
 * - Conversion funnel analysis
 * - Time-series data (leads/revenue over time)
 * - Performance tracking
 */

import { query } from '@/lib/db'
import type { Lead, Subscription, Generation, EmailLog } from '@/types'

export interface Metrics {
  totalLeads: number
  totalContacted: number
  totalOpened: number
  totalClicked: number
  totalSubscribed: number
  totalDelivered: number
  totalCanceled: number
  mrr: number
  arr: number
  conversionRate: number
  openRate: number
  clickRate: number
  clickToSubscribeRate: number
  avgRevenuePerLead: number
  ltv: number
  cac: number
  churnRate: number
  activeSubscriptions: number
}

/**
 * Calculate all key business metrics
 */
export async function calculateMetrics(): Promise<Metrics> {
  console.log('Calculating CRM metrics...')

  // Fetch all data
  const { data: leads } = await query<Lead>('leads')
  const { data: allSubscriptions } = await query<Subscription>('subscriptions')
  const { data: generations } = await query<Generation>('generations')

  const totalLeads = leads?.length || 0
  const totalContacted = leads?.filter((l) => l.email_sent_at).length || 0
  const totalOpened = leads?.filter((l) => l.email_opened_at).length || 0
  const totalClicked = leads?.filter((l) => l.email_clicked_at).length || 0

  // Active subscriptions
  const activeSubscriptions = allSubscriptions?.filter((s) => s.status === 'active') || []
  const totalSubscribed = activeSubscriptions.length

  // Delivered and canceled
  const totalDelivered = leads?.filter((l) => l.status === 'delivered').length || 0
  const totalCanceled = leads?.filter((l) => l.status === 'canceled').length || 0

  // Revenue calculations
  const mrr = activeSubscriptions.reduce((sum, s) => sum + Number(s.amount), 0)
  const arr = mrr * 12

  // Conversion rates
  const conversionRate = totalContacted > 0 ? (totalSubscribed / totalContacted) * 100 : 0
  const openRate = totalContacted > 0 ? (totalOpened / totalContacted) * 100 : 0
  const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0
  const clickToSubscribeRate =
    totalClicked > 0 ? (totalSubscribed / totalClicked) * 100 : 0

  // Average revenue per lead
  const avgRevenuePerLead = totalLeads > 0 ? mrr / totalLeads : 0

  // Customer Acquisition Cost (CAC)
  const totalCost = generations?.reduce((sum, g) => sum + Number(g.cost_usd || 0), 0) || 0
  const cac = totalSubscribed > 0 ? totalCost / totalSubscribed : 0

  // Lifetime Value (LTV) - simplified: average subscription * 12 months
  const ltv = totalSubscribed > 0 ? (mrr / totalSubscribed) * 12 : 0

  // Churn Rate - canceled / total ever subscribed
  const totalEverSubscribed = allSubscriptions?.length || 0
  const churnRate =
    totalEverSubscribed > 0 ? (totalCanceled / totalEverSubscribed) * 100 : 0

  console.log('Metrics calculated:', {
    totalLeads,
    totalSubscribed,
    mrr,
    conversionRate: conversionRate.toFixed(2) + '%',
  })

  return {
    totalLeads,
    totalContacted,
    totalOpened,
    totalClicked,
    totalSubscribed,
    totalDelivered,
    totalCanceled,
    mrr,
    arr,
    conversionRate,
    openRate,
    clickRate,
    clickToSubscribeRate,
    avgRevenuePerLead,
    ltv,
    cac,
    churnRate,
    activeSubscriptions: totalSubscribed,
  }
}

/**
 * Get leads created over time
 */
export async function getLeadsOverTime(days: number = 30): Promise<Array<{ date: string; count: number }>> {
  console.log(`Getting leads over last ${days} days...`)

  const { data: leads } = await query<Lead>('leads')

  const dates = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const count =
      leads?.filter((l) => l.created_at?.split('T')[0] === dateStr).length || 0

    dates.push({ date: dateStr, count })
  }

  return dates
}

/**
 * Get revenue over time (monthly)
 */
export async function getRevenueOverTime(
  months: number = 12
): Promise<Array<{ month: string; revenue: number; subscriptions: number }>> {
  console.log(`Getting revenue over last ${months} months...`)

  const { data: subscriptions } = await query<Subscription>('subscriptions')

  const monthsData = []
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthStr = date.toISOString().substring(0, 7) // YYYY-MM

    const monthSubs = subscriptions?.filter((s) => s.created_at?.startsWith(monthStr)) || []

    const revenue = monthSubs.reduce((sum, s) => sum + Number(s.amount), 0)

    monthsData.push({
      month: monthStr,
      revenue,
      subscriptions: monthSubs.length,
    })
  }

  return monthsData
}

/**
 * Get conversion funnel metrics
 */
export interface FunnelStage {
  name: string
  count: number
  rate: number
  dropOffRate?: number
}

export async function getFunnelMetrics(): Promise<FunnelStage[]> {
  console.log('Calculating funnel metrics...')

  const metrics = await calculateMetrics()

  const stages: FunnelStage[] = [
    { name: 'Contacted', count: metrics.totalContacted, rate: 100 },
    {
      name: 'Opened',
      count: metrics.totalOpened,
      rate: metrics.openRate,
      dropOffRate: 100 - metrics.openRate,
    },
    {
      name: 'Clicked',
      count: metrics.totalClicked,
      rate: metrics.clickRate,
      dropOffRate: 100 - metrics.clickRate,
    },
    {
      name: 'Subscribed',
      count: metrics.totalSubscribed,
      rate: metrics.clickToSubscribeRate,
      dropOffRate: 100 - metrics.clickToSubscribeRate,
    },
    {
      name: 'Delivered',
      count: metrics.totalDelivered,
      rate: metrics.totalSubscribed > 0 ? (metrics.totalDelivered / metrics.totalSubscribed) * 100 : 0,
    },
  ]

  return stages
}

/**
 * Get leads grouped by status for Kanban board
 */
export async function getLeadsByStatus() {
  console.log('Getting leads grouped by status...')

  const { data: leads } = await query<Lead>('leads')

  const grouped = {
    pending: leads?.filter((l) => l.status === 'pending') || [],
    contacted: leads?.filter((l) => l.status === 'contacted') || [],
    opened: leads?.filter((l) => l.status === 'opened') || [],
    clicked: leads?.filter((l) => l.status === 'clicked') || [],
    subscribed: leads?.filter((l) => l.status === 'subscribed') || [],
    delivered: leads?.filter((l) => l.status === 'delivered') || [],
    canceled: leads?.filter((l) => l.status === 'canceled') || [],
  }

  return grouped
}

/**
 * Get recent activity feed
 */
export interface Activity {
  id: string
  type: 'lead_added' | 'email_sent' | 'email_opened' | 'email_clicked' | 'payment_received' | 'website_delivered'
  leadName: string
  leadId: string
  timestamp: string
  metadata?: Record<string, any>
}

export async function getRecentActivity(limit: number = 20): Promise<Activity[]> {
  console.log(`Getting recent ${limit} activities...`)

  const activities: Activity[] = []

  // Get recent leads
  const { data: leads } = await query<Lead>('leads')
  const sortedLeads = leads?.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) || []

  for (const lead of sortedLeads.slice(0, limit)) {
    // Lead added
    activities.push({
      id: `lead-${lead.id}`,
      type: 'lead_added',
      leadName: lead.business_name,
      leadId: lead.id,
      timestamp: lead.created_at,
    })

    // Email sent
    if (lead.email_sent_at) {
      activities.push({
        id: `email-sent-${lead.id}`,
        type: 'email_sent',
        leadName: lead.business_name,
        leadId: lead.id,
        timestamp: lead.email_sent_at,
      })
    }

    // Email opened
    if (lead.email_opened_at) {
      activities.push({
        id: `email-opened-${lead.id}`,
        type: 'email_opened',
        leadName: lead.business_name,
        leadId: lead.id,
        timestamp: lead.email_opened_at,
      })
    }

    // Email clicked
    if (lead.email_clicked_at) {
      activities.push({
        id: `email-clicked-${lead.id}`,
        type: 'email_clicked',
        leadName: lead.business_name,
        leadId: lead.id,
        timestamp: lead.email_clicked_at,
      })
    }

    // Website delivered
    if (lead.status === 'delivered') {
      activities.push({
        id: `delivered-${lead.id}`,
        type: 'website_delivered',
        leadName: lead.business_name,
        leadId: lead.id,
        timestamp: lead.updated_at,
      })
    }
  }

  // Sort by timestamp and limit
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

/**
 * Get revenue by industry
 */
export async function getRevenueByIndustry(): Promise<Array<{ industry: string; revenue: number; count: number }>> {
  console.log('Calculating revenue by industry...')

  const { data: leads } = await query<Lead>('leads')
  const { data: subscriptions } = await query<Subscription>('subscriptions', { status: 'active' })

  // Group subscriptions by industry
  const industryMap = new Map<string, { revenue: number; count: number }>()

  for (const sub of subscriptions || []) {
    const lead = leads?.find((l) => l.id === sub.lead_id)
    if (!lead) continue

    const industry = lead.industry || 'Unknown'
    const current = industryMap.get(industry) || { revenue: 0, count: 0 }

    industryMap.set(industry, {
      revenue: current.revenue + Number(sub.amount),
      count: current.count + 1,
    })
  }

  return Array.from(industryMap.entries()).map(([industry, data]) => ({
    industry,
    revenue: data.revenue,
    count: data.count,
  }))
}

/**
 * Get best performing email subject lines
 */
export async function getBestSubjectLines(limit: number = 5) {
  console.log('Getting best performing subject lines...')

  const { data: emailLogs } = await query<EmailLog>('email_logs')

  // Group by subject
  const subjectMap = new Map<string, { opens: number; total: number }>()

  for (const log of emailLogs || []) {
    const current = subjectMap.get(log.subject) || { opens: 0, total: 0 }

    subjectMap.set(log.subject, {
      opens: current.opens + (log.opened_at ? 1 : 0),
      total: current.total + 1,
    })
  }

  // Calculate open rates and sort
  return Array.from(subjectMap.entries())
    .map(([subject, data]) => ({
      subject,
      opens: data.opens,
      total: data.total,
      openRate: (data.opens / data.total) * 100,
    }))
    .sort((a, b) => b.openRate - a.openRate)
    .slice(0, limit)
}
