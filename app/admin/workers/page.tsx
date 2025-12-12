'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Pause, Play, RefreshCw, Trash2 } from 'lucide-react'

interface WorkerHealth {
  name: string
  healthy: boolean
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
  paused: boolean
  failureRate: number
}

interface DeadLetterJob {
  id: string
  queue_name: string
  job_id: string
  job_data: any
  error_message: string
  error_stack: string
  attempts_made: number
  failed_at: string
  resolved: boolean
}

export default function WorkersPage() {
  const [health, setHealth] = useState<any>(null)
  const [deadLetterQueue, setDeadLetterQueue] = useState<DeadLetterJob[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchData()
    if (autoRefresh) {
      const interval = setInterval(fetchData, 10000) // Refresh every 10s
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  async function fetchData() {
    try {
      const [healthRes, dlqRes] = await Promise.all([
        fetch('/api/admin/workers/health'),
        fetch('/api/admin/dead-letter-queue'),
      ])

      const healthData = await healthRes.json()
      const dlqData = await dlqRes.json()

      setHealth(healthData)
      setDeadLetterQueue(dlqData.jobs || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch worker data:', error)
    }
  }

  async function resolveJob(id: string) {
    const confirmed = confirm('Mark this job as resolved?')
    if (!confirmed) return

    await fetch('/api/admin/dead-letter-queue', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        resolved: true,
        resolvedBy: 'admin',
      }),
    })
    fetchData()
  }

  async function deleteJob(id: string) {
    const confirmed = confirm('Permanently delete this job?')
    if (!confirmed) return

    await fetch(`/api/admin/dead-letter-queue?id=${id}`, {
      method: 'DELETE',
    })
    fetchData()
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
          <h1 className="text-3xl font-bold">Worker Monitoring</h1>
          <p className="text-gray-600 mt-2">Real-time worker health and performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className={health?.overall === 'healthy' ? 'border-green-300' : 'border-red-300'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {health?.overall === 'healthy' ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500" />
            )}
            Overall Status
          </CardTitle>
          <CardDescription>
            Last updated: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'Unknown'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-4">
            {health?.overall === 'healthy' ? (
              <span className="text-green-500">ALL SYSTEMS OPERATIONAL</span>
            ) : health?.overall === 'error' ? (
              <span className="text-red-500">MONITORING ERROR</span>
            ) : (
              <span className="text-yellow-500">ATTENTION REQUIRED</span>
            )}
          </div>

          {health?.summary && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-sm text-gray-600">Active Jobs</div>
                <div className="text-2xl font-bold text-blue-600">{health.summary.totalActive}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-2xl font-bold text-green-600">{health.summary.totalCompleted}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Failed</div>
                <div className="text-2xl font-bold text-red-600">{health.summary.totalFailed}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Worker Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {health?.workers?.map((worker: WorkerHealth) => (
          <Card key={worker.name} className={worker.healthy ? '' : 'border-yellow-300'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{worker.name.replace('-', ' ')}</span>
                {worker.healthy ? (
                  <Badge variant="default" className="bg-green-600">Healthy</Badge>
                ) : (
                  <Badge variant="destructive">Unhealthy</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Waiting:</span>
                <span className="font-bold">{worker.waiting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active:</span>
                <span className="font-bold text-blue-600">{worker.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-bold text-green-600">{worker.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Failed:</span>
                <span className="font-bold text-red-600">{worker.failed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Failure Rate:</span>
                <span className={`font-bold ${worker.failureRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                  {worker.failureRate}%
                </span>
              </div>
              {worker.paused && (
                <div className="text-yellow-600 flex items-center gap-2 mt-2 pt-2 border-t">
                  <Pause className="h-4 w-4" />
                  <span className="font-semibold">PAUSED</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dead Letter Queue */}
      <Card className={deadLetterQueue.length > 0 ? 'border-red-300' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {deadLetterQueue.length > 0 ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            Dead Letter Queue
            {deadLetterQueue.length > 0 && (
              <Badge variant="destructive">{deadLetterQueue.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {deadLetterQueue.length === 0
              ? 'No failed jobs - all systems running smoothly'
              : 'Jobs that failed after maximum retry attempts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deadLetterQueue.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="font-semibold">No Failed Jobs</p>
              <p className="text-sm">All workers are processing successfully</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deadLetterQueue.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-red-900 capitalize">
                        {job.queue_name.replace('-', ' ')}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Job ID: <code className="bg-white px-1 rounded">{job.job_id}</code>
                      </div>
                      <div className="text-sm text-gray-600">
                        Failed: {new Date(job.failed_at).toLocaleString()} | Attempts: {job.attempts_made}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveJob(job.id)}
                      >
                        Mark Resolved
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm mt-3">
                    <div className="text-red-700 font-medium mb-1">Error:</div>
                    <div className="text-red-900 bg-white p-2 rounded border border-red-200">
                      {job.error_message}
                    </div>
                  </div>
                  <details className="mt-3">
                    <summary className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                      View job data & stack trace
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-1">Job Data:</div>
                        <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                          {JSON.stringify(job.job_data, null, 2)}
                        </pre>
                      </div>
                      {job.error_stack && (
                        <div>
                          <div className="text-xs font-semibold text-gray-600 mb-1">Stack Trace:</div>
                          <pre className="text-xs bg-white p-2 rounded border overflow-x-auto max-h-40">
                            {job.error_stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Production Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Production Deployment</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">For production deployment with PM2:</p>
            <div className="bg-white p-3 rounded border border-blue-200 font-mono text-xs space-y-1">
              <div>npm install -g pm2</div>
              <div>npm run workers:prod    # Start workers with PM2</div>
              <div>npm run workers:status  # Check worker status</div>
              <div>npm run workers:logs    # View worker logs</div>
              <div>npm run workers:restart # Restart all workers</div>
            </div>
            <p className="mt-3">
              <strong>PM2 Benefits:</strong> Auto-restart on crash, dual redundancy, centralized logs, zero-downtime restarts
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
