"use server";

import { createClient } from "@/lib/supabase/server";
import { generateWebsiteForLead } from "@/lib/modules/websites/orchestrator";
import { revalidatePath } from "next/cache";

export async function generateWebsitesAction() {
  const supabase = await createClient();

  try {
    console.log("Starting batch website generation...");

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

    for (const lead of leads) {
      // Check for existing website
      const { data: existing } = await supabase
        .from("websites")
        .select("id")
        .eq("lead_id", lead.id)
        .single();

      if (existing) {
        console.log(`Skipping ${lead.business_name}, website already exists.`);
        continue;
      }

      const result = await generateWebsiteForLead(lead.id);

      if (result.success) {
        successCount++;
        await supabase
          .from("leads")
          .update({ status: "contacted" })
          .eq("id", lead.id);
      }
    }

    revalidatePath("/admin/websites");
    return { success: true, count: successCount };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
