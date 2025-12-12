import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: jobs, error } = await supabase
      .from('dead_letter_queue')
      .select('*')
      .eq('resolved', false)
      .order('failed_at', { ascending: false })
      .limit(100)

    if (error) throw error

    // Also get statistics
    const { data: stats } = await supabase
      .from('dead_letter_queue')
      .select('queue_name, resolved')

    const queueStats = stats?.reduce((acc: any, job) => {
      if (!acc[job.queue_name]) {
        acc[job.queue_name] = { total: 0, resolved: 0, unresolved: 0 }
      }
      acc[job.queue_name].total++
      if (job.resolved) {
        acc[job.queue_name].resolved++
      } else {
        acc[job.queue_name].unresolved++
      }
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      jobs: jobs || [],
      count: jobs?.length || 0,
      stats: queueStats || {},
    })
  } catch (error) {
    console.error('Dead letter queue fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dead letter queue' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, resolved, resolvedBy, notes } = await request.json()

    const updateData: any = {
      resolved,
    }

    if (resolved) {
      updateData.resolved_at = new Date().toISOString()
      updateData.resolved_by = resolvedBy
    }

    if (notes) {
      updateData.notes = notes
    }

    const { error } = await supabase
      .from('dead_letter_queue')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Dead letter queue update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('dead_letter_queue')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Dead letter queue delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
