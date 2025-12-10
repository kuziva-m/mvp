import { NextRequest, NextResponse } from 'next/server'
import { getById } from '@/lib/db'
import type { Lead } from '@/types'
import { createCheckoutSession } from '@/lib/modules/payments/stripe-client'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    // Get lead from database
    const { data: lead, error: leadError } = await getById<Lead>('leads', body.leadId)

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    if (!lead.email) {
      return NextResponse.json(
        { error: 'Lead has no email address' },
        { status: 400 }
      )
    }

    // Get price ID from environment
    const priceId = process.env.STRIPE_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured. Run setup script first.' },
        { status: 500 }
      )
    }

    // Create checkout session
    const session = await createCheckoutSession(
      lead.id,
      priceId,
      lead.email
    )

    return NextResponse.json(
      {
        success: true,
        url: session.url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
