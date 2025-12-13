import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const campaign = searchParams.get('campaign')

    let query = supabase
      .from('lead_magnet_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Filter by campaign if provided
    if (campaign) {
      query = query.eq('campaign_id', campaign)
    }

    const { data: submissions, error } = await query

    if (error) {
      throw error
    }

    // Fetch related data for each submission
    const enrichedSubmissions = await Promise.all(
      (submissions || []).map(async (submission) => {
        let campaign = null
        let lead = null
        let site = null

        if (submission.campaign_id) {
          const { data } = await supabase
            .from('lead_magnet_campaigns')
            .select('id, name, platform')
            .eq('id', submission.campaign_id)
            .single()
          campaign = data
        }

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

        return {
          ...submission,
          campaign,
          lead,
          site,
        }
      })
    )

    return NextResponse.json({
      success: true,
      submissions: enrichedSubmissions,
      total: enrichedSubmissions.length,
    })

  } catch (error) {
    console.error('❌ Failed to get submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get submissions' },
      { status: 500 }
    )
  }
}
