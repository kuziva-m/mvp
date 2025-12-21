'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { XCircle, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import type { Subscription } from '@/types'

interface SubscriptionTableProps {
  subscriptions: Subscription[]
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'canceled':
      return 'bg-gray-100 text-gray-800'
    case 'past_due':
      return 'bg-red-100 text-red-800'
    case 'incomplete':
      return 'bg-yellow-100 text-yellow-800'
    case 'trialing':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  const router = useRouter()
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const handleCancel = async (subscriptionId: string) => {
    setCancelingId(subscriptionId)

    try {
      const response = await fetch(`/api/admin/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription')
      }

      alert('Subscription canceled successfully')
      router.refresh()
    } catch (error) {
      alert(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setCancelingId(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Business Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscriptions.map((subscription) => (
            <tr key={subscription.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {subscription.lead?.business_name || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">
                  {subscription.lead?.email || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ${subscription.amount.toFixed(2)}
                  <span className="text-xs text-gray-500 ml-1">
                    {subscription.currency.toUpperCase()}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">
                  {formatDate(subscription.current_period_start)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">
                  {formatDate(subscription.current_period_end)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  {/* View Lead Button */}
                  <Link href={`/admin/leads/${subscription.lead_id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* Cancel Button (only for active subscriptions) */}
                  {subscription.status === 'active' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          disabled={cancelingId === subscription.id}
                        >
                          {cancelingId === subscription.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this subscription for{' '}
                            <strong>{subscription.lead?.business_name}</strong>?
                            <br />
                            <br />
                            This will cancel the subscription in Stripe and mark the lead as
                            canceled. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleCancel(subscription.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, cancel subscription
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
