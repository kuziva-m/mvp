'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Database,
  Palette,
} from 'lucide-react'

export default function DiagnosticsPage() {
  const [dbDiagnostics, setDbDiagnostics] = useState<any>(null)
  const [uiDiagnostics, setUiDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    runDiagnostics()
  }, [])

  async function runDiagnostics() {
    setLoading(true)

    try {
      const [dbRes, uiRes] = await Promise.all([
        fetch('/api/admin/diagnostics/database'),
        fetch('/api/admin/diagnostics/ui'),
      ])

      const dbData = await dbRes.json()
      const uiData = await uiRes.json()

      setDbDiagnostics(dbData)
      setUiDiagnostics(uiData)
    } catch (error) {
      console.error('Diagnostics failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalIssues = (dbDiagnostics?.summary?.totalIssues || 0) + (uiDiagnostics?.summary?.totalIssues || 0)
  const totalWarnings = (dbDiagnostics?.summary?.totalWarnings || 0) + (uiDiagnostics?.summary?.totalWarnings || 0)
  const criticalIssues = dbDiagnostics?.summary?.criticalIssues || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Diagnostics</h1>
          <p className="text-gray-600 mt-1">Comprehensive bug tracker and issue detection</p>
        </div>
        <Button onClick={runDiagnostics} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Run Diagnostics
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                criticalIssues > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {criticalIssues > 0 ? (
                  <XCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <div className="text-2xl font-bold">{criticalIssues}</div>
                <div className="text-sm text-gray-600">Critical Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalIssues}</div>
                <div className="text-sm text-gray-600">Total Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalWarnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {dbDiagnostics ? 'OK' : '...'}
                </div>
                <div className="text-sm text-gray-600">System Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Statistics */}
      {dbDiagnostics?.stats && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Total Leads</div>
                <div className="text-2xl font-bold">{dbDiagnostics.stats.totalLeads}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Active Subscriptions</div>
                <div className="text-2xl font-bold">{dbDiagnostics.stats.activeSubscriptions}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">MRR</div>
                <div className="text-2xl font-bold">${dbDiagnostics.stats.mrr}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
                <div className="text-2xl font-bold">{dbDiagnostics.stats.conversionRate}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Emails Sent</div>
                <div className="text-2xl font-bold">{dbDiagnostics.stats.totalEmailsSent}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Open Rate</div>
                <div className="text-2xl font-bold">{dbDiagnostics.stats.openRate}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Issues */}
      {dbDiagnostics?.issues && dbDiagnostics.issues.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Database Issues ({dbDiagnostics.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dbDiagnostics.issues.map((issue: any, index: number) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="uppercase text-xs">
                          {issue.severity}
                        </Badge>
                        {issue.table && (
                          <Badge variant="outline" className="text-xs">
                            Table: {issue.table}
                          </Badge>
                        )}
                      </div>
                      <div className="font-medium text-red-900">{issue.issue}</div>
                      {issue.error && (
                        <div className="text-sm text-red-700 mt-1 font-mono">{issue.error}</div>
                      )}
                      {issue.count !== undefined && (
                        <div className="text-sm text-red-700 mt-1">Count: {issue.count}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Warnings */}
      {dbDiagnostics?.warnings && dbDiagnostics.warnings.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Database Warnings ({dbDiagnostics.warnings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dbDiagnostics.warnings.map((warning: any, index: number) => (
                <div key={index} className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-yellow-100 text-yellow-800 uppercase text-xs">
                          {warning.severity}
                        </Badge>
                        {warning.table && (
                          <Badge variant="outline" className="text-xs">
                            Table: {warning.table}
                          </Badge>
                        )}
                      </div>
                      <div className="font-medium text-yellow-900">{warning.issue}</div>
                      {warning.count !== undefined && (
                        <div className="text-sm text-yellow-700 mt-1">Count: {warning.count}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* UI Issues */}
      {uiDiagnostics?.issues && uiDiagnostics.issues.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-red-600" />
              UI/UX Issues ({uiDiagnostics.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uiDiagnostics.issues.map((issue: any, index: number) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="uppercase text-xs">
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {issue.type}
                        </Badge>
                      </div>
                      <div className="font-medium text-red-900">{issue.issue}</div>
                      {issue.file && (
                        <div className="text-sm text-red-700 mt-1 font-mono">{issue.file}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* UI Warnings */}
      {uiDiagnostics?.warnings && uiDiagnostics.warnings.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              UI/UX Warnings ({uiDiagnostics.warnings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uiDiagnostics.warnings.map((warning: any, index: number) => (
                <div key={index} className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-yellow-100 text-yellow-800 uppercase text-xs">
                          {warning.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {warning.type}
                        </Badge>
                      </div>
                      <div className="font-medium text-yellow-900">{warning.issue}</div>
                      {warning.file && (
                        <div className="text-sm text-yellow-700 mt-1 font-mono">{warning.file}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Clear */}
      {totalIssues === 0 && totalWarnings === 0 && dbDiagnostics && (
        <Card className="border-0 shadow-lg bg-green-50">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-900 mb-2">All Systems Operational</h3>
            <p className="text-green-700">No issues or warnings detected</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
