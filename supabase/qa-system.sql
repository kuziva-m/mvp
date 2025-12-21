-- Quality Assurance System Tables
-- Validates website quality before sending to customers

-- QA Reviews table - stores all QA review results
CREATE TABLE IF NOT EXISTS qa_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
  review_type VARCHAR(50) NOT NULL, -- 'content', 'visual', 'manual'
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100), -- 0-100
  passed BOOLEAN NOT NULL,
  issues TEXT[],
  recommendations TEXT[],
  breakdown JSONB,
  reviewed_by VARCHAR(100), -- 'ai' or VA name
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_qa_reviews_site_id ON qa_reviews(site_id);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_passed ON qa_reviews(passed);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_reviewed_at ON qa_reviews(reviewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_reviews_type ON qa_reviews(review_type);

-- Add QA fields to sites table
ALTER TABLE sites ADD COLUMN IF NOT EXISTS qa_status VARCHAR(50) DEFAULT 'pending';
-- Values: 'pending', 'passed', 'failed', 'manual_review', 'approved'

ALTER TABLE sites ADD COLUMN IF NOT EXISTS qa_score INTEGER CHECK (qa_score >= 0 AND qa_score <= 100);
ALTER TABLE sites ADD COLUMN IF NOT EXISTS qa_reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE sites ADD COLUMN IF NOT EXISTS qa_reviewed_by VARCHAR(100);

-- Create index on qa_status for filtering
CREATE INDEX IF NOT EXISTS idx_sites_qa_status ON sites(qa_status);
CREATE INDEX IF NOT EXISTS idx_sites_qa_reviewed_at ON sites(qa_reviewed_at DESC);

-- Comments
COMMENT ON TABLE qa_reviews IS 'Quality assurance review results for generated websites';
COMMENT ON COLUMN qa_reviews.review_type IS 'Type of review: content (AI), visual (Puppeteer), or manual (VA)';
COMMENT ON COLUMN qa_reviews.score IS 'Quality score from 0-100';
COMMENT ON COLUMN qa_reviews.breakdown IS 'Detailed scoring breakdown (grammar, professionalism, etc.)';
COMMENT ON COLUMN sites.qa_status IS 'QA workflow status: pending, passed, failed, manual_review, or approved';
COMMENT ON COLUMN sites.qa_score IS 'Overall QA score (weighted average of content and visual)';
