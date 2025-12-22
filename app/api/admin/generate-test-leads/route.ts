import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Added 'req' to handle input if needed later
  console.log("--> STARTING LEAD GENERATION...");

  try {
    const supabase = await createClient();

    // 1. Create a dummy lead
    const mockLead = {
      business_name: "Mario's Woodfired Pizza",
      industry: "Restaurant",
      website_url: "http://marios-pizza-demo.com",
      email: `mario${Math.floor(Math.random() * 1000)}@example.com`, // Random email to avoid duplicates
      phone: "0400 123 456",
      status: "new",
      source: "Manual Test",
      copy_analysis: {
        tone: "Friendly, Family-oriented",
        keywords: ["Pizza", "Italian", "Woodfired"],
      },
    };

    console.log("--> ATTEMPTING INSERT TO SUPABASE...");

    // 2. Insert into DB
    const { data, error } = await supabase
      .from("leads")
      .insert([mockLead])
      .select();

    if (error) {
      console.error("❌ SUPABASE ERROR:", error.message); // <--- LOOK FOR THIS IN TERMINAL
      console.error("❌ ERROR DETAILS:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ SUCCESS! Lead created:", data);
    return NextResponse.json({ success: true, leads: data });
  } catch (err: any) {
    console.error("❌ SERVER CRASH:", err.message);
    return NextResponse.json(
      { error: "Server crashed: " + err.message },
      { status: 500 }
    );
  }
}
