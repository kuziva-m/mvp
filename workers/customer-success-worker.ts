import cron from 'node-cron'
import { supabase } from '@/lib/supabase'
import { calculateHealthScore, saveHealthScore } from '@/lib/modules/customer-success/health-scorer'
import { processOnboardingQueue } from '@/lib/modules/customer-success/onboarding-automation'
import { identifyAtRiskCustomers, reachOutToAtRisk } from '@/lib/modules/customer-success/churn-prevention'

// Calculate health scores daily
cron.schedule('0 9 * * *', async () => {
  console.log('💊 Calculating customer health scores...')

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('lead_id')
    .eq('status', 'active')

  for (const sub of subscriptions || []) {
    try {
      const health = await calculateHealthScore(sub.lead_id)
      await saveHealthScore(health)
    } catch (error) {
      console.error(`Failed to calculate health for ${sub.lead_id}:`, error)
    }
  }

  console.log('✅ Health scores updated')
}, {
  timezone: 'Australia/Melbourne'
})

// Process onboarding emails every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('📬 Processing onboarding queue...')
  try {
    await processOnboardingQueue()
  } catch (error) {
    console.error('Onboarding queue processing failed:', error)
  }
}, {
  timezone: 'Australia/Melbourne'
})

// Identify at-risk customers daily
cron.schedule('0 10 * * *', async () => {
  console.log('🚨 Identifying at-risk customers...')
  try {
    const atRisk = await identifyAtRiskCustomers()

    // Reach out to critical risk customers automatically
    for (const customer of atRisk.filter((c: any) => c.health.riskLevel === 'critical')) {
      await reachOutToAtRisk((customer as any).id)
    }
  } catch (error) {
    console.error('At-risk identification failed:', error)
  }
}, {
  timezone: 'Australia/Melbourne'
})

console.log('🎯 Customer Success worker started')
console.log('   - Health scoring: Daily at 9am')
console.log('   - Onboarding: Every 2 hours')
console.log('   - At-risk identification: Daily at 10am')
