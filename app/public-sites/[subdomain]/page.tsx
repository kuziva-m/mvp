import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

// Import all templates
import ModernMinimalTemplate from "@/templates/ModernMinimalTemplate";
import RestaurantTemplate from "@/templates/RestaurantTemplate";
import ServiceBusinessTemplate from "@/templates/ServiceBusinessTemplate";
import RetailTemplate from "@/templates/RetailTemplate";
import ProfessionalTemplate from "@/templates/ProfessionalTemplate";

export default async function PublicSitePage({
  params,
}: {
  params: { subdomain: string };
}) {
  const supabase = await createClient();
  const { subdomain } = params;

  // 1. Find the website by subdomain
  // We explicitly fetch lead details to populate contact info
  const { data: website, error } = await supabase
    .from("websites")
    .select("*, leads(business_name, industry, phone, email)")
    .eq("subdomain", subdomain)
    .eq("status", "published")
    .single();

  if (error || !website) {
    console.error("Site not found:", subdomain);
    return notFound();
  }

  const content = website.content || {};
  const leadInfo = website.leads || {};
  const templateId = website.template_id;

  // 2. Render the correct template based on ID
  // passing standard props: content (AI text) and leadInfo (Contact details)
  switch (templateId) {
    case "restaurant-modern-v1":
      return <RestaurantTemplate content={content} leadInfo={leadInfo} />;

    case "service-pro-v1":
      return <ServiceBusinessTemplate content={content} leadInfo={leadInfo} />;

    case "retail-boutique-v1":
      return <RetailTemplate content={content} leadInfo={leadInfo} />;

    case "corporate-clean-v1":
      return <ProfessionalTemplate content={content} leadInfo={leadInfo} />;

    case "general-universal-v1":
    default:
      return <ModernMinimalTemplate content={content} leadInfo={leadInfo} />;
  }
}
