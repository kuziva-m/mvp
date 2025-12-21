import { createClient } from "@/lib/supabase/server";
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
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

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
  }
}
