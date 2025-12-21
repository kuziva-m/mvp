"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { convertLeadToSubscription } from "@/lib/modules/payments/subscription-manager";

// --- EXISTING FUNCTIONS (Kept intact) ---

// MOCK SCRAPER: Simulates analyzing a website
export async function scrapeWebsite(url: string) {
  // Simulate network delay (1.5s)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return mock data based on the URL
  const domain = url
    .replace("https://", "")
    .replace("http://", "")
    .split("/")[0];

  return {
    success: true,
    data: {
      business_name: domain.split(".")[0].toUpperCase() + " Inc.",
      logo_url: `https://logo.clearbit.com/${domain}`,
      industry: "Technology", // Default guess
      email: `contact@${domain}`,
      phone: "+1 (555) 123-4567",
    },
  };
}

export async function createLead(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const leadData = {
    user_id: user.id,
    business_name: formData.get("businessName"),
    website: formData.get("website"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    industry: formData.get("industry") || "Unknown",
    source: formData.get("source") || "Manual",
    status: "new",
    quality_score: 50,
    logo_url: formData.get("logoUrl"),
  };

  const { error } = await supabase.from("leads").insert(leadData);

  if (error) return { error: error.message };

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 1. Update the Lead Status
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  // 2. AUTOMATIC SUBSCRIPTION LOGIC
  if (status === "subscriber") {
    // We can reuse the shared module logic here too if we want
    await convertLeadToSubscription(id);
  }

  revalidatePath("/admin/leads");
  return { success: true };
}

// --- NEW FUNCTION (Fixes the error in columns.tsx) ---

export async function simulateSaleAction(leadId: string) {
  // Logic to simulate a Stripe payment and move lead to 'subscribed'
  const result = await convertLeadToSubscription(leadId);

  // Refresh the data on the screen
  revalidatePath("/admin/leads");
  revalidatePath("/admin/subscriptions");

  return result;
}
