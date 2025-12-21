'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).substring(7)
    const toast = { id, type, title, description }

    setToasts((prev) => [...prev, toast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`
                min-w-[320px] max-w-md rounded-lg shadow-lg p-4
                flex items-start gap-3 border
                ${toast.type === 'success' ? 'bg-green-50 border-green-200' : ''}
                ${toast.type === 'error' ? 'bg-red-50 border-red-200' : ''}
                ${toast.type === 'warning' ? 'bg-orange-50 border-orange-200' : ''}
                ${toast.type === 'info' ? 'bg-blue-50 border-blue-200' : ''}
              `}
            >
              {/* Icon */}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}

              {/* Content */}
              <div className="flex-1">
                <div className={`font-semibold text-sm
                  ${toast.type === 'success' ? 'text-green-900' : ''}
                  ${toast.type === 'error' ? 'text-red-900' : ''}
                  ${toast.type === 'warning' ? 'text-orange-900' : ''}
                  ${toast.type === 'info' ? 'text-blue-900' : ''}
                `}>
                  {toast.title}
                </div>
                {toast.description && (
                  <div className={`text-sm mt-1
                    ${toast.type === 'success' ? 'text-green-700' : ''}
                    ${toast.type === 'error' ? 'text-red-700' : ''}
                    ${toast.type === 'warning' ? 'text-orange-700' : ''}
                    ${toast.type === 'info' ? 'text-blue-700' : ''}
                  `}>
                    {toast.description}
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
