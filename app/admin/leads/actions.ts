"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
    status: "new", // Default status
    quality_score: 50, // Default score
    logo_url: formData.get("logoUrl"),
  };

  const { error } = await supabase.from("leads").insert(leadData);

  if (error) return { error: error.message };

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin/leads");
}
