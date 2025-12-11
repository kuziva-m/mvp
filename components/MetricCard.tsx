'use client'

import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MetricCardProps {
  title: string
  value: string | number
  trend?: number
  icon?: LucideIcon
  color?: string
  subtitle?: string
}

export default function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  color = 'text-blue-600',
  subtitle,
}: MetricCardProps) {
  const trendPositive = trend !== undefined && trend >= 0
  const trendColor = trendPositive ? 'text-green-600' : 'text-red-600'
  const TrendIcon = trendPositive ? ArrowUp : ArrowDown

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${color}`} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs ${trendColor} mt-1`}>
            <TrendIcon className="h-3 w-3 mr-1" />
            <span>{Math.abs(trend).toFixed(1)}%</span>
            <span className="text-gray-500 ml-1">vs last period</span>
          </div>
        )}
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
