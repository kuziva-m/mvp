import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all active subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('amount')
      .eq('status', 'active')

    const totalRevenue = subscriptions?.reduce((sum, s) =>
      sum + parseFloat(s.amount || '0'), 0
    ) || 0

    // For MVP, expenses are estimated
    // In production, you'd sum from expenses table
    const totalExpenses = 0 // TODO: Sum from expenses table when tracking

    const grossProfit = totalRevenue - totalExpenses
    const grossMarginPercent = totalRevenue > 0
      ? Math.round((grossProfit / totalRevenue) * 100)
      : 0

    const totalCustomers = subscriptions?.length || 0
    const avgLTV = 1188 // $99/month × 12 months
    const avgCAC = 0.70 // From lead gen costs
    const ltvCacRatio = avgCAC > 0
      ? Math.round((avgLTV / avgCAC) * 10) / 10
      : 0
    const paybackMonths = avgCAC > 0 && totalRevenue > 0
      ? Math.round((avgCAC / (totalRevenue / totalCustomers)) * 10) / 10
      : 0

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        grossProfit: Math.round(grossProfit * 100) / 100,
        grossMarginPercent,
        totalCustomers,
        profitableCustomers: totalCustomers, // All profitable at MVP stage
        unprofitableCustomers: 0,
        avgLTV: Math.round(avgLTV * 100) / 100,
        avgCAC: Math.round(avgCAC * 100) / 100,
        ltvCacRatio,
        paybackMonths,
      },
    })
  } catch (error) {
    console.error('Financials error:', error)
    return NextResponse.json({ stats: {} }, { status: 500 })
  }
}
