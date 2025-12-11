import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/modules/payments/stripe-client'
import { createSubscription, updateSubscription, cancelSubscription } from '@/lib/modules/payments/subscription-manager'
import { deliverService } from '@/lib/modules/deliveries/orchestrator'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get raw body and signature
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return new Response('Missing signature', { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

      if (!webhookSecret) {
        console.error('Missing STRIPE_WEBHOOK_SECRET')
        return new Response('Webhook secret not configured', { status: 500 })
      }

      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, {
        status: 400,
      })
    }

    console.log('Stripe webhook received:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const leadId = session.metadata?.leadId

        if (!leadId) {
          console.error('No leadId in session metadata')
          break
        }

        console.log('Checkout completed for lead:', leadId)

        // Get subscription details from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Get period dates from subscription items
        const subscriptionItem = (stripeSubscription as any).items?.data?.[0]
        const periodStart = subscriptionItem?.current_period_start
        const periodEnd = subscriptionItem?.current_period_end

        if (!periodStart || !periodEnd) {
          console.error('Missing period dates. Subscription item:', subscriptionItem)
          throw new Error('Invalid subscription period dates')
        }

        console.log('Period dates:', { periodStart, periodEnd })

        // Create subscription in database
        await createSubscription({
          leadId: leadId,
          stripeSubscriptionId: stripeSubscription.id,
          stripeCustomerId: stripeSubscription.customer as string,
          status: stripeSubscription.status,
          amount: 99.0,
          currency: 'aud',
          currentPeriodStart: new Date(periodStart * 1000),
          currentPeriodEnd: new Date(periodEnd * 1000),
        })

        console.log('Subscription created in database:', stripeSubscription.id)

        // Trigger delivery automation asynchronously
        console.log('Triggering delivery automation for lead:', leadId)
        deliverService(leadId)
          .then((result) => {
            if (result.success) {
              console.log('Delivery completed successfully:', result.domain)
            } else {
              console.error('Delivery failed:', result.errors)
            }
          })
          .catch((error) => {
            console.error('Delivery automation error:', error)
          })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        console.log('Subscription updated:', subscription.id)

        // Get period dates from subscription items
        const subscriptionItem = (subscription as any).items?.data?.[0]
        const periodStart = subscriptionItem?.current_period_start
        const periodEnd = subscriptionItem?.current_period_end

        if (periodStart && periodEnd) {
          await updateSubscription(subscription.id, {
            status: subscription.status,
            current_period_start: new Date(periodStart * 1000).toISOString(),
            current_period_end: new Date(periodEnd * 1000).toISOString(),
          })
        } else {
          // If no period dates, just update status
          await updateSubscription(subscription.id, {
            status: subscription.status,
          })
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        console.log('Subscription deleted:', subscription.id)

        // Don't cancel in Stripe since it's already canceled (webhook triggered by Stripe)
        await cancelSubscription(subscription.id, false)

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string

        console.log('Payment failed for subscription:', subscriptionId)

        await updateSubscription(subscriptionId, {
          status: 'past_due',
        })

        // TODO: Send dunning email to customer

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Return 200 to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new Response(
      JSON.stringify({
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
