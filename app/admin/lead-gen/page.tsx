'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function LeadGenPage() {
  const [stats, setStats] = useState<any>(null)
  const [queues, setQueues] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      // Add timeout to prevent infinite loading
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const [statsRes, queuesRes] = await Promise.all([
        fetch('/api/admin/lead-stats', { signal: controller.signal }),
        fetch('/api/admin/queues', { signal: controller.signal }),
      ])

      clearTimeout(timeoutId)

      const [statsData, queuesData] = await Promise.all([
        statsRes.json(),
        queuesRes.json()
      ])

      setStats(statsData)
      setQueues(queuesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set default data so page still renders
      if (!stats) {
        setStats({ mode: 'MOCK', stats: { today: { total: 0, clay: 0, scrapemaps: 0, avgQualityScore: 0 } } })
      }
      if (!queues) {
        setQueues({ queues: [], error: 'Failed to load queue status' })
      }
    } finally {
      setLoading(false)
    }
  }

  async function generateTestLeads() {
    if (confirm('Generate 100 test leads?')) {
      try {
        setGenerating(true)
        await fetch('/api/admin/generate-test-leads', { method: 'POST' })
        alert('100 test leads queued! Check workers.')
        await fetchData()
      } catch (error) {
        alert('Failed to generate test leads')
      } finally {
        setGenerating(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Generation</h1>
          <p className="text-gray-600 mt-2">
            {stats?.mode === 'MOCK' && (
              <Badge variant="outline" className="text-lg">MOCK MODE - No API keys needed</Badge>
            )}
            {stats?.mode === 'PRODUCTION' && (
              <Badge className="text-lg">PRODUCTION MODE - Live APIs</Badge>
            )}
          </p>
        </div>
        {stats?.mode === 'MOCK' && (
          <Button onClick={generateTestLeads} disabled={generating}>
            {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Generate 100 Test Leads
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Today</CardTitle>
            <CardDescription>New leads added</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats?.stats?.today?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clay</CardTitle>
            <CardDescription>Webhook leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {stats?.stats?.today?.clay || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ScrapeMaps</CardTitle>
            <CardDescription>API scraping</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {stats?.stats?.today?.scrapemaps || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avg Quality</CardTitle>
            <CardDescription>Score (0-100)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">
              {stats?.stats?.today?.avgQualityScore || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Status</CardTitle>
          <CardDescription>Real-time processing status</CardDescription>
        </CardHeader>
        <CardContent>
          {queues?.error ? (
            <div className="text-center py-8">
              <p className="text-yellow-600 font-semibold mb-2">⚠️ Redis Connection Issue</p>
              <p className="text-sm text-gray-600 mb-4">
                Queue monitoring unavailable. Start workers with: <code className="bg-gray-100 px-2 py-1 rounded">npm run workers</code>
              </p>
              <p className="text-xs text-gray-500">
                Redis is required for queue processing. Check your REDIS_URL in .env.local
              </p>
            </div>
          ) : queues?.queues?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No workers running</p>
              <p className="text-sm">Start workers: <code className="bg-gray-100 px-2 py-1 rounded">npm run workers</code></p>
            </div>
          ) : (
            <div className="space-y-4">
              {queues?.queues?.map((queue: any) => (
                <div key={queue.name} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold capitalize">{queue.name.replace('-', ' ')}</div>
                    <div className="text-sm text-gray-500">
                      Waiting: {queue.waiting} | Active: {queue.active} | Failed: {queue.failed}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{queue.completed}</div>
                    <div className="text-xs text-gray-500">completed</div>
                  </div>
                </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="space-y-2">
            {stats?.mode === 'MOCK' ? (
              <>
                <p className="font-semibold">You're in MOCK MODE - Perfect for testing!</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Click "Generate 100 Test Leads" to create mock data</li>
                  <li>Start workers: <code className="bg-white px-2 py-1 rounded">npm run workers</code></li>
                  <li>Watch the queues process leads in real-time</li>
                  <li>No API keys required, completely free</li>
                </ul>
                <p className="text-sm mt-4">
                  <strong>To switch to PRODUCTION:</strong> Add CLAY_WEBHOOK_SECRET and SCRAPEMAPS_API_KEY to .env.local
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">You're in PRODUCTION MODE - Live APIs active!</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Clay.com webhook endpoint: /api/webhooks/clay</li>
                  <li>ScrapeMaps integration active</li>
                  <li>Automatic lead deduplication enabled</li>
                  <li>Quality scoring threshold: 60/100</li>
                </ul>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
