'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from './toast-provider'

export function KeyboardShortcuts() {
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Command/Ctrl + K is handled by CommandDialog

      // Command/Ctrl + H - Go to Dashboard
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault()
        router.push('/admin/dashboard')
      }

      // Command/Ctrl + L - Go to Leads
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault()
        router.push('/admin/leads')
      }

      // Command/Ctrl + E - Go to Email Templates
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        router.push('/admin/email-templates')
      }

      // Command/Ctrl + Shift + A - Go to Analytics
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && e.shiftKey) {
        e.preventDefault()
        router.push('/admin/analytics')
      }

      // Command/Ctrl + / - Show shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        showToast('info', 'Keyboard Shortcuts', '⌘H: Dashboard | ⌘L: Leads | ⌘K: Search | ⌘E: Emails')
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [router, showToast])

  return null
}
