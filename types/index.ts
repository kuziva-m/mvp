// Complete type definitions matching database schema

export interface Lead {
  id: string;
  user_id: string; // Linked to the user who owns this lead
  business_name: string;
  email?: string;
  website?: string;
  phone?: string;
  industry: string;
  // Matches the dropdown options in your UI
  status: "new" | "contacted" | "warm" | "hot" | "closed" | "subscriber";
  source:
    | "Manual"
    | "Clay"
    | "ScrapeMaps"
    | "FB Ads"
    | "LeadsGorilla"
    | "Website";
  logo_url?: string;
  quality_score: number;
  last_activity_at?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string; // Added to match SQL Schema
  lead_id: string;
  plan_name: string;
  amount: number;
  billing_cycle: "monthly" | "yearly"; // Added to match SQL Schema
  status: "active" | "past_due" | "canceled";
  started_at: string;
  created_at?: string;
}

export interface Site {
  id: string;
  lead_id: string;
  framer_project_id: string | null;
  preview_url: string | null;
  published_url: string | null;
  custom_domain: string | null;
  style: string;
  is_published: boolean;
  content_data: Record<string, any> | null;
  created_at: string;
}

export interface Generation {
  id: string;
  lead_id: string;
  site_id: string | null;
  prompt_data: Record<string, any>;
  ai_output: string | null;
  tokens_used: number | null;
  cost_usd: number | null;
  created_at: string;
}

export interface EmailLog {
  id: string;
  lead_id: string;
  template_id: string | null;
  subject: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
  resend_message_id: string | null;
}

export interface EmailTemplate {
  id: string;
  user_id?: string;
  name: string;
  subject: string;
  html_body: string;
  text_body: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Deployment {
  id: string;
  lead_id: string;
  site_id: string;
  domain: string;
  email_address: string | null;
  cpanel_username: string | null;
  cpanel_password: string | null;
  deployed_at: string;
}

export interface AutomationSettings {
  id: string;
  user_id?: string;
  pause_after_scraping: boolean;
  pause_after_generation: boolean;
  pause_after_deployment: boolean;
  pause_before_email: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrawlerConfig {
  id: string;
  user_id?: string;
  source: string;
  enabled: boolean;
  daily_limit: number;
  config: Record<string, any> | null;
  last_run: string | null;
  created_at: string;
}

export interface CrawlerLog {
  id: string;
  source: string;
  leads_found: number;
  leads_added: number;
  errors: number;
  run_at: string;
}

export interface SupportTicket {
  id: string;
  lead_id: string | null;
  subject: string;
  message: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

// Form input types (for creating records)
export type LeadInput = Omit<Lead, "id" | "created_at" | "updated_at">;
export type SiteInput = Omit<Site, "id" | "created_at">;
export type EmailTemplateInput = Omit<EmailTemplate, "id" | "created_at">;

// Website generation types
export interface ScrapedData {
  business_name?: string;
  industry?: string;
  email?: string;
  phone?: string;
  logo_url: string | null;
  colors?: {
    primary: string | null;
    secondary: string | null;
    text: string | null;
  };
  headings?: string[];
  metaDescription?: string | null;
  pageTitle?: string | null;
  screenshot?: string | null;
  scrapedAt?: string;
}

export interface GeneratedCopy {
  heroHeadline: string;
  heroSubheadline: string;
  services: Array<{
    title: string;
    description: string;
  }>;
  about: string;
  cta: string;
  tokensUsed: number;
  costUSD: number;
}

export interface SiteContent {
  businessName: string;
  industry: string;
  heroHeadline: string;
  heroSubheadline: string;
  services: Array<{ title: string; description: string }>;
  about: string;
  cta: string;
  colors?: {
    primary: string;
    secondary: string;
    text: string;
  };
  logoUrl?: string;
}
