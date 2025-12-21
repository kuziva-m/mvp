/**
 * Admin Activity Feed API
 *
 * GET /api/admin/activity
 * Returns recent activity feed
 */

import { NextResponse } from 'next/server'
import { getRecentActivity } from '@/lib/modules/crm/analytics'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const activities = await getRecentActivity(limit)

    return NextResponse.json({
      success: true,
      activities,
    })
  } catch (error) {
    console.error('Error fetching activity:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch activity',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
