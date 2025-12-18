export function selectTemplate(
  lead: any,
  quality: "basic" | "premium" = "basic"
): string {
  const industry = (lead.industry || "").toLowerCase().trim();

  // Map industries to template IDs
  if (industry.includes("restaurant") || industry.includes("food"))
    return "restaurant-v1";
  if (
    industry.includes("service") ||
    industry.includes("plumb") ||
    industry.includes("electr")
  )
    return "service-business-v1";
  if (industry.includes("shop") || industry.includes("retail"))
    return "retail-v1";

  // Default
  return "modern-minimal-v1";
}
