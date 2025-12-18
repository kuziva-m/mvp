import { createClient } from "@/lib/supabase/server";
import { generateAICopy } from "./ai-generator";
import { performQAChecks } from "./qa-service";
import { selectTemplate } from "./template-selector";

export async function createWebsiteForLead(
  leadId: string,
  options: { quality: "basic" | "premium" }
) {
  const supabase = await createClient();

  // 1. Fetch Lead Data
  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (error || !lead) throw new Error("Lead not found");

  // 2. Select Template based on Industry
  const templateId = selectTemplate(lead, options.quality);

  // 3. Generate AI Copy
  const websiteContent = await generateAICopy({
    businessName: lead.business_name || "New Business", // Handle distinct DB naming conventions (snake_case)
    industry: lead.industry,
    templateId: templateId,
  });

  // 4. Save Initial Draft
  const { data: website, error: insertError } = await supabase
    .from("websites")
    .insert({
      lead_id: leadId,
      template_id: templateId,
      content: websiteContent,
      status: "draft",
      subdomain: `${(lead.business_name || "site")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}-${leadId.slice(0, 4)}`,
    })
    .select()
    .single();

  if (insertError)
    throw new Error("Failed to create website record: " + insertError.message);

  // 5. Run Quality Assurance
  const qaResult = await performQAChecks(website.id, websiteContent);

  // 6. Update Status based on QA
  const finalStatus = qaResult.passed ? "generated" : "flagged";

  await supabase
    .from("websites")
    .update({
      status: finalStatus,
      qa_score: qaResult.score,
      qa_report: qaResult.report,
    })
    .eq("id", website.id);

  return {
    websiteId: website.id,
    status: finalStatus,
    report: qaResult.report,
  };
}
