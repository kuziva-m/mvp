import { NextResponse } from 'next/server'
import { reachOutToAtRisk } from '@/lib/modules/customer-success/churn-prevention'

export async function POST(
  request: Request,
  context: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await context.params
    await reachOutToAtRisk(leadId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to reach out:', error)
    return NextResponse.json({ error: 'Failed to reach out' }, { status: 500 })
  }
}
