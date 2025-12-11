-- Duplicate Logs Table
CREATE TABLE IF NOT EXISTS duplicate_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(50) NOT NULL,
  matched_on VARCHAR(50) NOT NULL,
  existing_lead_id UUID REFERENCES leads(id),
  attempted_data JSONB,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_duplicate_logs_source ON duplicate_logs(source);
CREATE INDEX idx_duplicate_logs_logged_at ON duplicate_logs(logged_at);
CREATE INDEX idx_duplicate_logs_existing_lead ON duplicate_logs(existing_lead_id);

-- API Usage Logs Table
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service VARCHAR(50) NOT NULL,
  request_count INTEGER NOT NULL,
  config JSONB,
  cost_estimate DECIMAL(10,4),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_usage_service ON api_usage_logs(service);
CREATE INDEX idx_api_usage_timestamp ON api_usage_logs(timestamp);

-- Comments
COMMENT ON TABLE duplicate_logs IS 'Tracks all duplicate leads prevented from being added';
COMMENT ON TABLE api_usage_logs IS 'Tracks external API usage for cost monitoring';
COMMENT ON COLUMN duplicate_logs.matched_on IS 'Field that matched: email, phone, website, or business_name';
COMMENT ON COLUMN duplicate_logs.attempted_data IS 'Full data of the attempted duplicate lead';
