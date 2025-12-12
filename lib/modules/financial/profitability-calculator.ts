import { supabase } from '@/lib/supabase'

export interface CustomerProfitability {
  leadId: string
  businessName: string
  totalRevenue: number
  totalExpenses: number
  grossProfit: number
  grossMarginPercent: number
  acquisitionCost: number
  monthsActive: number
  ltv: number
  isProfitable: boolean
  breakEvenMonth: number | null
}

export async function calculateCustomerProfitability(
  leadId: string
): Promise<CustomerProfitability> {

  // Get lead info
  const { data: lead } = await supabase
    .from('leads')
    .select('business_name, created_at')
    .eq('id', leadId)
    .single()

  if (!lead) {
    throw new Error(`Lead not found: ${leadId}`)
  }

  // Calculate months active
  const createdAt = new Date(lead.created_at)
  const now = new Date()
  const monthsActive = Math.max(1, Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
  ))

  // Get total revenue
  const { data: revenueEvents } = await supabase
    .from('revenue_events')
    .select('amount')
    .eq('lead_id', leadId)
    .eq('event_type', 'payment_received')

  const totalRevenue = revenueEvents?.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0) || 0

  // Get total expenses
  const { data: expenses } = await supabase
    .from('expenses')
    .select('amount, currency')
    .eq('related_to_customer', leadId)

  // Convert all to AUD (simplified - in production, use real exchange rates)
  const totalExpenses = expenses?.reduce((sum, e) => {
    const amountAUD = e.currency === 'USD' ? parseFloat(e.amount.toString()) * 1.5 : parseFloat(e.amount.toString())
    return sum + amountAUD
  }, 0) || 0

  // Get acquisition cost (sum of lead gen costs attributed to this customer)
  const { data: leadGenExpenses } = await supabase
    .from('expenses')
    .select('amount')
    .eq('category', 'lead_gen')
    .eq('related_to_customer', leadId)

  const acquisitionCost = leadGenExpenses?.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0) || 0

  // Calculate profitability
  const grossProfit = totalRevenue - totalExpenses
  const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
  const isProfitable = grossProfit > 0

  // Calculate LTV (assume 12 month average lifetime)
  const avgMonthlyRevenue = totalRevenue / monthsActive
  const avgMonthlyExpenses = totalExpenses / monthsActive
  const avgMonthlyProfit = avgMonthlyRevenue - avgMonthlyExpenses
  const ltv = avgMonthlyProfit * 12 // 12 month projection

  // Calculate break-even month
  let breakEvenMonth: number | null = null
  if (isProfitable && avgMonthlyProfit > 0) {
    breakEvenMonth = Math.ceil(acquisitionCost / avgMonthlyProfit)
  }

  return {
    leadId,
    businessName: lead.business_name,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossMarginPercent: Math.round(grossMarginPercent * 100) / 100,
    acquisitionCost: Math.round(acquisitionCost * 100) / 100,
    monthsActive,
    ltv: Math.round(ltv * 100) / 100,
    isProfitable,
    breakEvenMonth,
  }
}

// Calculate company-wide profitability
export async function calculateOverallProfitability() {
  // Get all customers with subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('lead_id')
    .eq('status', 'active')

  const leadIds = subscriptions?.map(s => s.lead_id) || []

  if (leadIds.length === 0) {
    return {
      totalCustomers: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      grossProfit: 0,
      grossMarginPercent: 0,
      profitableCustomers: 0,
      unprofitableCustomers: 0,
      avgLTV: 0,
      avgCAC: 0,
      ltvCacRatio: 0,
    }
  }

  // Calculate profitability for each
  const results = await Promise.all(
    leadIds.map(id => calculateCustomerProfitability(id))
  )

  // Aggregate metrics
  const totalRevenue = results.reduce((sum, r) => sum + r.totalRevenue, 0)
  const totalExpenses = results.reduce((sum, r) => sum + r.totalExpenses, 0)
  const grossProfit = totalRevenue - totalExpenses
  const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

  const profitableCustomers = results.filter(r => r.isProfitable).length
  const unprofitableCustomers = results.length - profitableCustomers

  const avgLTV = results.reduce((sum, r) => sum + r.ltv, 0) / results.length
  const avgCAC = results.reduce((sum, r) => sum + r.acquisitionCost, 0) / results.length
  const ltvCacRatio = avgCAC > 0 ? avgLTV / avgCAC : 0

  return {
    totalCustomers: results.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossMarginPercent: Math.round(grossMarginPercent * 100) / 100,
    profitableCustomers,
    unprofitableCustomers,
    avgLTV: Math.round(avgLTV * 100) / 100,
    avgCAC: Math.round(avgCAC * 100) / 100,
    ltvCacRatio: Math.round(ltvCacRatio * 100) / 100,
  }
}

// Save profitability to database
export async function saveProfitabilityRecord(
  profitability: CustomerProfitability
) {
  await supabase
    .from('customer_profitability')
    .upsert({
      lead_id: profitability.leadId,
      total_revenue: profitability.totalRevenue,
      total_expenses: profitability.totalExpenses,
      gross_profit: profitability.grossProfit,
      gross_margin_percent: profitability.grossMarginPercent,
      acquisition_cost: profitability.acquisitionCost,
      months_active: profitability.monthsActive,
      ltv: profitability.ltv,
      is_profitable: profitability.isProfitable,
      break_even_month: profitability.breakEvenMonth,
      last_calculated_at: new Date().toISOString(),
    }, {
      onConflict: 'lead_id',
    })
}
