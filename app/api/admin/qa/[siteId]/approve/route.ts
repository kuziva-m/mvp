import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params

    await supabase
      .from('sites')
      .update({
        qa_status: 'approved',
        qa_reviewed_by: 'va-manual',
      })
      .eq('id', siteId)

    console.log(`✅ Site approved by VA: ${siteId}`)

    // TODO: Trigger email sending here if not already triggered

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('QA approval error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to approve site' },
      { status: 500 }
    )
  }
}
