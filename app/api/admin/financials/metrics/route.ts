import { NextResponse } from 'next/server'
import { calculateOverallProfitability } from '@/lib/modules/financial/profitability-calculator'

export async function GET() {
  try {
    const metrics = await calculateOverallProfitability()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Failed to calculate metrics:', error)
    return NextResponse.json({ error: 'Failed to calculate metrics' }, { status: 500 })
  }
}
