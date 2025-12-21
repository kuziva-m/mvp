-- =====================================================
-- MVP 2.0 - Initial Database Schema
-- Created: 2025-12-08
-- Description: Complete schema for automated website agency
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: LEADS
-- Stores business leads and tracking data
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    website VARCHAR(500),
    phone VARCHAR(50),
    industry VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    source VARCHAR(50) NOT NULL DEFAULT 'manual',
    scraped_data JSONB,
    quality_score INTEGER,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    email_opened_at TIMESTAMP WITH TIME ZONE,
    email_clicked_at TIMESTAMP WITH TIME ZONE,
    email_replied_at TIMESTAMP WITH TIME ZONE,
    automation_paused VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for leads table
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_quality_score ON leads(quality_score DESC);

-- =====================================================
-- TABLE 2: SITES
-- Stores generated website information
-- =====================================================

CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    framer_project_id VARCHAR(255),
    preview_url VARCHAR(500),
    published_url VARCHAR(500),
    custom_domain VARCHAR(255),
    style VARCHAR(50) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    content_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for sites table
CREATE INDEX IF NOT EXISTS idx_sites_lead_id ON sites(lead_id);
CREATE INDEX IF NOT EXISTS idx_sites_is_published ON sites(is_published);
CREATE INDEX IF NOT EXISTS idx_sites_custom_domain ON sites(custom_domain);

-- =====================================================
-- TABLE 3: GENERATIONS
-- Tracks AI generation usage and costs
-- =====================================================

CREATE TABLE IF NOT EXISTS generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    prompt_data JSONB NOT NULL,
    ai_output TEXT,
    tokens_used INTEGER,
    cost_usd DECIMAL(10, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for generations table
CREATE INDEX IF NOT EXISTS idx_generations_lead_id ON generations(lead_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);

-- =====================================================
-- TABLE 4: EMAIL_LOGS
-- Tracks all emails sent
-- =====================================================

CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    template_id UUID,
    subject VARCHAR(500) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    resend_message_id VARCHAR(255)
);

-- Indexes for email_logs table
CREATE INDEX IF NOT EXISTS idx_email_logs_lead_id ON email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_message_id ON email_logs(resend_message_id);

-- =====================================================
-- TABLE 5: EMAIL_TEMPLATES
-- Stores email template definitions
-- =====================================================

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    html_body TEXT NOT NULL,
    text_body TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email_templates table
CREATE INDEX IF NOT EXISTS idx_email_templates_is_active ON email_templates(is_active);

-- =====================================================
-- TABLE 6: SUBSCRIPTIONS
-- Tracks Stripe subscriptions
-- =====================================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'AUD',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscriptions table
CREATE INDEX IF NOT EXISTS idx_subscriptions_lead_id ON subscriptions(lead_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- =====================================================
-- TABLE 7: DEPLOYMENTS
-- Tracks domain and hosting deployments
-- =====================================================

CREATE TABLE IF NOT EXISTS deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    email_address VARCHAR(255),
    cpanel_username VARCHAR(100),
    cpanel_password VARCHAR(255),
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for deployments table
CREATE INDEX IF NOT EXISTS idx_deployments_lead_id ON deployments(lead_id);
CREATE INDEX IF NOT EXISTS idx_deployments_domain ON deployments(domain);

-- =====================================================
-- TABLE 8: AUTOMATION_SETTINGS
-- Global automation configuration
-- =====================================================

CREATE TABLE IF NOT EXISTS automation_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pause_after_scraping BOOLEAN DEFAULT FALSE,
    pause_after_generation BOOLEAN DEFAULT FALSE,
    pause_after_deployment BOOLEAN DEFAULT FALSE,
    pause_before_email BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default automation settings
INSERT INTO automation_settings (
    pause_after_scraping,
    pause_after_generation,
    pause_after_deployment,
    pause_before_email
) VALUES (
    FALSE,
    FALSE,
    FALSE,
    TRUE
) ON CONFLICT DO NOTHING;

-- =====================================================
-- TABLE 9: CRAWLER_CONFIG
-- Configuration for lead generation crawlers
-- =====================================================

CREATE TABLE IF NOT EXISTS crawler_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT TRUE,
    daily_limit INTEGER DEFAULT 100,
    config JSONB,
    last_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default crawler configurations
INSERT INTO crawler_config (source, enabled, daily_limit, config) VALUES
    ('google-maps', TRUE, 50, '{"apiKey": "", "searchTypes": ["plumber", "electrician", "restaurant"], "locations": ["Melbourne VIC", "Sydney NSW"], "radius": 50000}'::jsonb),
    ('yellow-pages', TRUE, 30, '{"baseUrl": "https://www.yellowpages.com.au", "categories": ["plumbers", "electricians", "restaurants"]}'::jsonb),
    ('true-local', TRUE, 20, '{"baseUrl": "https://www.truelocal.com.au", "categories": ["plumbing", "electrical", "food-beverage"]}'::jsonb)
ON CONFLICT (source) DO NOTHING;

-- =====================================================
-- TABLE 10: CRAWLER_LOGS
-- Logs crawler activity and results
-- =====================================================

CREATE TABLE IF NOT EXISTS crawler_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    leads_found INTEGER DEFAULT 0,
    leads_added INTEGER DEFAULT 0,
    errors INTEGER DEFAULT 0,
    run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for crawler_logs table
CREATE INDEX IF NOT EXISTS idx_crawler_logs_run_at ON crawler_logs(run_at DESC);
CREATE INDEX IF NOT EXISTS idx_crawler_logs_source ON crawler_logs(source);

-- =====================================================
-- SUPPORT TABLES (for Prompt 26)
-- =====================================================

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'normal',
    assigned_to VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for support tables
CREATE INDEX IF NOT EXISTS idx_support_tickets_lead_id ON support_tickets(lead_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);

-- =====================================================
-- TRIGGERS
-- Auto-update updated_at timestamps
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for leads table
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for automation_settings table
CREATE TRIGGER update_automation_settings_updated_at
    BEFORE UPDATE ON automation_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================

COMMENT ON TABLE leads IS 'Stores business leads with tracking and quality scoring';
COMMENT ON TABLE sites IS 'Generated websites with preview and published URLs';
COMMENT ON TABLE generations IS 'AI generation history with token usage and costs';
COMMENT ON TABLE email_logs IS 'Email tracking with open and click metrics';
COMMENT ON TABLE email_templates IS 'Reusable email templates with variables';
COMMENT ON TABLE subscriptions IS 'Stripe subscription records';
COMMENT ON TABLE deployments IS 'Domain and hosting deployment records';
COMMENT ON TABLE automation_settings IS 'Global automation configuration';
COMMENT ON TABLE crawler_config IS 'Lead generation crawler settings';
COMMENT ON TABLE crawler_logs IS 'Crawler execution logs';
COMMENT ON TABLE support_tickets IS 'Customer support ticket system';
COMMENT ON TABLE ticket_messages IS 'Support ticket conversation history';

-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify schema creation
-- =====================================================

-- Count tables created (should be 12)
-- SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- List all tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;