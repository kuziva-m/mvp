import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Try to query (any table will do for connection test)
    const { error } = await supabase.from('leads').select('count').limit(1)

    // PGRST205 means table doesn't exist - but connection works!
    if (error && error.code === 'PGRST205') {
      return NextResponse.json({
        success: true,
        message: 'Database connected (tables not created yet)',
        note: 'Tables will be created in Prompt 3',
        timestamp: new Date().toISOString()
      })
    }

    // Any other error = real connection problem
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // No error = connection works and tables exist
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Database connection error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
