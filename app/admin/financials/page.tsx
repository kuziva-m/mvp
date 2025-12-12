'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, TrendingDown, Download, RefreshCw } from 'lucide-react'

export default function FinancialsPage() {
  const [metrics, setMetrics] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinancials()
  }, [])

  async function fetchFinancials() {
    setLoading(true)
    try {
      const [metricsRes, customersRes, expensesRes] = await Promise.all([
        fetch('/api/admin/financials/metrics'),
        fetch('/api/admin/financials/customers'),
        fetch('/api/admin/financials/expenses'),
      ])

      setMetrics(await metricsRes.json())
      const customersData = await customersRes.json()
      setCustomers(customersData.customers || [])
      const expensesData = await expensesRes.json()
      setExpenses(expensesData.expenses || [])
    } catch (error) {
      console.error('Failed to fetch financials:', error)
    } finally {
      setLoading(false)
    }
  }

  async function exportForTax() {
    const response = await fetch('/api/admin/financials/export')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `financials-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
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
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-gray-600 mt-2">Revenue, expenses, and profitability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchFinancials}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={exportForTax}>
            <Download className="h-4 w-4 mr-2" />
            Export for Tax
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics?.totalRevenue?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">All-time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${metrics?.totalExpenses?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">All-time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics?.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${metrics?.grossProfit?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics?.grossMarginPercent}% margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTV:CAC Ratio</CardTitle>
            <Badge variant="default">Target: 3:1</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {metrics?.ltvCacRatio?.toFixed(2) || 0}:1
            </div>
            <p className="text-xs text-gray-500 mt-1">
              LTV: ${metrics?.avgLTV} / CAC: ${metrics?.avgCAC}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Status</CardTitle>
            <CardDescription>Profitability breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Customers:</span>
                <span className="text-2xl font-bold">{metrics?.totalCustomers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-600">Profitable:</span>
                <span className="text-xl font-bold text-green-600">{metrics?.profitableCustomers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600">Unprofitable:</span>
                <span className="text-xl font-bold text-red-600">{metrics?.unprofitableCustomers || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Unit Economics</CardTitle>
            <CardDescription className="text-blue-700">At $99/month subscription</CardDescription>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Monthly Revenue:</span>
              <span className="font-bold">$99.00</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Monthly Cost:</span>
              <span className="font-bold">~$23.00</span>
            </div>
            <div className="flex justify-between">
              <span>Gross Profit/Month:</span>
              <span className="font-bold text-green-700">$76.00</span>
            </div>
            <div className="flex justify-between">
              <span>Gross Margin:</span>
              <span className="font-bold">77%</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-300">
              <span>LTV (12 months):</span>
              <span className="font-bold text-lg">$912</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Profitability */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Profitability</CardTitle>
          <CardDescription>
            Top {customers.length} customers by gross profit
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No customer data available yet
            </div>
          ) : (
            <div className="space-y-3">
              {customers.slice(0, 10).map((customer: any) => (
                <div key={customer.leadId} className="flex items-center justify-between border-b pb-3">
                  <div className="flex-1">
                    <div className="font-semibold">{customer.businessName}</div>
                    <div className="text-sm text-gray-500">
                      {customer.monthsActive} months active
                      {customer.breakEvenMonth && ` • Break-even: ${customer.breakEvenMonth} months`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${customer.isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                      ${customer.grossProfit}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.grossMarginPercent}% margin
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenses logged yet
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.slice(0, 20).map((expense: any) => (
                <div key={expense.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex-1">
                    <div className="font-semibold">{expense.subcategory}</div>
                    <div className="text-sm text-gray-500">{expense.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      ${expense.amount} {expense.currency}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
