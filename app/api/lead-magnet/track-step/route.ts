import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { step, email, data } = body

    console.log(`📊 Form step ${step} tracked for:`, email || 'anonymous')

    if (step === 1) {
      // Track when user starts the form (completes step 1)
      // We don't have email yet, so we can't update a specific record
      // Just log it for now - we'll track form_started when they hit step 2
      return NextResponse.json({ success: true, tracked: true })
    }

    if (step === 2 && email) {
      // Update the submission record when they start step 2
      const { error } = await supabase
        .from('lead_magnet_submissions')
        .update({
          form_started_at: new Date().toISOString(),
          step_1_completed_at: new Date().toISOString(),
          status: 'form_started',
        })
        .eq('email', email.toLowerCase().trim())
        .is('form_started_at', null) // Only update if not already tracked

      if (error) {
        console.error('Failed to track step:', error)
      }
    }

    return NextResponse.json({ success: true, tracked: true })

  } catch (error) {
    console.error('❌ Track step failed:', error)
    // Don't fail the request if tracking fails
    return NextResponse.json({ success: true, tracked: false })
  }
}
