import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // This uses the Admin client from lib/db, bypassing security rules (RLS)
    const { data: leads, error } = await query("leads");

    if (error) {
      console.error("Database Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leads: leads || [] }, { status: 200 });
  } catch (error) {
    console.error("Admin Leads API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
