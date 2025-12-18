"use server";

import { createClient } from "@/lib/supabase/server";
import { createWebsiteForLead } from "@/lib/modules/websites/orchestrator";
import { revalidatePath } from "next/cache";

export async function generateWebsitesAction() {
  const supabase = await createClient();

  // 1. Get leads that don't have websites yet (limit 3 for testing)
  // We fetch leads and check if they exist in the websites table
  const { data: leads } = await supabase
    .from("leads")
    .select("id, business_name, industry")
    .limit(5);

  if (!leads || leads.length === 0) {
    return { success: false, message: "No leads found to process." };
  }

  let count = 0;

  // 2. Loop through and generate
  for (const lead of leads) {
    // Check if website already exists
    const { data: existing } = await supabase
      .from("websites")
      .select("id")
      .eq("lead_id", lead.id)
      .single();

    if (!existing) {
      try {
        await createWebsiteForLead(lead.id, { quality: "basic" });
        count++;
      } catch (error) {
        console.error(`Failed to generate for ${lead.business_name}:`, error);
      }
    }
  }

  // 3. Refresh the UI
  revalidatePath("/admin/websites");

  return {
    success: true,
    message:
      count > 0
        ? `Successfully generated ${count} websites.`
        : "No new websites needed to be generated.",
  };
}
