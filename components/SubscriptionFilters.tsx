'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SubscriptionFiltersProps {
  currentStatus?: string
  currentSearch?: string
}

export default function SubscriptionFilters({
  currentStatus,
  currentSearch,
}: SubscriptionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || '')

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }

    router.push(`/admin/subscriptions?${params.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }

    router.push(`/admin/subscriptions?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setSearch('')
    router.push('/admin/subscriptions')
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Filter by Status
          </label>
          <Select
            value={currentStatus || 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="trialing">Trialing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Search
          </label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Business name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Clear Filters */}
        {(currentStatus || currentSearch) && (
          <div className="flex items-end">
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
