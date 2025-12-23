import { Suspense } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, DollarSign, Activity } from "lucide-react";

// FIX: Force dynamic rendering so dashboard data is always fresh
export const dynamic = "force-dynamic";

// Define interfaces for database response
interface Lead {
  id: string;
  status: string;
  value_estimated: number;
}

interface Subscription {
  status: string;
  amount: number;
}

interface RevenueEvent {
  amount: number;
  event_date: string;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock_user_id")?.value;
  const supabase = await createClient();

  // 1. Fetch data
  // Note: For MVP, if no mockUserId, we just fetch everything to show the dashboard works
  const leadsQuery = supabase
    .from("leads")
    .select("id, status, value_estimated");
  const subsQuery = supabase.from("subscriptions").select("status, amount");
  const revenueQuery = supabase
    .from("revenue_events")
    .select("amount, event_date")
    .order("event_date", { ascending: true })
    .limit(30);

  // If we had a real user system, we would filter by user_id here
  // if (mockUserId) {
  //   leadsQuery.eq("user_id", mockUserId);
  //   subsQuery.eq("user_id", mockUserId);
  // }

  const [leadsResult, subscriptionsResult, revenueResult] = await Promise.all([
    leadsQuery,
    subsQuery,
    revenueQuery,
  ]);

  const leads = (leadsResult.data || []) as Lead[];
  const subscriptions = (subscriptionsResult.data || []) as Subscription[];

  // @ts-ignore - Supabase type inference can be tricky with complex queries
  const revenueEvents = (revenueResult.data || []).map((r: any) => ({
    amount: Number(r.amount),
    event_date: r.event_date,
  })) as RevenueEvent[];

  // 2. Calculate Metrics
  const totalLeads = leads.length;
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  ).length;

  // Calculate Revenue
  const totalRevenue = revenueEvents.reduce(
    (sum, event) => sum + (event.amount || 0),
    0
  );

  // Calculate Pipeline Value (Mock logic: assume each lead is worth $500 if not specified)
  const pipelineValue = leads.reduce(
    (sum, lead) => sum + (Number(lead.value_estimated) || 500),
    0
  );

  // 3. Define Metrics for Server Rendering
  const metricCards = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12.5%", // Mock change for UI
      icon: DollarSign,
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions.toString(),
      change: "+2",
      icon: CreditCard,
    },
    {
      title: "Total Leads",
      value: totalLeads.toString(),
      change: "+5",
      icon: Users,
    },
    {
      title: "Pipeline Value",
      value: `$${pipelineValue.toLocaleString()}`,
      change: "+4.3%",
      icon: Activity,
    },
  ];

  // 4. Prepare Data for Client Component
  const clientChartData = {
    revenueSeries:
      revenueEvents.length > 0
        ? revenueEvents.map((e) => ({
            x: new Date(e.event_date).toLocaleDateString(),
            y: e.amount,
          }))
        : [], // Empty array if no data
    leadStatusCounts: leads.reduce((acc: any, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {}),
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Metric Cards - Rendered on Server */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts - Rendered on Client */}
      <Suspense fallback={<div>Loading charts...</div>}>
        <DashboardClient data={clientChartData} />
      </Suspense>
    </div>
  );
}
