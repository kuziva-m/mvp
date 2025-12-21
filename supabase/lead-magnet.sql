-- Lead Magnet Funnel Tables
-- Tracks paid acquisition campaigns and conversions

-- Lead magnet campaigns
CREATE TABLE IF NOT EXISTS lead_magnet_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  platform VARCHAR(50), -- 'facebook', 'google', 'instagram', 'tiktok'
  target_audience VARCHAR(255), -- 'plumbers-melbourne', 'restaurants-sydney'
  ad_spend DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  landing_page_variant VARCHAR(50) DEFAULT 'default', -- For A/B testing
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_slug ON lead_magnet_campaigns(slug);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON lead_magnet_campaigns(is_active);

-- Lead magnet submissions
CREATE TABLE IF NOT EXISTS lead_magnet_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES lead_magnet_campaigns(id),
  lead_id UUID REFERENCES leads(id), -- Links to main system
  site_id UUID REFERENCES sites(id),

  -- Form data
  business_name VARCHAR(255) NOT NULL,
  business_description TEXT NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),

  -- UTM tracking
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),
  referrer TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,

  -- Funnel progression
  landing_page_visited_at TIMESTAMP WITH TIME ZONE,
  form_started_at TIMESTAMP WITH TIME ZONE,
  step_1_completed_at TIMESTAMP WITH TIME ZONE,
  form_completed_at TIMESTAMP WITH TIME ZONE,
  website_generated_at TIMESTAMP WITH TIME ZONE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  preview_visited_at TIMESTAMP WITH TIME ZONE,
  cta_clicked_at TIMESTAMP WITH TIME ZONE,
  subscribed_at TIMESTAMP WITH TIME ZONE,

  -- Status
  status VARCHAR(50) DEFAULT 'visited',
  -- 'visited', 'form_started', 'form_completed', 'generated', 'delivered', 'converted'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_campaign ON lead_magnet_submissions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON lead_magnet_submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON lead_magnet_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_lead ON lead_magnet_submissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON lead_magnet_submissions(created_at DESC);

-- Add source tracking to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS acquisition_source VARCHAR(50) DEFAULT 'crawler';
-- Values: 'crawler', 'lead_magnet', 'manual', 'csv_import', 'api'
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lead_magnet_submission_id UUID REFERENCES lead_magnet_submissions(id);

-- Comments
COMMENT ON TABLE lead_magnet_campaigns IS 'Paid advertising campaigns (Facebook, Google, etc.)';
COMMENT ON TABLE lead_magnet_submissions IS 'Lead magnet funnel submissions with full tracking';

COMMENT ON COLUMN lead_magnet_submissions.status IS 'visited, form_started, form_completed, generated, delivered, converted';
COMMENT ON COLUMN leads.acquisition_source IS 'crawler, lead_magnet, manual, csv_import, api';
