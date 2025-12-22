import { getById, insert, update } from "@/lib/db";
import type { Lead, Site, Generation } from "@/types";
import { scrapeWebsite } from "./scraper";
import { generateWebsiteCopy } from "./ai-generator";
import { logAIUsage } from "@/lib/modules/financial/expense-tracker";
import { qaQueue } from "@/lib/queues"; // Uses our safe Mock Queue

interface GenerationResult {
  success: boolean;
  siteId?: string;
  previewUrl?: string;
  tokensUsed?: number;
  costUSD?: number;
  error?: string;
}

/**
 * Main orchestration function for website generation
 * Handles the complete workflow from lead data to generated site
 */
export async function generateWebsite(
  leadId: string
): Promise<GenerationResult> {
  console.log(`[Generator] Starting process for lead: ${leadId}`);

  try {
    // 1. Fetch lead from database
    const { data: lead, error: leadError } = await getById<Lead>(
      "leads",
      leadId
    );

    if (leadError || !lead) {
      return {
        success: false,
        error: "Lead not found",
      };
    }

    // 2. Optionally scrape website if URL exists (Mock/Partial implementation for MVP)
    let scrapedData: any = null;
    if (lead.website) {
      try {
        console.log(`Scraping website: ${lead.website}`);
        scrapedData = await scrapeWebsite(lead.website);

        if (scrapedData) {
          await update("leads", leadId, {
            scraped_data: scrapedData,
            status: "scraped",
          });
          console.log("Website scraped successfully");
        }
      } catch (scrapeError) {
        console.warn(
          "Scraping failed, continuing without scraped data:",
          scrapeError
        );
      }
    }

    // 3. Determine template based on industry
    const template = getTemplateForIndustry(lead.industry);
    console.log(
      `Selected template: ${template} for industry: ${lead.industry}`
    );

    // 4. Generate website copy using AI
    console.log("Generating website copy with AI...");

    const generatedCopy = await generateWebsiteCopy(
      lead.business_name,
      lead.industry,
      scrapedData || {}
    );

    // 5. Prepare content data for the site
    // CRITICAL FIX: Structure this exactly how the Template components expect it (Nested Hero)
    const contentData = {
      businessName: lead.business_name,
      industry: lead.industry,

      // FIX: Nest hero data so 'content.hero.headline' works in templates
      hero: {
        headline:
          generatedCopy.heroHeadline ||
          generatedCopy.hero?.headline ||
          "Welcome",
        subheadline:
          generatedCopy.heroSubheadline ||
          generatedCopy.hero?.subheadline ||
          "We provide excellent service.",
      },

      services: generatedCopy.services || [],
      about: generatedCopy.about || "",
      cta: generatedCopy.cta || { title: "Contact Us", link: "/contact" },

      // Handle colors if scraping worked
      colors: scrapedData?.colors
        ? {
            primary: scrapedData.colors.primary || undefined,
            secondary: scrapedData.colors.secondary || undefined,
            text: scrapedData.colors.text || undefined,
          }
        : undefined,

      logoUrl: scrapedData?.logoUrl || undefined,

      contact: {
        email: lead.email,
        phone: lead.phone,
      },
    };

    // 6. Save to sites table
    const siteId = crypto.randomUUID();
    const previewUrl = `/preview/${siteId}`;

    const { error: siteError } = await insert<Partial<Site>>("sites", {
      id: siteId,
      lead_id: leadId,
      preview_url: previewUrl,
      published_url: null,
      custom_domain: null,
      style: template,
      is_published: false,
      content_data: contentData, // Correct column name
    });

    if (siteError) {
      console.error("Failed to save site:", siteError);
      return {
        success: false,
        error: "Failed to save generated site: " + siteError.message,
      };
    }

    console.log("Site saved successfully");

    // 7. Save to generations table (Logs)
    await insert<Partial<Generation>>("generations", {
      id: crypto.randomUUID(),
      lead_id: leadId,
      site_id: siteId,
      prompt_data: {
        businessName: lead.business_name,
        industry: lead.industry,
      },
      ai_output: generatedCopy,
      tokens_used: generatedCopy.tokensUsed || 0,
      cost_usd: generatedCopy.costUSD || 0,
    });

    // 8. Log AI usage expense (Optional)
    if (generatedCopy.tokensUsed && generatedCopy.costUSD) {
      try {
        await logAIUsage(
          leadId,
          siteId,
          generatedCopy.tokensUsed,
          generatedCopy.costUSD
        );
      } catch (expenseError) {
        console.error("Failed to log AI expense (non-fatal):", expenseError);
      }
    }

    // 9. Update lead status to 'generated'
    await update("leads", leadId, {
      status: "generated",
      copy_analysis: generatedCopy,
    });
    console.log("Lead status updated to generated");

    // 10. Queue QA review (Mock Queue - Safe for local)
    try {
      await qaQueue.add("review", {
        siteId: siteId,
      });
      console.log(`✅ QA queued for site: ${siteId}`);
    } catch (qaError) {
      console.error("Failed to queue QA (non-fatal):", qaError);
    }

    // 11. Return success result
    return {
      success: true,
      siteId,
      previewUrl,
      tokensUsed: generatedCopy.tokensUsed,
      costUSD: generatedCopy.costUSD,
    };
  } catch (error: any) {
    console.error("Website generation error:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
}

/**
 * Maps industry to appropriate template
 */
function getTemplateForIndustry(industry: string): string {
  const industryLower = (industry || "").toLowerCase();

  // Service businesses
  if (
    industryLower.includes("plumb") ||
    industryLower.includes("electric") ||
    industryLower.includes("hvac") ||
    industryLower.includes("construct") ||
    industryLower.includes("repair") ||
    industryLower.includes("handyman")
  ) {
    return "service";
  }

  // Restaurants & Food
  if (
    industryLower.includes("restaurant") ||
    industryLower.includes("cafe") ||
    industryLower.includes("coffee") ||
    industryLower.includes("food") ||
    industryLower.includes("bakery") ||
    industryLower.includes("catering") ||
    industryLower.includes("pizza")
  ) {
    return "restaurant";
  }

  // Retail
  if (
    industryLower.includes("retail") ||
    industryLower.includes("store") ||
    industryLower.includes("shop") ||
    industryLower.includes("boutique") ||
    industryLower.includes("clothing")
  ) {
    return "retail";
  }

  // Professional Services
  if (
    industryLower.includes("law") ||
    industryLower.includes("legal") ||
    industryLower.includes("account") ||
    industryLower.includes("consult") ||
    industryLower.includes("financial") ||
    industryLower.includes("insurance") ||
    industryLower.includes("agency")
  ) {
    return "professional";
  }

  // Default to modern minimal
  return "modern";
}
