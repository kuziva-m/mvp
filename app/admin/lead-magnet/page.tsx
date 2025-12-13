'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Stats {
  totalSubmissions: number
  totalGenerated: number
  totalConverted: number
  conversionRate: number
  revenue: number
  costPerLead: number
  roi: number
  campaignBreakdown: Array<{
    id: string
    name: string
    platform: string
    submissions: number
    adSpend: number
    costPerLead: number
  }>
  funnelMetrics: {
    visited: number
    formStarted: number
    formCompleted: number
    generated: number
    delivered: number
    previewVisited: number
    ctaClicked: number
    converted: number
  }
}

interface Submission {
  id: string
  business_name: string
  email: string
  status: string
  created_at: string
  utm_source?: string
  utm_campaign?: string
  campaign?: {
    name: string
    platform: string
  }
  lead?: {
    business_name: string
    email: string
  }
  site?: {
    subdomain: string
    status: string
  }
}

export default function LeadMagnetDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [filter])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/lead-magnet/stats')
      const statsData = await statsRes.json()
      setStats(statsData)

      // Fetch submissions
      const submissionsRes = await fetch(`/api/admin/lead-magnet/submissions?status=${filter}`)
      const submissionsData = await submissionsRes.json()
      setSubmissions(submissionsData.submissions || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const funnelSteps = [
    { label: 'Visited', count: stats.funnelMetrics.visited, color: 'bg-blue-500' },
    { label: 'Started Form', count: stats.funnelMetrics.formStarted, color: 'bg-indigo-500' },
    { label: 'Completed', count: stats.funnelMetrics.formCompleted, color: 'bg-purple-500' },
    { label: 'Generated', count: stats.funnelMetrics.generated, color: 'bg-pink-500' },
    { label: 'Delivered', count: stats.funnelMetrics.delivered, color: 'bg-rose-500' },
    { label: 'Viewed Preview', count: stats.funnelMetrics.previewVisited, color: 'bg-orange-500' },
    { label: 'Clicked CTA', count: stats.funnelMetrics.ctaClicked, color: 'bg-amber-500' },
    { label: 'Converted', count: stats.funnelMetrics.converted, color: 'bg-green-500' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lead Magnet Analytics</h1>
        <p className="text-gray-600">Track your paid advertising funnel performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalGenerated} websites generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalConverted} converted to paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.costPerLead.toFixed(2)} cost per lead
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {stats.roi > 0 ? (
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              )}
              {stats.roi}%
            </div>
            <p className="text-xs text-muted-foreground">
              Return on ad spend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Track drop-off at each step</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelSteps.map((step, index) => {
              const maxCount = stats.funnelMetrics.visited || 1
              const percentage = (step.count / maxCount) * 100
              const dropOff = index > 0
                ? ((funnelSteps[index - 1].count - step.count) / funnelSteps[index - 1].count) * 100
                : 0

              return (
                <div key={step.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{step.label}</span>
                    <span className="text-gray-600">
                      {step.count} ({percentage.toFixed(1)}%)
                      {index > 0 && dropOff > 0 && (
                        <span className="text-red-600 ml-2">
                          -{dropOff.toFixed(1)}% drop-off
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${step.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      {stats.campaignBreakdown.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Compare campaign effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.campaignBreakdown.map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-gray-600">
                      <Badge variant="outline">{campaign.platform}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{campaign.submissions} submissions</div>
                    <div className="text-sm text-gray-600">
                      ${campaign.adSpend.toFixed(2)} spend • ${campaign.costPerLead.toFixed(2)}/lead
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Latest lead magnet funnel entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="visited">Visited</TabsTrigger>
              <TabsTrigger value="form_started">Started</TabsTrigger>
              <TabsTrigger value="form_completed">Completed</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="converted">Converted</TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No submissions found</p>
                ) : (
                  submissions.slice(0, 20).map(submission => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="font-medium">{submission.business_name}</div>
                        <div className="text-sm text-gray-600">{submission.email}</div>
                        {submission.campaign && (
                          <div className="text-xs text-gray-500 mt-1">
                            Campaign: {submission.campaign.name} ({submission.campaign.platform})
                          </div>
                        )}
                        {submission.utm_campaign && (
                          <div className="text-xs text-gray-500">
                            {submission.utm_source} • {submission.utm_campaign}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          submission.status === 'converted' ? 'default' :
                          submission.status === 'delivered' ? 'secondary' :
                          'outline'
                        }>
                          {submission.status}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </div>
                        {submission.site && (
                          <div className="text-xs text-blue-600 mt-1">
                            {submission.site.subdomain}.mvp-agency.com
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
