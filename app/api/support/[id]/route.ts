/**
 * Single Support Ticket API
 *
 * GET /api/support/[id] - Get ticket with messages
 * PATCH /api/support/[id] - Update ticket
 * DELETE /api/support/[id] - Delete ticket
 */

import { NextRequest, NextResponse } from 'next/server'
import { getById, update, query } from '@/lib/db'
import { deleteRecord as deleteById } from '@/lib/db'
import type { SupportTicket, TicketMessage } from '@/types'

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

    // Get ticket
    const { data: ticket, error: ticketError } = await getById<SupportTicket>('support_tickets', id)

    if (ticketError || !ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Get lead details
    let lead = null
    if (ticket.lead_id) {
      const { data: leads } = await query('leads', { id: ticket.lead_id })
      lead = leads?.[0]
    }

    // Get messages
    const { data: messages } = await query<TicketMessage>('ticket_messages', {
      ticket_id: id,
    })

    // Sort messages by created date
    const sortedMessages = (messages || []).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    return NextResponse.json({
      success: true,
      ticket: { ...ticket, lead },
      messages: sortedMessages,
    })
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ticket',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const { status, priority, assigned_to } = body

    const updates: Record<string, any> = {}
    if (status) updates.status = status
    if (priority) updates.priority = priority
    if (assigned_to !== undefined) updates.assigned_to = assigned_to

    // If resolving, set resolved_at
    if (status === 'resolved') {
      updates.resolved_at = new Date().toISOString()
    }

    await update('support_tickets', id, updates)

    return NextResponse.json({
      success: true,
      message: 'Ticket updated successfully',
    })
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update ticket',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params

    await deleteById('support_tickets', id)

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete ticket',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
