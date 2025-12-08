'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import type { EmailTemplate } from '@/types'

interface EmailTemplateFormProps {
  template?: EmailTemplate
}

export default function EmailTemplateForm({ template }: EmailTemplateFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = !!template

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      html_body: formData.get('html_body') as string,
      text_body: formData.get('text_body') as string || null,
      is_active: formData.get('is_active') === 'on',
    }

    // Validation
    const newErrors: Record<string, string> = {}
    if (!data.name?.trim()) newErrors.name = 'Name is required'
    if (!data.subject?.trim()) newErrors.subject = 'Subject is required'
    if (!data.html_body?.trim()) newErrors.html_body = 'HTML body is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const url = isEdit ? `/api/email-templates/${template.id}` : '/api/email-templates'
      const method = isEdit ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${isEdit ? 'update' : 'create'} template`)
      }

      alert(`Template ${isEdit ? 'updated' : 'created'} successfully!`)
      router.push('/admin/email-templates')
    } catch (error) {
      alert(error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} template`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/email-templates">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit' : 'New'} Email Template</h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? `Editing: ${template.name}` : 'Create a new email template for your campaigns'}
        </p>
        {isEdit && (
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {format(new Date(template.created_at), 'MMM d, yyyy h:mm a')}
          </p>
        )}
      </div>

      {/* Variable Helper */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            Available Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <code className="bg-white px-2 py-1 rounded">{'{{business_name}}'}</code>
              <span className="text-gray-600 ml-2">- Business name</span>
            </div>
            <div>
              <code className="bg-white px-2 py-1 rounded">{'{{first_name}}'}</code>
              <span className="text-gray-600 ml-2">- Contact first name</span>
            </div>
            <div>
              <code className="bg-white px-2 py-1 rounded">{'{{preview_url}}'}</code>
              <span className="text-gray-600 ml-2">- Website preview URL</span>
            </div>
            <div>
              <code className="bg-white px-2 py-1 rounded">{'{{demo_url}}'}</code>
              <span className="text-gray-600 ml-2">- Same as preview_url</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={template?.name}
                placeholder="e.g., Cold Outreach - Website Demo"
                maxLength={255}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              <p className="text-xs text-gray-500">Internal identifier for this template</p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line *</Label>
              <Input
                id="subject"
                name="subject"
                defaultValue={template?.subject}
                placeholder="e.g., Quick question about {{business_name}}"
                maxLength={500}
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
              <p className="text-xs text-gray-500">Use variables like {'{{business_name}}'} to personalize</p>
            </div>

            {/* HTML Body */}
            <div className="space-y-2">
              <Label htmlFor="html_body">HTML Body *</Label>
              <Textarea
                id="html_body"
                name="html_body"
                defaultValue={template?.html_body}
                rows={12}
                placeholder="Enter HTML email content..."
                className={errors.html_body ? 'border-red-500' : ''}
              />
              {errors.html_body && <p className="text-sm text-red-600">{errors.html_body}</p>}
              <p className="text-xs text-gray-500">
                Full HTML content. Use variables for personalization.
              </p>
            </div>

            {/* Text Body */}
            <div className="space-y-2">
              <Label htmlFor="text_body">Plain Text Body (Optional)</Label>
              <Textarea
                id="text_body"
                name="text_body"
                defaultValue={template?.text_body || ''}
                rows={8}
                placeholder="Plain text version (auto-generated if left blank)..."
              />
              <p className="text-xs text-gray-500">
                Fallback for email clients that don't support HTML
              </p>
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                name="is_active"
                defaultChecked={template?.is_active ?? true}
              />
              <Label htmlFor="is_active" className="font-normal">
                Set as active template
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Template' : 'Save Template')}
              </Button>
              <Link href="/admin/email-templates">
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
