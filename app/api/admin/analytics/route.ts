/**
 * Admin Analytics API
 *
 * GET /api/admin/analytics
 * Returns comprehensive analytics data
 */

import { NextResponse } from 'next/server'
import {
  calculateMetrics,
  getLeadsOverTime,
  getRevenueOverTime,
  getFunnelMetrics,
  getRevenueByIndustry,
  getBestSubjectLines,
} from '@/lib/modules/crm/analytics'

export async function GET() {
  try {
    const [metrics, leadsOverTime, revenueOverTime, funnelMetrics, revenueByIndustry, bestSubjects] =
      await Promise.all([
        calculateMetrics(),
        getLeadsOverTime(30),
        getRevenueOverTime(12),
        getFunnelMetrics(),
        getRevenueByIndustry(),
        getBestSubjectLines(5),
      ])

    return NextResponse.json({
      success: true,
      analytics: {
        metrics,
        leadsOverTime,
        revenueOverTime,
        funnelMetrics,
        revenueByIndustry,
        bestSubjects,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
