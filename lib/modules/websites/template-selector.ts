import { createClient } from "@/lib/supabase/server";

export interface Template {
  id: string;
  name: string;
  industry: string[];
  qualityTier: "standard" | "premium";
  description: string;
  componentPath: string; // Path to the React component
}

// Hardcoded registry of your available React templates
const AVAILABLE_TEMPLATES: Template[] = [
  {
    id: "restaurant-modern-v1",
    name: "Modern Bistro",
    industry: ["restaurant", "cafe", "food", "hospitality"],
    qualityTier: "standard",
    description: "A clean, image-heavy template perfect for restaurants.",
    componentPath: "templates/RestaurantTemplate",
  },
  {
    id: "service-pro-v1",
    name: "Service Pro",
    industry: ["plumber", "electrician", "contractor", "cleaning", "trades"],
    qualityTier: "standard",
    description: "High-converting layout for service-based businesses.",
    componentPath: "templates/ServiceBusinessTemplate",
  },
  {
    id: "retail-boutique-v1",
    name: "Boutique Shop",
    industry: ["retail", "fashion", "shop", "store", "ecommerce"],
    qualityTier: "standard",
    description: "Elegant showcase for physical products.",
    componentPath: "templates/RetailTemplate",
  },
  {
    id: "corporate-clean-v1",
    name: "Corporate Clean",
    industry: ["finance", "legal", "consulting", "business", "insurance"],
    qualityTier: "standard",
    description:
      "Professional and trustworthy layout for white-collar services.",
    componentPath: "templates/ProfessionalTemplate",
  },
  {
    id: "general-universal-v1",
    name: "Universal Standard",
    industry: ["other", "general"],
    qualityTier: "standard",
    description: "A versatile template that works for any industry.",
    componentPath: "templates/ModernMinimalTemplate",
  },
];

export async function selectTemplateForLead(lead: {
  industry?: string;
  business_name?: string;
}): Promise<Template> {
  // 1. Normalize industry string
  const industryInput = (lead.industry || "other").toLowerCase();

  // 2. Find matching template
  const matchedTemplate = AVAILABLE_TEMPLATES.find((t) =>
    t.industry.some((ind) => industryInput.includes(ind))
  );

  // 3. Fallback to universal template if no match found
  if (!matchedTemplate) {
    return AVAILABLE_TEMPLATES.find((t) => t.id === "general-universal-v1")!;
  }

  return matchedTemplate;
}

export function getTemplateById(templateId: string): Template | undefined {
  return AVAILABLE_TEMPLATES.find((t) => t.id === templateId);
}
