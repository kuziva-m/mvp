import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SubscriptionFilters from '@/components/SubscriptionFilters'
import SubscriptionTable from '@/components/SubscriptionTable'
import type { Subscription } from '@/types'

export const metadata: Metadata = {
  title: 'Subscriptions | Admin',
  description: 'Manage customer subscriptions',
}

interface PageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

export const dynamic = 'force-dynamic'

async function getSubscriptions(status?: string, search?: string) {
  try {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    if (search) params.append('search', search)

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/subscriptions?${params.toString()}`
    const response = await fetch(url, { cache: 'no-store' })

    if (!response.ok) {
      console.error('Failed to fetch subscriptions:', await response.text())
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return []
  }
}

function calculateMRR(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((sub) => sub.status === 'active')
    .reduce((total, sub) => total + sub.amount, 0)
}

export default async function SubscriptionsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const subscriptions = await getSubscriptions(params.status, params.search)
  const mrr = calculateMRR(subscriptions)
  const activeCount = subscriptions.filter((sub: Subscription) => sub.status === 'active').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscriptions</h1>
          <p className="text-gray-600">Manage customer subscriptions and billing</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Recurring Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${mrr.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">AUD</span>
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <SubscriptionFilters currentStatus={params.status} currentSearch={params.search} />

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          {subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No subscriptions found</p>
              {(params.status || params.search) && (
                <Link href="/admin/subscriptions">
                  <Button variant="outline">Clear Filters</Button>
                </Link>
              )}
            </div>
          ) : (
            <SubscriptionTable subscriptions={subscriptions} />
          )}
        </div>
      </div>
    </div>
  )
}
