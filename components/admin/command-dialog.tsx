'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog as CmdDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
  Sparkles,
  DollarSign,
  Heart,
  Palette,
  ClipboardCheck,
} from 'lucide-react'

const commands = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', keywords: ['home', 'overview'] },
  { icon: Sparkles, label: 'Lead Magnet', href: '/admin/lead-magnet', keywords: ['ads', 'facebook', 'funnel'] },
  { icon: Zap, label: 'Lead Generation', href: '/admin/lead-gen', keywords: ['crawlers', 'scraping', 'clay'] },
  { icon: Users, label: 'Leads', href: '/admin/leads', keywords: ['customers', 'prospects'] },
  { icon: Globe, label: 'Websites', href: '/admin/websites', keywords: ['sites', 'generated'] },
  { icon: ClipboardCheck, label: 'QA Queue', href: '/admin/qa', keywords: ['quality', 'review'] },
  { icon: Mail, label: 'Email Campaigns', href: '/admin/email-templates', keywords: ['emails', 'templates'] },
  { icon: CreditCard, label: 'Subscriptions', href: '/admin/subscriptions', keywords: ['billing', 'revenue', 'payments'] },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', keywords: ['stats', 'metrics'] },
  { icon: DollarSign, label: 'Financials', href: '/admin/financials', keywords: ['money', 'profit'] },
  { icon: Heart, label: 'Customer Success', href: '/admin/customer-success', keywords: ['retention', 'churn'] },
  { icon: Headphones, label: 'Support', href: '/admin/support', keywords: ['tickets', 'help'] },
  { icon: Settings, label: 'Workers', href: '/admin/workers', keywords: ['jobs', 'queue'] },
]

interface CommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandDialog({ open, onOpenChange }: CommandDialogProps) {
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  function handleSelect(href: string) {
    router.push(href)
    onOpenChange(false)
  }

  return (
    <CmdDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {commands.map((cmd) => {
            const Icon = cmd.icon
            return (
              <CommandItem
                key={cmd.href}
                onSelect={() => handleSelect(cmd.href)}
                className="flex items-center gap-3"
              >
                <Icon className="w-4 h-4" />
                <span>{cmd.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CmdDialog>
  )
}
