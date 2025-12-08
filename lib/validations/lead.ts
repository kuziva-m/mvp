import { z } from 'zod'

export const leadSchema = z.object({
  business_name: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),

  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  website: z.string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  phone: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),

  industry: z.string()
    .min(1, 'Please select an industry'),

  source: z.string().default('manual'),

  status: z.string().default('pending'),
})

export type LeadFormData = z.infer<typeof leadSchema>
