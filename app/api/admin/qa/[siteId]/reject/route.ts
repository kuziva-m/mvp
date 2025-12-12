import { NextResponse } from 'next/server'
import { regenerateFailedSite } from '@/lib/modules/qa/qa-orchestrator'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params
    const { reason } = await request.json()

    // Log rejection reason
    const { supabase } = await import('@/lib/supabase')
    await supabase
      .from('qa_reviews')
      .insert({
        site_id: siteId,
        review_type: 'manual',
        score: 0,
        passed: false,
        issues: [reason || 'Manually rejected by VA'],
        recommendations: [],
        breakdown: {},
        reviewed_by: 'va-manual',
      })

    console.log(`❌ Site rejected by VA: ${siteId} - ${reason}`)

    // Regenerate
    await regenerateFailedSite(siteId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('QA rejection error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reject site' },
      { status: 500 }
    )
  }
}
