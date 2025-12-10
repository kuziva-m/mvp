import { NextRequest, NextResponse } from 'next/server'
import { getById } from '@/lib/db'
import { cancelSubscription } from '@/lib/modules/payments/subscription-manager'
import type { Subscription } from '@/types'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

/**
 * POST /api/admin/subscriptions/[id]/cancel
 * Cancel a subscription
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Get subscription from database
    const { data: subscription, error } = await getById<Subscription>('subscriptions', id)

    if (error || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Cancel subscription
    await cancelSubscription(subscription.stripe_subscription_id)

    return NextResponse.json(
      {
        success: true,
        message: 'Subscription canceled successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      {
        error: 'Failed to cancel subscription',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
