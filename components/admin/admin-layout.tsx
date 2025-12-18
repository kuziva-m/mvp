"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic"; // 1. Add dynamic import
import { Sidebar } from "./sidebar";
import { KeyboardShortcuts } from "./keyboard-shortcuts";
import { useLayoutStore } from "@/lib/stores/layout-store";

// 2. Fix Hydration Mismatch: Load TopNav only on client
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

  // 3. Fix TypeScript Errors: Use correct store properties
  // sidebarOpen = isMobileMenuOpen
  // toggleSidebar = closeMobileMenu (toggles it off)
  const { sidebarOpen, toggleSidebar } = useLayoutStore();

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-muted/10">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
          <TopNav />

          <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <KeyboardShortcuts />
    </div>
  );
}
