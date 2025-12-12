import { supabase } from '@/lib/supabase'

export interface HealthScore {
  leadId: string
  healthScore: number // 0-100
  engagementScore: number
  satisfactionScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  churnProbability: number
  factors: {
    daysSinceActivity: number
    supportTickets: number
    paymentIssues: number
    engagement: string
  }
}

export async function calculateHealthScore(leadId: string): Promise<HealthScore> {
  console.log(`💊 Calculating health score for: ${leadId}`)

  // Get customer data
  const { data: lead } = await supabase
    .from('leads')
    .select('*, subscriptions(*), support_tickets(*)')
    .eq('id', leadId)
    .single()

  if (!lead) {
    throw new Error('Lead not found')
  }

  // Factor 1: Engagement (40 points)
  let engagementScore = 0

  // Check last activity (email opens, clicks, site visits)
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  const daysSinceActivity = lead.email_clicked_at
    ? Math.floor((Date.now() - new Date(lead.email_clicked_at).getTime()) / (1000 * 60 * 60 * 24))
    : daysSinceCreated

  if (daysSinceActivity <= 7) engagementScore = 40
  else if (daysSinceActivity <= 14) engagementScore = 30
  else if (daysSinceActivity <= 30) engagementScore = 20
  else if (daysSinceActivity <= 60) engagementScore = 10
  else engagementScore = 0

  // Factor 2: Support tickets (30 points)
  const totalTickets = lead.support_tickets?.length || 0
  const unresolvedTickets = lead.support_tickets?.filter((t: any) => t.status !== 'resolved').length || 0

  let supportScore = 30
  if (unresolvedTickets > 0) supportScore -= (unresolvedTickets * 10)
  if (totalTickets > 5) supportScore -= 10
  supportScore = Math.max(0, supportScore)

  // Factor 3: Payment health (30 points)
  const subscription = lead.subscriptions?.[0]
  let paymentScore = 30

  if (subscription?.status === 'past_due') paymentScore = 10
  else if (subscription?.status === 'canceled') paymentScore = 0

  // Calculate overall health score
  const healthScore = Math.round(engagementScore + supportScore + paymentScore)

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical'
  if (healthScore >= 80) riskLevel = 'low'
  else if (healthScore >= 60) riskLevel = 'medium'
  else if (healthScore >= 40) riskLevel = 'high'
  else riskLevel = 'critical'

  // Calculate churn probability
  const churnProbability = Math.round(100 - healthScore)

  // Determine satisfaction (simplified - in production, use survey data)
  const satisfactionScore = Math.min(100, healthScore + 10)

  console.log(`✅ Health score: ${healthScore}/100 (${riskLevel} risk)`)

  return {
    leadId,
    healthScore,
    engagementScore,
    satisfactionScore,
    riskLevel,
    churnProbability,
    factors: {
      daysSinceActivity,
      supportTickets: totalTickets,
      paymentIssues: subscription?.status === 'past_due' ? 1 : 0,
      engagement: daysSinceActivity <= 7 ? 'active' : daysSinceActivity <= 30 ? 'moderate' : 'low',
    },
  }
}

// Save health score to database
export async function saveHealthScore(health: HealthScore) {
  await supabase
    .from('customer_health')
    .upsert({
      lead_id: health.leadId,
      health_score: health.healthScore,
      engagement_score: health.engagementScore,
      satisfaction_score: health.satisfactionScore,
      risk_level: health.riskLevel,
      churn_probability: health.churnProbability,
      last_activity_at: new Date().toISOString(),
      days_since_activity: health.factors.daysSinceActivity,
      total_support_tickets: health.factors.supportTickets,
      payment_failures: health.factors.paymentIssues,
      last_calculated_at: new Date().toISOString(),
    }, {
      onConflict: 'lead_id',
    })
}

// Get all at-risk customers
export async function getAtRiskCustomers() {
  const { data } = await supabase
    .from('customer_health')
    .select('*, leads(business_name, email)')
    .in('risk_level', ['high', 'critical'])
    .order('health_score', { ascending: true })

  return data || []
}
