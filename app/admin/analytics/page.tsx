'use client'

import { useEffect, useState } from 'react'
import { Loader2, TrendingUp, TrendingDown, DollarSign, Users, Target, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import MetricCard from '@/components/MetricCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metrics } from '@/lib/modules/crm/analytics'

interface AnalyticsData {
  metrics: Metrics
  leadsOverTime: Array<{ date: string; count: number }>
  revenueOverTime: Array<{ month: string; revenue: number; subscriptions: number }>
  funnelMetrics: Array<{ name: string; count: number; rate: number; dropOffRate?: number }>
  revenueByIndustry: Array<{ industry: string; revenue: number; count: number }>
  bestSubjects: Array<{ subject: string; opens: number; total: number; openRate: number }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics')
      const json = await response.json()

      if (json.success) {
        setData(json.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (!data) return

    const csv = [
      ['Metric', 'Value'],
      ['Total Leads', data.metrics.totalLeads],
      ['Total Contacted', data.metrics.totalContacted],
      ['Total Opened', data.metrics.totalOpened],
      ['Total Clicked', data.metrics.totalClicked],
      ['Total Subscribed', data.metrics.totalSubscribed],
      ['MRR', `$${data.metrics.mrr.toFixed(2)}`],
      ['ARR', `$${data.metrics.arr.toFixed(2)}`],
      ['Conversion Rate', `${data.metrics.conversionRate.toFixed(2)}%`],
      ['Open Rate', `${data.metrics.openRate.toFixed(2)}%`],
      ['Click Rate', `${data.metrics.clickRate.toFixed(2)}%`],
      ['LTV', `$${data.metrics.ltv.toFixed(2)}`],
      ['CAC', `$${data.metrics.cac.toFixed(2)}`],
      ['Churn Rate', `${data.metrics.churnRate.toFixed(2)}%`],
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-600">Failed to load analytics data</p>
      </div>
    )
  }

  const ltvCacRatio = data.metrics.cac > 0 ? data.metrics.ltv / data.metrics.cac : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Metrics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business intelligence</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Leads"
          value={data.metrics.totalLeads}
          icon={Users}
          color="text-blue-600"
          subtitle="All time"
        />
        <MetricCard
          title="MRR"
          value={`$${data.metrics.mrr.toFixed(2)}`}
          icon={DollarSign}
          color="text-green-600"
          subtitle={`ARR: $${data.metrics.arr.toFixed(2)}`}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.metrics.conversionRate.toFixed(1)}%`}
          icon={Target}
          color="text-purple-600"
          subtitle={`${data.metrics.totalSubscribed} subscribed`}
        />
        <MetricCard
          title="Active Subscriptions"
          value={data.metrics.activeSubscriptions}
          icon={TrendingUp}
          color="text-emerald-600"
          subtitle={`${data.metrics.totalCanceled} canceled`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Churn Rate"
          value={`${data.metrics.churnRate.toFixed(1)}%`}
          icon={TrendingDown}
          color="text-red-600"
        />
        <MetricCard
          title="LTV (Lifetime Value)"
          value={`$${data.metrics.ltv.toFixed(2)}`}
          icon={DollarSign}
          color="text-blue-600"
          subtitle="Per customer"
        />
        <MetricCard
          title="CAC (Acquisition Cost)"
          value={`$${data.metrics.cac.toFixed(2)}`}
          icon={DollarSign}
          color="text-orange-600"
          subtitle="Per customer"
        />
        <MetricCard
          title="LTV:CAC Ratio"
          value={ltvCacRatio.toFixed(1) + ':1'}
          icon={TrendingUp}
          color={ltvCacRatio >= 3 ? 'text-green-600' : 'text-yellow-600'}
          subtitle={ltvCacRatio >= 3 ? 'Healthy' : 'Needs improvement'}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="email">Email Performance</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MRR Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>MRR Over Time</CardTitle>
                <CardDescription>Monthly Recurring Revenue trend</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Industry */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Industry</CardTitle>
                <CardDescription>Distribution of revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.revenueByIndustry}
                      dataKey="revenue"
                      nameKey="industry"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {data.revenueByIndustry.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Stats */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${data.metrics.mrr.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Monthly</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ARR Projection</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${data.metrics.arr.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Annual</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Revenue/Lead</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${data.metrics.avgRevenuePerLead.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Per lead</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Growth Rate</p>
                    <p className="text-2xl font-bold text-green-600">+12.5%</p>
                    <p className="text-xs text-gray-500">vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Tab */}
        <TabsContent value="conversion" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Leads Over Time</CardTitle>
                <CardDescription>Lead generation trend (30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.leadsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Leads" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Conversion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
                <CardDescription>Stage-by-stage performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Open Rate</span>
                      <span className="text-sm font-bold">
                        {data.metrics.openRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${data.metrics.openRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Click Rate</span>
                      <span className="text-sm font-bold">
                        {data.metrics.clickRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-cyan-600 h-2 rounded-full"
                        style={{ width: `${data.metrics.clickRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Subscribe Rate</span>
                      <span className="text-sm font-bold">
                        {data.metrics.clickToSubscribeRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${data.metrics.clickToSubscribeRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Overall Conversion</span>
                      <span className="text-sm font-bold">
                        {data.metrics.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${data.metrics.conversionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Performance Tab */}
        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Emails Sent"
              value={data.metrics.totalContacted}
              subtitle="Total sent"
            />
            <MetricCard
              title="Open Rate"
              value={`${data.metrics.openRate.toFixed(1)}%`}
              subtitle={`${data.metrics.totalOpened} opened`}
            />
            <MetricCard
              title="Click Rate"
              value={`${data.metrics.clickRate.toFixed(1)}%`}
              subtitle={`${data.metrics.totalClicked} clicked`}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Best Performing Subject Lines</CardTitle>
              <CardDescription>Top 5 subject lines by open rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.bestSubjects.map((subject, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{subject.subject}</p>
                      <span className="text-sm font-bold text-green-600">
                        {subject.openRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{subject.opens} opens</span>
                      <span>•</span>
                      <span>{subject.total} sent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${subject.openRate}%` }}
                      />
                    </div>
                  </div>
                ))}
                {data.bestSubjects.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No email data available yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Lead journey from contacted to delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.funnelMetrics} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.funnelMetrics.map((stage, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stage.count}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {stage.rate.toFixed(1)}% of previous
                  </p>
                  {stage.dropOffRate !== undefined && (
                    <p className="text-xs text-red-600 mt-1">
                      {stage.dropOffRate.toFixed(1)}% drop-off
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
