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
  }
}
