"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApexChart } from "@/components/admin/apex-chart";
// Import ApexOptions to fix the strict type checking error
import { ApexOptions } from "apexcharts";

interface DashboardClientProps {
  data: {
    revenueSeries: { x: string; y: number }[];
    leadStatusCounts: Record<string, number>;
  };
}

export function DashboardClient({ data }: DashboardClientProps) {
  // Chart 1: Revenue over time
  // Explicitly type this object as ApexOptions
  const revenueChartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: data.revenueSeries.map((d) => d.x),
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${value}`,
      },
    },
    colors: ["#2563eb"], // Primary blue
  };

  const revenueSeries = [
    {
      name: "Revenue",
      data: data.revenueSeries.map((d) => d.y),
    },
  ];

  // Chart 2: Lead Status Distribution
  const leadStatusLabels = Object.keys(data.leadStatusCounts);
  const leadStatusSeries = Object.values(data.leadStatusCounts);

  // Explicitly type this object as ApexOptions
  const leadChartOptions: ApexOptions = {
    chart: { type: "donut" },
    labels: leadStatusLabels,
    colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Income from subscriptions and one-time payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {data.revenueSeries.length > 0 ? (
            <ApexChart
              type="area"
              options={revenueChartOptions}
              series={revenueSeries}
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              No revenue data available
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Lead Status</CardTitle>
          <CardDescription>Current distribution of pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          {leadStatusSeries.length > 0 ? (
            <ApexChart
              type="donut"
              options={leadChartOptions}
              series={leadStatusSeries}
              height={350}
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              No lead data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
