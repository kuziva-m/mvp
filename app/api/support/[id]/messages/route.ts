/**
 * Ticket Messages API
 *
 * POST /api/support/[id]/messages - Add message to ticket
 */

import { NextRequest, NextResponse } from 'next/server'
import { insert as create, getById, query } from '@/lib/db'
import { sendEmail } from '@/lib/modules/emails/sender'
import type { SupportTicket } from '@/types'

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
    const { id: ticketId } = await context.params
    const body = await request.json()
    const { sender = 'support', message, is_internal = false } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get ticket
    const { data: ticket, error: ticketError } = await getById<SupportTicket>('support_tickets', ticketId)

    if (ticketError || !ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Create message
    const { data: newMessage, error } = await create('ticket_messages', {
      ticket_id: ticketId,
      sender,
      message,
      is_internal,
    })

    if (error || !newMessage) {
      throw new Error(error?.message || 'Failed to create message')
    }

    // Send email to customer if not internal
    if (!is_internal && ticket.lead_id) {
      const { data: leads } = await query('leads', { id: ticket.lead_id })
      const lead = leads?.[0]

      if (lead?.email) {
        await sendEmail({
          to: lead.email,
          subject: `Re: ${ticket.subject}`,
          htmlBody: `
            <h2>Support Team Response</h2>
            <p>Hi ${lead.business_name},</p>
            <p>We've added a response to your support ticket.</p>
            <p><strong>Ticket ID:</strong> ${ticket.id}</p>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
            <p><strong>Response:</strong></p>
            <p>${message}</p>
            <p>Best regards,<br>Support Team</p>
          `,
          textBody: `Support Team Response\n\nHi ${lead.business_name},\n\nWe've added a response to your support ticket.\n\nTicket ID: ${ticket.id}\nSubject: ${ticket.subject}\n\nResponse:\n${message}\n\nBest regards,\nSupport Team`,
          leadId: ticket.lead_id,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
    })
  } catch (error) {
    console.error('Error adding message:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
