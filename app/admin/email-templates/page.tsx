import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { query } from '@/lib/db'
import type { EmailTemplate } from '@/types'
import TemplateActions from '@/components/TemplateActions'

export const dynamic = 'force-dynamic'

export default async function EmailTemplatesPage() {
  const { data: templates, error } = await query<EmailTemplate>('email_templates')

  const sortedTemplates = templates?.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) || []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-gray-600 mt-2">
            Manage your email templates for outreach and follow-ups
          </p>
        </div>
        <Link href="/admin/email-templates/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedTemplates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sortedTemplates.filter(t => t.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">
              {sortedTemplates.filter(t => !t.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      {error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-800">Error loading templates: {error.message}</p>
          </CardContent>
        </Card>
      ) : sortedTemplates.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first email template to start sending automated emails to leads
              </p>
              <Link href="/admin/email-templates/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Template
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {sortedTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    <CardDescription className="mt-2">
                      Subject: {template.subject}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={template.is_active ? 'default' : 'secondary'}
                    className={template.is_active ? 'bg-green-100 text-green-800' : ''}
                  >
                    {template.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview */}
                <div className="text-sm text-gray-600 line-clamp-3">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: template.html_body.replace(/<[^>]*>/g, ' ').substring(0, 150) + '...'
                    }}
                  />
                </div>

                {/* Actions */}
                <TemplateActions templateId={template.id} isActive={template.is_active} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
