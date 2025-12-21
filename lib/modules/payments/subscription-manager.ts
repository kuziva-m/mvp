<<<<<<< HEAD
import { createClient } from "@/lib/supabase/server";

export async function convertLeadToSubscription(leadId: string) {
  const supabase = await createClient();

  try {
    // 1. Get the lead details
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) throw new Error("Lead not found");

    // 2. Check if already subscribed to avoid duplicates
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("lead_id", leadId)
      .single();

    if (existingSub) return { success: true, message: "Already subscribed" };

    // 3. Create Subscription Record (Mocking Stripe Data)
    const { error: subError } = await supabase.from("subscriptions").insert({
      lead_id: leadId,
      stripe_subscription_id: `sub_mock_${Date.now()}`,
      stripe_customer_id: `cus_mock_${Date.now()}`,
      status: "active",
      amount: 99.0,
      currency: "AUD",
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toISOString(),
      plan_name: "Standard Plan",
      billing_cycle: "monthly",
    });

    if (subError) throw new Error(`DB Error: ${subError.message}`);

    // 4. Update Lead Status
    await supabase
      .from("leads")
      .update({ status: "subscribed" })
      .eq("id", leadId);

    // 5. Trigger "Post-Payment Delivery" logic here (e.g., Domain purchase)
    // await startDeliveryProcess(leadId);

    return { success: true };
  } catch (error: any) {
    console.error("Conversion failed:", error);
    return { success: false, error: error.message };
=======
import { insert, update, query } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { stripe } from './stripe-client'
import type { Subscription } from '@/types'

export interface CreateSubscriptionData {
  leadId: string
  stripeSubscriptionId: string
  stripeCustomerId: string
  status: string
  amount: number
  currency: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
}

/**
 * Create a new subscription in database
 */
export async function createSubscription(data: CreateSubscriptionData) {
  try {
    // Insert subscription
    const { data: subscription, error: subError } = await insert<Partial<Subscription>>('subscriptions', {
      id: crypto.randomUUID(),
      lead_id: data.leadId,
      stripe_subscription_id: data.stripeSubscriptionId,
      stripe_customer_id: data.stripeCustomerId,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      current_period_start: data.currentPeriodStart.toISOString(),
      current_period_end: data.currentPeriodEnd.toISOString(),
      cancel_at: null,
    })

    if (subError) {
      console.error('Failed to create subscription:', subError)
      throw new Error('Failed to create subscription in database')
    }

    // Update lead status
    await update('leads', data.leadId, { status: 'subscribed' })

    console.log('Subscription created successfully:', subscription)
    return subscription
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

/**
 * Update subscription in database
 */
export async function updateSubscription(
  stripeSubscriptionId: string,
  updates: Partial<Subscription>
) {
  try {
    // Find subscription by stripe_subscription_id
    const { data: subscriptions, error: findError } = await query<Subscription>('subscriptions', {
      stripe_subscription_id: stripeSubscriptionId,
    })

    if (findError || !subscriptions || subscriptions.length === 0) {
      throw new Error('Subscription not found')
    }

    const subscription = subscriptions[0]

    // Update subscription
    const { data: updated, error: updateError } = await update(
      'subscriptions',
      subscription.id,
      updates
    )

    if (updateError) {
      throw new Error('Failed to update subscription')
    }

    console.log('Subscription updated:', updated)
    return updated
  } catch (error) {
    console.error('Error updating subscription:', error)
    throw error
  }
}

/**
 * Cancel subscription
 * @param stripeSubscriptionId - The Stripe subscription ID
 * @param cancelInStripe - Whether to cancel in Stripe (false when called from webhook)
 */
export async function cancelSubscription(stripeSubscriptionId: string, cancelInStripe: boolean = true) {
  try {
    // Find subscription
    const { data: subscriptions, error: findError } = await query<Subscription>('subscriptions', {
      stripe_subscription_id: stripeSubscriptionId,
    })

    if (findError || !subscriptions || subscriptions.length === 0) {
      throw new Error('Subscription not found')
    }

    const subscription = subscriptions[0]

    // Update database
    await update('subscriptions', subscription.id, {
      status: 'canceled',
      cancel_at: new Date().toISOString(),
    })

    // Update lead status
    await update('leads', subscription.lead_id, { status: 'canceled' })

    // Cancel in Stripe (only if not already canceled via webhook)
    if (cancelInStripe) {
      await stripe.subscriptions.cancel(stripeSubscriptionId)
      console.log('Subscription canceled in Stripe:', stripeSubscriptionId)
    }

    console.log('Subscription canceled in database:', stripeSubscriptionId)
    return { success: true }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw error
  }
}

/**
 * Get all active subscriptions with lead details
 */
export async function getActiveSubscriptions() {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        leads:lead_id (
          business_name,
          email,
          phone
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching active subscriptions:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting active subscriptions:', error)
    throw error
  }
}

/**
 * Get all subscriptions with lead details (with optional status filter)
 */
export async function getAllSubscriptions(statusFilter?: string) {
  try {
    let queryBuilder = supabase
      .from('subscriptions')
      .select(`
        *,
        leads:lead_id (
          business_name,
          email,
          phone
        )
      `)

    if (statusFilter) {
      queryBuilder = queryBuilder.eq('status', statusFilter)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscriptions:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error getting subscriptions:', error)
    throw error
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
  }
}
