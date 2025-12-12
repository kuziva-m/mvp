import { NextResponse } from 'next/server'
import { getAtRiskCustomers } from '@/lib/modules/customer-success/health-scorer'

export async function GET() {
  try {
    const atRisk = await getAtRiskCustomers()
    return NextResponse.json({ atRisk })
  } catch (error) {
    console.error('Failed to get at-risk customers:', error)
    return NextResponse.json({ error: 'Failed to get at-risk customers' }, { status: 500 })
  }
}
