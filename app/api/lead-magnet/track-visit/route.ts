import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
    } = body

    console.log('📊 Landing page visit tracked:', { utm_source, utm_campaign })

    // Create a preliminary submission record to track the visit
    // This will be updated when they complete the form
    const { data, error } = await supabase
      .from('lead_magnet_submissions')
      .insert({
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        landing_page_visited_at: new Date().toISOString(),
        status: 'visited',
        // These will be filled in when form is submitted
        business_name: 'Unknown',
        business_description: 'Unknown',
        contact_name: 'Unknown',
        email: 'unknown@unknown.com',
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to track visit:', error)
      // Don't fail the request if tracking fails
      return NextResponse.json({ success: true, tracked: false })
    }

    return NextResponse.json({
      success: true,
      tracked: true,
      submissionId: data.id,
    })

  } catch (error) {
    console.error('❌ Track visit failed:', error)
    // Don't fail the request if tracking fails
    return NextResponse.json({ success: true, tracked: false })
  }
}
