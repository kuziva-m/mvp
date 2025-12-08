import { NextRequest, NextResponse } from 'next/server'
import { getById, update } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import type { EmailTemplate } from '@/types'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// GET /api/email-templates/[id]
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    const { data, error } = await getById<EmailTemplate>('email_templates', id)

    if (error || !data) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// PATCH /api/email-templates/[id]
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Check template exists
    const { data: existing, error: fetchError } = await getById<EmailTemplate>('email_templates', id)

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Build update object with only provided fields
    const updates: Partial<EmailTemplate> = {}
    if (body.name !== undefined) updates.name = body.name.trim()
    if (body.subject !== undefined) updates.subject = body.subject.trim()
    if (body.html_body !== undefined) updates.html_body = body.html_body.trim()
    if (body.text_body !== undefined) updates.text_body = body.text_body?.trim() || null
    if (body.is_active !== undefined) updates.is_active = body.is_active

    const { data, error } = await update('email_templates', id, updates)

    if (error) {
      console.error('Failed to update template:', error)
      return NextResponse.json(
        { error: 'Failed to update template', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// DELETE /api/email-templates/[id]
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    // Check template exists
    const { data: existing, error: fetchError } = await getById<EmailTemplate>('email_templates', id)

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Hard delete
    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete template:', error)
      return NextResponse.json(
        { error: 'Failed to delete template', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Template deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
