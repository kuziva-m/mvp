import { NextResponse } from 'next/server'
import { getAllQueueStatuses } from '@/lib/queues'

export async function GET() {
  try {
    const statuses = await getAllQueueStatuses()
    return NextResponse.json({ success: true, queues: statuses })
  } catch (error) {
    // Return empty queues if Redis is unavailable
    console.error('Queue status error:', error)
    return NextResponse.json({
      success: true,
      queues: [],
      error: 'Redis connection unavailable'
    })
  }
}
