/**
 * A/B Tests API
 *
 * GET /api/admin/ab-tests - List all tests
 * POST /api/admin/ab-tests - Create new test
 */

import { NextRequest, NextResponse } from 'next/server'
import { query, insert as create } from '@/lib/db'

export async function GET() {
  try {
    const { data: tests, error } = await query('ab_tests')

    if (error) {
      throw error
    }

    // Sort by created date (newest first)
    const sortedTests = (tests || []).sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({
      success: true,
      tests: sortedTests,
    })
  } catch (error) {
    console.error('Error fetching A/B tests:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch A/B tests',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, test_type, variant_a, variant_b, sample_size = 50 } = body

    if (!name || !test_type || !variant_a || !variant_b) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate test_type
    if (!['subject_line', 'email_body', 'template'].includes(test_type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid test type' },
        { status: 400 }
      )
    }

    // Validate sample_size
    if (sample_size < 1 || sample_size > 100) {
      return NextResponse.json(
        { success: false, error: 'Sample size must be between 1 and 100' },
        { status: 400 }
      )
    }

    const { data: test, error } = await create('ab_tests', {
      name,
      test_type,
      variant_a,
      variant_b,
      sample_size,
      status: 'running',
      winner: null,
    })

    if (error || !test) {
      throw new Error(error?.message || 'Failed to create test')
    }

    return NextResponse.json({
      success: true,
      test,
    })
  } catch (error) {
    console.error('Error creating A/B test:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create A/B test',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
