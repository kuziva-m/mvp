'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TemplateActionsProps {
  templateId: string
  isActive: boolean
}

export default function TemplateActions({ templateId, isActive }: TemplateActionsProps) {
  const router = useRouter()
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleActive = async () => {
    setIsToggling(true)
    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle template')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to toggle template')
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/email-templates/${templateId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete template')
      }

      router.refresh()
    } catch (error) {
      alert('Failed to delete template')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-2 pt-2">
      <Link href={`/admin/email-templates/${templateId}/edit`} className="flex-1">
        <Button variant="outline" className="w-full">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </Link>
      <Button
        variant="outline"
        onClick={handleToggleActive}
        disabled={isToggling}
        title={isActive ? 'Deactivate' : 'Activate'}
      >
        <Power className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="text-red-600 hover:bg-red-50"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
