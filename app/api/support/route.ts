/**
 * Support Tickets API
 *
 * GET /api/support - List all tickets with filters
 * POST /api/support - Create new ticket
 */

import { NextRequest, NextResponse } from 'next/server'
import { query, insert as create } from '@/lib/db'
import { sendEmail } from '@/lib/modules/emails/sender'
import type { SupportTicket } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assignedTo = searchParams.get('assigned_to')

    // Build filter
    const filter: Record<string, any> = {}
    if (status && status !== 'all') filter.status = status
    if (priority && priority !== 'all') filter.priority = priority
    if (assignedTo && assignedTo !== 'all') filter.assigned_to = assignedTo

    const { data: tickets, error } = await query<SupportTicket>('support_tickets', filter)

    if (error) {
      throw error
    }

    // Fetch lead details for each ticket
    const ticketsWithLeads = await Promise.all(
      (tickets || []).map(async (ticket) => {
        if (ticket.lead_id) {
          const { data: leads } = await query('leads', { id: ticket.lead_id })
          return { ...ticket, lead: leads?.[0] }
        }
        return ticket
      })
    )

    // Sort by created date (newest first)
    ticketsWithLeads.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({
      success: true,
      tickets: ticketsWithLeads,
    })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tickets',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, subject, message, priority = 'normal' } = body

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    // Create ticket
    const { data: ticket, error: ticketError } = await create('support_tickets', {
      lead_id: leadId || null,
      subject,
      message,
      status: 'open',
      priority,
      assigned_to: null,
    })

    if (ticketError || !ticket) {
      throw new Error(ticketError?.message || 'Failed to create ticket')
    }

    // Create initial message
    const { error: msgError } = await create('ticket_messages', {
      ticket_id: ticket.id,
      sender: 'customer',
      message,
      is_internal: false,
    })

    if (msgError) {
      throw new Error(msgError.message || 'Failed to create message')
    }

    // Send confirmation email to customer (if lead exists)
    if (leadId) {
      const { data: leads } = await query('leads', { id: leadId })
      const lead = leads?.[0]

      if (lead?.email) {
        await sendEmail({
          to: lead.email,
          subject: `Support Ticket Created: ${subject}`,
          htmlBody: `
            <h2>Support Ticket Created</h2>
            <p>Hi ${lead.business_name},</p>
            <p>Your support ticket has been created and our team will respond shortly.</p>
            <p><strong>Ticket ID:</strong> ${ticket.id}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
            <p>Best regards,<br>Support Team</p>
          `,
          textBody: `Support Ticket Created\n\nHi ${lead.business_name},\n\nYour support ticket has been created.\n\nTicket ID: ${ticket.id}\nSubject: ${subject}\n\nYour Message:\n${message}\n\nBest regards,\nSupport Team`,
          leadId: leadId,
        })
      }
    }

    return NextResponse.json({
      success: true,
      ticket,
    })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create ticket',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
