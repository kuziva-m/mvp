import { Suspense } from "react";
import { LeadGenClient } from "./lead-gen-client";
import { createClient } from "@/lib/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";

// Force dynamic rendering so data is always fresh
export const dynamic = "force-dynamic";

async function getLeadGenData() {
  const supabase = await createClient();

  // Fetch data safely
  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  // Get count safely
  const { count } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  return {
    recentLeads: recentLeads || [],
    totalLeads: count || 0,
  };
}

export default async function LeadGenPage() {
  const data = await getLeadGenData();

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Generation</h1>
          <p className="text-muted-foreground">
            Find and enrich new business leads.
          </p>
        </div>
      </div>

      <Suspense fallback={<LeadGenSkeleton />}>
        <LeadGenClient
          initialLeads={data.recentLeads}
          totalCount={data.totalLeads}
        />
      </Suspense>
    </div>
  );
}

function LeadGenSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}
