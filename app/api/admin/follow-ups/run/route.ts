import { NextRequest, NextResponse } from 'next/server'
import { checkAndSendFollowUps } from '@/lib/modules/emails/follow-ups'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/follow-ups/run
 * Manually trigger follow-up email sequence
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Starting follow-up sequence...')

    const result = await checkAndSendFollowUps()

    console.log('Follow-up sequence completed:', result)

    return NextResponse.json(
      {
        success: true,
        ...result,
        message: `Sent ${result.total} follow-up emails`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error running follow-ups:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
