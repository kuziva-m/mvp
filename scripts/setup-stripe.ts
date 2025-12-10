/**
 * Stripe Setup Script
 *
 * This script creates a Stripe product and price for the subscription.
 * Run this once to set up your Stripe account:
 *
 * npx tsx scripts/setup-stripe.ts
 *
 * This will output the STRIPE_PRODUCT_ID and STRIPE_PRICE_ID that you need
 * to add to your .env.local file.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import Stripe from 'stripe'

// Load .env.local from the project root
config({ path: resolve(process.cwd(), '.env.local') })

const PRODUCT_NAME = 'Website Hosting Service'
const PRODUCT_DESCRIPTION = 'Professional website with hosting, domain, and email'
const PRICE_AMOUNT = 9900 // $99.00 in cents
const PRICE_CURRENCY = 'aud'
const PRICE_INTERVAL = 'month'

async function setupStripe() {
  console.log('🚀 Starting Stripe setup...\n')

  // Validate environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ Error: STRIPE_SECRET_KEY not found in environment variables')
    console.error('Please add it to your .env.local file\n')
    process.exit(1)
  }

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  })

  try {
    // Step 1: Check if product already exists
    console.log('📦 Checking for existing products...')
    const existingProducts = await stripe.products.list({ limit: 100 })
    const existingProduct = existingProducts.data.find(
      (p) => p.name === PRODUCT_NAME
    )

    let product: Stripe.Product

    if (existingProduct) {
      console.log(`✓ Found existing product: ${existingProduct.name}`)
      console.log(`  ID: ${existingProduct.id}\n`)
      product = existingProduct
    } else {
      // Create product
      console.log('📦 Creating Stripe product...')
      product = await stripe.products.create({
        name: PRODUCT_NAME,
        description: PRODUCT_DESCRIPTION,
      })
      console.log(`✓ Product created: ${product.name}`)
      console.log(`  ID: ${product.id}\n`)
    }

    // Step 2: Check if price already exists for this product
    console.log('💰 Checking for existing prices...')
    const existingPrices = await stripe.prices.list({
      product: product.id,
      limit: 100,
    })
    const existingPrice = existingPrices.data.find(
      (p) =>
        p.unit_amount === PRICE_AMOUNT &&
        p.currency === PRICE_CURRENCY &&
        p.recurring?.interval === PRICE_INTERVAL &&
        p.active
    )

    let price: Stripe.Price

    if (existingPrice) {
      console.log(
        `✓ Found existing price: $${(existingPrice.unit_amount! / 100).toFixed(2)} ${existingPrice.currency.toUpperCase()}/${
          existingPrice.recurring?.interval
        }`
      )
      console.log(`  ID: ${existingPrice.id}\n`)
      price = existingPrice
    } else {
      // Create price
      console.log('💰 Creating Stripe price...')
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: PRICE_AMOUNT,
        currency: PRICE_CURRENCY,
        recurring: {
          interval: PRICE_INTERVAL,
        },
      })
      console.log(
        `✓ Price created: $${(price.unit_amount! / 100).toFixed(2)} ${price.currency.toUpperCase()}/${
          price.recurring?.interval
        }`
      )
      console.log(`  ID: ${price.id}\n`)
    }

    // Output results
    console.log('✅ Stripe setup complete!\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Add these to your .env.local file:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log(`STRIPE_PRODUCT_ID=${product.id}`)
    console.log(`STRIPE_PRICE_ID=${price.id}\n`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // Show current .env.local status
    console.log('📝 Next steps:')
    console.log('1. Copy the above values to your .env.local file')
    console.log('2. Set up webhook endpoint in Stripe Dashboard:')
    console.log('   - Go to https://dashboard.stripe.com/webhooks')
    console.log('   - Add endpoint: https://your-domain.com/api/webhooks/stripe')
    console.log('   - Select events: checkout.session.completed, customer.subscription.updated,')
    console.log('                    customer.subscription.deleted, invoice.payment_failed')
    console.log('   - Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env.local')
    console.log('3. For local testing, use Stripe CLI:')
    console.log('   stripe login')
    console.log('   stripe listen --forward-to localhost:3000/api/webhooks/stripe')
    console.log('   - Copy the webhook signing secret from the CLI output\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error setting up Stripe:')
    console.error(error)
    process.exit(1)
  }
}

// Run the setup
setupStripe()
