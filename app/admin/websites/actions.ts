"use server";

import { createClient } from "@/lib/supabase/server";
import { generateWebsiteForLead } from "@/lib/modules/websites/orchestrator"; // FIXED IMPORT
import { revalidatePath } from "next/cache";

export async function generateWebsitesAction() {
  const supabase = await createClient();

  try {
    console.log("Starting batch website generation...");

    // 1. Get leads that are 'pending' and don't have a website yet
    // Limiting to 3 at a time to prevent timeout during testing
    const { data: leads, error } = await supabase
      .from("leads")
      .select("id, business_name, industry")
      .eq("status", "pending")
      .limit(3);

    if (error) {
      console.error("Error fetching leads:", error);
      return { success: false, error: error.message };
    }

    if (!leads || leads.length === 0) {
      return {
        success: true,
        count: 0,
        message: "No pending leads found to process.",
      };
    }

    let successCount = 0;

    // 2. Loop through leads and trigger the Orchestrator
    for (const lead of leads) {
      // Double check if a website already exists to avoid duplicates
      const { data: existing } = await supabase
        .from("websites")
        .select("id")
        .eq("lead_id", lead.id)
        .single();

      if (existing) {
        console.log(`Skipping ${lead.business_name}, website already exists.`);
        continue;
      }

      // Call the "Brain" to generate the site
      const result = await generateWebsiteForLead(lead.id);

      if (result.success) {
        successCount++;
        // Update lead status so we don't pick it up again immediately
        await supabase
          .from("leads")
          .update({ status: "contacted" })
          .eq("id", lead.id);
      } else {
        console.error(
          `Failed to generate for ${lead.business_name}:`,
          result.error
        );
      }
    }

    // 3. Refresh the UI to show the new rows
    revalidatePath("/admin/websites");

    return { success: true, count: successCount };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
