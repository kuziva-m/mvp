import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all health scores
    const { data: health } = await supabase
      .from('customer_health')
      .select('health_score, risk_level')

    const avgHealthScore = (health?.reduce((sum, h) => sum + h.health_score, 0) || 0) / (health?.length || 1)
    const atRiskCount = health?.filter(h => h.risk_level === 'high' || h.risk_level === 'critical').length || 0

    // Calculate churn rate (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: churned } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('status', 'canceled')
      .gte('cancel_at', thirtyDaysAgo.toISOString())

    const { data: active } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('status', 'active')

    const churnRate = ((churned?.length || 0) / ((churned?.length || 0) + (active?.length || 1))) * 100

    return NextResponse.json({
      avgHealthScore: Math.round(avgHealthScore),
      atRiskCount,
      churnRate: Math.round(churnRate * 10) / 10,
      npsScore: 85, // Placeholder - implement surveys later
    })
  } catch (error) {
    console.error('Failed to get metrics:', error)
    return NextResponse.json({ error: 'Failed to get metrics' }, { status: 500 })
  }
}
