import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false })

    // Get all revenue events
    const { data: revenueEvents } = await supabase
      .from('revenue_events')
      .select('*, leads(business_name)')
      .order('event_date', { ascending: false })

    // Create CSV
    const csvRows = []

    // Header
    csvRows.push('Type,Date,Category,Subcategory,Description,Amount,Currency,Customer')

    // Add expenses
    for (const expense of expenses || []) {
      const row = [
        'Expense',
        expense.expense_date,
        expense.category,
        expense.subcategory || '',
        expense.description || '',
        expense.amount,
        expense.currency,
        expense.related_to_customer || ''
      ]
      csvRows.push(row.map(field => `"${field}"`).join(','))
    }

    // Add revenue
    for (const revenue of revenueEvents || []) {
      const row = [
        'Revenue',
        new Date(revenue.event_date).toISOString().split('T')[0],
        revenue.event_type,
        '',
        (revenue.leads as any)?.business_name || '',
        revenue.amount,
        revenue.currency,
        revenue.lead_id
      ]
      csvRows.push(row.map(field => `"${field}"`).join(','))
    }

    const csv = csvRows.join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="financials-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Failed to export financials:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
