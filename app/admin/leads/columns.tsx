"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// Define the shape of our Lead data
export type Lead = {
  id: string;
  business_name: string;
  email: string;
  status: string;
  industry: string;
  created_at: string;
  website_url?: string;
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "business_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Business Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // THIS LINK IS CRITICAL - It lets you navigate to the detail page
      return (
        <Link
          href={`/admin/leads/${row.original.id}`}
          className="font-medium hover:underline text-blue-600"
        >
          {row.getValue("business_name")}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "new" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "industry",
    header: "Industry",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "website_url",
    header: "Website",
    cell: ({ row }) => {
      const url = row.getValue("website_url") as string;
      if (!url) return <span className="text-muted-foreground">-</span>;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          View <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      );
    },
  },
];
