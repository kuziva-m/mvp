import { createClient } from "@/lib/supabase/server";
import { selectTemplateForLead } from "./template-selector";
import { generateWebsiteCopy } from "./ai-generator"; // Using our mock
import { scrapeBusinessData } from "../leads/scrapers/scrapemaps-client"; // Using our mock

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

    // 1. Fetch Lead Data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError || !lead)
      throw new Error(`Lead not found: ${leadError?.message}`);

    // 2. Scrape Existing Data (if website exists or just generic business info)
    const scrapedData = await scrapeBusinessData(
      lead.website,
      lead.business_name
    );

    // Update Lead with scraped logo/data if valuable
    await supabase
      .from("leads")
      .update({
        scraped_data: scrapedData,
        logo_url: scrapedData.logoUrl,
      })
      .eq("id", leadId);

    // 3. Select Template
    const template = await selectTemplateForLead(lead);
    console.log(`[Orchestrator] Selected template: ${template.id}`);

    // 4. Generate AI Copy
    // We combine manual lead info + scraped info for the prompt context
    const aiContext = {
      ...lead,
      ...scrapedData,
    };
    const websiteContent = await generateWebsiteCopy(
      lead.business_name,
      lead.industry,
      aiContext
    );

    // 5. Create Website Record
    // We create a subdomain based on business name (sanitized)
    const subdomain =
      lead.business_name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
        .replace(/-+/g, "-") // Remove duplicate hyphens
        .replace(/^-|-$/g, "") + // Remove leading/trailing hyphens
      `-${leadId.slice(0, 4)}`; // Add simplified unique suffix

    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .insert({
        lead_id: leadId,
        template_id: template.id,
        content: websiteContent,
        status: "draft", // Starts as draft, moves to published after QA
        subdomain: subdomain,
      })
      .select()
      .single();

    if (websiteError)
      throw new Error(
        `Failed to create website record: ${websiteError.message}`
      );

    console.log(`[Orchestrator] Website created successfully: ${website.id}`);

    // 6. Trigger "Deployment" (Mocking the build process)
    // In a real system, this would call Vercel/Netlify API.
    // Here we just update the status to 'published' after a short delay.
    await supabase
      .from("websites")
      .update({ status: "published" }) // Auto-publishing for MVP
      .eq("id", website.id);

    return { success: true, websiteId: website.id };
  } catch (error: any) {
    console.error(`[Orchestrator] Error:`, error);
    return { success: false, error: error.message };
  }
}
