import { NextRequest, NextResponse } from 'next/server'
import { getAllSubscriptions, createSubscription } from '@/lib/modules/payments/subscription-manager'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/subscriptions
 * Get all subscriptions with optional status filter and search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let subscriptions = await getAllSubscriptions(status || undefined)

    // Filter by search term (business name or email)
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim()
      subscriptions = subscriptions.filter((sub) => {
        const businessName = sub.lead?.business_name?.toLowerCase() || ''
        const email = sub.lead?.email?.toLowerCase() || ''
        return businessName.includes(searchLower) || email.includes(searchLower)
      })
    }

    return NextResponse.json({ data: subscriptions }, { status: 200 })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch subscriptions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/subscriptions
 * Create subscription manually (for testing)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.leadId || !body.stripeSubscriptionId || !body.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const subscription = await createSubscription({
      leadId: body.leadId,
      stripeSubscriptionId: body.stripeSubscriptionId,
      stripeCustomerId: body.stripeCustomerId,
      status: body.status || 'active',
      amount: body.amount || 99.0,
      currency: body.currency || 'aud',
      currentPeriodStart: body.currentPeriodStart ? new Date(body.currentPeriodStart) : new Date(),
      currentPeriodEnd: body.currentPeriodEnd ? new Date(body.currentPeriodEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })

    return NextResponse.json({ data: subscription }, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      {
        error: 'Failed to create subscription',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
