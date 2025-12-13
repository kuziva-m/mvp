import { AdminLayout } from '@/components/admin/admin-layout'
import { ToastProvider } from '@/components/admin/toast-provider'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AdminLayout>{children}</AdminLayout>
    </ToastProvider>
  )
}
