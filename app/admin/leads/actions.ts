"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { convertLeadToSubscription } from "@/lib/modules/payments/subscription-manager";

// --- EXISTING FUNCTIONS ---

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

  // For MVP/Factory mode, we might not always have a user session if testing via scripts
  // But we try to get one.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const businessName = formData.get("businessName") as string;

  if (!businessName) {
    return { error: "Business name is required" };
  }

  const leadData = {
    // If no user is logged in (factory mode), just skip user_id or use a placeholder if DB enforces it
    user_id: user?.id || undefined,
    business_name: businessName,
    website: formData.get("website") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    industry: (formData.get("industry") as string) || "Unknown",
    source: (formData.get("source") as string) || "Manual",
    status: "new",
    quality_score: 50,
    logo_url: formData.get("logoUrl") as string,
  };

  const { error } = await supabase.from("leads").insert(leadData);

  if (error) return { error: error.message };

  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard"); // Refresh dashboard too
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();

  // 1. Update the Lead Status
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  // 2. AUTOMATIC SUBSCRIPTION LOGIC
  if (status === "subscriber") {
    await convertLeadToSubscription(id);
  }

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function simulateSaleAction(leadId: string) {
  // Logic to simulate a Stripe payment and move lead to 'subscribed'
  const result = await convertLeadToSubscription(leadId);

  // Refresh the data on the screen
  revalidatePath("/admin/leads");
  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/dashboard");

  return result;
}

// --- NEW DELETE FUNCTION ---
// This was missing and caused your error when trying to wire up the delete button
export async function deleteLead(leadId: string) {
  const supabase = await createClient();

  try {
    // 1. Delete associated sites first (Clean up FK constraints)
    // We ignore error here in case no sites exist
    await supabase.from("sites").delete().eq("lead_id", leadId);
    await supabase.from("generations").delete().eq("lead_id", leadId);
    await supabase.from("email_logs").delete().eq("lead_id", leadId);

    // 2. Delete the lead
    const { error } = await supabase.from("leads").delete().eq("id", leadId);

    if (error) {
      console.error("Delete Error:", error);
      return { success: false, error: error.message };
    }

    // 3. Refresh the UI
    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
