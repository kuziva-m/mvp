-- AB Testing Tables
-- Run this in Supabase SQL Editor

-- Create ab_tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type VARCHAR(50) NOT NULL CHECK (test_type IN ('subject_line', 'email_body', 'template')),
  name VARCHAR(255) NOT NULL,
  variant_a TEXT NOT NULL,
  variant_b TEXT NOT NULL,
  sample_size INTEGER NOT NULL DEFAULT 50 CHECK (sample_size > 0 AND sample_size <= 100),
  status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'paused')),
  winner VARCHAR(10) CHECK (winner IN ('a', 'b', 'none')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_created_at ON ab_tests(created_at);

-- Create ab_test_results table
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  variant VARCHAR(10) NOT NULL CHECK (variant IN ('a', 'b')),
  opened BOOLEAN DEFAULT FALSE,
  clicked BOOLEAN DEFAULT FALSE,
  subscribed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(test_id, lead_id)
);

CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_id ON ab_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_lead_id ON ab_test_results(lead_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_variant ON ab_test_results(variant);
