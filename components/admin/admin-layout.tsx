'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { KeyboardShortcuts } from './keyboard-shortcuts'
import { useLayoutStore } from '@/lib/stores/layout-store'
import { cn } from '@/lib/utils'

export function AdminLayout({ children }: { children: ReactNode }) {
  const { sidebarCollapsed } = useLayoutStore()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <KeyboardShortcuts />
      <Sidebar />

      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-[280px]'
        )}
      >
        <TopNav />

        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
