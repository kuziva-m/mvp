import { NextResponse } from 'next/server'
import { generateMockLeads } from '@/lib/modules/leads/mock-data-generator'
import { addJobToQueue, leadProcessingQueue } from '@/lib/queues'

export async function POST() {
  try {
    const leads = generateMockLeads({ count: 100 })

    for (const lead of leads) {
      await addJobToQueue(leadProcessingQueue, 'process', lead)
    }

    return NextResponse.json({
      success: true,
      message: '100 test leads queued',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
