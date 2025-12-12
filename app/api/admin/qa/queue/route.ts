import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: sites } = await supabase
      .from('sites')
      .select(`
        *,
        leads(*),
        qa_reviews(*)
      `)
      .eq('qa_status', 'manual_review')
      .order('qa_reviewed_at', { ascending: true })

    return NextResponse.json({ success: true, sites: sites || [] })
  } catch (error) {
    console.error('QA queue fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch QA queue' },
      { status: 500 }
    )
  }
}
