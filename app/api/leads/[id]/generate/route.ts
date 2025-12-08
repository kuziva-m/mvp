import { NextRequest, NextResponse } from 'next/server'
import { generateWebsite } from '@/lib/modules/websites/generator'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      )
    }

    console.log(`Starting website generation for lead: ${id}`)

    // Call the generation pipeline
    const result = await generateWebsite(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Website generation failed' },
        { status: 500 }
      )
    }

    console.log(`Website generation completed successfully for lead: ${id}`)

    return NextResponse.json(
      {
        success: true,
        siteId: result.siteId,
        previewUrl: result.previewUrl,
        tokensUsed: result.tokensUsed,
        costUSD: result.costUSD,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API error during website generation:', error)
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
