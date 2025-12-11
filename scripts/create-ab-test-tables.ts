/**
 * Create AB Testing Tables
 *
 * Run with: npx tsx scripts/create-ab-test-tables.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTables() {
  console.log('Creating AB testing tables...\n')

  try {
    // Create ab_tests table
    console.log('Creating ab_tests table...')
    const { error: testsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `,
    })

    if (testsError) {
      console.error('Error creating ab_tests table:', testsError)
      throw testsError
    }

    console.log('✓ ab_tests table created')

    // Create ab_test_results table
    console.log('Creating ab_test_results table...')
    const { error: resultsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `,
    })

    if (resultsError) {
      console.error('Error creating ab_test_results table:', resultsError)
      throw resultsError
    }

    console.log('✓ ab_test_results table created')

    console.log('\n✅ All AB testing tables created successfully!')
  } catch (error) {
    console.error('\n❌ Error creating tables:', error)
    process.exit(1)
  }
}

// Run the script
createTables().then(() => process.exit(0))
