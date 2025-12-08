import { NextResponse } from 'next/server'
import { insert, query } from '@/lib/db'
import { leadSchema } from '@/lib/validations/lead'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate the request body
    const validation = leadSchema.safeParse(body)

    if (!validation.success) {
      console.error('Validation failed:', validation.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.format(),
        },
        { status: 400 }
      )
    }

    const { business_name, email, website, phone, industry } = validation.data

    // Convert empty strings to null for optional fields
    const leadData = {
      business_name,
      email: email || null,
      website: website || null,
      phone: phone || null,
      industry,
      source: 'manual',
      status: 'pending',
    }

    // Insert the lead into the database
    const { data: lead, error } = await insert('leads', leadData)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create lead',
          details: error.message,
        },
        { status: 500 }
      )
    }

    console.log('Lead created successfully:', lead)

    return NextResponse.json(
      {
        success: true,
        message: 'Lead created successfully',
        lead,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Fetch all leads (sorting will be done client-side)
    const { data, error } = await query('leads')

    if (error) {
      console.error('Failed to fetch leads:', error)
      return NextResponse.json(
        { error: 'Failed to fetch leads', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
