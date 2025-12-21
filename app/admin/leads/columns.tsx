"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Mail, MousePointer2, ExternalLink } from "lucide-react";
import { simulateSaleAction } from "./actions"; // Ensure this action exists from previous step

export type Lead = {
  id: string;
  business_name: string;
  email: string;
  status: string;
  source: string;
  email_opened_at: string | null;
  email_clicked_at: string | null;
  created_at: string;
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "business_name",
    header: "Business",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      // Color coding status
      const color =
        status === "subscribed"
          ? "bg-green-500"
          : status === "contacted"
          ? "bg-blue-500"
          : status === "churned"
          ? "bg-red-500"
          : "bg-gray-500";
      return (
        <Badge className={`${color} text-white hover:${color}`}>{status}</Badge>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = (row.getValue("source") as string) || "Manual";
      return <Badge variant="outline">{source}</Badge>;
    },
  },
  {
    id: "engagement",
    header: "Engagement",
    cell: ({ row }) => {
      const opened = !!row.original.email_opened_at;
      const clicked = !!row.original.email_clicked_at;

      return (
        <div className="flex gap-3 text-gray-500">
          <div
            title={opened ? "Email Opened" : "Not Opened"}
            className={opened ? "text-blue-600" : "opacity-30"}
          >
            <Mail className="h-4 w-4" />
          </div>
          <div
            title={clicked ? "Link Clicked" : "Not Clicked"}
            className={clicked ? "text-green-600" : "opacity-30"}
          >
            <MousePointer2 className="h-4 w-4" />
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={async () => {
            // Logic to simulate a sale for testing without API
            if (confirm("Simulate Stripe Payment for this lead?")) {
              await simulateSaleAction(row.original.id);
            }
          }}
        >
          Simulate Sale $$$
        </Button>
      );
    },
  },
];
