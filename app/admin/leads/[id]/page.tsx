import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getById, query } from '@/lib/db'
import type { Lead, Site } from '@/types'
import GenerateWebsiteButton from '@/components/GenerateWebsiteButton'

export const dynamic = 'force-dynamic'

interface LeadDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params
  const { data: lead, error } = await getById<Lead>('leads', id)

  if (error || !lead) {
    notFound()
  }

  // Check if site already exists
  const { data: sites } = await query<Site>('sites', { lead_id: id })
  const existingSite = sites && sites.length > 0 ? sites[0] : null

  const STATUS_COLORS = {
    pending: 'bg-gray-100 text-gray-800',
    scraped: 'bg-blue-100 text-blue-800',
    generated: 'bg-purple-100 text-purple-800',
    emailed: 'bg-yellow-100 text-yellow-800',
    opened: 'bg-orange-100 text-orange-800',
    clicked: 'bg-cyan-100 text-cyan-800',
    subscribed: 'bg-green-100 text-green-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    canceled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/leads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </Button>
        </Link>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Lead Details</h1>
        <p className="text-gray-600 mt-2">View and manage lead information</p>
      </div>

      {/* Lead Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{lead.business_name}</CardTitle>
              <CardDescription>
                Created {format(new Date(lead.created_at), 'MMMM d, yyyy')}
              </CardDescription>
            </div>
            <Badge
              className={
                STATUS_COLORS[lead.status as keyof typeof STATUS_COLORS] ||
                STATUS_COLORS.pending
              }
            >
              {lead.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.email}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-medium">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {lead.website}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium capitalize">{lead.industry}</p>
              </div>
            </div>
          </div>

          {/* Lead Metadata */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Lead Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium capitalize">{lead.source}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quality Score</p>
                <p className="font-medium">
                  {lead.quality_score !== null ? (
                    <span>{lead.quality_score}/100</span>
                  ) : (
                    <span className="text-gray-400">Not scored</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {format(new Date(lead.created_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Updated At</p>
                <p className="font-medium">
                  {format(new Date(lead.updated_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </div>

          {/* Email Activity */}
          {(lead.email_sent_at ||
            lead.email_opened_at ||
            lead.email_clicked_at ||
            lead.email_replied_at) && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Email Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                {lead.email_sent_at && (
                  <div>
                    <p className="text-sm text-gray-500">Email Sent</p>
                    <p className="font-medium">
                      {format(new Date(lead.email_sent_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                )}
                {lead.email_opened_at && (
                  <div>
                    <p className="text-sm text-gray-500">Email Opened</p>
                    <p className="font-medium">
                      {format(new Date(lead.email_opened_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                )}
                {lead.email_clicked_at && (
                  <div>
                    <p className="text-sm text-gray-500">Link Clicked</p>
                    <p className="font-medium">
                      {format(new Date(lead.email_clicked_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                )}
                {lead.email_replied_at && (
                  <div>
                    <p className="text-sm text-gray-500">Email Replied</p>
                    <p className="font-medium">
                      {format(new Date(lead.email_replied_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Automation Status */}
          {lead.automation_paused && (
            <div>
              <h3 className="font-semibold text-lg mb-4">Automation</h3>
              <div>
                <p className="text-sm text-gray-500">Paused At</p>
                <p className="font-medium text-yellow-600">
                  {format(new Date(lead.automation_paused), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Website Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Website Generation</CardTitle>
          <CardDescription>
            Generate an AI-powered website for this lead
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {existingSite ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Website Generated</p>
                  <p className="text-sm text-green-700">
                    Template: <span className="capitalize">{existingSite.style}</span>
                  </p>
                </div>
                <Link href={existingSite.preview_url || '#'}>
                  <Button>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Preview
                  </Button>
                </Link>
              </div>
              <GenerateWebsiteButton leadId={id} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                No website has been generated yet. Click the button below to generate a custom website using AI.
              </p>
              <GenerateWebsiteButton leadId={id} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coming Soon Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Edit lead information</li>
            <li>View email history</li>
            <li>Pause/resume automation</li>
            <li>Add notes and tasks</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
