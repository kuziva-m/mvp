/**
 * Admin Charts - Revenue Over Time API
 *
 * GET /api/admin/charts/revenue?months=12
 * Returns revenue over time
 */

import { NextResponse } from 'next/server'
import { getRevenueOverTime } from '@/lib/modules/crm/analytics'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '12')

    const data = await getRevenueOverTime(months)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Error fetching revenue chart data:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch revenue chart data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
