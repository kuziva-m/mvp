'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Send, Trash2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import type { SupportTicket, TicketMessage, Lead } from '@/types'

interface TicketWithLead extends SupportTicket {
  lead?: Lead
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState<TicketWithLead | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [replyMessage, setReplyMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchTicketData()
  }, [id])

  const fetchTicketData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/support/${id}`)
      const data = await response.json()

      if (data.success) {
        setTicket(data.ticket)
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTicket = async (updates: Partial<SupportTicket>) => {
    try {
      const response = await fetch(`/api/support/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Failed to update ticket')

      await fetchTicketData()
    } catch (error) {
      console.error('Error updating ticket:', error)
      alert('Failed to update ticket')
    }
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return

    try {
      setSending(true)
      const response = await fetch(`/api/support/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'support',
          message: replyMessage,
          is_internal: isInternal,
        }),
      })

      if (!response.ok) throw new Error('Failed to send reply')

      setReplyMessage('')
      setIsInternal(false)
      await fetchTicketData()
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const handleDeleteTicket = async () => {
    try {
      const response = await fetch(`/api/support/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete ticket')

      router.push('/admin/support')
    } catch (error) {
      console.error('Error deleting ticket:', error)
      alert('Failed to delete ticket')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-600">Ticket not found</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/admin/support')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{ticket.subject}</h1>
            <p className="text-gray-600 mt-1">Ticket #{ticket.id.substring(0, 8)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {ticket.status !== 'resolved' && (
            <Button
              onClick={() => handleUpdateTicket({ status: 'resolved' })}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Resolved
            </Button>
          )}
          {ticket.status === 'resolved' && (
            <Button
              onClick={() => handleUpdateTicket({ status: 'open' })}
              variant="outline"
            >
              Reopen Ticket
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this ticket? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteTicket}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Ticket Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Business</label>
            <div className="mt-1">
              {ticket.lead_id ? (
                <Link
                  href={`/admin/leads/${ticket.lead_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {ticket.lead?.business_name || 'N/A'}
                </Link>
              ) : (
                <span className="text-gray-900">N/A</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <Select
              value={ticket.status}
              onValueChange={(value) => handleUpdateTicket({ status: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Priority</label>
            <Select
              value={ticket.priority}
              onValueChange={(value) => handleUpdateTicket({ priority: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Created</label>
            <p className="mt-1 text-gray-900">
              {new Date(ticket.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {ticket.resolved_at && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-green-600">
              Resolved on {new Date(ticket.resolved_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Conversation Thread */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Conversation</h2>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {messages.map((message, index) => {
            const isCustomer = message.sender === 'customer'
            const isInternal = message.is_internal

            return (
              <div
                key={message.id}
                className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    isInternal
                      ? 'bg-yellow-50 border border-yellow-200'
                      : isCustomer
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {isCustomer
                        ? ticket.lead?.business_name || 'Customer'
                        : 'Support Team'}
                    </span>
                    {isInternal && (
                      <Badge className="ml-2 bg-yellow-600">Internal Note</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reply Form */}
      {ticket.status !== 'resolved' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Reply</h2>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={5}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="internal"
                  checked={isInternal}
                  onCheckedChange={(checked) => setIsInternal(checked as boolean)}
                />
                <label htmlFor="internal" className="text-sm text-gray-700">
                  Internal Note (won't email customer)
                </label>
              </div>
              <Button onClick={handleSendReply} disabled={sending || !replyMessage.trim()}>
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Reply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
