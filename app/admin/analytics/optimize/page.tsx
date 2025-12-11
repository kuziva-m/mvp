'use client'

import { useEffect, useState } from 'react'
import { Loader2, Mail, Target, DollarSign, Settings, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Metrics } from '@/lib/modules/crm/analytics'

interface OptimizationInsight {
  category: 'email' | 'quality' | 'revenue' | 'efficiency'
  type: 'success' | 'warning' | 'info'
  title: string
  description: string
  recommendations: string[]
  impact: 'high' | 'medium' | 'low'
}

export default function OptimizePage() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [insights, setInsights] = useState<OptimizationInsight[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/metrics')
      const data = await response.json()

      if (data.success) {
        setMetrics(data.metrics)
        generateInsights(data.metrics)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateInsights = (metrics: Metrics) => {
    const insights: OptimizationInsight[] = []

    // Email Optimization
    const industryOpenAvg = 25
    const industryClickAvg = 20

    if (metrics.openRate >= industryOpenAvg) {
      insights.push({
        category: 'email',
        type: 'success',
        title: `Strong Email Open Rate (${metrics.openRate.toFixed(1)}%)`,
        description: `Your open rate is ${(metrics.openRate - industryOpenAvg).toFixed(1)}% above industry average (${industryOpenAvg}%)`,
        recommendations: [
          'Continue using current subject line strategies',
          'Document what\'s working for future campaigns',
          'A/B test to push even higher',
        ],
        impact: 'medium',
      })
    } else {
      insights.push({
        category: 'email',
        type: 'warning',
        title: `Open Rate Below Average (${metrics.openRate.toFixed(1)}%)`,
        description: `Your open rate is ${(industryOpenAvg - metrics.openRate).toFixed(1)}% below industry average (${industryOpenAvg}%)`,
        recommendations: [
          'Test subject lines with questions or urgency',
          'Include recipient\'s business name for personalization',
          'Optimize send times (try Tuesday-Thursday, 10am-12pm)',
          'Clean your email list of inactive contacts',
        ],
        impact: 'high',
      })
    }

    if (metrics.clickRate < industryClickAvg) {
      insights.push({
        category: 'email',
        type: 'warning',
        title: `Click Rate Needs Improvement (${metrics.clickRate.toFixed(1)}%)`,
        description: `Industry average is ${industryClickAvg}%`,
        recommendations: [
          'Make CTA buttons more prominent',
          'Simplify email copy - focus on one clear benefit',
          'Add preview images of generated websites',
          'Test different CTA text ("View Your Website" vs "See Preview")',
        ],
        impact: 'high',
      })
    }

    // Lead Quality
    if (metrics.conversionRate >= 10) {
      insights.push({
        category: 'quality',
        type: 'success',
        title: 'High-Quality Lead Generation',
        description: `${metrics.conversionRate.toFixed(1)}% conversion rate indicates strong lead quality`,
        recommendations: [
          'Double down on current lead sources',
          'Analyze what industries convert best',
          'Document lead qualification criteria',
        ],
        impact: 'medium',
      })
    } else if (metrics.conversionRate < 5) {
      insights.push({
        category: 'quality',
        type: 'warning',
        title: 'Lead Quality Needs Improvement',
        description: `${metrics.conversionRate.toFixed(1)}% conversion rate suggests lead qualification issues`,
        recommendations: [
          'Increase quality score threshold before contacting',
          'Focus crawler on higher-converting industries',
          'Add more qualifying questions before website preview',
          'Target businesses 2+ years old with existing websites',
        ],
        impact: 'high',
      })
    }

    // Revenue Optimization
    const potentialMRR = calculatePotentialMRR(metrics)
    const opportunity = potentialMRR - metrics.mrr

    if (opportunity > 500) {
      insights.push({
        category: 'revenue',
        type: 'info',
        title: `Revenue Growth Opportunity: $${opportunity.toFixed(2)}/month`,
        description: `Current MRR: $${metrics.mrr.toFixed(2)} • Potential: $${potentialMRR.toFixed(2)}`,
        recommendations: [
          `Win back ${Math.ceil(opportunity / 99)} canceled customers (+$${(Math.ceil(opportunity / 99) * 99).toFixed(2)} MRR)`,
          `Reduce churn from ${metrics.churnRate.toFixed(1)}% to 4% (+$${(metrics.mrr * 0.03).toFixed(2)} MRR)`,
          'Implement customer success outreach for at-risk accounts',
          'Create reactivation campaign for canceled customers',
        ],
        impact: 'high',
      })
    }

    // LTV:CAC Ratio
    const ltvCacRatio = metrics.cac > 0 ? metrics.ltv / metrics.cac : 0

    if (ltvCacRatio >= 3) {
      insights.push({
        category: 'efficiency',
        type: 'success',
        title: `Healthy LTV:CAC Ratio (${ltvCacRatio.toFixed(1)}:1)`,
        description: 'Customer economics are strong',
        recommendations: [
          'Scale up acquisition - you can afford to spend more',
          'Consider paid advertising channels',
          'Invest in automation to reduce CAC further',
        ],
        impact: 'high',
      })
    } else if (ltvCacRatio < 3) {
      insights.push({
        category: 'efficiency',
        type: 'warning',
        title: `LTV:CAC Ratio Needs Improvement (${ltvCacRatio.toFixed(1)}:1)`,
        description: 'Target is 3:1 or higher for sustainable growth',
        recommendations: [
          'Reduce AI generation costs through caching',
          'Increase subscription price after proving value',
          'Add upsell opportunities (premium templates, features)',
          'Improve retention to increase LTV',
        ],
        impact: 'high',
      })
    }

    // Operational Efficiency
    insights.push({
      category: 'efficiency',
      type: 'info',
      title: 'Automation Opportunities',
      description: 'Areas where automation could improve efficiency',
      recommendations: [
        'Auto-respond to common support questions',
        'Implement self-service portal for customers',
        'Automate follow-ups based on email engagement',
        'Schedule automatic quality checks for generated sites',
      ],
      impact: 'medium',
    })

    setInsights(insights)
  }

  const calculatePotentialMRR = (metrics: Metrics): number => {
    // Potential from reducing churn
    const churnReduction = metrics.mrr * 0.03 // 3% improvement

    // Potential from win-backs (assume 10% of canceled could return)
    const winbackPotential = (metrics.totalCanceled * 0.1) * 99

    return metrics.mrr + churnReduction + winbackPotential
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'email':
        return Mail
      case 'quality':
        return Target
      case 'revenue':
        return DollarSign
      case 'efficiency':
        return Settings
      default:
        return AlertCircle
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'email':
        return 'text-purple-600 bg-purple-100'
      case 'quality':
        return 'text-blue-600 bg-blue-100'
      case 'revenue':
        return 'text-green-600 bg-green-100'
      case 'efficiency':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50'
      case 'info':
        return 'border-blue-500 bg-blue-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-600">Failed to load optimization data</p>
      </div>
    )
  }

  const highImpact = insights.filter((i) => i.impact === 'high')
  const mediumImpact = insights.filter((i) => i.impact === 'medium')
  const lowImpact = insights.filter((i) => i.impact === 'low')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Optimization Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Actionable insights and recommendations to grow your business
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{insights.length}</p>
            <p className="text-xs text-gray-500 mt-1">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              High Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{highImpact.length}</p>
            <p className="text-xs text-gray-500 mt-1">Action required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Medium Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{mediumImpact.length}</p>
            <p className="text-xs text-gray-500 mt-1">Consider soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Doing Well
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {insights.filter((i) => i.type === 'success').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* High Impact Insights */}
      {highImpact.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            High Impact Opportunities
          </h2>
          <div className="space-y-4">
            {highImpact.map((insight, index) => {
              const Icon = getCategoryIcon(insight.category)
              const categoryColor = getCategoryColor(insight.category)
              const typeColor = getTypeColor(insight.type)

              return (
                <Card key={index} className={`border-l-4 ${typeColor}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-2 ${categoryColor}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{insight.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {insight.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800">High Impact</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Recommendations:
                      </p>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Medium Impact Insights */}
      {mediumImpact.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Medium Impact Improvements</h2>
          <div className="space-y-4">
            {mediumImpact.map((insight, index) => {
              const Icon = getCategoryIcon(insight.category)
              const categoryColor = getCategoryColor(insight.category)
              const typeColor = getTypeColor(insight.type)

              return (
                <Card key={index} className={`border-l-4 ${typeColor}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-2 ${categoryColor}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{insight.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {insight.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium Impact</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Recommendations:
                      </p>
                      <ul className="space-y-1">
                        {insight.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
