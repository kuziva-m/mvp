// Global type definitions

export interface Lead {
  id: string
  business_name: string
  email: string | null
  website: string | null
  phone: string | null
  industry: string
  status: string
  source: string
  scraped_data: Record<string, any> | null
  quality_score: number | null
  email_sent_at: string | null
  email_opened_at: string | null
  email_clicked_at: string | null
  email_replied_at: string | null
  automation_paused: string | null
  created_at: string
  updated_at: string
}

export interface Site {
  id: string
  lead_id: string
  framer_project_id: string | null
  preview_url: string | null
  published_url: string | null
  custom_domain: string | null
  style: string
  is_published: boolean
  content_data: Record<string, any> | null
  created_at: string
}

export interface EmailLog {
  id: string
  lead_id: string
  template_id: string | null
  subject: string
  sent_at: string
  opened_at: string | null
  clicked_at: string | null
  resend_message_id: string | null
}

export interface Subscription {
  id: string
  lead_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  status: string
  amount: number
  currency: string
  current_period_start: string | null
  current_period_end: string | null
  cancel_at: string | null
  created_at: string
}

// Add more types as we build modules
