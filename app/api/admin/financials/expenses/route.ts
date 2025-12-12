import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get expenses from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .gte('expense_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('expense_date', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Failed to fetch expenses:', error)
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
    }

    return NextResponse.json({ expenses: expenses || [] })
  } catch (error) {
    console.error('Failed to fetch expenses:', error)
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
  }
}
