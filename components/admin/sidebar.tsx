"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLayoutStore } from "@/lib/stores/layout-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Globe,
  BarChart3,
  Settings,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Search,
  Magnet,
  HeartHandshake,
  DollarSign,
  Mail,
  Cpu,
  ClipboardCheck,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  businessName?: string | null;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },

  // Growth Tools
  { icon: Search, label: "Lead Gen", href: "/admin/lead-gen" },
  { icon: Magnet, label: "Lead Magnet", href: "/admin/lead-magnet" },
  { icon: Users, label: "Leads", href: "/admin/leads" },

  // Production
  { icon: Globe, label: "Websites", href: "/admin/websites" },
  { icon: Mail, label: "Email Templates", href: "/admin/email-templates" },

  // Operations & Success
  {
    icon: HeartHandshake,
    label: "Customer Success",
    href: "/admin/customer-success",
  },
  { icon: MessageSquare, label: "Support", href: "/admin/support" },
  { icon: ClipboardCheck, label: "QA Reviews", href: "/admin/qa" },

  // Business
  { icon: DollarSign, label: "Financials", href: "/admin/financials" },
  { icon: CreditCard, label: "Subscriptions", href: "/admin/subscriptions" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },

  // System
  { icon: Cpu, label: "Workers", href: "/admin/workers" },
  { icon: Activity, label: "Diagnostics", href: "/admin/diagnostics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function Sidebar({ businessName }: SidebarProps) {
  const { sidebarCollapsed: isCollapsed, collapseSidebar: toggleCollapse } =
    useLayoutStore();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="fixed left-0 top-0 z-40 h-screen bg-card border-r border-border flex flex-col"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-lg truncate"
            >
              {businessName || "Admin Panel"}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-md hover:bg-accent text-muted-foreground"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon
                size={20}
                className={
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }
              />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border shadow-sm">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Info */}
      <div className="p-4 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
            {businessName ? businessName[0].toUpperCase() : "A"}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">
                {businessName || "Admin"}
              </span>
              <span className="text-xs text-muted-foreground">
                Business Account
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
