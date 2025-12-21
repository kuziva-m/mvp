import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { calculateCustomerProfitability } from '@/lib/modules/financial/profitability-calculator'

export async function GET() {
  try {
    // Get all active subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('lead_id')
      .eq('status', 'active')

    const leadIds = subscriptions?.map(s => s.lead_id) || []

    if (leadIds.length === 0) {
      return NextResponse.json({ customers: [] })
    }

    // Calculate profitability for each customer
    const customers = await Promise.all(
      leadIds.map(id => calculateCustomerProfitability(id))
    )

    // Sort by gross profit (highest first)
    customers.sort((a, b) => b.grossProfit - a.grossProfit)

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Failed to fetch customer profitability:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}
