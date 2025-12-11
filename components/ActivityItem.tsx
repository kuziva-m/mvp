'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  UserPlus,
  Mail,
  MailOpen,
  MousePointerClick,
  DollarSign,
  Rocket,
  LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

interface ActivityItemProps {
  type: 'lead_added' | 'email_sent' | 'email_opened' | 'email_clicked' | 'payment_received' | 'website_delivered'
  leadName: string
  leadId: string
  timestamp: string
  metadata?: Record<string, any>
}

const iconMap: Record<ActivityItemProps['type'], LucideIcon> = {
  lead_added: UserPlus,
  email_sent: Mail,
  email_opened: MailOpen,
  email_clicked: MousePointerClick,
  payment_received: DollarSign,
  website_delivered: Rocket,
}

const colorMap: Record<ActivityItemProps['type'], string> = {
  lead_added: 'bg-blue-100 text-blue-600',
  email_sent: 'bg-purple-100 text-purple-600',
  email_opened: 'bg-cyan-100 text-cyan-600',
  email_clicked: 'bg-orange-100 text-orange-600',
  payment_received: 'bg-green-100 text-green-600',
  website_delivered: 'bg-emerald-100 text-emerald-600',
}

const descriptionMap: Record<ActivityItemProps['type'], (name: string) => string> = {
  lead_added: (name) => `New lead added: ${name}`,
  email_sent: (name) => `Email sent to ${name}`,
  email_opened: (name) => `${name} opened email`,
  email_clicked: (name) => `${name} clicked link`,
  payment_received: (name) => `Payment received from ${name}`,
  website_delivered: (name) => `Website delivered to ${name}`,
}

export default function ActivityItem({
  type,
  leadName,
  leadId,
  timestamp,
}: ActivityItemProps) {
  const Icon = iconMap[type]
  const colorClass = colorMap[type]
  const description = descriptionMap[type](leadName)

  const relativeTime = formatDistanceToNow(new Date(timestamp), { addSuffix: true })

  return (
    <Link
      href={`/admin/leads/${leadId}`}
      className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className={`rounded-full p-2 ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{description}</p>
        <p className="text-xs text-gray-500">{relativeTime}</p>
      </div>
    </Link>
  )
}
