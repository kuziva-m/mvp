'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingDown, TrendingUp, Percent } from 'lucide-react'

export default function FinancialsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinancials()
  }, [])

  async function fetchFinancials() {
    try {
      const response = await fetch('/api/admin/financials/metrics')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch financials:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Management</h1>
        <p className="text-gray-600 mt-1">Revenue, expenses, and profitability</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${data?.stats?.totalRevenue || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">All-time</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingDown className="w-4 h-4 text-red-600" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ${data?.stats?.totalExpenses || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">All-time</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Gross Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${(data?.stats?.grossProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${data?.stats?.grossProfit || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {data?.stats?.grossMarginPercent || 0}% margin
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Percent className="w-4 h-4 text-purple-600" />
              LTV:CAC Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {data?.stats?.ltvCacRatio || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Target: 3:1</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Customer Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Total Customers</div>
              <div className="text-3xl font-bold">{data?.stats?.totalCustomers || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Profitable</div>
              <div className="text-3xl font-bold text-green-600">
                {data?.stats?.profitableCustomers || 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Unprofitable</div>
              <div className="text-3xl font-bold text-red-600">
                {data?.stats?.unprofitableCustomers || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit Economics */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Unit Economics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Avg LTV</div>
              <div className="text-2xl font-bold">${data?.stats?.avgLTV || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Avg CAC</div>
              <div className="text-2xl font-bold">${data?.stats?.avgCAC || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Payback Period</div>
              <div className="text-2xl font-bold">{data?.stats?.paybackMonths || 0} months</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
