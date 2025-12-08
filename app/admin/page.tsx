import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { count } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const { count: leadsCount } = await count('leads')
  const { count: sitesCount } = await count('sites')
  const { count: subscribersCount } = await count('subscriptions', { status: 'active' })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/leads/new">
          <Button>Add New Lead</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{leadsCount || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Websites Generated</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{sitesCount || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Clients</CardTitle>
            <CardDescription>Subscribed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{subscribersCount || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
