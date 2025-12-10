import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
})

/**
 * Create Stripe product (run once via setup script)
 */
export async function createProduct() {
  const product = await stripe.products.create({
    name: 'Website Hosting Service',
    description: 'Professional website with hosting, domain, and email',
  })

  console.log('Product created:', product.id)
  return product
}

/**
 * Create recurring price for product (run once via setup script)
 */
export async function createPrice(productId: string) {
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: 9900, // $99.00 in cents
    currency: 'aud',
    recurring: {
      interval: 'month',
    },
  })

  console.log('Price created:', price.id)
  return price
}

/**
 * Create Stripe checkout session for subscription
 */
export async function createCheckoutSession(
  leadId: string,
  priceId: string,
  leadEmail: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: leadEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    metadata: {
      leadId: leadId,
    },
    subscription_data: {
      metadata: {
        leadId: leadId,
      },
    },
  })

  return session
}

/**
 * Create customer portal session for subscription management
 */
export async function createCustomerPortal(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/subscriptions`,
  })

  return session
}
