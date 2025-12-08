import { notFound } from 'next/navigation'
import { getById } from '@/lib/db'
import type { EmailTemplate } from '@/types'
import EmailTemplateForm from '@/components/EmailTemplateForm'

export const dynamic = 'force-dynamic'

interface EditTemplatePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = await params
  const { data: template, error } = await getById<EmailTemplate>('email_templates', id)

  if (error || !template) {
    notFound()
  }

  return <EmailTemplateForm template={template} />
}
