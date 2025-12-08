import { NextRequest, NextResponse } from 'next/server'
import { query, insert } from '@/lib/db'
import type { EmailTemplate } from '@/types'

export const dynamic = 'force-dynamic'

// GET /api/email-templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    let filters = {}
    if (activeOnly) {
      filters = { is_active: true }
    }

    const { data, error } = await query<EmailTemplate>('email_templates', filters)

    if (error) {
      console.error('Failed to fetch templates:', error)
      return NextResponse.json(
        { error: 'Failed to fetch templates', details: error.message },
        { status: 500 }
      )
    }

    // Sort by created_at DESC
    const sortedData = data?.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) || []

    return NextResponse.json({ data: sortedData }, { status: 200 })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST /api/email-templates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!body.subject?.trim()) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      )
    }

    if (!body.html_body?.trim()) {
      return NextResponse.json(
        { error: 'HTML body is required' },
        { status: 400 }
      )
    }

    const templateData = {
      id: crypto.randomUUID(),
      name: body.name.trim(),
      subject: body.subject.trim(),
      html_body: body.html_body.trim(),
      text_body: body.text_body?.trim() || null,
      is_active: body.is_active ?? true,
    }

    const { data, error } = await insert<Partial<EmailTemplate>>('email_templates', templateData)

    if (error) {
      console.error('Failed to create template:', error)
      return NextResponse.json(
        { error: 'Failed to create template', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
