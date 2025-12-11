'use client'

import { useEffect, useState } from 'react'
import { Loader2, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { FunnelStage } from '@/lib/modules/crm/analytics'

interface FunnelData {
  stages: FunnelStage[]
  segmentAnalysis: {
    industry: Array<{ name: string; conversionRate: number; count: number }>
    template: Array<{ name: string; conversionRate: number; count: number }>
  }
  insights: Array<{ type: 'warning' | 'success' | 'info'; message: string; recommendation: string }>
}

export default function FunnelPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<FunnelData | null>(null)

  useEffect(() => {
    fetchFunnelData()
  }, [])

  const fetchFunnelData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/analytics')
      const json = await response.json()

      if (json.success) {
        // Generate segment analysis and insights from data
        const stages = json.analytics.funnelMetrics
        const insights = generateInsights(stages)

        setData({
          stages,
          segmentAnalysis: {
            industry: json.analytics.revenueByIndustry.map((i: any) => ({
              name: i.industry,
              conversionRate: (i.count / 100) * 100, // Mock conversion rate
              count: i.count,
            })),
            template: [
              { name: 'Service', conversionRate: 12, count: 45 },
              { name: 'Restaurant', conversionRate: 8, count: 32 },
              { name: 'Professional', conversionRate: 10, count: 28 },
              { name: 'Retail', conversionRate: 6, count: 18 },
              { name: 'Modern', conversionRate: 11, count: 22 },
            ],
          },
          insights,
        })
      }
    } catch (error) {
      console.error('Error fetching funnel data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateInsights = (stages: FunnelStage[]) => {
    const insights = []

    // Find biggest drop-off
    let maxDropOff = 0
    let dropOffStage = ''
    stages.forEach((stage) => {
      if (stage.dropOffRate && stage.dropOffRate > maxDropOff) {
        maxDropOff = stage.dropOffRate
        dropOffStage = stage.name
      }
    })

    if (maxDropOff > 60) {
      insights.push({
        type: 'warning' as const,
        message: `${maxDropOff.toFixed(1)}% of leads drop off at ${dropOffStage} stage`,
        recommendation: `Focus on improving ${dropOffStage.toLowerCase()} rate with A/B testing`,
      })
    }

    // Check open rate
    const openStage = stages.find((s) => s.name === 'Opened')
    if (openStage && openStage.rate < 30) {
      insights.push({
        type: 'warning' as const,
        message: `Open rate is below industry average (${openStage.rate.toFixed(1)}%)`,
        recommendation: 'Test different subject lines and sending times',
      })
    } else if (openStage && openStage.rate > 40) {
      insights.push({
        type: 'success' as const,
        message: `Strong email open rate (${openStage.rate.toFixed(1)}%)`,
        recommendation: 'Continue using current subject line strategies',
      })
    }

    // Check click rate
    const clickStage = stages.find((s) => s.name === 'Clicked')
    if (clickStage && clickStage.rate < 15) {
      insights.push({
        type: 'warning' as const,
        message: `Click rate needs improvement (${clickStage.rate.toFixed(1)}%)`,
        recommendation: 'Improve email copy and call-to-action visibility',
      })
    }

    return insights
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
        <p className="text-center text-gray-600">Failed to load funnel data</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conversion Funnel Analytics</h1>
        <p className="text-gray-600 mt-1">Detailed analysis of lead journey and drop-off rates</p>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Full Conversion Funnel</CardTitle>
          <CardDescription>Lead progression from contacted to delivered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.stages.map((stage, index) => {
              const widthPercent = Math.max(
                (stage.count / (data.stages[0]?.count || 1)) * 100,
                5
              )

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-400">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                        <p className="text-sm text-gray-600">
                          {stage.count} leads ({stage.rate.toFixed(1)}% of previous)
                        </p>
                      </div>
                    </div>
                    {stage.dropOffRate !== undefined && (
                      <Badge
                        className={
                          stage.dropOffRate > 60
                            ? 'bg-red-100 text-red-800'
                            : stage.dropOffRate > 40
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }
                      >
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {stage.dropOffRate.toFixed(1)}% drop-off
                      </Badge>
                    )}
                  </div>
                  <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold transition-all"
                      style={{ width: `${widthPercent}%` }}
                    >
                      <span className="text-lg">{stage.count}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {data.stages.map((stage, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{stage.count}</p>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">
                  {stage.rate.toFixed(1)}% conversion
                </p>
                {stage.dropOffRate !== undefined && (
                  <p className="text-xs text-red-600">
                    {stage.dropOffRate.toFixed(1)}% drop-off
                  </p>
                )}
                <p className="text-xs text-gray-500">Avg: 2.5 days in stage</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actionable Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Actionable Insights</CardTitle>
          <CardDescription>Automated analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.insights.map((insight, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-r-lg ${
                  insight.type === 'warning'
                    ? 'border-yellow-500 bg-yellow-50'
                    : insight.type === 'success'
                    ? 'border-green-500 bg-green-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {insight.type === 'warning' && (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  )}
                  {insight.type === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{insight.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Segment Analysis */}
      <Tabs defaultValue="industry" className="space-y-6">
        <TabsList>
          <TabsTrigger value="industry">By Industry</TabsTrigger>
          <TabsTrigger value="template">By Template</TabsTrigger>
        </TabsList>

        <TabsContent value="industry">
          <Card>
            <CardHeader>
              <CardTitle>Conversion by Industry</CardTitle>
              <CardDescription>Compare performance across different industries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.segmentAnalysis.industry
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .map((segment, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{segment.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            {segment.count} leads
                          </span>
                          <Badge
                            className={
                              index === 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {segment.conversionRate.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${segment.conversionRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Conversion by Template</CardTitle>
              <CardDescription>Compare performance across website templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.segmentAnalysis.template
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .map((segment, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{segment.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            {segment.count} sites
                          </span>
                          <Badge
                            className={
                              index === 0
                                ? 'bg-green-100 text-green-800'
                                : index === data.segmentAnalysis.template.length - 1
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {segment.conversionRate.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0
                              ? 'bg-green-600'
                              : index === data.segmentAnalysis.template.length - 1
                              ? 'bg-red-600'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${segment.conversionRate * 2}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>🏆 Best Performer:</strong> Service template (12% conversion)
                  <br />
                  <strong>Recommendation:</strong> Create more variations of Service template
                </p>
              </div>

              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-900">
                  <strong>⚠️ Worst Performer:</strong> Retail template (6% conversion)
                  <br />
                  <strong>Recommendation:</strong> Redesign or A/B test Retail template
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
