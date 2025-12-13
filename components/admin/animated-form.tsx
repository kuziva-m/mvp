'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AnimatedFormProps {
  children: ReactNode
  title?: string
  description?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
}

export function AnimatedForm({ children, title, description }: AnimatedFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-0 shadow-lg">
        {(title || description) && (
          <CardHeader>
            {title && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CardTitle>{title}</CardTitle>
              </motion.div>
            )}
            {description && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardDescription>{description}</CardDescription>
              </motion.div>
            )}
          </CardHeader>
        )}
        <CardContent>
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            {children}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  delay?: number
}

export function FormSection({ title, description, children, delay = 0 }: FormSectionProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="space-y-4 pb-6 mb-6 border-b last:border-0 last:pb-0 last:mb-0"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  )
}

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-2">
      <label className="text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}
