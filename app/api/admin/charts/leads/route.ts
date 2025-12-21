/**
 * Admin Charts - Leads Over Time API
 *
 * GET /api/admin/charts/leads?days=30
 * Returns leads created over time
 */

import { NextResponse } from 'next/server'
import { getLeadsOverTime } from '@/lib/modules/crm/analytics'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const data = await getLeadsOverTime(days)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error fetching leads chart data:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leads chart data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
