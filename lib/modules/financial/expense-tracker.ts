import { supabase } from '@/lib/supabase'

export interface ExpenseInput {
  category: string
  subcategory?: string
  description: string
  amount: number
  currency?: string
  relatedToCustomer?: string
  relatedToSite?: string
  expenseDate: string
  isRecurring?: boolean
  recurrencePeriod?: string
}

export async function logExpense(expense: ExpenseInput) {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      category: expense.category,
      subcategory: expense.subcategory,
      description: expense.description,
      amount: expense.amount,
      currency: expense.currency || 'AUD',
      related_to_customer: expense.relatedToCustomer,
      related_to_site: expense.relatedToSite,
      expense_date: expense.expenseDate,
      is_recurring: expense.isRecurring || false,
      recurrence_period: expense.recurrencePeriod,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to log expense:', error)
    return null
  }

  console.log(`💰 Expense logged: ${expense.subcategory} - $${expense.amount}`)
  return data
}

// Auto-log AI usage costs
export async function logAIUsage(
  leadId: string,
  siteId: string,
  tokensUsed: number,
  costUSD: number
) {
  return logExpense({
    category: 'api_usage',
    subcategory: 'anthropic',
    description: `AI generation - ${tokensUsed} tokens`,
    amount: costUSD,
    currency: 'USD',
    relatedToCustomer: leadId,
    relatedToSite: siteId,
    expenseDate: new Date().toISOString().split('T')[0],
  })
}

// Auto-log email costs
export async function logEmailCost(
  leadId: string,
  emailCount: number = 1
) {
  // Resend: 3,000 emails/month free, then $20/10k
  // Conservative estimate: $0.002 per email
  const costPerEmail = 0.002

  return logExpense({
    category: 'api_usage',
    subcategory: 'resend',
    description: `Email sending - ${emailCount} email(s)`,
    amount: emailCount * costPerEmail,
    currency: 'USD',
    relatedToCustomer: leadId,
    expenseDate: new Date().toISOString().split('T')[0],
  })
}

// Auto-log Stripe fees
export async function logStripeFee(
  leadId: string,
  subscriptionAmount: number
) {
  // Stripe: 1.75% + $0.30 AUD for Australian cards
  const fee = (subscriptionAmount * 0.0175) + 0.30

  return logExpense({
    category: 'api_usage',
    subcategory: 'stripe',
    description: `Payment processing fee`,
    amount: fee,
    currency: 'AUD',
    relatedToCustomer: leadId,
    expenseDate: new Date().toISOString().split('T')[0],
  })
}

// Log domain purchase
export async function logDomainPurchase(
  leadId: string,
  domain: string,
  costAUD: number = 15.00
) {
  return logExpense({
    category: 'infrastructure',
    subcategory: 'domain',
    description: `Domain registration - ${domain}`,
    amount: costAUD,
    currency: 'AUD',
    relatedToCustomer: leadId,
    expenseDate: new Date().toISOString().split('T')[0],
    isRecurring: true,
    recurrencePeriod: 'annual',
  })
}

// Log hosting costs (per customer)
export async function logHostingCost(
  leadId: string,
  monthlyAUD: number = 20.00
) {
  return logExpense({
    category: 'infrastructure',
    subcategory: 'hosting',
    description: `Framer hosting`,
    amount: monthlyAUD,
    currency: 'AUD',
    relatedToCustomer: leadId,
    expenseDate: new Date().toISOString().split('T')[0],
    isRecurring: true,
    recurrencePeriod: 'monthly',
  })
}

// Log email hosting (cPanel)
export async function logEmailHosting(
  leadId: string,
  monthlyAUD: number = 0.40 // $20/50 customers
) {
  return logExpense({
    category: 'infrastructure',
    subcategory: 'email_hosting',
    description: `cPanel email hosting`,
    amount: monthlyAUD,
    currency: 'AUD',
    relatedToCustomer: leadId,
    expenseDate: new Date().toISOString().split('T')[0],
    isRecurring: true,
    recurrencePeriod: 'monthly',
  })
}

// Log lead generation costs
export async function logLeadGenCost(
  source: string, // 'clay', 'scrapemaps'
  leadsObtained: number,
  totalCost: number
) {
  return logExpense({
    category: 'lead_gen',
    subcategory: source,
    description: `${leadsObtained} leads from ${source}`,
    amount: totalCost,
    currency: 'USD',
    expenseDate: new Date().toISOString().split('T')[0],
  })
}

// Log fixed costs (monthly subscriptions)
export async function logFixedCost(
  service: string,
  monthlyAmount: number,
  currency: string = 'USD'
) {
  return logExpense({
    category: 'fixed_costs',
    subcategory: service,
    description: `${service} monthly subscription`,
    amount: monthlyAmount,
    currency,
    expenseDate: new Date().toISOString().split('T')[0],
    isRecurring: true,
    recurrencePeriod: 'monthly',
  })
}
