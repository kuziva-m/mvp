"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Sidebar } from "./sidebar";
import { KeyboardShortcuts } from "./keyboard-shortcuts";
import { useLayoutStore } from "@/lib/stores/layout-store";

// Dynamic import for TopNav to prevent hydration mismatch
const TopNav = dynamic(() => import("./top-nav").then((mod) => mod.TopNav), {
  ssr: false,
  loading: () => (
    <div className="h-16 border-b bg-background/95 backdrop-blur-md" />
  ),
});

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useLayoutStore();

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-muted/10 relative">
      {/* 1. Desktop Sidebar Container 
        - Hidden on mobile (lg:flex)
        - Fixed position so it stays while scrolling
        - Width 72 (w-72) to match standard sidebar width
        - Z-index 50 to stay above content
      */}
      <div className="hidden lg:flex h-full w-72 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* 2. Main Content Wrapper 
        - Padded left (lg:pl-72) to make room for the fixed sidebar
        - Flex column to organize TopNav and Children
      */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40">
          <TopNav />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={toggleSidebar}
          />

          {/* Mobile Sidebar */}
          <div className="relative flex w-72 flex-col h-full bg-background border-r shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      <KeyboardShortcuts />
    </div>
  );
}
