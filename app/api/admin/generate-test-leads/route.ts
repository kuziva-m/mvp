import { NextResponse } from "next/server";

// A "Smart Mock" generator that creates relevant data based on your search
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const keyword = body.keyword || "Business";
    const location = body.location || "City";

    // Wait 1.5s to simulate a real search
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Helper to capitalize words
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const key = cap(keyword);
    const loc = cap(location);

    // Generate 5 "smart" mock results based on the input
    const mockResults = [
      {
        business_name: `${key} Pros of ${loc}`,
        address: `123 Main St, ${loc}`,
        phone: "(555) 123-4567",
        website: `www.${keyword.toLowerCase()}pros${location.toLowerCase()}.com`,
        rating: 4.8,
        reviews: 124,
        email: `contact@${keyword.toLowerCase()}pros.com`,
        industry: key,
      },
      {
        business_name: `${loc} ${key} Specialists`,
        address: `45 Broad Ave, ${loc}`,
        phone: "(555) 987-6543",
        website: `www.${location.toLowerCase()}${keyword.toLowerCase()}.com`,
        rating: 4.2,
        reviews: 85,
        email: `info@${location.toLowerCase()}${keyword.toLowerCase()}.com`,
        industry: key,
      },
      {
        business_name: `Elite ${key} Solutions`,
        address: `88 Market St, ${loc}`,
        phone: "(555) 456-7890",
        rating: 4.9,
        reviews: 210,
        email: `hello@elite${keyword.toLowerCase()}.com`,
        industry: key,
      },
      {
        business_name: `${key} Express`,
        address: `12 Industrial Pkwy, ${loc}`,
        phone: "(555) 222-3333",
        website: null, // Test handling no website
        rating: 3.5,
        reviews: 12,
        industry: key,
      },
      {
        business_name: `The ${key} House`,
        address: `99 Center Rd, ${loc}`,
        phone: "(555) 888-9999",
        website: `www.the${keyword.toLowerCase()}house.com`,
        rating: 4.5,
        reviews: 156,
        email: `support@the${keyword.toLowerCase()}house.com`,
        industry: key,
      },
    ];

    return NextResponse.json({
      success: true,
      leads: mockResults,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate leads" },
      { status: 500 }
    );
  }
}
