-- Dead Letter Queue Table
-- Stores jobs that failed after maximum retry attempts

CREATE TABLE IF NOT EXISTS dead_letter_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_name VARCHAR(100) NOT NULL,
  job_id VARCHAR(255),
  job_data JSONB NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  attempts_made INTEGER,
  failed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(100),
  notes TEXT
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_dlq_queue_name ON dead_letter_queue(queue_name);
CREATE INDEX IF NOT EXISTS idx_dlq_failed_at ON dead_letter_queue(failed_at DESC);
CREATE INDEX IF NOT EXISTS idx_dlq_resolved ON dead_letter_queue(resolved) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_dlq_queue_resolved ON dead_letter_queue(queue_name, resolved);

-- Comments
COMMENT ON TABLE dead_letter_queue IS 'Stores jobs that failed permanently after all retry attempts';
COMMENT ON COLUMN dead_letter_queue.queue_name IS 'Name of the queue (lead-processing, site-generation, etc.)';
COMMENT ON COLUMN dead_letter_queue.job_id IS 'Original job ID from BullMQ';
COMMENT ON COLUMN dead_letter_queue.job_data IS 'Full job data for debugging';
COMMENT ON COLUMN dead_letter_queue.attempts_made IS 'Number of attempts before permanent failure';
COMMENT ON COLUMN dead_letter_queue.resolved IS 'Whether this issue has been resolved';
COMMENT ON COLUMN dead_letter_queue.resolved_by IS 'Admin who resolved the issue';
