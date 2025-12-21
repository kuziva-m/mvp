import { Suspense } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, DollarSign, Activity } from "lucide-react";

// Define interfaces for our data
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
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock_user_id")?.value;
  const supabase = await createClient();

  // 1. Fetch data for the selected business
  // We run these in parallel for performance
  const [leadsResult, subscriptionsResult, revenueResult] = await Promise.all([
    // Get Leads
    supabase
      .from("leads")
      .select("id, status, value_estimated")
      .eq("user_id", mockUserId),

    // Get Subscriptions
    supabase
      .from("subscriptions")
      .select("status, amount")
      .eq("user_id", mockUserId),

    // Get Revenue Events (To calculate total revenue)
    // Note: Since revenue_events links to leads, we usually join.
    // For simplicity with this schema, we assume we fetch events for leads owned by this user.
    supabase
      .from("revenue_events")
      .select("amount, leads!inner(user_id)")
      .eq("leads.user_id", mockUserId),
  ]);

  const leads = (leadsResult.data || []) as Lead[];
  const subscriptions = (subscriptionsResult.data || []) as Subscription[];
  // @ts-ignore - Supabase type inference with joins can be tricky, casting safely here
  const revenueEvents = (revenueResult.data || []).map((r: any) => ({
    amount: r.amount,
  })) as RevenueEvent[];

  // 2. Calculate Metrics
  const totalLeads = leads.length;
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  ).length;

  // Calculate Revenue
  const totalRevenue = revenueEvents.reduce(
    (sum, event) => sum + (Number(event.amount) || 0),
    0
  );

  // Calculate Pipeline Value (Estimated value of leads)
  const pipelineValue = leads.reduce(
    (sum, lead) => sum + (Number(lead.value_estimated) || 0),
    0
  );

  // 3. Prepare data for Client Component
  const dashboardData = {
    metrics: [
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        change: "+12.5%", // Placeholder - needs historical data to calculate real change
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
    ],
    // Pass raw data if charts need it
    chartData: revenueEvents.map((e, i) => ({
      name: `Event ${i}`,
      value: e.amount,
    })),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.metrics.map((metric) => (
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

      {/* Main Dashboard Client Component (Charts, etc) */}
      <Suspense fallback={<div>Loading charts...</div>}>
        <DashboardClient data={dashboardData} />
      </Suspense>
    </div>
  );
}
