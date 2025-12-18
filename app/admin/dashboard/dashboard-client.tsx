"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApexChart } from "@/components/admin/apex-chart";
import { KanbanBoard } from "@/components/admin/kanban-board";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  ArrowUpRight,
  Clock,
  Activity,
} from "lucide-react";
import { DropResult } from "@hello-pangea/dnd";

// ✅ Added explicit types to fix TS7006 and TS7031
export function DashboardClient({
  initialMetrics,
  initialLeads,
}: {
  initialMetrics: any;
  initialLeads: any[];
}) {
  const [pipelineData, setPipelineData] = useState(() =>
    processPipeline(initialLeads)
  );

  const revenueOptions: any = {
    chart: { toolbar: { show: false }, fontFamily: "var(--font-sans)" },
    colors: ["#3b82f6"],
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { formatter: (val: any) => `$${val}` } },
  };

  const revenueSeries = [
    {
      name: "Revenue",
      data: [0, 0, 99, 198, 297, initialMetrics?.totalRevenue || 0],
    },
  ];

  // ✅ Added type definition for the 'leads' parameter
  function processPipeline(leads: any[]) {
    // Safety check in case leads is null
    const safeLeads = Array.isArray(leads) ? leads : [];

    return [
      {
        id: "pending",
        title: "New Leads",
        color: "gray",
        items: safeLeads
          .filter((l) => l.status === "pending")
          .slice(0, 5)
          .map((l) => ({
            id: l.id,
            title: l.business_name,
            description: l.email || "No email",
            metadata: { score: l.quality_score || 0 },
          })),
      },
      {
        id: "generated",
        title: "Website Ready",
        color: "blue",
        items: safeLeads
          .filter((l) => l.status === "generated")
          .slice(0, 5)
          .map((l) => ({
            id: l.id,
            title: l.business_name,
            description: l.email || "No email",
            metadata: { industry: l.industry },
          })),
      },
      {
        id: "contacted",
        title: "Email Sent",
        color: "purple",
        items: safeLeads
          .filter((l) => l.status === "contacted")
          .slice(0, 5)
          .map((l) => ({
            id: l.id,
            title: l.business_name,
            description: l.email || "No email",
            metadata: { sent: "Email sent" },
          })),
      },
      {
        id: "subscribed",
        title: "Paid Customer",
        color: "green",
        items: safeLeads
          .filter((l) => l.status === "subscribed" || l.status === "delivered")
          .slice(0, 5)
          .map((l) => ({
            id: l.id,
            title: l.business_name,
            description: l.email || "No email",
            metadata: { mrr: "$99" },
          })),
      },
    ];
  }

  async function handleKanbanDragEnd(result: DropResult) {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId;

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your agency's performance.
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <ArrowUpRight className="w-4 h-4" />
          View Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Leads"
          value={initialMetrics?.totalLeads || 0}
          trend="+12%"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Conversion Rate"
          value={
            initialMetrics?.conversionRate
              ? `${initialMetrics.conversionRate}%`
              : "0%"
          }
          trend="+2.5%"
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${initialMetrics?.totalRevenue || 0}`}
          trend="+18%"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Active Customers"
          value={initialMetrics?.activeCustomers || 0}
          trend="stable"
          icon={Globe}
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border shadow-xs">
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ApexChart
              type="area"
              series={revenueSeries}
              options={revenueOptions}
              height={300}
            />
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {initialLeads &&
                initialLeads.slice(0, 4).map((lead: any, index: number) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        New lead added
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {lead.business_name}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      Just now
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Lead Pipeline</h2>
        {pipelineData.length > 0 ? (
          <KanbanBoard columns={pipelineData} onDragEnd={handleKanbanDragEnd} />
        ) : (
          <div className="p-12 text-center border-2 border-dashed rounded-xl bg-gray-50/50">
            <p className="text-muted-foreground">
              No leads in pipeline. Generate some test data to get started.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function MetricCard({ title, value, trend, icon: Icon, color }: any) {
  return (
    <Card className="border shadow-xs hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center border border-${color}-100`}
          >
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.startsWith("+")
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {trend}
          </span>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-sm text-muted-foreground mt-1">{title}</div>
      </CardContent>
    </Card>
  );
}
