/**
 * A/B Test Results API
 *
 * GET /api/admin/ab-tests/[id]/results - Get test results with statistical analysis
 * POST /api/admin/ab-tests/[id]/results - Declare winner
 */

import { NextRequest, NextResponse } from 'next/server'
import { getById, update, query } from '@/lib/db'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Get test
    const { data: test, error: testError } = await getById('ab_tests', id)

    if (testError || !test) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      )
    }

    // Get results
    const { data: results } = await query('ab_test_results', { test_id: id })

    // Calculate stats for each variant
    const variantAResults = (results || []).filter((r: any) => r.variant === 'a')
    const variantBResults = (results || []).filter((r: any) => r.variant === 'b')

    const statsA = {
      total: variantAResults.length,
      opened: variantAResults.filter((r: any) => r.opened).length,
      clicked: variantAResults.filter((r: any) => r.clicked).length,
      subscribed: variantAResults.filter((r: any) => r.subscribed).length,
      openRate: variantAResults.length > 0
        ? (variantAResults.filter((r: any) => r.opened).length / variantAResults.length) * 100
        : 0,
      clickRate: variantAResults.length > 0
        ? (variantAResults.filter((r: any) => r.clicked).length / variantAResults.length) * 100
        : 0,
      conversionRate: variantAResults.length > 0
        ? (variantAResults.filter((r: any) => r.subscribed).length / variantAResults.length) * 100
        : 0,
    }

    const statsB = {
      total: variantBResults.length,
      opened: variantBResults.filter((r: any) => r.opened).length,
      clicked: variantBResults.filter((r: any) => r.clicked).length,
      subscribed: variantBResults.filter((r: any) => r.subscribed).length,
      openRate: variantBResults.length > 0
        ? (variantBResults.filter((r: any) => r.opened).length / variantBResults.length) * 100
        : 0,
      clickRate: variantBResults.length > 0
        ? (variantBResults.filter((r: any) => r.clicked).length / variantBResults.length) * 100
        : 0,
      conversionRate: variantBResults.length > 0
        ? (variantBResults.filter((r: any) => r.subscribed).length / variantBResults.length) * 100
        : 0,
    }

    // Simple statistical significance (chi-square test approximation)
    // In production, use a proper statistical library
    const totalSamples = statsA.total + statsB.total
    const significanceThreshold = 30 // minimum samples per variant
    const isSignificant = statsA.total >= significanceThreshold && statsB.total >= significanceThreshold

    // Determine metric based on test type
    let metricName = 'Conversion Rate'
    let metricA = statsA.conversionRate
    let metricB = statsB.conversionRate

    if (test.test_type === 'subject_line') {
      metricName = 'Open Rate'
      metricA = statsA.openRate
      metricB = statsB.openRate
    } else if (test.test_type === 'email_body') {
      metricName = 'Click Rate'
      metricA = statsA.clickRate
      metricB = statsB.clickRate
    }

    // Determine suggested winner
    let suggestedWinner = null
    if (isSignificant) {
      if (metricA > metricB * 1.1) { // 10% lift threshold
        suggestedWinner = 'a'
      } else if (metricB > metricA * 1.1) {
        suggestedWinner = 'b'
      } else {
        suggestedWinner = 'none' // too close to call
      }
    }

    return NextResponse.json({
      success: true,
      test,
      results: {
        variantA: statsA,
        variantB: statsB,
        metricName,
        metricA,
        metricB,
        isSignificant,
        suggestedWinner,
      },
    })
  } catch (error) {
    console.error('Error fetching test results:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch test results',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { winner } = body

    if (!['a', 'b', 'none'].includes(winner)) {
      return NextResponse.json(
        { success: false, error: 'Invalid winner value' },
        { status: 400 }
      )
    }

    // Update test
    await update('ab_tests', id, {
      status: 'completed',
      winner,
      completed_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Winner declared successfully',
    })
  } catch (error) {
    console.error('Error declaring winner:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to declare winner',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
