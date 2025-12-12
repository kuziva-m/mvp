import { supabase } from '@/lib/supabase'
import { calculateHealthScore } from './health-scorer'
import { sendEmail } from '@/lib/modules/emails/sender'

export async function identifyAtRiskCustomers() {
  console.log('🚨 Identifying at-risk customers...')

  // Get all active subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('lead_id, leads(*)')
    .eq('status', 'active')

  const atRiskCustomers = []

  for (const sub of subscriptions || []) {
    const health = await calculateHealthScore(sub.lead_id)

    if (health.riskLevel === 'high' || health.riskLevel === 'critical') {
      atRiskCustomers.push({
        ...sub.leads,
        health,
      })

      // Log churn event
      await supabase
        .from('churn_events')
        .insert({
          lead_id: sub.lead_id,
          event_type: 'at_risk',
          reason: `Health score: ${health.healthScore}, Days inactive: ${health.factors.daysSinceActivity}`,
        })
    }
  }

  console.log(`🚨 Found ${atRiskCustomers.length} at-risk customers`)
  return atRiskCustomers
}

// Proactive outreach to at-risk customers
export async function reachOutToAtRisk(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select('business_name, email')
    .eq('id', leadId)
    .single()

  if (!lead) return

  await sendEmail({
    to: lead.email,
    subject: `We Haven't Heard from You in a While`,
    htmlBody: `
      <p>Hi ${lead.business_name},</p>

      <p>We noticed we haven't heard from you recently, and wanted to check in.</p>

      <p><strong>Is everything okay with your website?</strong></p>

      <ul>
        <li>Need any updates or changes?</li>
        <li>Having any technical issues?</li>
        <li>Questions about your service?</li>
      </ul>

      <p>We're here to help! Just reply to this email.</p>

      <p>If you're thinking about canceling, please let us know why.
      We'd love a chance to make things right.</p>

      <p>Best,<br>Your Website Team</p>
    `,
    textBody: `Checking in - everything okay with your website?`,
    leadId,
  })

  await supabase
    .from('churn_events')
    .insert({
      lead_id: leadId,
      event_type: 'at_risk',
      intervention_attempted: true,
      intervention_type: 'proactive_email',
      outcome: 'pending',
    })

  console.log(`✅ Reached out to at-risk customer: ${lead.business_name}`)
}

// Win-back campaign for churned customers
export async function sendWinBackEmail(leadId: string) {
  const { data: lead } = await supabase
    .from('leads')
    .select('business_name, email')
    .eq('id', leadId)
    .single()

  if (!lead) return

  await sendEmail({
    to: lead.email,
    subject: `We'd Love to Have You Back - Special Offer Inside`,
    htmlBody: `
      <p>Hi ${lead.business_name},</p>

      <p>We noticed you canceled your website service, and wanted to reach out.</p>

      <p><strong>We'd love to win you back!</strong></p>

      <p>As a special offer for former customers:</p>
      <ul>
        <li>50% off your first month back ($49.50 instead of $99)</li>
        <li>Free website redesign</li>
        <li>Priority support</li>
      </ul>

      <p>We've made improvements based on feedback. Give us another chance?</p>

      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/reactivate">Reactivate Your Website</a></p>

      <p>Or reply and let us know what we can do better!</p>

      <p>Best,<br>Your Website Team</p>
    `,
    textBody: `Win-back offer - 50% off to come back!`,
    leadId,
  })

  await supabase
    .from('churn_events')
    .insert({
      lead_id: leadId,
      event_type: 'churned',
      intervention_attempted: true,
      intervention_type: 'winback_email',
      outcome: 'pending',
    })
}
