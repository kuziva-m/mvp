import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ServiceBusinessTemplate from "@/templates/ServiceBusinessTemplate";
import RestaurantTemplate from "@/templates/RestaurantTemplate";
import RetailTemplate from "@/templates/RetailTemplate";
import ProfessionalTemplate from "@/templates/ProfessionalTemplate";
import ModernMinimalTemplate from "@/templates/ModernMinimalTemplate";
import { ArrowRight, CheckCircle2 } from "lucide-react";

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

  // 3. Read content
  const content = site.content_data || {};

  console.log("Previewing Site:", site.id);

  // 4. Determine Template Component
  let TemplateComponent;
  switch (site.style) {
    case "restaurant":
      TemplateComponent = RestaurantTemplate;
      break;
    case "service":
      TemplateComponent = ServiceBusinessTemplate;
      break;
    case "retail":
      TemplateComponent = RetailTemplate;
      break;
    case "professional":
      TemplateComponent = ProfessionalTemplate;
      break;
    default:
      TemplateComponent = ModernMinimalTemplate;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* --- THE CONVERSION HEADER --- */}
      <div className="sticky top-0 z-[100] bg-slate-900 text-white shadow-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 text-green-400 p-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <span className="text-slate-400">Demo created for:</span>
              <span className="font-bold ml-1 text-white">
                {lead?.business_name || "Your Business"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden md:inline">
              Like what you see?
            </span>
            <Link href={`/checkout/${site.id}`}>
              <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                Claim This Website <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- THE WEBSITE CONTENT --- */}
      <div className="flex-1">
        <TemplateComponent content={content} leadInfo={lead} />
      </div>
    </div>
  );
}
