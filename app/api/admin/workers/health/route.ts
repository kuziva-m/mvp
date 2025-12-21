import { NextResponse } from 'next/server'
import { getAllQueueStatuses } from '@/lib/queues'

export async function GET() {
  try {
    // Get queue statuses
    const queues = await getAllQueueStatuses()

    // Infer worker health from queue activity
    const workers = queues.map(queue => {
      const failureRate = queue.completed > 0
        ? (queue.failed / (queue.completed + queue.failed)) * 100
        : 0

      const healthy = queue.failed < 10 && !queue.paused && failureRate < 5

      return {
        name: queue.name,
        healthy,
        waiting: queue.waiting,
        active: queue.active,
        completed: queue.completed,
        failed: queue.failed,
        delayed: queue.delayed,
        paused: queue.paused,
        failureRate: parseFloat(failureRate.toFixed(2)),
      }
    })

    const allHealthy = workers.every(w => w.healthy)
    const totalActive = workers.reduce((sum, w) => sum + w.active, 0)
    const totalCompleted = workers.reduce((sum, w) => sum + w.completed, 0)
    const totalFailed = workers.reduce((sum, w) => sum + w.failed, 0)

    return NextResponse.json({
      success: true,
      overall: allHealthy ? 'healthy' : 'unhealthy',
      workers,
      summary: {
        totalActive,
        totalCompleted,
        totalFailed,
        allHealthy,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        success: false,
        overall: 'error',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
