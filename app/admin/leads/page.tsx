import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, Upload } from 'lucide-react'
import { query } from '@/lib/db'
import type { Lead } from '@/types'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const { data: leads, error } = await query<Lead>('leads')

  if (error) {
    console.error('Failed to fetch leads:', error)
  }

  const leadsList = leads || []
  const hasLeads = leadsList.length > 0

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-gray-600 mt-2">
            Manage your business leads
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/leads/import">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          </Link>
          <Link href="/admin/leads/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>
            {hasLeads
              ? `Showing ${leadsList.length} lead${leadsList.length === 1 ? '' : 's'}`
              : 'View and manage all leads in the system'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasLeads ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">No leads yet</p>
              <p className="mb-6">Get started by adding leads</p>
              <div className="flex gap-3 justify-center">
                <Link href="/admin/leads/new">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Manually
                  </Button>
                </Link>
                <Link href="/admin/leads/import">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                ✅ {leadsList.length} lead{leadsList.length === 1 ? '' : 's'} in database
              </p>
              <div className="text-sm text-gray-500">
                <p>Full leads table will be built in Prompt 7</p>
                <p className="mt-2">For now, you can:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Add more leads manually</li>
                  <li>Import leads via CSV</li>
                  <li>View leads in Supabase Dashboard</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
