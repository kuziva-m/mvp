import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 1. Total Leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    // 2. Active Subscriptions (PAYING CUSTOMERS)
    const { data: activeSubs, count: activeCount } = await supabase
      .from('subscriptions')
      .select('amount', { count: 'exact' })
      .eq('status', 'active')

    // 3. Calculate MRR (Monthly Recurring Revenue)
    const totalRevenue = activeSubs?.reduce((sum, sub) => {
      return sum + parseFloat(sub.amount?.toString() || '0')
    }, 0) || 0

    // 4. Leads Contacted (emails sent)
    const { count: leadsContacted } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .not('email_sent_at', 'is', null)

    // 5. CORRECT Conversion Rate Calculation
    // Conversion Rate = (Active Customers / Leads Contacted) × 100
    // Should NEVER exceed 100%
    const conversionRate = leadsContacted && leadsContacted > 0
      ? Math.min(100, Math.round((activeCount || 0) / leadsContacted * 100 * 10) / 10)
      : 0

    // 6. Email Stats
    const { count: emailsOpened } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .not('email_opened_at', 'is', null)

    const { count: linksClicked } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .not('email_clicked_at', 'is', null)

    const openRate = leadsContacted && leadsContacted > 0
      ? Math.round((emailsOpened || 0) / leadsContacted * 100 * 10) / 10
      : 0

    const clickRate = emailsOpened && emailsOpened > 0
      ? Math.round((linksClicked || 0) / emailsOpened * 100 * 10) / 10
      : 0

    console.log('📊 Metrics Calculation:', {
      totalLeads,
      activeCount,
      leadsContacted,
      conversionRate,
      totalRevenue,
    })

    return NextResponse.json({
      totalLeads: totalLeads || 0,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      conversionRate, // NOW CORRECTLY CALCULATED
      activeCustomers: activeCount || 0,
      leadsContacted: leadsContacted || 0,
      emailsOpened: emailsOpened || 0,
      linksClicked: linksClicked || 0,
      openRate,
      clickRate,
    })

  } catch (error: any) {
    console.error('❌ Metrics API error:', error)

    // Return safe defaults on error
    return NextResponse.json({
      totalLeads: 0,
      totalRevenue: 0,
      conversionRate: 0,
      activeCustomers: 0,
      leadsContacted: 0,
      emailsOpened: 0,
      linksClicked: 0,
      openRate: 0,
      clickRate: 0,
    })
  }
}
