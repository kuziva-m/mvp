/**
 * Admin Metrics API
 *
 * GET /api/admin/metrics
 * Returns all key business metrics
 */

import { NextResponse } from 'next/server'
import { calculateMetrics } from '@/lib/modules/crm/analytics'

export async function GET() {
  try {
    const metrics = await calculateMetrics()

    return NextResponse.json({
      success: true,
      metrics,
    })
  } catch (error) {
    console.error('Error calculating metrics:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate metrics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
