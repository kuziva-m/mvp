import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/db'

export async function GET() {
  try {
    const isConnected = await testConnection()

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Database connection error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
