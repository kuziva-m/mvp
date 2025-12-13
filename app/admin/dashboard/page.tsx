'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ApexChart } from '@/components/admin/apex-chart'
import { KanbanBoard } from '@/components/admin/kanban-board'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Mail,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { ApexOptions } from 'apexcharts'
import { DropResult } from '@hello-pangea/dnd'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [pipelineData, setPipelineData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    try {
      const [metricsRes, leadsRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/leads'),
      ])

      const metricsData = await metricsRes.json()
      const leadsData = await leadsRes.json()

      setMetrics(metricsData)

      // Build pipeline from leads
      const leads = leadsData.leads || []

      const pipeline = [
        {
          id: 'pending',
          title: 'New Leads',
          color: 'gray',
          items: leads
            .filter((l: any) => l.status === 'pending')
            .slice(0, 5)
            .map((l: any) => ({
              id: l.id,
              title: l.business_name,
              description: l.email,
              metadata: { score: l.quality_score || 0 },
            })),
        },
        {
          id: 'generated',
          title: 'Website Ready',
          color: 'blue',
          items: leads
            .filter((l: any) => l.status === 'generated')
            .slice(0, 5)
            .map((l: any) => ({
              id: l.id,
              title: l.business_name,
              description: l.email,
              metadata: { industry: l.industry },
            })),
        },
        {
          id: 'contacted',
          title: 'Email Sent',
          color: 'purple',
          items: leads
            .filter((l: any) => l.status === 'contacted')
            .slice(0, 5)
            .map((l: any) => ({
              id: l.id,
              title: l.business_name,
              description: l.email,
              metadata: { sent: 'Email sent' },
            })),
        },
        {
          id: 'subscribed',
          title: 'Paid Customer',
          color: 'green',
          items: leads
            .filter((l: any) => l.status === 'subscribed' || l.status === 'delivered')
            .slice(0, 5)
            .map((l: any) => ({
              id: l.id,
              title: l.business_name,
              description: l.email,
              metadata: { mrr: '$99' },
            })),
        },
      ]

      setPipelineData(pipeline)

      // Build recent activity
      const activities = [
        ...leads
          .filter((l: any) => l.created_at)
          .slice(0, 2)
          .map((l: any) => ({
            icon: Users,
            label: 'New lead added',
            detail: l.business_name,
            time: getRelativeTime(l.created_at),
            color: 'blue',
          })),
        ...leads
          .filter((l: any) => l.status === 'generated')
          .slice(0, 2)
          .map((l: any) => ({
            icon: Globe,
            label: 'Website generated',
            detail: l.business_name,
            time: getRelativeTime(l.updated_at || l.created_at),
            color: 'purple',
          })),
        ...leads
          .filter((l: any) => l.email_sent_at)
          .slice(0, 2)
          .map((l: any) => ({
            icon: Mail,
            label: 'Email sent',
            detail: l.business_name,
            time: getRelativeTime(l.email_sent_at),
            color: 'green',
          })),
        ...leads
          .filter((l: any) => l.status === 'subscribed')
          .slice(0, 2)
          .map((l: any) => ({
            icon: DollarSign,
            label: 'Payment received',
            detail: `$99 from ${l.business_name}`,
            time: getRelativeTime(l.updated_at || l.created_at),
            color: 'orange',
          })),
      ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 6)

      setRecentActivity(activities.length > 0 ? activities : [
        { icon: Clock, label: 'No recent activity', detail: 'Get started by adding leads', time: 'Just now', color: 'gray' },
      ])

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  function getRelativeTime(timestamp: string) {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  async function handleKanbanDragEnd(result: DropResult) {
    if (!result.destination) return

    const leadId = result.draggableId
    const newStatus = result.destination.droppableId

    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })

    fetchAllData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const revenueOptions: ApexOptions = {
    chart: { toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
    colors: ['#3b82f6'],
    stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { opacityFrom: 0.7, opacityTo: 0.2 } },
    dataLabels: { enabled: false },
    grid: { borderColor: '#f1f5f9' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    yaxis: { labels: { formatter: (val) => `$${val}` } },
  }

  const revenueSeries = [{ name: 'Revenue', data: [0, 0, 99, 99, 99, metrics?.totalRevenue || 297] }]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <Button className="gap-2">
          <ArrowUpRight className="w-4 h-4" />
          View Full Report
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <div className="text-3xl font-bold">{metrics?.totalLeads || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Total Leads</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+2.5%</span>
            </div>
            <div className="text-3xl font-bold">{metrics?.conversionRate || 0}%</div>
            <div className="text-sm text-gray-600 mt-1">Conversion Rate</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+18%</span>
            </div>
            <div className="text-3xl font-bold">${metrics?.totalRevenue || 0}</div>
            <div className="text-sm text-gray-600 mt-1">MRR</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+{metrics?.activeCustomers || 0}</span>
            </div>
            <div className="text-3xl font-bold">{metrics?.activeCustomers || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Active Customers</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ApexChart type="area" series={revenueSeries} options={revenueOptions} height={300} />
        </CardContent>
      </Card>

      {/* Pipeline */}
      <div>
        <h2 className="text-xl font-bold mb-4">Pipeline</h2>
        {pipelineData.length > 0 && (
          <KanbanBoard columns={pipelineData} onDragEnd={handleKanbanDragEnd} />
        )}
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.label}</div>
                    <div className="text-sm text-gray-500">{activity.detail}</div>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
