'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useLayoutStore } from '@/lib/stores/layout-store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Globe,
  Mail,
  CreditCard,
  Settings,
  BarChart3,
  Headphones,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign,
  Heart,
  Palette,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Lead Magnet', icon: Sparkles, href: '/admin/lead-magnet' },
  { label: 'Lead Generation', icon: Zap, href: '/admin/lead-gen' },
  { label: 'Leads', icon: Users, href: '/admin/leads' },
  { label: 'Websites', icon: Globe, href: '/admin/websites' },
  { label: 'QA Queue', icon: ClipboardCheck, href: '/admin/qa' },
  { label: 'Email Campaigns', icon: Mail, href: '/admin/email-templates' },
  { label: 'Subscriptions', icon: CreditCard, href: '/admin/subscriptions' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Financials', icon: DollarSign, href: '/admin/financials' },
  { label: 'Customer Success', icon: Heart, href: '/admin/customer-success' },
  { label: 'Support', icon: Headphones, href: '/admin/support' },
  { label: 'Diagnostics', icon: AlertTriangle, href: '/admin/diagnostics' },
  { label: 'Workers', icon: Settings, href: '/admin/workers' },
]

export function Sidebar() {
  const { sidebarCollapsed, collapseSidebar } = useLayoutStore()
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{
        width: sidebarCollapsed ? 80 : 280,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 border-r border-gray-700"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">WebGen Pro</span>
            </motion.div>
          ) : (
            <motion.div
              key="logo-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto"
            >
              <Globe className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {!sidebarCollapsed && (
          <button
            onClick={collapseSidebar}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Collapse button (when collapsed) */}
      {sidebarCollapsed && (
        <div className="absolute -right-3 top-20">
          <button
            onClick={collapseSidebar}
            className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Menu Items */}
      <nav className="mt-4 px-3 space-y-1 overflow-y-auto h-[calc(100vh-5rem)] custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer',
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </motion.aside>
  )
}
