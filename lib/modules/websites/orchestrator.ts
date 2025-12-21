import { createClient } from "@/lib/supabase/server";
<<<<<<< HEAD
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
=======
import { generateAICopy } from "./ai-generator";
import { QAService } from "./qa-service";
import { selectTemplate } from "./template-selector";

export async function createWebsiteForLead(
  leadId: string,
  options: { quality: "basic" | "premium" } = { quality: "basic" }
) {
  const supabase = await createClient();

  try {
    // 1. Fetch Lead Data
    const { data: lead } = await supabase
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

<<<<<<< HEAD
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
=======
    if (!lead) throw new Error(`Lead not found: ${leadId}`);

    // 2. Select Template
    // The selectTemplate function returns a string ID directly
    const templateId = selectTemplate(lead, options.quality);

    // 3. Generate Content (AI)
    // Pass a single object with properties as expected by generateAICopy
    const content = await generateAICopy({
      businessName: lead.business_name,
      industry: lead.industry,
      templateId: templateId,
    });

    // 4. Mock Deployment (In a real app, this calls your React Builder + Vercel API)
    const siteId = crypto.randomUUID();
    const previewUrl = `https://mvp-agency-preview.vercel.app/preview/${siteId}`;

    // 5. Perform QA Checks
    const qaResult = await QAService.checkSite(previewUrl);

    // 6. Save to Database
    const { error } = await supabase.from("sites").insert({
      id: siteId,
      lead_id: lead.id,
      template_id: templateId, // Pass the string directly
      content: content,
      preview_url: previewUrl,
      qa_status: qaResult.passed ? "passed" : "failed",
      qa_score: qaResult.score,
      status: "ready",
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return { success: true, siteId, url: previewUrl, qa: qaResult };
  } catch (error) {
    console.error("Website Orchestration Failed:", error);
    return { success: false, error: (error as Error).message };
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
  }
}
