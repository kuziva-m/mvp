import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get the submission
    const { data: submission, error } = await supabase
      .from('lead_magnet_submissions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching submission:', error)
      return NextResponse.json(
        { success: false, error: 'Submission not found', details: error },
        { status: 404 }
      )
    }

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Fetch related data separately to avoid relationship issues
    let lead = null
    let site = null

    if (submission.lead_id) {
      const { data } = await supabase
        .from('leads')
        .select('id, business_name, email, industry, status')
        .eq('id', submission.lead_id)
        .single()
      lead = data
    }

    if (submission.site_id) {
      const { data } = await supabase
        .from('sites')
        .select('id, subdomain, status')
        .eq('id', submission.site_id)
        .single()
      site = data
    }

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        lead,
        site,
      },
    })

  } catch (error) {
    console.error('❌ Get submission failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get submission' },
      { status: 500 }
    )
  }
}
