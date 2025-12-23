"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { deleteLead } from "./actions"; // Import the action we just made
import { toast } from "sonner";

// Define the shape of your data
export type Lead = {
  id: string;
  business_name: string;
  industry: string;
  status: string;
  email: string;
  website: string | null;
  created_at: string;
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "business_name",
    header: "Business Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("business_name")}</div>
    ),
  },
  {
    accessorKey: "industry",
    header: "Industry",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "generated" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lead = row.original;

      const handleDelete = async () => {
        const confirmDelete = window.confirm(
          `Are you sure you want to delete ${lead.business_name}?`
        );
        if (!confirmDelete) return;

        const result = await deleteLead(lead.id);
        if (result.success) {
          toast.success("Lead deleted successfully");
        } else {
          toast.error("Failed to delete lead: " + result.error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(lead.id)}
            >
              Copy Lead ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <Link href={`/admin/leads/${lead.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                View Details <ArrowRight className="w-4 h-4 ml-auto" />
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              Delete Lead <Trash2 className="w-4 h-4 ml-auto" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
