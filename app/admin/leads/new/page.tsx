'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { leadSchema, type LeadFormData } from '@/lib/validations/lead'
import { INDUSTRIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function NewLeadPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      business_name: '',
      email: '',
      website: '',
      phone: '',
      industry: '',
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)

    try {
      console.log('Submitting lead:', data)

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`)
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to create lead')
      }

      console.log('Lead created successfully:', result.lead)

      toast.success(`Lead "${data.business_name}" created successfully!`)

      reset()

      setTimeout(() => {
        router.push('/admin/leads')
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error('Error creating lead:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Lead</h1>
        <p className="text-muted-foreground mt-2">
          Manually add a new business lead to the system
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="business_name">
            Business Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="business_name"
            {...register('business_name')}
            placeholder="e.g. Joe's Plumbing"
            disabled={isSubmitting}
          />
          {errors.business_name && (
            <p className="text-sm text-red-500">{errors.business_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="contact@business.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            {...register('website')}
            placeholder="https://business.com"
            disabled={isSubmitting}
          />
          {errors.website && (
            <p className="text-sm text-red-500">{errors.website.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="0400 123 456"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.industry && (
            <p className="text-sm text-red-500">{errors.industry.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Creating...' : 'Create Lead'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/leads')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
