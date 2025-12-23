import { NextRequest, NextResponse } from "next/server";
import { getById, query } from "@/lib/db";
import type { Lead, Site, EmailTemplate } from "@/types";
import {
  sendEmail,
  replaceVariables,
  extractFirstName,
} from "@/lib/modules/emails/sender";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: leadId } = await context.params;
    const body = await request.json();

    // 1. Get lead from database
    const { data: lead, error: leadError } = await getById<Lead>(
      "leads",
      leadId
    );

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (!lead.email) {
      return NextResponse.json(
        { error: "Lead has no email address" },
        { status: 400 }
      );
    }

    // 2. Get site from database (for preview_url)
    const { data: sites } = await query<Site>("sites", { lead_id: leadId });
    const site = sites && sites.length > 0 ? sites[0] : null;

    if (!site) {
      return NextResponse.json(
        { error: "No website generated for this lead" },
        { status: 400 }
      );
    }

    // 3. Prepare Template Content
    // We allow passing `templateId` OR just relying on a default construct
    let subject = "";
    let htmlBody = "";
    let textBody = undefined;
    let templateIdToLog = body.templateId || null;

    if (body.templateId) {
      // Fetch specific template
      const { data: template, error: templateError } =
        await getById<EmailTemplate>("email_templates", body.templateId);

      if (templateError || !template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }
      if (!template.is_active) {
        return NextResponse.json(
          { error: "Template is inactive" },
          { status: 400 }
        );
      }

      subject = template.subject;
      htmlBody = template.html_body;
      textBody = template.text_body;
    } else {
      // Default / Fallback Email if no template selected
      subject = "I built a demo website for {{business_name}}";
      htmlBody = `
        <p>Hi {{first_name}},</p>
        <p>I built a custom website demo for {{business_name}}. You can view it here:</p>
        <p><a href="{{preview_url}}">View Demo Site</a></p>
        <p>Let me know what you think!</p>
      `;
    }

    // 4. Prepare variables for replacement
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    // Ensure preview URL is absolute
    const previewUrl = site.preview_url?.startsWith("http")
      ? site.preview_url
      : `${baseUrl}${site.preview_url || `/preview/${site.id}`}`;

    const variables = {
      businessName: lead.business_name,
      firstName: extractFirstName(lead.business_name),
      previewUrl: previewUrl,
    };

    // 5. Replace variables
    const finalSubject = replaceVariables(subject, variables);
    const finalHtmlBody = replaceVariables(htmlBody, variables);
    const finalTextBody = textBody
      ? replaceVariables(textBody, variables)
      : undefined;

    // 6. Send email
    const result = await sendEmail({
      to: lead.email,
      subject: finalSubject,
      htmlBody: finalHtmlBody,
      textBody: finalTextBody,
      leadId,
      templateId: templateIdToLog,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messageId: result.messageId,
        message: "Email sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error during email sending:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
