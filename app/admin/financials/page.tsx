import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  CreditCard,
  Users,
} from "lucide-react";

export default async function FinancialsPage() {
  const cookieStore = await cookies();
  const mockUserId = cookieStore.get("mock_user_id")?.value;
  const supabase = await createClient();

  // 1. Fetch Revenue Data (One-time charges, subscription charges)
  const { data: revenueEvents } = await supabase
    .from("revenue_events")
    .select("amount, event_type, leads!inner(user_id)")
    .eq("leads.user_id", mockUserId);

  // 2. Fetch Subscription Data (MRR, Status)
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("amount, status, plan_name")
    .eq("user_id", mockUserId);

  // 3. Fetch Expenses (If you have an expenses table, otherwise 0)
  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount")
    .eq("related_to_customer", mockUserId); // Assuming expenses are linked or we check user_id if column exists

  // --- Calculations ---

  // Total Revenue (All time)
  const totalRevenue =
    revenueEvents?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;

  // Total Expenses
  const totalExpenses =
    expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0; // Currently 0 if table empty

  // Monthly Recurring Revenue (Active subscriptions only)
  const mrr =
    subscriptions
      ?.filter((s) => s.status === "active")
      .reduce((sum, s) => sum + Number(s.amount), 0) || 0;

  // Gross Profit
  const grossProfit = totalRevenue - totalExpenses;

  // Gross Margin %
  const grossMargin =
    totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : "0";

  // Counts
  const totalCustomers = new Set(revenueEvents?.map((e) => e.leads)).size || 0; // Unique paying customers approx
  const activeSubs =
    subscriptions?.filter((s) => s.status === "active").length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <p className="text-gray-600 mt-1">
          Revenue, expenses, and profitability overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">All-time collected</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-blue-600" />
              MRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              ${mrr.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">Monthly Recurring</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Gross Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                grossProfit >= 0 ? "text-purple-600" : "text-red-600"
              }`}
            >
              ${grossProfit.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-1">{grossMargin}% Margin</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-orange-600" />
              Active Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {activeSubs}
            </div>
            <p className="text-sm text-gray-600 mt-1">Paying customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdowns / Details could go here */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueEvents && revenueEvents.length > 0 ? (
            <div className="space-y-4">
              {revenueEvents.slice(0, 5).map((event: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between border-b pb-2 last:border-0"
                >
                  <span className="capitalize">
                    {event.event_type.replace("_", " ")}
                  </span>
                  <span className="font-bold text-green-600">
                    +${event.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No revenue recorded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
