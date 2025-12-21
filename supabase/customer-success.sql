-- Customer Success System Tables
-- Tracks customer health, onboarding progress, and churn prevention

-- Customer health tracking
CREATE TABLE IF NOT EXISTS customer_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) NOT NULL UNIQUE,
  health_score INTEGER NOT NULL, -- 0-100
  engagement_score INTEGER, -- 0-100 based on activity
  satisfaction_score INTEGER, -- 0-100 from surveys
  risk_level VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
  churn_probability DECIMAL(5,2), -- 0-100%
  last_activity_at TIMESTAMP WITH TIME ZONE,
  days_since_activity INTEGER,
  total_support_tickets INTEGER DEFAULT 0,
  unresolved_tickets INTEGER DEFAULT 0,
  payment_failures INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_health_lead ON customer_health(lead_id);
CREATE INDEX IF NOT EXISTS idx_customer_health_risk ON customer_health(risk_level);
CREATE INDEX IF NOT EXISTS idx_customer_health_score ON customer_health(health_score);

-- Onboarding tracking
CREATE TABLE IF NOT EXISTS customer_onboarding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) NOT NULL UNIQUE,
  stage VARCHAR(50) NOT NULL, -- 'welcome', 'day_3', 'day_7', 'day_14', 'day_30', 'completed'
  welcome_email_sent_at TIMESTAMP WITH TIME ZONE,
  day_3_sent_at TIMESTAMP WITH TIME ZONE,
  day_7_sent_at TIMESTAMP WITH TIME ZONE,
  day_14_sent_at TIMESTAMP WITH TIME ZONE,
  day_30_sent_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_onboarding_lead ON customer_onboarding(lead_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_stage ON customer_onboarding(stage);

-- Churn events
CREATE TABLE IF NOT EXISTS churn_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'at_risk', 'cancellation_intent', 'churned', 'won_back'
  reason TEXT,
  intervention_attempted BOOLEAN DEFAULT FALSE,
  intervention_type VARCHAR(100),
  outcome VARCHAR(50), -- 'retained', 'churned', 'pending'
  event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_churn_events_lead ON churn_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_churn_events_type ON churn_events(event_type);

-- Comments
COMMENT ON TABLE customer_health IS 'Customer health scores and risk assessment';
COMMENT ON TABLE customer_onboarding IS 'Automated onboarding sequence tracking';
COMMENT ON TABLE churn_events IS 'Churn events and retention interventions';

COMMENT ON COLUMN customer_health.health_score IS 'Overall health score 0-100 (engagement + support + payment)';
COMMENT ON COLUMN customer_health.risk_level IS 'low (80+), medium (60-79), high (40-59), critical (<40)';
COMMENT ON COLUMN customer_onboarding.stage IS 'Current onboarding stage: welcome, day_3, day_7, day_14, day_30, completed';
COMMENT ON COLUMN churn_events.event_type IS 'at_risk, cancellation_intent, churned, won_back';
