'use client'

import { useEffect, useState } from 'react'
import { Loader2, Trophy, AlertTriangle, TrendingUp, Eye, MousePointerClick, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TemplatePerformance {
  name: string
  timesUsed: number
  sitesGenerated: number
  emailsSent: number
  openRate: number
  clickRate: number
  subscriptions: number
  conversionRate: number
  totalRevenue: number
  avgRevenuePerSite: number
}

export default function TemplatesPage() {
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState<TemplatePerformance[]>([])

  useEffect(() => {
    fetchTemplateData()
  }, [])

  const fetchTemplateData = async () => {
    try {
      setLoading(true)

      // Mock data - in production, this would come from API
      // API would aggregate data from sites, email_logs, subscriptions tables
      const mockData: TemplatePerformance[] = [
        {
          name: 'Service',
          timesUsed: 45,
          sitesGenerated: 45,
          emailsSent: 45,
          openRate: 42,
          clickRate: 28,
          subscriptions: 12,
          conversionRate: 26.7,
          totalRevenue: 1188,
          avgRevenuePerSite: 26.4,
        },
        {
          name: 'Restaurant',
          timesUsed: 32,
          sitesGenerated: 32,
          emailsSent: 32,
          openRate: 38,
          clickRate: 22,
          subscriptions: 8,
          conversionRate: 25.0,
          totalRevenue: 792,
          avgRevenuePerSite: 24.75,
        },
        {
          name: 'Professional',
          timesUsed: 28,
          sitesGenerated: 28,
          emailsSent: 28,
          openRate: 45,
          clickRate: 30,
          subscriptions: 10,
          conversionRate: 35.7,
          totalRevenue: 990,
          avgRevenuePerSite: 35.36,
        },
        {
          name: 'Retail',
          timesUsed: 18,
          sitesGenerated: 18,
          emailsSent: 18,
          openRate: 32,
          clickRate: 18,
          subscriptions: 4,
          conversionRate: 22.2,
          totalRevenue: 396,
          avgRevenuePerSite: 22.0,
        },
        {
          name: 'Modern',
          timesUsed: 22,
          sitesGenerated: 22,
          emailsSent: 22,
          openRate: 40,
          clickRate: 25,
          subscriptions: 9,
          conversionRate: 40.9,
          totalRevenue: 891,
          avgRevenuePerSite: 40.5,
        },
      ]

      setTemplates(mockData)
    } catch (error) {
      console.error('Error fetching template data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  // Find best and worst performers
  const bestByConversion = [...templates].sort((a, b) => b.conversionRate - a.conversionRate)[0]
  const bestByRevenue = [...templates].sort((a, b) => b.totalRevenue - a.totalRevenue)[0]
  const worstByConversion = [...templates].sort((a, b) => a.conversionRate - b.conversionRate)[0]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Template Performance</h1>
        <p className="text-gray-600 mt-1">Compare effectiveness across website templates</p>
      </div>

      {/* Best/Worst Performers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-900">
                Best Conversion
              </CardTitle>
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">{bestByConversion.name}</p>
            <p className="text-sm text-green-700 mt-1">
              {bestByConversion.conversionRate.toFixed(1)}% conversion rate
            </p>
            <p className="text-xs text-green-600 mt-2">
              {bestByConversion.subscriptions} subscriptions from {bestByConversion.timesUsed} sites
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-900">
                Highest Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-900">{bestByRevenue.name}</p>
            <p className="text-sm text-blue-700 mt-1">
              ${bestByRevenue.totalRevenue.toFixed(2)} total revenue
            </p>
            <p className="text-xs text-blue-600 mt-2">
              ${bestByRevenue.avgRevenuePerSite.toFixed(2)} avg per site
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-900">
                Needs Improvement
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-900">{worstByConversion.name}</p>
            <p className="text-sm text-red-700 mt-1">
              {worstByConversion.conversionRate.toFixed(1)}% conversion rate
            </p>
            <p className="text-xs text-red-600 mt-2">
              Consider redesigning or A/B testing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>Detailed metrics for each template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Template
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Used
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Open Rate
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Click Rate
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Conv. Rate
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Subscriptions
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templates
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .map((template, index) => (
                    <tr key={template.name} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{template.name}</span>
                          {index === 0 && (
                            <Badge className="bg-green-100 text-green-800">Best</Badge>
                          )}
                          {index === templates.length - 1 && (
                            <Badge className="bg-red-100 text-red-800">Worst</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900">
                        {template.timesUsed}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {template.openRate}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-purple-600 h-1.5 rounded-full"
                              style={{ width: `${template.openRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {template.clickRate}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-cyan-600 h-1.5 rounded-full"
                              style={{ width: `${template.clickRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge
                          className={
                            template.conversionRate >= 30
                              ? 'bg-green-100 text-green-800'
                              : template.conversionRate >= 20
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {template.conversionRate.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-medium text-gray-900">
                        {template.subscriptions}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${template.totalRevenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${template.avgRevenuePerSite.toFixed(2)}/site
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.name}>
            <CardHeader>
              <CardTitle>{template.name} Template</CardTitle>
              <CardDescription>Detailed performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Times Used</span>
                  <span className="font-semibold">{template.timesUsed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Open Rate</span>
                  </div>
                  <span className="font-semibold">{template.openRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-cyan-600" />
                    <span className="text-sm text-gray-600">Click Rate</span>
                  </div>
                  <span className="font-semibold">{template.clickRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Conversion</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {template.conversionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Total Revenue</span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    ${template.totalRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Avg per Site</span>
                  <span className="text-sm font-medium">
                    ${template.avgRevenuePerSite.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Suggested actions based on template performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
              <p className="font-medium text-green-900">
                🏆 {bestByConversion.name} template performs best
              </p>
              <p className="text-sm text-green-700 mt-1">
                Create more variations of this template and focus marketing on industries that use it
              </p>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
              <p className="font-medium text-blue-900">
                💰 {bestByRevenue.name} generates highest revenue
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Prioritize leads that would benefit from this template style
              </p>
            </div>

            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
              <p className="font-medium text-red-900">
                ⚠️ {worstByConversion.name} template needs improvement
              </p>
              <p className="text-sm text-red-700 mt-1">
                Consider redesigning this template or running A/B tests to improve conversion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
