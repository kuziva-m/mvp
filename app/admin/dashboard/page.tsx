import { Suspense } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, DollarSign, Activity } from "lucide-react";

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

  // 1. Fetch data for the selected business
  const [leadsResult, subscriptionsResult, revenueResult] = await Promise.all([
    supabase
      .from("leads")
      .select("id, status, value_estimated")
      .eq("user_id", mockUserId),

    supabase
      .from("subscriptions")
      .select("status, amount")
      .eq("user_id", mockUserId),

    supabase
      .from("revenue_events")
      .select("amount, event_date, leads!inner(user_id)")
      .eq("leads.user_id", mockUserId)
      .order("event_date", { ascending: true })
      .limit(30),
  ]);

  const leads = (leadsResult.data || []) as Lead[];
  const subscriptions = (subscriptionsResult.data || []) as Subscription[];
  // @ts-ignore - Supabase type inference with inner joins can be complex
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

  // Calculate Pipeline Value
  const pipelineValue = leads.reduce(
    (sum, lead) => sum + (Number(lead.value_estimated) || 0),
    0
  );

  // 3. Define Metrics for Server Rendering (Icons allowed here)
  const metricCards = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12.5%", // You would calculate this by comparing prev month
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

  // 4. Prepare Pure Data for Client Component (NO ICONS/FUNCTIONS)
  // Only pass serializable JSON data (strings, numbers, arrays, plain objects)
  const clientChartData = {
    revenueSeries: revenueEvents.map((e) => ({
      x: new Date(e.event_date).toLocaleDateString(),
      y: e.amount,
    })),
    leadStatusCounts: leads.reduce((acc: any, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {}),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

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
