import { createClient } from "@/lib/supabase/server";
import { selectTemplateForLead } from "./template-selector";
import { generateWebsiteCopy } from "./ai-generator";
import { scrapeBusinessData } from "../leads/scrapers/scrapemaps-client";

interface OrchestrationResult {
  success: boolean;
  websiteId?: string;
  error?: string;
}

export async function generateWebsiteForLead(
  leadId: string
): Promise<OrchestrationResult> {
  const supabase = await createClient();

  try {
    console.log(`[Orchestrator] Starting generation for lead: ${leadId}`);

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead)
      throw new Error(`Lead not found: ${leadError?.message}`);

    // Mock Scrape
    const scrapedData = await scrapeBusinessData(
      lead.website,
      lead.business_name
    );

    // Update Lead with scraped logo/data
    await supabase
      .from("leads")
      .update({
        scraped_data: scrapedData,
        logo_url: scrapedData.logoUrl,
      })
      .eq("id", leadId);

    // Select Template
    const template = await selectTemplateForLead(lead);

    // Generate AI Copy
    const aiContext = { ...lead, ...scrapedData };
    const websiteContent = await generateWebsiteCopy(
      lead.business_name,
      lead.industry,
      aiContext
    );

    // Create Subdomain
    const subdomain =
      lead.business_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") + `-${leadId.slice(0, 4)}`;

    // Save Website
    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .insert({
        lead_id: leadId,
        template_id: template.id,
        content: websiteContent,
        status: "draft",
        subdomain: subdomain,
      })
      .select()
      .single();

    if (websiteError)
      throw new Error(
        `Failed to create website record: ${websiteError.message}`
      );

    // Auto-publish for MVP
    await supabase
      .from("websites")
      .update({ status: "published" })
      .eq("id", website.id);

    return { success: true, websiteId: website.id };
  } catch (error: any) {
    console.error(`[Orchestrator] Error:`, error);
    return { success: false, error: error.message };
  }
}
