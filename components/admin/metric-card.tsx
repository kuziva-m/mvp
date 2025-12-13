'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor: string
  trend?: number[] // For sparkline
  delay?: number
}

export function MetricCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor,
  trend,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
        {/* Background gradient */}
        <div className={cn(
          'absolute inset-0 opacity-5',
          iconColor === 'blue' && 'bg-gradient-to-br from-blue-400 to-blue-600',
          iconColor === 'purple' && 'bg-gradient-to-br from-purple-400 to-purple-600',
          iconColor === 'green' && 'bg-gradient-to-br from-green-400 to-green-600',
          iconColor === 'orange' && 'bg-gradient-to-br from-orange-400 to-orange-600',
          iconColor === 'red' && 'bg-gradient-to-br from-red-400 to-red-600',
        )} />

        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            <motion.div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                iconColor === 'blue' && 'bg-blue-100',
                iconColor === 'purple' && 'bg-purple-100',
                iconColor === 'green' && 'bg-green-100',
                iconColor === 'orange' && 'bg-orange-100',
                iconColor === 'red' && 'bg-red-100',
              )}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon className={cn(
                'w-6 h-6',
                iconColor === 'blue' && 'text-blue-600',
                iconColor === 'purple' && 'text-purple-600',
                iconColor === 'green' && 'text-green-600',
                iconColor === 'orange' && 'text-orange-600',
                iconColor === 'red' && 'text-red-600',
              )} />
            </motion.div>

            {/* Change badge */}
            {change && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.2, type: 'spring' }}
                className={cn(
                  'text-sm font-medium px-2 py-1 rounded-full',
                  changeType === 'positive' && 'text-green-700 bg-green-100',
                  changeType === 'negative' && 'text-red-700 bg-red-100',
                  changeType === 'neutral' && 'text-gray-700 bg-gray-100',
                )}
              >
                {change}
              </motion.span>
            )}
          </div>

          {/* Value */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.1 }}
            className="text-3xl font-bold text-gray-900 mb-1"
          >
            {value}
          </motion.div>

          {/* Label */}
          <div className="text-sm text-gray-600">{label}</div>

          {/* Sparkline */}
          {trend && (
            <div className="mt-4 h-8 flex items-end gap-1">
              {trend.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / Math.max(...trend)) * 100}%` }}
                  transition={{ delay: delay + 0.2 + (index * 0.05), duration: 0.4 }}
                  className={cn(
                    'flex-1 rounded-t',
                    iconColor === 'blue' && 'bg-blue-200',
                    iconColor === 'purple' && 'bg-purple-200',
                    iconColor === 'green' && 'bg-green-200',
                    iconColor === 'orange' && 'bg-orange-200',
                    iconColor === 'red' && 'bg-red-200',
                  )}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
