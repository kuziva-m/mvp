import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";
import { query } from "@/lib/db"; // ✅ Correct import for your project

// Force dynamic rendering to ensure data is always fresh
export const dynamic = "force-dynamic";

async function getDashboardData() {
  // Fetch data using your project's helper
  // We use Promise.all to fetch both in parallel (faster)
  const [metricsRes, leadsRes] = await Promise.all([
    query("metrics"),
    query("leads"),
  ]);

  // Extract data or default to empty
  const metrics = metricsRes.data?.[0] || null; // Assuming metrics is a single row
  const leads = leadsRes.data || [];

  return { metrics, leads };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <DashboardClient
        initialMetrics={data.metrics}
        initialLeads={data.leads}
      />
    </div>
  );
}
