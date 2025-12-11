/**
 * Manual Delivery API Endpoint
 *
 * POST /api/admin/deliver/:leadId
 *
 * Triggers the complete delivery workflow for a lead.
 * Should only be called for leads with active subscriptions.
 */

import { NextRequest, NextResponse } from 'next/server'
import { deliverService } from '@/lib/modules/deliveries/orchestrator'

interface RouteContext {
  params: Promise<{
    leadId: string
  }>
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { leadId } = await context.params

    console.log('Manual delivery triggered for lead:', leadId)

    // Trigger the complete delivery workflow
    const result = await deliverService(leadId)

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Delivery failed',
          details: result.errors,
          steps: result.steps,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Service delivered successfully',
      domain: result.domain,
      deploymentUrl: result.deploymentUrl,
      emailAccount: result.emailAccount,
      cpanelUrl: result.cpanelUrl,
      steps: result.steps,
    })
  } catch (error) {
    console.error('Error in delivery endpoint:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
