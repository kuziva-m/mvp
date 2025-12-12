'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle, Heart, TrendingUp } from 'lucide-react'

export default function CustomerSuccessPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [atRisk, setAtRisk] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [metricsRes, atRiskRes] = await Promise.all([
        fetch('/api/admin/customer-success/metrics'),
        fetch('/api/admin/customer-success/at-risk'),
      ])

      setMetrics(await metricsRes.json())
      const atRiskData = await atRiskRes.json()
      setAtRisk(atRiskData.atRisk || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function reachOut(leadId: string) {
    try {
      await fetch(`/api/admin/customer-success/${leadId}/reach-out`, { method: 'POST' })
      alert('Outreach email sent!')
      fetchData()
    } catch (error) {
      console.error('Failed to send outreach:', error)
      alert('Failed to send outreach email')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Success</h1>
          <p className="text-gray-600 mt-2">Health monitoring and retention</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Health Score</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics?.avgHealthScore || 0}/100
            </div>
            <p className="text-xs text-gray-500 mt-1">All customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics?.atRiskCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics?.churnRate || 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <Badge variant="default">Target: 50+</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics?.npsScore || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Customers */}
      <Card>
        <CardHeader>
          <CardTitle>At-Risk Customers ({atRisk?.length || 0})</CardTitle>
          <CardDescription>Customers needing proactive outreach</CardDescription>
        </CardHeader>
        <CardContent>
          {atRisk?.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              ✅ No at-risk customers - everyone's healthy!
            </div>
          ) : (
            <div className="space-y-4">
              {atRisk?.map((customer: any) => (
                <div key={customer.lead_id} className="flex items-start justify-between border-b pb-4">
                  <div className="flex-1">
                    <div className="font-semibold">{customer.leads?.business_name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Health Score: {customer.health_score}/100 |
                      Days Inactive: {customer.days_since_activity} |
                      Support Tickets: {customer.total_support_tickets}
                    </div>
                    <Badge
                      variant={
                        customer.risk_level === 'critical' ? 'destructive' :
                        customer.risk_level === 'high' ? 'destructive' :
                        'default'
                      }
                      className="mt-2"
                    >
                      {customer.risk_level?.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => reachOut(customer.lead_id)}
                  >
                    Reach Out
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
