-- Financial Management System Tables
-- Tracks revenue, expenses, and profitability per customer

-- Expense tracking
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(100) NOT NULL, -- 'api_usage', 'infrastructure', 'lead_gen', 'fixed_costs', 'other'
  subcategory VARCHAR(100), -- 'anthropic', 'resend', 'stripe', 'domains', etc.
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'AUD',
  related_to_customer UUID REFERENCES leads(id), -- If expense is for specific customer
  related_to_site UUID REFERENCES sites(id),
  expense_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_period VARCHAR(50), -- 'monthly', 'annual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_customer ON expenses(related_to_customer);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);

-- Revenue tracking (supplement subscriptions table)
CREATE TABLE IF NOT EXISTS revenue_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES subscriptions(id),
  lead_id UUID REFERENCES leads(id) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'subscription_created', 'payment_received', 'refund', 'churn'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'AUD',
  stripe_event_id VARCHAR(255),
  event_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenue_events_lead ON revenue_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_revenue_events_date ON revenue_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_events_type ON revenue_events(event_type);

-- Customer profitability tracking
CREATE TABLE IF NOT EXISTS customer_profitability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) NOT NULL UNIQUE,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  gross_profit DECIMAL(10,2) DEFAULT 0,
  gross_margin_percent DECIMAL(5,2) DEFAULT 0,
  acquisition_cost DECIMAL(10,2) DEFAULT 0,
  months_active INTEGER DEFAULT 0,
  ltv DECIMAL(10,2) DEFAULT 0,
  is_profitable BOOLEAN DEFAULT FALSE,
  break_even_month INTEGER,
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_profitability_lead ON customer_profitability(lead_id);
CREATE INDEX IF NOT EXISTS idx_customer_profitability_is_profitable ON customer_profitability(is_profitable);
CREATE INDEX IF NOT EXISTS idx_customer_profitability_calculated ON customer_profitability(last_calculated_at DESC);

-- Comments
COMMENT ON TABLE expenses IS 'Tracks all business expenses (API costs, infrastructure, lead gen, etc.)';
COMMENT ON TABLE revenue_events IS 'Tracks all revenue events (payments, refunds, churn)';
COMMENT ON TABLE customer_profitability IS 'Per-customer profitability analysis with LTV/CAC metrics';

COMMENT ON COLUMN expenses.category IS 'api_usage, infrastructure, lead_gen, fixed_costs, other';
COMMENT ON COLUMN expenses.related_to_customer IS 'Links expense to specific customer for per-customer profitability';
COMMENT ON COLUMN revenue_events.event_type IS 'subscription_created, payment_received, refund, churn';
COMMENT ON COLUMN customer_profitability.ltv IS 'Lifetime Value - projected 12-month profit';
