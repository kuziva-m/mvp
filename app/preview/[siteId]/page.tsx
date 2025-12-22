import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ServiceBusinessTemplate from "@/templates/ServiceBusinessTemplate";
import RestaurantTemplate from "@/templates/RestaurantTemplate";
import RetailTemplate from "@/templates/RetailTemplate";
import ProfessionalTemplate from "@/templates/ProfessionalTemplate";
import ModernMinimalTemplate from "@/templates/ModernMinimalTemplate";

interface PageProps {
  params: Promise<{
    siteId: string;
  }>;
}

export default async function PreviewPage(props: PageProps) {
  const params = await props.params;
  const supabase = await createClient();

  // 1. Fetch the site data
  const { data: site, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", params.siteId)
    .single();

  if (error || !site) {
    console.error("Preview Error:", error);
    notFound();
  }

  // 2. Fetch lead info
  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", site.lead_id)
    .single();

  // 3. CRITICAL FIX: Read from 'content_data' (the new column)
  // We default to an empty object {} if data is missing to prevent crashes
  const content = site.content_data || {};

  console.log("Previewing Site:", site.id);
  console.log("Template Style:", site.style);

  // 4. Render the correct template
  switch (site.style) {
    case "restaurant":
      return <RestaurantTemplate content={content} leadInfo={lead} />;

    case "service":
      return <ServiceBusinessTemplate content={content} leadInfo={lead} />;

    case "retail":
      return <RetailTemplate content={content} leadInfo={lead} />;

    case "professional":
      return <ProfessionalTemplate content={content} leadInfo={lead} />;

    case "modern":
    default:
      return <ModernMinimalTemplate content={content} leadInfo={lead} />;
  }
}
