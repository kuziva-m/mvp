"use server";

import { createClient } from "@/lib/supabase/server";
<<<<<<< HEAD
import { generateWebsiteForLead } from "@/lib/modules/websites/orchestrator"; // FIXED IMPORT
=======
import { createWebsiteForLead } from "@/lib/modules/websites/orchestrator";
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
import { revalidatePath } from "next/cache";

export async function generateWebsitesAction() {
  const supabase = await createClient();

<<<<<<< HEAD
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
=======
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
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
}
